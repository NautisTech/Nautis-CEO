import { apiClient, type RequestConfig } from '../client'
import type {
    PublicarSocialResponse,
    PublicarSocialRequest,
    ConnectedAccountsResponse,
    OAuthFlowResponse,
    DisconnectRequest
} from './types'

class SocialAPI {
    private baseUrl = '/social'

    /**
     * Publicar conteúdo nas redes sociais
     */
    async publishToSocial(data: PublicarSocialRequest, config?: RequestConfig): Promise<PublicarSocialResponse> {
        return apiClient.post<PublicarSocialResponse>(`${this.baseUrl}/publish`, data, {
            showErrorToast: false,
            ...config,
        })
    }

    /**
     * Obter contas conectadas
     */
    async getConnectedAccounts(config?: RequestConfig): Promise<ConnectedAccountsResponse> {
        return apiClient.get<ConnectedAccountsResponse>(`${this.baseUrl}/accounts`, {
            showErrorToast: false,
            ...config,
        })
    }

    /**
     * Iniciar fluxo OAuth para conectar uma conta
     */
    async startOAuthFlow(provider: string, config?: RequestConfig): Promise<OAuthFlowResponse> {
        return apiClient.get<OAuthFlowResponse>(`${this.baseUrl}/connect/${provider}`, {
            showErrorToast: false,
            ...config,
        })
    }

    /**
     * Desconectar uma conta
     */
    async disconnectAccount(data: DisconnectRequest, config?: RequestConfig): Promise<void> {
        return apiClient.post(`${this.baseUrl}/disconnect`, data, {
            showErrorToast: false,
            ...config,
        })
    }
}

export const socialAPI = new SocialAPI()
