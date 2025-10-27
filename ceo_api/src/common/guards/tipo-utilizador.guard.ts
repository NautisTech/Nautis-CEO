import { Injectable, CanActivate, ExecutionContext, ForbiddenException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const TIPOS_PERMITIDOS_KEY = 'tiposPermitidos';

/**
 * Decorator para especificar tipos de utilizador permitidos
 * @param tipos - Array de tipos permitidos ('interno', 'cliente', 'fornecedor')
 *
 * Uso:
 * @TiposPermitidos('interno', 'cliente')
 * @UseGuards(JwtAuthGuard, TipoUtilizadorGuard)
 */
export const TiposPermitidos = (...tipos: string[]) => SetMetadata(TIPOS_PERMITIDOS_KEY, tipos);

/**
 * Guard flexível que permite acesso baseado em tipos de utilizador
 * Usar em conjunto com @TiposPermitidos decorator
 */
@Injectable()
export class TipoUtilizadorGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const tiposPermitidos = this.reflector.get<string[]>(
            TIPOS_PERMITIDOS_KEY,
            context.getHandler(),
        );

        // Se não especificar tipos, permite todos
        if (!tiposPermitidos || tiposPermitidos.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('Utilizador não autenticado');
        }

        const tipoUtilizador = user.tipo_utilizador || 'interno';

        if (!tiposPermitidos.includes(tipoUtilizador)) {
            throw new ForbiddenException(
                `Acesso negado. Tipos permitidos: ${tiposPermitidos.join(', ')}. Seu tipo: ${tipoUtilizador}`
            );
        }

        return true;
    }
}
