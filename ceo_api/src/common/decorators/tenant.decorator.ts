import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TenantContext, UserPayload } from '../interfaces/tenant-context.interface';

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