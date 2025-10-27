import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { IntervencoesController } from './intervencoes.controller';
import { IntervencoesCustosController } from './intervencoes-custos.controller';
import { TicketsService } from './tickets.service';
import { IntervencoesService } from './intervencoes.service';
import { IntervencoesCustosService } from './intervencoes-custos.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [TicketsController, IntervencoesController, IntervencoesCustosController],
    providers: [TicketsService, IntervencoesService, IntervencoesCustosService],
    exports: [TicketsService, IntervencoesService, IntervencoesCustosService]
})
export class SuporteModule { }
