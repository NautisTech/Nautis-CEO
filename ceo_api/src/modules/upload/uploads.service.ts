import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import { ImageProcessorService } from './image-processor.service';
import * as sql from 'mssql';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
    private uploadPath: string;

    constructor(
        private databaseService: DatabaseService,
        private configService: ConfigService,
        private imageProcessor: ImageProcessorService,
    ) {
        this.uploadPath = this.configService.get('app.uploadPath') || './uploads';
        this.ensureUploadDirectory();
    }

    private ensureUploadDirectory() {
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
    }

    async uploadFile(
        tenantId: number,
        file: Express.Multer.File,
        utilizadorId: number,
    ) {
        console.log('📤 Iniciando upload...');
        console.log('  - Tenant:', tenantId);
        console.log('  - Arquivo:', file.originalname);
        console.log('  - Tamanho:', (file.size / 1024 / 1024).toFixed(2), 'MB');
        console.log('  - MIME:', file.mimetype);

        // Validar arquivo
        this.validateFile(file);

        // Gerar nome único
        const fileExt = path.extname(file.originalname);
        const baseFileName = uuidv4();
        const fileName = `${baseFileName}${fileExt}`;
        const tenantFolder = path.join(this.uploadPath, `tenant_${tenantId}`);

        // Criar pasta do tenant se não existir
        if (!fs.existsSync(tenantFolder)) {
            fs.mkdirSync(tenantFolder, { recursive: true });
        }

        const tempFilePath = path.join(tenantFolder, fileName);

        // Salvar arquivo temporário
        fs.writeFileSync(tempFilePath, file.buffer);

        let finalFilePath = tempFilePath;
        let processedSize = file.size;
        let variants: any = null;

        // 🔥 Processar imagem se for imagem
        if (this.imageProcessor.isImage(file.mimetype)) {
            console.log('  🖼️ Imagem detectada, processando...');

            try {
                const result = await this.imageProcessor.processImage(
                    tempFilePath,
                    tenantFolder,
                    baseFileName,
                );

                variants = {
                    original: path.basename(result.variants.original),
                    large: path.basename(result.variants.large),
                    medium: path.basename(result.variants.medium),
                    small: path.basename(result.variants.small),
                    thumbnail: path.basename(result.variants.thumbnail),
                };

                processedSize = result.compressedSize;

                // Remover arquivo temporário original
                if (fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                }

                // Usar a versão medium como principal
                finalFilePath = result.variants.medium;

                console.log(
                    `  ✅ Imagem processada: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(processedSize / 1024 / 1024).toFixed(2)}MB`,
                );
            } catch (error) {
                console.error('  ⚠️ Erro ao processar imagem, usando original:', error);
                // Se falhar, usar o arquivo original
                finalFilePath = tempFilePath;
            }
        }

        // Registrar no banco
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool
            .request()
            .input('nome', sql.NVarChar, path.basename(finalFilePath))
            .input('nomeOriginal', sql.NVarChar, file.originalname)
            .input('caminho', sql.NVarChar, finalFilePath)
            .input('tipo', sql.NVarChar, fileExt.replace('.', ''))
            .input('mimeType', sql.NVarChar, file.mimetype)
            .input('tamanhoBytes', sql.Int, processedSize)
            .input('uploadPorId', sql.Int, utilizadorId)
            .input('variants', sql.NVarChar, variants ? JSON.stringify(variants) : null)
            .query(`
        INSERT INTO anexos 
          (nome, nome_original, caminho, tipo, mime_type, tamanho_bytes, upload_por_id, variants)
        OUTPUT INSERTED.id, INSERTED.nome, INSERTED.caminho, INSERTED.tipo, INSERTED.variants
        VALUES 
          (@nome, @nomeOriginal, @caminho, @tipo, @mimeType, @tamanhoBytes, @uploadPorId, @variants)
      `);

        const anexo = result.recordset[0];

        return {
            id: anexo.id,
            nome: anexo.nome,
            nome_original: file.originalname,
            url: this.getFileUrl(tenantId, anexo.nome),
            variants: variants
                ? {
                    original: this.getFileUrl(tenantId, variants.original),
                    large: this.getFileUrl(tenantId, variants.large),
                    medium: this.getFileUrl(tenantId, variants.medium),
                    small: this.getFileUrl(tenantId, variants.small),
                    thumbnail: this.getFileUrl(tenantId, variants.thumbnail),
                }
                : null,
            tipo: anexo.tipo,
            tamanho_bytes: processedSize,
        };
    }

    async uploadMultiple(
        tenantId: number,
        files: Express.Multer.File[],
        utilizadorId: number,
    ) {
        const uploadedFiles: any[] = [];

        for (const file of files) {
            const uploaded = await this.uploadFile(tenantId, file, utilizadorId);
            uploadedFiles.push(uploaded);
        }

        return uploadedFiles;
    }

    async deleteFile(tenantId: number, anexoId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Buscar informações do arquivo
        const result = await pool
            .request()
            .input('id', sql.Int, anexoId)
            .query(`
        SELECT caminho, nome, variants FROM anexos WHERE id = @id
      `);

        if (result.recordset.length === 0) {
            throw new BadRequestException('Arquivo não encontrado');
        }

        const { caminho, nome, variants } = result.recordset[0];
        const tenantFolder = path.join(this.uploadPath, `tenant_${tenantId}`);

        // 🔥 Se tem variants, remover todas as versões
        if (variants) {
            try {
                const variantsObj = JSON.parse(variants);
                const baseFileName = path.basename(nome, path.extname(nome));

                await this.imageProcessor.removeImageVariants(
                    tenantFolder,
                    baseFileName,
                );
            } catch (error) {
                console.error('Erro ao remover variants:', error);
            }
        }

        // Deletar arquivo principal
        if (fs.existsSync(caminho)) {
            fs.unlinkSync(caminho);
        }

        // Deletar registro
        await pool
            .request()
            .input('id', sql.Int, anexoId)
            .query(`DELETE FROM anexos WHERE id = @id`);

        return { success: true };
    }

    private validateFile(file: Express.Multer.File) {
        const maxSize = this.configService.get('app.uploadMaxSize') || 10485760;

        if (file.size > maxSize) {
            throw new BadRequestException(
                `Arquivo muito grande. Tamanho máximo: ${maxSize / 1024 / 1024}MB`,
            );
        }

        const allowedMimes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
            'video/mp4',
            'video/mpeg',
            'audio/mpeg',
            'audio/wav',
        ];

        if (!allowedMimes.includes(file.mimetype)) {
            throw new BadRequestException('Tipo de arquivo não permitido');
        }
    }

    private getFileUrl(tenantId: number, fileName: string): string {
        const apiUrl = this.configService.get('app.apiUrl') || 'http://localhost:9832';
        return `${apiUrl}/api/uploads/tenant_${tenantId}/${fileName}`;
    }
}