import { Module } from '@nestjs/common';
import { ConteudosController } from './conteudos.controller';
import { ConteudosService } from './conteudos.service';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { ComentariosController } from './comentarios.controller';
import { ComentariosService } from './comentarios.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [
        ConteudosController,
        CategoriasController,
        TagsController,
        ComentariosController,
    ],
    providers: [
        ConteudosService,
        CategoriasService,
        TagsService,
        ComentariosService,
    ],
    exports: [ConteudosService],
})
export class ConteudosModule { }