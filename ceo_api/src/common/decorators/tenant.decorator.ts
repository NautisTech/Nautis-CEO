import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TenantContext } from '../interfaces/tenant-context.interface';
import { UserPayload } from '../interfaces/user-payload.interface';

export const Tenant = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): TenantContext => {
        const request = ctx.switchToHttp().getRequest();
        return request.tenant;
    },
);

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): UserPayload => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);