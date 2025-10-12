import { Module } from '@nestjs/common';
import { PermissoesController } from './permissoes.controller';
import { PermissoesService } from './permissoes.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [PermissoesController],
    providers: [PermissoesService],
    exports: [PermissoesService],
})
export class PermissoesModule { }