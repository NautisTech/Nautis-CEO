import { apiClient, type RequestConfig } from '../client'
import type {
    Group,
    GroupListItem,
    CreateGroupDto,
    UpdateGroupDto,
    AssignPermissionsDto,
    AssignUsersDto,
    CreateResponse,
    SuccessResponse,
} from './types'

class GroupsAPI {
    private baseUrl = '/grupos'

    /**
     * Criar novo grupo
     */
    async create(data: CreateGroupDto, config?: RequestConfig): Promise<CreateResponse> {
        return apiClient.post<CreateResponse>(this.baseUrl, data, {
            successMessage: 'Grupo criado com sucesso!',
            ...config,
        })
    }

    /**
     * Listar grupos
     */
    async list(config?: RequestConfig): Promise<GroupListItem[]> {
        return apiClient.get<GroupListItem[]>(this.baseUrl, {
            showErrorToast: false,
            ...config,
        })
    }

    /**
     * Obter grupo por ID
     */
    async getById(id: number, config?: RequestConfig): Promise<Group> {
        return apiClient.get<Group>(`${this.baseUrl}/${id}`, {
            showErrorToast: false,
            ...config,
        })
    }

    /**
     * Atualizar grupo
     */
    async update(
        id: number,
        data: UpdateGroupDto,
        config?: RequestConfig
    ): Promise<SuccessResponse> {
        return apiClient.put<SuccessResponse>(`${this.baseUrl}/${id}`, data, {
            successMessage: 'Grupo atualizado com sucesso!',
            ...config,
        })
    }

    /**
     * Deletar grupo (soft delete)
     */
    async delete(id: number, config?: RequestConfig): Promise<SuccessResponse> {
        return apiClient.delete<SuccessResponse>(`${this.baseUrl}/${id}`, {
            successMessage: 'Grupo deletado com sucesso!',
            ...config,
        })
    }

    /**
     * Associar permissões ao grupo
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
     * Associar utilizadores ao grupo
     */
    async assignUsers(
        id: number,
        data: AssignUsersDto,
        config?: RequestConfig
    ): Promise<SuccessResponse> {
        return apiClient.post<SuccessResponse>(
            `${this.baseUrl}/${id}/utilizadores`,
            data,
            {
                successMessage: 'Utilizadores associados com sucesso!',
                ...config,
            }
        )
    }

    /**
     * Obter estatísticas de grupos
     */
    async getStatistics(config?: RequestConfig): Promise<{
        total_grupos: number
        grupos_ativos: number
        grupos_inativos: number
        total_atribuicoes: number
        utilizadores_com_grupos: number
        grupos_com_permissoes: number
        media_utilizadores_por_grupo: number
    }> {
        return apiClient.get(`${this.baseUrl}/estatisticas`, {
            showErrorToast: false,
            ...config,
        })
    }
}

export const groupsAPI = new GroupsAPI()
