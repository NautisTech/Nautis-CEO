import { apiClient, type RequestConfig } from '../client'
import type {
  Ticket,
  CriarTicketDto,
  TipoTicket,
  TicketHistorico,
  Intervencao,
  CriarIntervencaoDto
} from './types'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

class TicketsAPI {
  private baseUrl = '/tickets'

  async list(
    filtros?: {
      tipo_ticket_id?: number
      equipamento_id?: number
      status?: string
      prioridade?: string
      solicitante_id?: number
      atribuido_id?: number
      page?: number
      pageSize?: number
    },
    config?: RequestConfig
  ): Promise<Ticket[] | PaginatedResponse<Ticket>> {
    const params = new URLSearchParams()

    if (filtros?.tipo_ticket_id) params.append('tipo_ticket_id', String(filtros.tipo_ticket_id))
    if (filtros?.equipamento_id) params.append('equipamento_id', String(filtros.equipamento_id))
    if (filtros?.status) params.append('status', filtros.status)
    if (filtros?.prioridade) params.append('prioridade', filtros.prioridade)
    if (filtros?.solicitante_id) params.append('solicitante_id', String(filtros.solicitante_id))
    if (filtros?.atribuido_id) params.append('atribuido_id', String(filtros.atribuido_id))
    if (filtros?.page) params.append('page', String(filtros.page))
    if (filtros?.pageSize) params.append('pageSize', String(filtros.pageSize))

    return apiClient.get<Ticket[] | PaginatedResponse<Ticket>>(
      `${this.baseUrl}?${params.toString()}`,
      config?.signal
    )
  }

  async getById(id: number, config?: RequestConfig): Promise<Ticket> {
    return apiClient.get<Ticket>(`${this.baseUrl}/${id}`, config?.signal)
  }

  async create(data: CriarTicketDto, config?: RequestConfig): Promise<Ticket> {
    return apiClient.post<Ticket>(this.baseUrl, data, config?.signal)
  }

  async update(id: number, data: CriarTicketDto, config?: RequestConfig): Promise<Ticket> {
    return apiClient.put<Ticket>(`${this.baseUrl}/${id}`, data, config?.signal)
  }

  async delete(id: number, config?: RequestConfig): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`${this.baseUrl}/${id}`, config?.signal)
  }

  async getTipos(config?: RequestConfig): Promise<TipoTicket[]> {
    return apiClient.get<TipoTicket[]>(`${this.baseUrl}/tipos`, config?.signal)
  }

  async getHistorico(id: number, config?: RequestConfig): Promise<TicketHistorico[]> {
    return apiClient.get<TicketHistorico[]>(`${this.baseUrl}/${id}/historico`, config?.signal)
  }

  async getEstatisticas(config?: RequestConfig): Promise<{
    total: number
    novos: number
    abertos: number
    slaCumprido: number
    prioridade_baixa: number
    prioridade_media: number
    prioridade_alta: number
    prioridade_urgente: number
  }> {
    return apiClient.get(`${this.baseUrl}/estatisticas`, config?.signal)
  }
}

class IntervencoesAPI {
  private baseUrl = '/intervencoes'

  async list(
    filtros?: {
      ticket_id?: number
      equipamento_id?: number
      tipo?: string
      tecnico_id?: number
      status?: string
      page?: number
      pageSize?: number
    },
    config?: RequestConfig
  ): Promise<Intervencao[] | PaginatedResponse<Intervencao>> {
    const params = new URLSearchParams()

    if (filtros?.ticket_id) params.append('ticket_id', String(filtros.ticket_id))
    if (filtros?.equipamento_id) params.append('equipamento_id', String(filtros.equipamento_id))
    if (filtros?.tipo) params.append('tipo', filtros.tipo)
    if (filtros?.tecnico_id) params.append('tecnico_id', String(filtros.tecnico_id))
    if (filtros?.status) params.append('status', filtros.status)
    if (filtros?.page) params.append('page', String(filtros.page))
    if (filtros?.pageSize) params.append('pageSize', String(filtros.pageSize))

    return apiClient.get<Intervencao[] | PaginatedResponse<Intervencao>>(
      `${this.baseUrl}?${params.toString()}`,
      config?.signal
    )
  }

  async getById(id: number, config?: RequestConfig): Promise<Intervencao> {
    return apiClient.get<Intervencao>(`${this.baseUrl}/${id}`, config?.signal)
  }

  async create(data: CriarIntervencaoDto, config?: RequestConfig): Promise<Intervencao> {
    return apiClient.post<Intervencao>(this.baseUrl, data, config?.signal)
  }

  async update(id: number, data: CriarIntervencaoDto, config?: RequestConfig): Promise<Intervencao> {
    return apiClient.put<Intervencao>(`${this.baseUrl}/${id}`, data, config?.signal)
  }

  async delete(id: number, config?: RequestConfig): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`${this.baseUrl}/${id}`, config?.signal)
  }

  async getAnexos(id: number, config?: RequestConfig): Promise<any[]> {
    return apiClient.get<any[]>(`${this.baseUrl}/${id}/anexos`, config?.signal)
  }

  async getPecas(id: number, config?: RequestConfig): Promise<any[]> {
    return apiClient.get<any[]>(`${this.baseUrl}/${id}/pecas`, config?.signal)
  }
}

export const ticketsAPI = new TicketsAPI()
export const intervencoesAPI = new IntervencoesAPI()
