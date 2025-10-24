import { apiClient, type RequestConfig } from '../client'
import type {
    Permission,
    PermissionModule,
    CreatePermissionDto,
    UpdatePermissionDto,
    CreateResponse,
    SuccessResponse,
} from './types'

class PermissionsAPI {
    private baseUrl = '/permissoes'

    /**
     * Criar nova permissão
     */
    async create(
        data: CreatePermissionDto,
        config?: RequestConfig
    ): Promise<CreateResponse> {
        return apiClient.post<CreateResponse>(this.baseUrl, data, {
            successMessage: 'Permissão criada com sucesso!',
            ...config,
        })
    }

    /**
     * Listar permissões
     */
    async list(config?: RequestConfig): Promise<Permission[]> {
        return apiClient.get<Permission[]>(this.baseUrl, {
            showErrorToast: false,
            ...config,
        })
    }

    /**
     * Listar permissões agrupadas por módulo
     */
    async listByModule(config?: RequestConfig): Promise<PermissionModule[]> {
        return apiClient.get<PermissionModule[]>(`${this.baseUrl}/modulos`, {
            showErrorToast: false,
            ...config,
        })
    }

    /**
     * Obter permissão por ID
     */
    async getById(id: number, config?: RequestConfig): Promise<Permission> {
        return apiClient.get<Permission>(`${this.baseUrl}/${id}`, {
            showErrorToast: false,
            ...config,
        })
    }

    /**
     * Obter permissão por código
     */
    async getByCode(code: string, config?: RequestConfig): Promise<Permission> {
        return apiClient.get<Permission>(`${this.baseUrl}/codigo/${code}`, {
            showErrorToast: false,
            ...config,
        })
    }

    /**
     * Atualizar permissão
     */
    async update(
        id: number,
        data: UpdatePermissionDto,
        config?: RequestConfig
    ): Promise<SuccessResponse> {
        return apiClient.put<SuccessResponse>(`${this.baseUrl}/${id}`, data, {
            successMessage: 'Permissão atualizada com sucesso!',
            ...config,
        })
    }

    /**
     * Deletar permissão
     */
    async delete(id: number, config?: RequestConfig): Promise<SuccessResponse> {
        return apiClient.delete<SuccessResponse>(`${this.baseUrl}/${id}`, {
            successMessage: 'Permissão deletada com sucesso!',
            ...config,
        })
    }

    /**
     * Obter permissões de um utilizador
     */
    async getUserPermissions(
        userId: number,
        config?: RequestConfig
    ): Promise<Permission[]> {
        return apiClient.get<Permission[]>(
            `${this.baseUrl}/utilizador/${userId}`,
            {
                showErrorToast: false,
                ...config,
            }
        )
    }

    /**
     * Associar permissão a um utilizador
     */
    async assignToUser(
        userId: number,
        permissionId: number,
        config?: RequestConfig
    ): Promise<SuccessResponse> {
        return apiClient.post<SuccessResponse>(
            `${this.baseUrl}/utilizador/${userId}/${permissionId}`,
            {},
            {
                successMessage: 'Permissão associada ao utilizador!',
                ...config,
            }
        )
    }

    /**
     * Remover permissão de um utilizador
     */
    async removeFromUser(
        userId: number,
        permissionId: number,
        config?: RequestConfig
    ): Promise<SuccessResponse> {
        return apiClient.delete<SuccessResponse>(
            `${this.baseUrl}/utilizador/${userId}/${permissionId}`,
            {
                successMessage: 'Permissão removida do utilizador!',
                ...config,
            }
        )
    }
}

export const permissionsAPI = new PermissionsAPI()
