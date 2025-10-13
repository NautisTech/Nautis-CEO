import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    Get,
    Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard, Public } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

class LoginDto {
    @ApiProperty({ example: 'admin@vuexy.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'admin' })
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    password: string;

    @ApiPropertyOptional({ example: 'softon' })
    @IsOptional()
    @IsString()
    tenantSlug?: string;

    @ApiPropertyOptional({ example: 'softon' })
    @IsOptional()
    @IsString()
    tenant_slug?: string;
}

class RefreshTokenDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @Public()
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        const normalizedDto = {
            ...loginDto,
            tenantSlug: loginDto.tenantSlug || loginDto.tenant_slug,
        };

        return this.authService.login(normalizedDto);
    }

    @Post('refresh')
    @Public()
    @HttpCode(HttpStatus.OK)
    async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto.refreshToken);
    }

    // NextAuth compatibility endpoint
    @Get('session')
    @Public()
    async getSession(@Request() req) {
        if (!req.user) {
            return {
                user: null,
                authenticated: false
            };
        }

        return {
            user: {
                id: req.user.userId,
                email: req.user.email,
                name: req.user.nome,
                tenantId: req.user.tenantId,
            },
            authenticated: true
        };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Request() req) {
        return {
            user: req.user,
        };
    }

    @Get('me/modules')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obter módulos e permissões do utilizador' })
    async getModules(@Request() req) {
        return this.authService.getUserModules(req.user.userId, req.user.tenantId);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    async logout(@Request() req) {
        // Aqui pode implementar lógica de blacklist de tokens se necessário
        return {
            message: 'Logout realizado com sucesso',
        };
    }
}