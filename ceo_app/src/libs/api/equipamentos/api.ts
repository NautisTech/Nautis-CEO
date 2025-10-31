import { apiClient, type RequestConfig } from '../client'
import type {
  Marca,
  CriarMarcaDto,
  CategoriaEquipamento,
  CriarCategoriaDto,
  ModeloEquipamento,
  CriarModeloDto,
  Equipamento,
  CriarEquipamentoDto,
  FiltrosEquipamento,
} from './types'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

class MarcasAPI {
  private baseUrl = '/marcas'

  async list(
    filtros?: { ativo?: boolean; page?: number; pageSize?: number },
    config?: RequestConfig
  ): Promise<Marca[] | PaginatedResponse<Marca>> {
    const params = new URLSearchParams()
    if (filtros?.ativo !== undefined) params.append('ativo', String(filtros.ativo))
    if (filtros?.page) params.append('page', String(filtros.page))
    if (filtros?.pageSize) params.append('pageSize', String(filtros.pageSize))

    return apiClient.get<Marca[] | PaginatedResponse<Marca>>(`${this.baseUrl}?${params.toString()}`, {
      showErrorToast: false,
      ...config,
    })
  }

  async getById(id: number, config?: RequestConfig): Promise<Marca> {
    return apiClient.get<Marca>(`${this.baseUrl}/${id}`, {
      showErrorToast: false,
      ...config,
    })
  }

  async create(data: CriarMarcaDto, config?: RequestConfig): Promise<{ id: number }> {
    return apiClient.post<{ id: number }>(this.baseUrl, data, {
      successMessage: 'Marca criada com sucesso!',
      ...config,
    })
  }

  async update(
    id: number,
    data: CriarMarcaDto,
    config?: RequestConfig
  ): Promise<{ message: string }> {
    return apiClient.put<{ message: string }>(`${this.baseUrl}/${id}`, data, {
      successMessage: 'Marca atualizada com sucesso!',
      ...config,
    })
  }

  async delete(id: number, config?: RequestConfig): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      successMessage: 'Marca deletada com sucesso!',
      ...config,
    })
  }
}

class CategoriasAPI {
  private baseUrl = '/categorias-equipamento'

  async list(config?: RequestConfig): Promise<CategoriaEquipamento[]> {
    return apiClient.get<CategoriaEquipamento[]>(this.baseUrl, {
      showErrorToast: false,
      ...config,
    })
  }

  async getById(id: number, config?: RequestConfig): Promise<CategoriaEquipamento> {
    return apiClient.get<CategoriaEquipamento>(`${this.baseUrl}/${id}`, {
      showErrorToast: false,
      ...config,
    })
  }

  async create(data: CriarCategoriaDto, config?: RequestConfig): Promise<{ id: number }> {
    return apiClient.post<{ id: number }>(this.baseUrl, data, {
      successMessage: 'Categoria criada com sucesso!',
      ...config,
    })
  }

  async update(
    id: number,
    data: CriarCategoriaDto,
    config?: RequestConfig
  ): Promise<{ message: string }> {
    return apiClient.put<{ message: string }>(`${this.baseUrl}/${id}`, data, {
      successMessage: 'Categoria atualizada com sucesso!',
      ...config,
    })
  }

  async delete(id: number, config?: RequestConfig): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      successMessage: 'Categoria deletada com sucesso!',
      ...config,
    })
  }
}

class ModelosAPI {
  private baseUrl = '/modelos-equipamento'

  async list(
    filtros?: { marca_id?: number; categoria_id?: number; page?: number; pageSize?: number },
    config?: RequestConfig
  ): Promise<ModeloEquipamento[] | PaginatedResponse<ModeloEquipamento>> {
    const params = new URLSearchParams()
    if (filtros?.marca_id) params.append('marca_id', String(filtros.marca_id))
    if (filtros?.categoria_id) params.append('categoria_id', String(filtros.categoria_id))
    if (filtros?.page) params.append('page', String(filtros.page))
    if (filtros?.pageSize) params.append('pageSize', String(filtros.pageSize))

    return apiClient.get<ModeloEquipamento[] | PaginatedResponse<ModeloEquipamento>>(
      `${this.baseUrl}?${params.toString()}`,
      {
        showErrorToast: false,
        ...config,
      }
    )
  }

  async getById(id: number, config?: RequestConfig): Promise<ModeloEquipamento> {
    return apiClient.get<ModeloEquipamento>(`${this.baseUrl}/${id}`, {
      showErrorToast: false,
      ...config,
    })
  }

  async create(data: CriarModeloDto, config?: RequestConfig): Promise<ModeloEquipamento> {
    return apiClient.post<ModeloEquipamento>(this.baseUrl, data, {
      successMessage: 'Modelo criado com sucesso!',
      ...config,
    })
  }

  async update(
    id: number,
    data: CriarModeloDto,
    config?: RequestConfig
  ): Promise<ModeloEquipamento> {
    return apiClient.put<ModeloEquipamento>(`${this.baseUrl}/${id}`, data, {
      successMessage: 'Modelo atualizado com sucesso!',
      ...config,
    })
  }

  async delete(id: number, config?: RequestConfig): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      successMessage: 'Modelo deletado com sucesso!',
      ...config,
    })
  }
}

class EquipamentosAPI {
  private baseUrl = '/equipamentos'

  async list(
    filtros?: FiltrosEquipamento & { page?: number; pageSize?: number },
    config?: RequestConfig
  ): Promise<Equipamento[] | PaginatedResponse<Equipamento>> {
    const params = new URLSearchParams()
    if (filtros?.modelo_id) params.append('modelo_id', String(filtros.modelo_id))
    if (filtros?.responsavel_id) params.append('responsavel_id', String(filtros.responsavel_id))
    if (filtros?.utilizador_id) params.append('utilizador_id', String(filtros.utilizador_id))
    if (filtros?.estado) params.append('estado', filtros.estado)
    if (filtros?.page) params.append('page', String(filtros.page))
    if (filtros?.pageSize) params.append('pageSize', String(filtros.pageSize))

    return apiClient.get<Equipamento[] | PaginatedResponse<Equipamento>>(
      `${this.baseUrl}?${params.toString()}`,
      {
        showErrorToast: false,
        ...config,
      }
    )
  }

  async getById(id: number, config?: RequestConfig): Promise<Equipamento> {
    return apiClient.get<Equipamento>(`${this.baseUrl}/${id}`, {
      showErrorToast: false,
      ...config,
    })
  }

  async create(data: CriarEquipamentoDto, config?: RequestConfig): Promise<Equipamento> {
    return apiClient.post<Equipamento>(this.baseUrl, data, {
      successMessage: 'Equipamento criado com sucesso!',
      ...config,
    })
  }

  async update(
    id: number,
    data: CriarEquipamentoDto,
    config?: RequestConfig
  ): Promise<Equipamento> {
    return apiClient.put<Equipamento>(`${this.baseUrl}/${id}`, data, {
      successMessage: 'Equipamento atualizado com sucesso!',
      ...config,
    })
  }

  async delete(id: number, config?: RequestConfig): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      successMessage: 'Equipamento deletado com sucesso!',
      ...config,
    })
  }

  async getDashboardStatistics(config?: RequestConfig): Promise<any> {
    return apiClient.get<any>(`${this.baseUrl}/dashboard/estatisticas`, {
      showErrorToast: false,
      ...config,
    })
  }
}

export const marcasAPI = new MarcasAPI()
export const categoriasAPI = new CategoriasAPI()
export const modelosAPI = new ModelosAPI()
export const equipamentosAPI = new EquipamentosAPI()
