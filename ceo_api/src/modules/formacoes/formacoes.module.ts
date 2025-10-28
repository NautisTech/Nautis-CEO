import { Module } from '@nestjs/common';
import { FormacoesController } from './formacoes.controller';
import { FormacoesService } from './formacoes.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [FormacoesController],
    providers: [FormacoesService],
    exports: [FormacoesService]
})
export class FormacoesModule { }
