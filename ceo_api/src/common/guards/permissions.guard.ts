import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.get<string[]>(
            'permissions',
            context.getHandler(),
        );

        if (!requiredPermissions) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        const hasPermission = requiredPermissions.some((permission) =>
            user.permissions?.includes(permission),
        );

        if (!hasPermission) {
            throw new ForbiddenException(
                `Não tem permissões para executar esta ação: ${JSON.stringify(requiredPermissions)}`,
            );
        }

        return true;
    }
}

// Decorator para definir permissões necessárias
import { SetMetadata } from '@nestjs/common';
export const RequirePermissions = (...permissions: string[]) => SetMetadata('permissions', permissions);