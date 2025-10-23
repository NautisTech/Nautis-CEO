import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { DatabaseService } from '../../database/database.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService extends BaseService {
  private transporter: nodemailer.Transporter | null = null;

  constructor(databaseService: DatabaseService) {
    super(databaseService);
  }

  private getTransporter(): nodemailer.Transporter {
    if (this.transporter) return this.transporter;

    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || 587;
    const secure = process.env.SMTP_SECURE === 'true';

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    return this.transporter;
  }

  async sendSimpleEmail(
    to: string,
    subject = 'Mensagem do site',
    text = 'Mensagem automática enviada pelo sistema',
  ) {
    try {
      const transporter = this.getTransporter();

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@nautis.pt',
        to,
        subject,
        text,
      });

      return { success: true, info };
    } catch (error) {
      throw new InternalServerErrorException('Falha ao enviar email');
    }
  }
}
