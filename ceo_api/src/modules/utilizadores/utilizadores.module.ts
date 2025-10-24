import { Module } from '@nestjs/common';
import { UtilizadoresController } from './utilizadores.controller';
import { UtilizadoresService } from './utilizadores.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [UtilizadoresController],
    providers: [UtilizadoresService],
    exports: [UtilizadoresService],
})
export class UtilizadoresModule { }
