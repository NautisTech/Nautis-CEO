import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Guard que permite acesso APENAS a utilizadores do tipo 'interno' (funcionários)
 * Uso: @UseGuards(JwtAuthGuard, InternoGuard)
 */
@Injectable()
export class InternoGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('Utilizador não autenticado');
        }

        if (user.tipo_utilizador !== 'interno') {
            throw new ForbiddenException('Acesso negado. Apenas utilizadores internos podem aceder a este recurso.');
        }

        // Verificar se tem funcionario_id
        if (!user.funcionario_id) {
            throw new ForbiddenException('Utilizador não tem funcionário associado');
        }

        return true;
    }
}
