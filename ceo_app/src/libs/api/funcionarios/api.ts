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

    /**
     * Atualizar funcionário
     */
    async update(id: number, data: any, config?: RequestConfig): Promise<void> {
        return apiClient.put(`${this.baseUrl}/${id}`, data, {
            successMessage: 'Funcionário atualizado com sucesso!',
            ...config,
        })
    }

    /**
     * Ativar/Desativar funcionário
     */
    async toggleAtivo(id: number, config?: RequestConfig): Promise<{ message: string; ativo: boolean }> {
        return apiClient.put<{ message: string; ativo: boolean }>(`${this.baseUrl}/${id}/toggle-ativo`, {}, {
            successMessage: 'Estado do funcionário atualizado com sucesso!',
            ...config,
        })
    }

    /**
     * Listar tipos de funcionário
     */
    async getTiposFuncionario(config?: RequestConfig): Promise<Array<{
        id: number
        codigo: string
        nome: string
        icone?: string
        cor?: string
        ordem: number
        ativo: boolean
    }>> {
        return apiClient.get(`${this.baseUrl}/tipos-funcionario`, {
            showErrorToast: false,
            ...config,
        })
    }

    // ========== CONTACTOS ==========
    async getContatos(funcionarioId: number, config?: RequestConfig): Promise<any[]> {
        return apiClient.get(`${this.baseUrl}/${funcionarioId}/contatos`, {
            showErrorToast: false,
            ...config,
        })
    }

    async createContato(data: any, config?: RequestConfig): Promise<{ id: number }> {
        return apiClient.post(`${this.baseUrl}/contatos`, data, {
            successMessage: 'Contacto adicionado com sucesso!',
            ...config,
        })
    }

    async updateContato(id: number, data: any, config?: RequestConfig): Promise<void> {
        return apiClient.put(`${this.baseUrl}/contatos/${id}`, data, {
            successMessage: 'Contacto atualizado com sucesso!',
            ...config,
        })
    }

    async deleteContato(id: number, config?: RequestConfig): Promise<void> {
        return apiClient.delete(`${this.baseUrl}/contatos/${id}`, {
            successMessage: 'Contacto excluído com sucesso!',
            ...config,
        })
    }

    // ========== ENDEREÇOS ==========
    async getEnderecos(funcionarioId: number, config?: RequestConfig): Promise<any[]> {
        return apiClient.get(`${this.baseUrl}/${funcionarioId}/enderecos`, {
            showErrorToast: false,
            ...config,
        })
    }

    async createEndereco(data: any, config?: RequestConfig): Promise<{ id: number }> {
        return apiClient.post(`${this.baseUrl}/enderecos`, data, {
            successMessage: 'Endereço adicionado com sucesso!',
            ...config,
        })
    }

    async updateEndereco(id: number, data: any, config?: RequestConfig): Promise<void> {
        return apiClient.put(`${this.baseUrl}/enderecos/${id}`, data, {
            successMessage: 'Endereço atualizado com sucesso!',
            ...config,
        })
    }

    async deleteEndereco(id: number, config?: RequestConfig): Promise<void> {
        return apiClient.delete(`${this.baseUrl}/enderecos/${id}`, {
            successMessage: 'Endereço excluído com sucesso!',
            ...config,
        })
    }

    // ========== EMPREGOS ==========
    async getEmpregos(funcionarioId: number, config?: RequestConfig): Promise<any[]> {
        return apiClient.get(`${this.baseUrl}/${funcionarioId}/empregos`, {
            showErrorToast: false,
            ...config,
        })
    }

    async createEmprego(data: any, config?: RequestConfig): Promise<{ id: number }> {
        return apiClient.post(`${this.baseUrl}/empregos`, data, {
            successMessage: 'Emprego adicionado com sucesso!',
            ...config,
        })
    }

    async updateEmprego(id: number, data: any, config?: RequestConfig): Promise<void> {
        return apiClient.put(`${this.baseUrl}/empregos/${id}`, data, {
            successMessage: 'Emprego atualizado com sucesso!',
            ...config,
        })
    }

    async deleteEmprego(id: number, config?: RequestConfig): Promise<void> {
        return apiClient.delete(`${this.baseUrl}/empregos/${id}`, {
            successMessage: 'Emprego excluído com sucesso!',
            ...config,
        })
    }

    // ========== BENEFÍCIOS ==========
    async getBeneficios(funcionarioId: number, config?: RequestConfig): Promise<any[]> {
        return apiClient.get(`${this.baseUrl}/${funcionarioId}/beneficios`, {
            showErrorToast: false,
            ...config,
        })
    }

    async createBeneficio(data: any, config?: RequestConfig): Promise<{ id: number }> {
        return apiClient.post(`${this.baseUrl}/beneficios`, data, {
            successMessage: 'Benefício adicionado com sucesso!',
            ...config,
        })
    }

    async updateBeneficio(id: number, data: any, config?: RequestConfig): Promise<void> {
        return apiClient.put(`${this.baseUrl}/beneficios/${id}`, data, {
            successMessage: 'Benefício atualizado com sucesso!',
            ...config,
        })
    }

    async deleteBeneficio(id: number, config?: RequestConfig): Promise<void> {
        return apiClient.delete(`${this.baseUrl}/beneficios/${id}`, {
            successMessage: 'Benefício excluído com sucesso!',
            ...config,
        })
    }

    // ========== DOCUMENTOS ==========
    async getDocumentos(funcionarioId: number, config?: RequestConfig): Promise<any[]> {
        return apiClient.get(`${this.baseUrl}/${funcionarioId}/documentos`, {
            showErrorToast: false,
            ...config,
        })
    }

    async createDocumento(data: any, config?: RequestConfig): Promise<{ id: number }> {
        return apiClient.post(`${this.baseUrl}/documentos`, data, {
            successMessage: 'Documento adicionado com sucesso!',
            ...config,
        })
    }

    async updateDocumento(id: number, data: any, config?: RequestConfig): Promise<void> {
        return apiClient.put(`${this.baseUrl}/documentos/${id}`, data, {
            successMessage: 'Documento atualizado com sucesso!',
            ...config,
        })
    }

    async deleteDocumento(id: number, config?: RequestConfig): Promise<void> {
        return apiClient.delete(`${this.baseUrl}/documentos/${id}`, {
            successMessage: 'Documento excluído com sucesso!',
            ...config,
        })
    }

    /**
     * Obter estatísticas de funcionários
     */
    async getStatistics(config?: RequestConfig): Promise<{
        total_funcionarios: number
        funcionarios_ativos: number
        funcionarios_inativos: number
        funcionarios_mes: number
    }> {
        return apiClient.get(`${this.baseUrl}/estatisticas`, {
            showErrorToast: false,
            ...config,
        })
    }
}

export const funcionariosAPI = new FuncionariosAPI()
