import { apiClient, type RequestConfig } from '../client'
import type {
    User,
    UserListItem,
    CreateUserDto,
    UpdateUserDto,
    UpdatePasswordDto,
    ResetPasswordDto,
    AssignGroupsDto,
    AssignPermissionsDto,
    AssignCompaniesDto,
    UserFilters,
    PaginatedResponse,
    CreateResponse,
    SuccessResponse,
} from './types'

class UsersAPI {
    private baseUrl = '/utilizadores'

    /**
     * Criar novo utilizador
     */
    async create(data: CreateUserDto, config?: RequestConfig): Promise<CreateResponse> {
        return apiClient.post<CreateResponse>(this.baseUrl, data, {
            successMessage: 'Utilizador criado com sucesso!',
            ...config,
        })
    }

    /**
     * Listar utilizadores com paginação e filtros
     */
    async list(
        filters?: UserFilters,
        config?: RequestConfig
    ): Promise<PaginatedResponse<UserListItem>> {
        return apiClient.get<PaginatedResponse<UserListItem>>(this.baseUrl, {
            params: filters,
            showErrorToast: false,
            ...config,
        })
    }

    /**
     * Obter utilizador por ID
     */
    async getById(id: number, config?: RequestConfig): Promise<User> {
        return apiClient.get<User>(`${this.baseUrl}/${id}`, {
            showErrorToast: false,
            ...config,
        })
    }

    /**
     * Atualizar utilizador
     */
    async update(
        id: number,
        data: UpdateUserDto,
        config?: RequestConfig
    ): Promise<SuccessResponse> {
        return apiClient.put<SuccessResponse>(`${this.baseUrl}/${id}`, data, {
            successMessage: 'Utilizador atualizado com sucesso!',
            ...config,
        })
    }

    /**
     * Atualizar senha do utilizador
     */
    async updatePassword(
        id: number,
        data: UpdatePasswordDto,
        config?: RequestConfig
    ): Promise<SuccessResponse> {
        return apiClient.put<SuccessResponse>(`${this.baseUrl}/${id}/senha`, data, {
            successMessage: 'Senha atualizada com sucesso!',
            ...config,
        })
    }

    /**
     * Resetar senha do utilizador (admin)
     */
    async resetPassword(
        id: number,
        data: ResetPasswordDto,
        config?: RequestConfig
    ): Promise<SuccessResponse> {
        return apiClient.post<SuccessResponse>(
            `${this.baseUrl}/${id}/resetar-senha`,
            data,
            {
                successMessage: 'Senha resetada com sucesso!',
                ...config,
            }
        )
    }

    /**
     * Desativar utilizador
     */
    async delete(id: number, config?: RequestConfig): Promise<SuccessResponse> {
        return apiClient.delete<SuccessResponse>(`${this.baseUrl}/${id}`, {
            successMessage: 'Utilizador desativado com sucesso!',
            ...config,
        })
    }

    /**
     * Associar grupos ao utilizador
     */
    async assignGroups(
        id: number,
        data: AssignGroupsDto,
        config?: RequestConfig
    ): Promise<SuccessResponse> {
        return apiClient.post<SuccessResponse>(
            `${this.baseUrl}/${id}/grupos`,
            data,
            {
                successMessage: 'Grupos associados com sucesso!',
                ...config,
            }
        )
    }

    /**
     * Remover utilizador de um grupo
     */
    async removeFromGroup(
        userId: number,
        groupId: number,
        config?: RequestConfig
    ): Promise<SuccessResponse> {
        return apiClient.delete<SuccessResponse>(
            `${this.baseUrl}/${userId}/grupos/${groupId}`,
            {
                successMessage: 'Utilizador removido do grupo!',
                ...config,
            }
        )
    }

    /**
     * Associar permissões diretas ao utilizador
     */
    async assignPermissions(
        id: number,
        data: AssignPermissionsDto,
        config?: RequestConfig
    ): Promise<SuccessResponse> {
        return apiClient.post<SuccessResponse>(
            `${this.baseUrl}/${id}/permissoes`,
            data,
            {
                successMessage: 'Permissões associadas com sucesso!',
                ...config,
            }
        )
    }

    /**
     * Remover permissão direta do utilizador
     */
    async removePermission(
        userId: number,
        permissionId: number,
        config?: RequestConfig
    ): Promise<SuccessResponse> {
        return apiClient.delete<SuccessResponse>(
            `${this.baseUrl}/${userId}/permissoes/${permissionId}`,
            {
                successMessage: 'Permissão removida!',
                ...config,
            }
        )
    }

    /**
     * Associar empresas ao utilizador
     */
    async assignCompanies(
        id: number,
        data: AssignCompaniesDto,
        config?: RequestConfig
    ): Promise<SuccessResponse> {
        return apiClient.post<SuccessResponse>(
            `${this.baseUrl}/${id}/empresas`,
            data,
            {
                successMessage: 'Empresas associadas com sucesso!',
                ...config,
            }
        )
    }

    /**
     * Remover utilizador de uma empresa
     */
    async removeFromCompany(
        userId: number,
        companyId: number,
        config?: RequestConfig
    ): Promise<SuccessResponse> {
        return apiClient.delete<SuccessResponse>(
            `${this.baseUrl}/${userId}/empresas/${companyId}`,
            {
                successMessage: 'Utilizador removido da empresa!',
                ...config,
            }
        )
    }

    /**
     * Obter estatísticas de utilizadores
     */
    async getStatistics(config?: RequestConfig): Promise<{
        total_utilizadores: number
        utilizadores_ativos: number
        utilizadores_inativos: number
        emails_verificados: number
        emails_nao_verificados: number
        novos_ultimos_30_dias: number
        ativos_ultimos_7_dias: number
    }> {
        return apiClient.get(`${this.baseUrl}/estatisticas`, {
            showErrorToast: false,
            ...config,
        })
    }

    /**
     * Obter estatísticas para dashboard de administração
     */
    async getDashboardStatistics(config?: RequestConfig): Promise<any> {
        return apiClient.get<any>(`${this.baseUrl}/dashboard/estatisticas`, {
            showErrorToast: false,
            ...config,
        })
    }
}

export const usersAPI = new UsersAPI()
