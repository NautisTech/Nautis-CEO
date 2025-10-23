import { Module } from '@nestjs/common';
import { MailerPublicController } from './mailer-public.controller';
import { MailerService } from './mailer.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [
        MailerPublicController,
    ],
    providers: [
        MailerService,
    ],
    exports: [MailerService],
})
export class MailerModule { }