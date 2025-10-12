import { Module } from '@nestjs/common';
import { GruposController } from './grupos.controller';
import { GruposService } from './grupos.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [GruposController],
    providers: [GruposService],
    exports: [GruposService],
})
export class GruposModule { }