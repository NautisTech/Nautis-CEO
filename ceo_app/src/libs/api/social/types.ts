export interface PublicarSocialRequest {
    contentId: number
    platforms: string[]
}

export interface PublicarSocialResponse {
    success: boolean
    results: Array<{
        platform: string
        success: boolean
        data?: any
        error?: string
    }>
}

export interface ConnectedAccount {
    platform: string
    connected: boolean
    username?: string
}

export interface ConnectedAccountsResponse {
    accounts: ConnectedAccount[]
}

export interface OAuthFlowResponse {
    authUrl: string
}

export interface DisconnectRequest {
    platform: string
}