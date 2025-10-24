import { apiClient, type RequestConfig } from '../client'
import type {
    Funcionario,
    FuncionarioDetalhado,
    CreateFuncionarioDto
} from './types'

class FuncionariosAPI {
    private baseUrl = '/funcionarios'

    /**
     * Criar novo funcionário
     */
    async create(data: CreateFuncionarioDto, config?: RequestConfig): Promise<{ id: number }> {
        return apiClient.post<{ id: number }>(this.baseUrl, data, {
            successMessage: 'Funcionário criado com sucesso!',
            ...config,
        })
    }

    /**
     * Listar funcionários
     */
    async list(filters?: {
        tipoFuncionarioId?: number
        ativo?: boolean
        textoPesquisa?: string
        page?: number
        pageSize?: number
    }, config?: RequestConfig): Promise<{
        data: Funcionario[]
        total: number
        page: number
        pageSize: number
    }> {
        return apiClient.get(this.baseUrl, {
            params: filters,
            showErrorToast: false,
            ...config,
        })
    }

    /**
     * Obter funcionário por ID com todos os dados relacionados
     */
    async getById(id: number, config?: RequestConfig): Promise<FuncionarioDetalhado> {
        return apiClient.get<FuncionarioDetalhado>(`${this.baseUrl}/${id}`, {
            showErrorToast: false,
            ...config,
        })
    }
}

export const funcionariosAPI = new FuncionariosAPI()
