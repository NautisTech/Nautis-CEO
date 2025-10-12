import { PartialType } from '@nestjs/swagger';
import { CriarTagDto } from './criar-tag.dto';

export class AtualizarTagDto extends PartialType(CriarTagDto) { }