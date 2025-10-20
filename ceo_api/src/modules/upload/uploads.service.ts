import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import * as sql from 'mssql';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

@Injectable()
export class UploadsService {
    private uploadPath: string;

    constructor(
        private databaseService: DatabaseService,
        private configService: ConfigService,
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
        // Validar arquivo
        this.validateFile(file);

        // Gerar nome único
        const fileExt = path.extname(file.originalname);
        const fileName = `${uuidv4()}${fileExt}`;
        const tenantFolder = path.join(this.uploadPath, `tenant_${tenantId}`);

        // Criar pasta do tenant se não existir
        if (!fs.existsSync(tenantFolder)) {
            fs.mkdirSync(tenantFolder, { recursive: true });
        }

        const filePath = path.join(tenantFolder, fileName);

        // Salvar arquivo
        fs.writeFileSync(filePath, file.buffer);

        // Registrar no banco
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool
            .request()
            .input('nome', sql.NVarChar, fileName)
            .input('nomeOriginal', sql.NVarChar, file.originalname)
            .input('caminho', sql.NVarChar, filePath)
            .input('tipo', sql.NVarChar, fileExt.replace('.', ''))
            .input('mimeType', sql.NVarChar, file.mimetype)
            .input('tamanhoBytes', sql.Int, file.size)
            .input('uploadPorId', sql.Int, utilizadorId)
            .query(`
        INSERT INTO anexos 
          (nome, nome_original, caminho, tipo, mime_type, tamanho_bytes, upload_por_id)
        OUTPUT INSERTED.id, INSERTED.nome, INSERTED.caminho, INSERTED.tipo
        VALUES 
          (@nome, @nomeOriginal, @caminho, @tipo, @mimeType, @tamanhoBytes, @uploadPorId)
      `);

        const anexo = result.recordset[0];

        return {
            id: anexo.id,
            nome: anexo.nome,
            nome_original: file.originalname,
            url: this.getFileUrl(tenantId, anexo.nome),
            tipo: anexo.tipo,
            tamanho_bytes: file.size,
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
        SELECT caminho FROM anexos WHERE id = @id
      `);

        if (result.recordset.length === 0) {
            throw new BadRequestException('Arquivo não encontrado');
        }

        const filePath = result.recordset[0].caminho;

        // Deletar arquivo físico
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Deletar registro
        await pool
            .request()
            .input('id', sql.Int, anexoId)
            .query(`DELETE FROM anexos WHERE id = @id`);

        return { success: true };
    }

    private validateFile(file: Express.Multer.File) {
        const maxSize = this.configService.get('app.uploadMaxSize') || 10485760; // 10MB

        if (file.size > maxSize) {
            throw new BadRequestException(
                `Arquivo muito grande. Tamanho máximo: ${maxSize / 1024 / 1024}MB`,
            );
        }

        // Validar tipos permitidos
        const allowedMimes = [
            'image/jpeg',
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
        const apiUrl = process.env.API_URL || 'http://localhost:9832';
        return `${apiUrl}/api/uploads/tenant_${tenantId}/${fileName}`;
    }
}