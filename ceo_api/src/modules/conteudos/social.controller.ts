import {
    Controller,
    Post,
    Body,
    Req,
    UseGuards,
    Get,
    Param,
    ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SocialService } from './social.service';
import { JwtAuthGuard, Public } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { ConteudosService } from './conteudos.service';
import { PublicarSocialDto } from './dto/publicar-social.dto';
import type { UserPayload } from '../../common/interfaces/user-payload.interface';

@ApiTags('Social')
@Controller('social')
export class SocialController {
    constructor(
        private readonly socialService: SocialService,
        private readonly conteudosService: ConteudosService,
    ) { }

    @Post('publish')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Publicar conteúdo nas redes sociais' })
    async publish(@Body() dto: PublicarSocialDto, @Req() req: any) {
        const { contentId, platforms } = dto;
        const tenantId = req.user.tenantId;
        const userId = req.user.sub;

        // Buscar o conteúdo
        const content = await this.conteudosService.obterPorId(tenantId, contentId);

        if (!content) {
            return {
                success: false,
                error: 'Conteúdo não encontrado',
                results: []
            };
        }

        const results: Array<{
            platform: string;
            success: boolean;
            data?: any;
            error?: string;
        }> = [];

        // Publicar em cada plataforma
        for (const platform of platforms) {
            try {
                const result = await this.socialService.post(
                    tenantId,
                    userId,
                    platform,
                    content,
                );
                results.push({ platform, success: true, data: result });
            } catch (error: any) {
                results.push({
                    platform,
                    success: false,
                    error: error.message,
                });
            }
        }

        return { success: true, results };
    }

    @Get('accounts')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obter contas conectadas' })
    async getConnectedAccounts(@Req() req) {
        const tenantId = req.user.tenantId;
        const userId = req.user.sub;

        const platforms = ['facebook', 'instagram', 'linkedin'];
        const accounts = await Promise.all(
            platforms.map(async (platform) => {
                const tokens = await this.socialService.getUserTokens(
                    tenantId,
                    userId,
                    platform,
                );
                return {
                    platform,
                    connected: !!tokens,
                    username: tokens?.username || tokens?.name || undefined,
                };
            }),
        );

        return { accounts };
    }

    @Post('connect')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async connectAccount(@Body() body: any, @Req() req) {
        const { platform, credentials } = body;
        const tenantId = req.user.tenantId;
        const userId = req.user.sub;

        // TODO: Implementar lógica de conexão de conta
        return { success: true, platform };
    }

    @Post('disconnect')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Desconectar conta de rede social' })
    async disconnectAccount(@Body() body: any, @Req() req) {
        const { platform } = body;
        const tenantId = req.user.tenantId;
        const userId = req.user.sub;

        // Delete the tokens from configuration
        await this.socialService.saveUserTokens(tenantId, userId, platform, null);

        return { success: true, platform };
    }

    @Get('history/:contentId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getPublicationHistory(@Param('contentId') contentId: number, @Req() req) {
        const tenantId = req.user.tenantId;

        // TODO: Implementar histórico de publicações
        return {
            history: [],
        };
    }

    @Get('connect/:provider')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Iniciar fluxo OAuth' })
    async startOAuth(
        @Param('provider') provider: string,
        @Req() req,
    ) {
        const tenantId = req.user.tenantId;
        const userId = req.user.sub;

        try {
            const creds = await this.socialService.getClientCredentials(tenantId, provider);

            if (!creds || !creds.clientId) {
                throw new Error(`Credentials not configured for ${provider}. Please configure ${provider.toUpperCase()}_APP_CREDENTIALS in settings.`);
            }

            const redirectUri = `${process.env.API_URL || 'http://localhost:9833/api'}/social/callback/${provider}`;

            let authUrl = '';
            const state = Buffer.from(JSON.stringify({ tenantId, userId })).toString('base64');

            if (provider === 'facebook') {
                // Facebook permissions - pages_manage_metadata is needed to read pages list
                const scopes = [
                    'pages_show_list',
                    'pages_read_engagement',
                    'pages_manage_metadata',
                    'public_profile',
                ].join(',');

                authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${creds.clientId}&redirect_uri=${encodeURIComponent(
                    redirectUri,
                )}&scope=${scopes}&state=${state}`;
            } else if (provider === 'instagram') {
                // Instagram permissions - needs pages access to get IG Business Account
                const scopes = [
                    'pages_show_list',
                    'pages_read_engagement',
                    'pages_manage_metadata',
                    'instagram_basic',
                    'instagram_manage_insights',
                    'public_profile',
                ].join(',');

                authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${creds.clientId}&redirect_uri=${encodeURIComponent(
                    redirectUri,
                )}&scope=${scopes}&state=${state}`;
            } else if (provider === 'linkedin') {
                const scopes = ['openid', 'profile', 'w_member_social'].join('%20');
                authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${creds.clientId}&redirect_uri=${encodeURIComponent(
                    redirectUri,
                )}&scope=${scopes}&state=${state}`;
            } else {
                throw new Error(`Unsupported provider: ${provider}`);
            }

            // Frontend redirects the user to this URL
            return { authUrl };
        } catch (error: any) {
            throw new Error(`Failed to start OAuth flow: ${error.message}`);
        }
    }

    @Public()
    @Get('callback/:provider')
    async oauthCallback(
        @Param('provider') provider: string,
        @Req() req,
    ) {
        const { code, state } = req.query;
        const { tenantId, userId } = JSON.parse(Buffer.from(state, 'base64').toString());

        try {
            const tokens = await this.socialService.handleOAuthCallback(
                tenantId,
                userId,
                provider,
                code,
            );

            // Redirect back to frontend with success
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            return `
                <html>
                    <head>
                        <title>Autenticação com Sucesso</title>
                    </head>
                    <body>
                        <h2>Conta ${provider} conectada com sucesso!</h2>
                        <p>Você pode fechar esta janela agora.</p>
                        <script>
                            window.opener?.postMessage({ type: 'oauth_success', provider: '${provider}' }, '${frontendUrl}');
                            setTimeout(() => window.close(), 2000);
                        </script>
                    </body>
                </html>
            `;
        } catch (error: any) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            return `
                <html>
                    <head>
                        <title>Erro na Autenticação</title>
                    </head>
                    <body>
                        <h2>Erro ao conectar conta ${provider}</h2>
                        <p>${error.message}</p>
                        <script>
                            window.opener?.postMessage({ type: 'oauth_error', provider: '${provider}', error: '${error.message}' }, '${frontendUrl}');
                            setTimeout(() => window.close(), 3000);
                        </script>
                    </body>
                </html>
            `;
        }
    }

}
