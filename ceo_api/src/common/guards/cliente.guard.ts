import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Guard que permite acesso APENAS a utilizadores do tipo 'cliente'
 * Uso: @UseGuards(JwtAuthGuard, ClienteGuard)
 */
@Injectable()
export class ClienteGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('Utilizador não autenticado');
        }

        if (user.tipo_utilizador !== 'cliente') {
            throw new ForbiddenException('Acesso negado. Apenas clientes podem aceder a este recurso.');
        }

        // Verificar se tem cliente_id
        if (!user.cliente_id) {
            throw new ForbiddenException('Utilizador não tem cliente associado');
        }

        return true;
    }
}
