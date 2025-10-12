import { PartialType } from '@nestjs/swagger';
import { CriarConteudoDto } from './criar-conteudo.dto';

export class AtualizarConteudoDto extends PartialType(CriarConteudoDto) { }