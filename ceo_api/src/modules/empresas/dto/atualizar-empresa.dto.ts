import { PartialType } from '@nestjs/swagger';
import { CriarEmpresaDto } from './criar-empresa.dto';

export class AtualizarEmpresaDto extends PartialType(CriarEmpresaDto) { }