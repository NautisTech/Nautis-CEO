import { Injectable, HttpException } from '@nestjs/common';
import { ConfiguracoesService } from '../configuracoes/configuracoes.service';

@Injectable()
export class InstagramService {
    async postContent(
        accessToken: string,
        igUserId: string,
        caption: string,
        imageUrl: string,
    ) {
        // 1. Create a media container
        const createRes = await fetch(
            `https://graph.facebook.com/v20.0/${igUserId}/media`,
            {
                method: 'POST',
                body: new URLSearchParams({
                    image_url: imageUrl,
                    caption,
                    access_token: accessToken,
                }),
            },
        );
        const createData = await createRes.json();

        // 2. Publish the media
        const publishRes = await fetch(
            `https://graph.facebook.com/v20.0/${igUserId}/media_publish`,
            {
                method: 'POST',
                body: new URLSearchParams({
                    creation_id: createData.id,
                    access_token: accessToken,
                }),
            },
        );
        return publishRes.json();
    }
}

@Injectable()
export class FacebookService {
    private readonly apiVersion = 'v20.0';
    private readonly baseUrl = `https://graph.facebook.com/${this.apiVersion}`;

    /**
     * Publish a post on a Facebook Page.
     * @param accessToken Long-lived Page access token
     * @param pageId Facebook Page ID
     * @param message Text caption
     * @param link Optional link or image URL
     */
    async postContent(
        accessToken: string,
        pageId: string,
        message: string,
        link?: string,
    ) {
        try {
            const endpoint = `${this.baseUrl}/${pageId}/feed`;

            const params = new URLSearchParams({
                message,
                access_token: accessToken,
            });

            if (link) params.append('link', link);

            const res = await fetch(endpoint, {
                method: 'POST',
                body: params,
            });

            const data = await res.json();
            if (!res.ok) {
                throw new HttpException(
                    data.error?.message || 'Facebook API error',
                    res.status,
                );
            }

            return data; // { id: "<pageId_postId>" }
        } catch (err) {
            console.error('Facebook post error:', err);
            throw new HttpException('Failed to post to Facebook', 500);
        }
    }

    /**
     * Retrieve the list of Pages managed by the user.
     * Used to discover Page IDs and Page-level access tokens.
     */
    async getUserPages(userAccessToken: string) {
        const res = await fetch(
            `${this.baseUrl}/me/accounts?access_token=${userAccessToken}`,
        );
        const data = await res.json();
        if (!res.ok) throw new Error(JSON.stringify(data));
        return data.data; // [{ id, name, access_token, ... }]
    }
}

@Injectable()
export class LinkedInService {
    private readonly baseUrl = 'https://api.linkedin.com/v2';

    /**
     * Create a LinkedIn post.
     * @param accessToken OAuth2 access token
     * @param authorUrn "urn:li:person:{id}" or "urn:li:organization:{id}"
     * @param text The post text
     * @param mediaUrl Optional image or link URL
     */
    async postContent(
        accessToken: string,
        authorUrn: string,
        text: string,
        mediaUrl?: string,
    ) {
        try {
            const body: any = {
                author: authorUrn,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: { text },
                        shareMediaCategory: mediaUrl ? 'ARTICLE' : 'NONE',
                    },
                },
                visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
            };

            if (mediaUrl) {
                body.specificContent['com.linkedin.ugc.ShareContent'].media = [
                    { status: 'READY', originalUrl: mediaUrl },
                ];
            }

            const res = await fetch(`${this.baseUrl}/ugcPosts`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Restli-Protocol-Version': '2.0.0',
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new HttpException(
                    data.message || 'LinkedIn API error',
                    res.status,
                );
            }

            return data; // { id: 'urn:li:share:...' }
        } catch (err) {
            console.error('LinkedIn post error:', err);
            throw new HttpException('Failed to post to LinkedIn', 500);
        }
    }

    /**
     * Get the authenticated user's URN (LinkedIn ID).
     */
    async getProfile(accessToken: string) {
        const res = await fetch(`${this.baseUrl}/me`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(JSON.stringify(data));
        return data; // includes id, localizedFirstName, etc.
    }
}

@Injectable()
export class SocialService {
    constructor(
        private configService: ConfiguracoesService,
        private instagram: InstagramService,
        private facebook: FacebookService,
        private linkedin: LinkedInService,
    ) { }

    async post(
        tenantId: number,
        userId: string,
        provider: string,
        content: any,
    ) {
        const tokens = await this.getUserTokens(tenantId, userId, provider);
        if (!tokens) throw new Error(`${provider} account not connected`);

        const validToken =
            tokens.expires_at && Date.now() > tokens.expires_at
                ? await this.refreshToken(tenantId, userId, provider)
                : tokens.access_token;

        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const imageUrl = content.imagem_destaque || null;

        const caption = `${content.titulo}\n\n${content.resumo || content.subtitulo || ''}\n\nLeia mais: ${baseUrl}`;

        switch (provider) {
            case 'linkedin':
                if (!tokens.authorUrn) {
                    throw new Error('LinkedIn authorUrn not found in tokens');
                }
                return await this.linkedin.postContent(
                    validToken,
                    tokens.authorUrn,
                    caption,
                    imageUrl || baseUrl,
                );
            case 'facebook':
                // Use page_id from tokens (set during OAuth)
                if (!tokens.clientId) {
                    throw new Error('Facebook page_id not found in tokens. Please reconnect your account.');
                }
                return await this.facebook.postContent(
                    validToken,
                    tokens.clientId,
                    caption,
                    imageUrl || baseUrl,
                );
            case 'instagram':
                if (!imageUrl) {
                    throw new Error('Instagram requires an image');
                }
                if (!tokens.clientId) {
                    throw new Error('Instagram user ID not found in tokens. Please reconnect your account.');
                }
                return await this.instagram.postContent(
                    validToken,
                    tokens.clientId,
                    caption,
                    imageUrl,
                );
            default:
                throw new Error(`Unsupported provider: ${provider}`);
        }
    }

    async getUserTokens(tenantId: number, userId: string, provider: string) {
        const config = await this.configService.obterConfiguracao(
            tenantId,
            `${provider.toUpperCase()}_TOKENS`,
        );
        return config ? JSON.parse(config.valor) : null;
    }

    async saveUserTokens(
        tenantId: number,
        userId: string,
        provider: string,
        tokens: any,
    ) {
        await this.configService.atualizarConfiguracao(tenantId, {
            codigo: `${provider.toUpperCase()}_TOKENS`,
            valor: tokens ? JSON.stringify(tokens) : (null as any),
        });
    }

    async getClientCredentials(tenantId: number, provider: string) {
        if (provider === 'facebook' || provider === 'instagram') {
            const config = await this.configService.obterConfiguracao(
                tenantId,
                'META_APP_CREDENTIALS',
            );
            return config ? JSON.parse(config.valor) : null;
        }

        const config = await this.configService.obterConfiguracao(
            tenantId,
            `${provider.toUpperCase()}_APP_CREDENTIALS`,
        );
        return config ? JSON.parse(config.valor) : null;
    }

    async refreshToken(
        tenantId: number,
        userId: string,
        provider: string,
    ): Promise<string> {
        const tokens = await this.getUserTokens(tenantId, userId, provider);
        const creds = await this.getClientCredentials(tenantId, provider);

        const res = await fetch(this.getTokenEndpoint(provider), {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: tokens.refresh_token,
                client_id: creds.clientId,
                client_secret: creds.clientSecret,
            }),
        });

        const data = await res.json();
        const updated = {
            ...tokens,
            access_token: data.access_token,
            expires_at: Date.now() + data.expires_in * 1000,
        };

        await this.saveUserTokens(tenantId, userId, provider, updated);
        return updated.access_token;
    }

    async handleOAuthCallback(
        tenantId: number,
        userId: string,
        provider: string,
        code: string,
    ) {
        const creds = await this.getClientCredentials(tenantId, provider);
        const redirectUri = `${process.env.API_URL || 'http://localhost:9833/api'}/social/callback/${provider}`;

        if (provider === 'facebook' || provider === 'instagram') {
            // Step 1: Exchange code for short-lived user token
            const shortRes = await fetch(
                `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${creds.clientId}&redirect_uri=${encodeURIComponent(
                    redirectUri,
                )}&client_secret=${creds.clientSecret}&code=${code}`,
            );
            const shortData = await shortRes.json();
            if (!shortRes.ok) throw new Error(JSON.stringify(shortData));

            // Step 2: Exchange for long-lived user token
            const longRes = await fetch(
                `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${creds.clientId}&client_secret=${creds.clientSecret}&fb_exchange_token=${shortData.access_token}`,
            );
            const longData = await longRes.json();
            if (!longRes.ok) throw new Error(JSON.stringify(longData));

            const userToken = longData.access_token;
            const expiresAt = Date.now() + longData.expires_in * 1000;

            // Step 3: Fetch Pages
            const pagesRes = await fetch(
                `https://graph.facebook.com/v21.0/me/accounts?access_token=${userToken}`,
            );
            const pagesData = await pagesRes.json();

            console.log('[OAuth] Pages response:', JSON.stringify(pagesData, null, 2));

            if (!pagesRes.ok) {
                throw new Error(`Failed to fetch pages: ${JSON.stringify(pagesData)}`);
            }

            if (!pagesData.data || pagesData.data.length === 0) {
                throw new Error('No Facebook Pages found. You need to manage at least one Facebook Page to use this integration.');
            }

            // For now just pick the first managed page
            const firstPage = pagesData.data[0];
            let igUserId = null;

            console.log('[OAuth] First page:', firstPage.name, firstPage.id);

            // Step 4: Get Instagram account if present
            if (firstPage) {
                const igRes = await fetch(
                    `https://graph.facebook.com/v21.0/${firstPage.id}?fields=instagram_business_account&access_token=${firstPage.access_token}`,
                );
                const igData = await igRes.json();

                console.log('[OAuth] Instagram account data:', JSON.stringify(igData, null, 2));

                igUserId = igData.instagram_business_account?.id || null;

                if (igUserId) {
                    console.log('[OAuth] Found Instagram Business Account:', igUserId);
                } else {
                    console.log('[OAuth] No Instagram Business Account linked to this page');
                }
            }

            // Step 5: Save everything
            const tokens = {
                access_token: firstPage.access_token,
                user_access_token: userToken,
                page_id: firstPage.id,
                ig_user_id: igUserId,
                expires_at: expiresAt,
            };

            console.log('[OAuth] Saving tokens:', {
                page_id: tokens.page_id,
                ig_user_id: tokens.ig_user_id,
                has_access_token: !!tokens.access_token,
            });

            await this.saveUserTokens(tenantId, userId, provider, tokens);

            return tokens;
        }

        if (provider === 'linkedin') {
            // Step 1: Exchange code for access token
            const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: redirectUri,
                    client_id: creds.clientId,
                    client_secret: creds.clientSecret,
                }),
            });
            const tokenData = await tokenRes.json();
            if (!tokenRes.ok) throw new Error(JSON.stringify(tokenData));

            const accessToken = tokenData.access_token;
            const expiresAt = Date.now() + tokenData.expires_in * 1000;

            // Step 2: Get profile to get user ID
            const profileRes = await fetch('https://api.linkedin.com/v2/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const profileData = await profileRes.json();
            if (!profileRes.ok) throw new Error(JSON.stringify(profileData));

            const authorUrn = `urn:li:person:${profileData.id}`;

            // Step 3: Save tokens
            const tokens = {
                access_token: accessToken,
                authorUrn,
                expires_at: expiresAt,
            };

            await this.saveUserTokens(tenantId, userId, provider, tokens);
            return tokens;
        }

        throw new Error(`Unsupported provider: ${provider}`);
    }


    private getTokenEndpoint(provider: string): string {
        switch (provider) {
            case 'facebook':
                return 'https://graph.facebook.com/oauth/access_token';
            case 'linkedin':
                return 'https://www.linkedin.com/oauth/v2/accessToken';
            default:
                throw new Error(`No token endpoint for provider ${provider}`);
        }
    }
}
