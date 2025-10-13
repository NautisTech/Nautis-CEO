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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

class LoginDto {
    email: string;
    password: string;
    tenantSlug?: string;
}

class RefreshTokenDto {
    refreshToken: string;
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @Public()
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('refresh')
    @Public()
    @HttpCode(HttpStatus.OK)
    async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto.refreshToken);
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