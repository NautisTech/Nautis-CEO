// ceo_app/src/lib/api/client.ts
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'

// Tipos
export interface ApiError {
    message: string
    statusCode: number
    error?: string
}

export interface LoginResponse {
    accessToken: string
    refreshToken: string
    user: {
        id: number
        username: string
        email: string
        fotoUrl: string | null
    }
    tenant: {
        id: number
        nome: string
        slug: string
    }
    empresas: Array<{
        id: number
        nome: string
        principal: boolean
    }>
}

export interface RefreshResponse {
    accessToken: string
}

class ApiClient {
    private client: AxiosInstance
    private refreshPromise: Promise<string> | null = null

    constructor() {
        this.client = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        this.setupInterceptors()
    }

    private setupInterceptors() {
        // Request interceptor - adiciona token automaticamente
        this.client.interceptors.request.use(
            config => {
                const token = this.getAccessToken()
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config
            },
            error => Promise.reject(error)
        )

        // Response interceptor - trata erros e refresh token
        this.client.interceptors.response.use(
            response => response,
            async (error: AxiosError<ApiError>) => {
                const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

                // Se erro 401 e não é retry, tenta refresh
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true

                    try {
                        const newToken = await this.handleTokenRefresh()

                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`
                        }

                        return this.client(originalRequest)
                    } catch (refreshError) {
                        // Refresh falhou, redireciona para login
                        this.handleAuthError()
                        return Promise.reject(refreshError)
                    }
                }

                return Promise.reject(this.normalizeError(error))
            }
        )
    }

    private async handleTokenRefresh(): Promise<string> {
        // Evita múltiplas chamadas simultâneas de refresh
        if (this.refreshPromise) {
            return this.refreshPromise
        }

        this.refreshPromise = (async () => {
            try {
                const refreshToken = this.getRefreshToken()

                if (!refreshToken) {
                    throw new Error('No refresh token available')
                }

                const response = await axios.post<RefreshResponse>(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                    { refreshToken }
                )

                const { accessToken } = response.data
                this.setAccessToken(accessToken)

                return accessToken
            } finally {
                this.refreshPromise = null
            }
        })()

        return this.refreshPromise
    }

    private normalizeError(error: AxiosError<ApiError>): ApiError {
        if (error.response?.data) {
            return error.response.data
        }

        return {
            message: error.message || 'An unexpected error occurred',
            statusCode: error.response?.status || 500
        }
    }

    private handleAuthError() {
        this.clearTokens()

        // Redireciona para login
        if (typeof window !== 'undefined') {
            window.location.href = '/login'
        }
    }

    // Token management
    private getAccessToken(): string | null {
        if (typeof window === 'undefined') return null
        return localStorage.getItem('accessToken')
    }

    private getRefreshToken(): string | null {
        if (typeof window === 'undefined') return null
        return localStorage.getItem('refreshToken')
    }

    private setAccessToken(token: string) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', token)
        }
    }

    private setRefreshToken(token: string) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('refreshToken', token)
        }
    }

    private clearTokens() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
        }
    }

    // Public methods
    public async login(email: string, password: string, tenantSlug?: string): Promise<LoginResponse> {
        const response = await this.client.post<LoginResponse>('/auth/login', {
            email,
            password,
            tenantSlug
        })

        // Armazena tokens
        this.setAccessToken(response.data.accessToken)
        this.setRefreshToken(response.data.refreshToken)

        return response.data
    }

    public async logout(): Promise<void> {
        try {
            await this.client.post('/auth/logout')
        } finally {
            this.clearTokens()
        }
    }

    public async getProfile() {
        const response = await this.client.get('/auth/me')
        return response.data
    }

    // Generic methods
    public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config)
        return response.data
    }

    public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.post<T>(url, data, config)
        return response.data
    }

    public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.put<T>(url, data, config)
        return response.data
    }

    public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.patch<T>(url, data, config)
        return response.data
    }

    public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.delete<T>(url, config)
        return response.data
    }
}

// Singleton instance
export const apiClient = new ApiClient()