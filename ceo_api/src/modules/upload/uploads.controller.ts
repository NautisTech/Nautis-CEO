import {
    Controller,
    Post,
    Delete,
    Param,
    Res,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
    Request,
    ParseIntPipe,
    BadRequestException,
    NotFoundException,
    Get,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('Uploads')
@ApiBearerAuth()
@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) { }

    @Post('single')
    @ApiOperation({ summary: 'Upload de arquivo único' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    async uploadSingle(
        @Request() req,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('Nenhum arquivo enviado');
        }

        return this.uploadsService.uploadFile(
            req.user.tenantId,
            file,
            req.user.sub,
        );
    }

    @Post('multiple')
    @ApiOperation({ summary: 'Upload de múltiplos arquivos' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FilesInterceptor('files', 10))
    async uploadMultiple(
        @Request() req,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        if (!files || files.length === 0) {
            throw new BadRequestException('Nenhum arquivo enviado');
        }

        return this.uploadsService.uploadMultiple(
            req.user.tenantId,
            files,
            req.user.sub,
        );
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Deletar arquivo' })
    async delete(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.uploadsService.deleteFile(req.user.tenantId, id);
    }

    @Get('tenant_:tenantId/:filename')
    @ApiOperation({ summary: 'Servir arquivo' })
    async serveFile(
        @Param('tenantId') tenantId: string,
        @Param('filename') filename: string,
        @Res() res: Response,
    ) {
        const uploadPath = process.env.UPLOAD_PATH || './uploads';
        const filePath = path.join(uploadPath, `tenant_${tenantId}`, filename);

        if (!fs.existsSync(filePath)) {
            throw new NotFoundException('Arquivo não encontrado');
        }

        res.sendFile(filePath, { root: '.' });
    }
}