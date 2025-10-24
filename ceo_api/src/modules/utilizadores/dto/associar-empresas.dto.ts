import { IsArray, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssociarEmpresasDto {
    @ApiProperty({ type: [Number] })
    @IsArray()
    @IsInt({ each: true })
    empresasIds: number[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    empresaPrincipalId?: number;
}
