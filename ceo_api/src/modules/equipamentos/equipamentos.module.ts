import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';

// Marcas
import { MarcasController } from './marcas.controller';
import { MarcasService } from './marcas.service';

// Categorias
import { CategoriasEquipamentoController } from './categorias.controller';
import { CategoriasEquipamentoService } from './categorias.service';

// Modelos
import { ModelosEquipamentoController } from './modelos.controller';
import { ModelosEquipamentoService } from './modelos.service';

// Equipamentos
import { EquipamentosController } from './equipamentos.controller';
import { EquipamentosService } from './equipamentos.service';

@Module({
    imports: [DatabaseModule],
    controllers: [
        MarcasController,
        CategoriasEquipamentoController,
        ModelosEquipamentoController,
        EquipamentosController,
    ],
    providers: [
        MarcasService,
        CategoriasEquipamentoService,
        ModelosEquipamentoService,
        EquipamentosService,
    ],
    exports: [
        MarcasService,
        CategoriasEquipamentoService,
        ModelosEquipamentoService,
        EquipamentosService,
    ],
})
export class EquipamentosModule { }
