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
        html: text,
      });

      return { success: true, info };
    } catch (error) {
      throw new InternalServerErrorException('Falha ao enviar email');
    }
  }

  async sendNewsletterEmail(
    to: string,
    titulo: string,
    url: string,
  ) {
    try {
      const transporter = this.getTransporter();

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #f4f4f4;
              padding: 20px;
              text-align: center;
              border-radius: 5px;
            }
            .content {
              padding: 20px 0;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Novo Conteúdo Publicado</h2>
          </div>
          <div class="content">
            <p>Olá,</p>
            <p>Temos novo conteúdo disponível no nosso site:</p>
            <h3>${titulo}</h3>
            <p>Clique no botão abaixo para ler o artigo completo:</p>
            <a href="${url}" class="button">Ler Artigo</a>
          </div>
          <div class="footer">
            <p>Você está recebendo este email porque está inscrito na nossa newsletter.</p>
            <p>Se não deseja mais receber estes emails, entre em contato conosco.</p>
          </div>
        </body>
        </html>
      `;

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@nautis.pt',
        to,
        subject: `Novo Conteúdo: ${titulo}`,
        html: htmlContent,
      });

      return { success: true, info };
    } catch (error) {
      console.error('Erro ao enviar email de newsletter:', error);
      throw new InternalServerErrorException('Falha ao enviar email de newsletter');
    }
  }
}
