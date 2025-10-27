import { apiClient, type RequestConfig } from '../client'
import type { Empresa, CriarEmpresaDto, AtualizarEmpresaDto } from './types'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

class EmpresasAPI {
  private baseUrl = '/empresas'

  async list(
    filtros?: { ativo?: boolean; page?: number; pageSize?: number },
    config?: RequestConfig
  ): Promise<Empresa[] | PaginatedResponse<Empresa>> {
    const params = new URLSearchParams()
    if (filtros?.ativo !== undefined) params.append('ativo', String(filtros.ativo))
    if (filtros?.page) params.append('page', String(filtros.page))
    if (filtros?.pageSize) params.append('pageSize', String(filtros.pageSize))

    return apiClient.get<Empresa[] | PaginatedResponse<Empresa>>(`${this.baseUrl}?${params.toString()}`, {
      showErrorToast: false,
      ...config,
    })
  }

  async getById(id: number, config?: RequestConfig): Promise<Empresa> {
    return apiClient.get<Empresa>(`${this.baseUrl}/${id}`, {
      showErrorToast: false,
      ...config,
    })
  }

  async create(data: CriarEmpresaDto, config?: RequestConfig): Promise<Empresa> {
    return apiClient.post<Empresa>(this.baseUrl, data, {
      successMessage: 'Empresa criada com sucesso!',
      ...config,
    })
  }

  async update(
    id: number,
    data: AtualizarEmpresaDto,
    config?: RequestConfig
  ): Promise<Empresa> {
    return apiClient.put<Empresa>(`${this.baseUrl}/${id}`, data, {
      successMessage: 'Empresa atualizada com sucesso!',
      ...config,
    })
  }

  async delete(id: number, config?: RequestConfig): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      successMessage: 'Empresa deletada com sucesso!',
      ...config,
    })
  }
}

export const empresasAPI = new EmpresasAPI()
