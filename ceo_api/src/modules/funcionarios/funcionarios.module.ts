import { Module } from '@nestjs/common';
import { FuncionariosController } from './funcionarios.controller';
import { FuncionariosService } from './funcionarios.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [FuncionariosController],
    providers: [FuncionariosService],
    exports: [FuncionariosService],
})
export class FuncionariosModule { }