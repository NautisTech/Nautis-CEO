import { IsArray, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PublicarSocialDto {
    @ApiProperty({ description: 'ID do conteúdo a ser publicado' })
    @IsNumber()
    contentId: number;

    @ApiProperty({
        description: 'Plataformas onde publicar',
        type: [String],
        example: ['facebook', 'instagram', 'linkedin']
    })
    @IsArray()
    @IsString({ each: true })
    platforms: string[];
}
