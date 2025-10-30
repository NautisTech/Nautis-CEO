import { apiClient, type RequestConfig } from '../client'
import type { Cliente, CriarClienteDto, AtualizarClienteDto } from './types'

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

class ClientesAPI {
    private baseUrl = '/clientes'

    async list(
        filtros?: {
            gestor_conta_id?: number
            ativo?: boolean
            page?: number
            pageSize?: number
        },
        config?: RequestConfig
    ): Promise<Cliente[] | PaginatedResponse<Cliente>> {
        const params = new URLSearchParams()

        if (filtros?.gestor_conta_id) params.append('gestor_conta_id', String(filtros.gestor_conta_id))
        if (filtros?.ativo !== undefined) params.append('ativo', String(filtros.ativo))
        if (filtros?.page) params.append('page', String(filtros.page))
        if (filtros?.pageSize) params.append('pageSize', String(filtros.pageSize))

        return apiClient.get<Cliente[] | PaginatedResponse<Cliente>>(
            `${this.baseUrl}?${params.toString()}`,
            config?.signal
        )
    }

    async getById(id: number, config?: RequestConfig): Promise<Cliente> {
        return apiClient.get<Cliente>(`${this.baseUrl}/${id}`, config?.signal)
    }

    async getByEmpresaId(empresaId: number, config?: RequestConfig): Promise<Cliente> {
        return apiClient.get<Cliente>(`${this.baseUrl}/empresa/${empresaId}`, config?.signal)
    }

    async create(data: CriarClienteDto, config?: RequestConfig): Promise<Cliente> {
        return apiClient.post<Cliente>(this.baseUrl, data, config?.signal)
    }

    async update(id: number, data: AtualizarClienteDto, config?: RequestConfig): Promise<Cliente> {
        return apiClient.put<Cliente>(`${this.baseUrl}/${id}`, data, config?.signal)
    }

    async delete(id: number, config?: RequestConfig): Promise<{ message: string }> {
        return apiClient.delete<{ message: string }>(`${this.baseUrl}/${id}`, config?.signal)
    }

    async bloquear(
        id: number,
        motivo: string,
        config?: RequestConfig
    ): Promise<{ message: string; cliente: Cliente }> {
        return apiClient.patch<{ message: string; cliente: Cliente }>(
            `${this.baseUrl}/${id}/bloquear`,
            { motivo },
            config?.signal
        )
    }

    async desbloquear(id: number, config?: RequestConfig): Promise<{ message: string; cliente: Cliente }> {
        return apiClient.patch<{ message: string; cliente: Cliente }>(
            `${this.baseUrl}/${id}/desbloquear`,
            {},
            config?.signal
        )
    }

    async getEstatisticas(id: number, config?: RequestConfig): Promise<{
        total_compras: number
        num_encomendas: number
        tickets_abertos: number
        tickets_total: number
        ultima_compra?: string
        valor_medio_compra: number
    }> {
        return apiClient.get(`${this.baseUrl}/${id}/estatisticas`, config?.signal)
    }
}

export const clientesAPI = new ClientesAPI()
