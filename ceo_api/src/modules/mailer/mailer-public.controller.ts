import {
    Controller,
    Get,
    Post,
    Body,
    UsePipes,
    ValidationPipe,
    Param,
    Query,
    ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiExcludeController } from '@nestjs/swagger';
import { MailerService } from './mailer.service';
import { SendEmailDto } from './dto/send-email.dto';
import { Public } from '../../common/guards/jwt-auth.guard';

@ApiTags('Mailer Público')
@ApiExcludeController()
@Controller('public/mailer')
@Public() // Tornar todas as rotas públicas
export class MailerPublicController {
    constructor(private readonly mailerService: MailerService) { }

    @Get('mailer')
    @ApiOperation({ summary: 'Rota de envio de e-mail pública' })
    sendEmail() {
        return { success: true, message: 'Mailer public endpoint' };
    }

    @Post('send')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @ApiOperation({ summary: 'Enviar email genérico (público)' })
    async send(@Body() dto: SendEmailDto) {
        return this.mailerService.sendSimpleEmail(dto.to, dto.subject, dto.text);
    }
}