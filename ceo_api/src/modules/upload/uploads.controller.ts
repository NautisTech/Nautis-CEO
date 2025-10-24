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
  Body,
  ParseIntPipe,
  BadRequestException,
  NotFoundException,
  Get,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard, Public } from '../../common/guards/jwt-auth.guard';
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
  @ApiOperation({ summary: 'Upload de ficheiro único' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum ficheiro enviado');
    }

    return this.uploadsService.uploadFile(
      req.user.tenantId,
      file,
      req.user.sub,
    );
  }

  @Post('multiple')
  @ApiOperation({ summary: 'Upload de múltiplos ficheiros' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultiple(
    @Request() req,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhum ficheiro enviado');
    }

    return this.uploadsService.uploadMultiple(
      req.user.tenantId,
      files,
      req.user.sub,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar ficheiro' })
  async delete(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.uploadsService.deleteFile(req.user.tenantId, id);
  }

  @Get('tenant_:tenantId/:filename')
  @Public()
  @ApiOperation({ summary: 'Servir ficheiro' })
  async serveFile(
    @Param('tenantId') tenantId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    const filePath = path.join(uploadPath, `tenant_${tenantId}`, filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Ficheiro não encontrado');
    }

    res.sendFile(filePath, { root: '.' });
  }

  @Post('external')
  @ApiOperation({ summary: 'Registrar ficheiro externo' })
  async registerExternalFile(
    @Request() req,
    @Body() body: { url: string; tipo: string },
  ) {
    const { url, tipo } = body;
    if (!url || !tipo) {
      throw new BadRequestException('URL e tipo são obrigatórios');
    }

    return this.uploadsService.registerExternalFile(
      req.user.tenantId,
      url,
      tipo,
      req.user.sub,
    );
  }
}
