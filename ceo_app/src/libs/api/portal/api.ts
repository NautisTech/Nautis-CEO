import { apiClient } from '../client'
import type {
  PortalDashboardStats,
  PortalTicket,
  CriarTicketPortalDto,
  AtualizarTicketPortalDto,
  PortalAnexo
} from './types'

export const portalAPI = {
  // Dashboard
  getDashboard: async (): Promise<PortalDashboardStats> => {
    const response = await apiClient.get('/portal/dashboard')
    return response.data
  },

  // Tickets
  listarTickets: async (filtros?: {
    status?: string
    prioridade?: string
    search?: string
  }): Promise<PortalTicket[]> => {
    const response = await apiClient.get('/portal/tickets', { params: filtros })
    return response.data
  },

  obterTicket: async (id: number): Promise<PortalTicket> => {
    const response = await apiClient.get(`/portal/tickets/${id}`)
    return response.data
  },

  criarTicket: async (dto: CriarTicketPortalDto): Promise<PortalTicket> => {
    const response = await apiClient.post('/portal/tickets', dto)
    return response.data
  },

  atualizarTicket: async (id: number, dto: AtualizarTicketPortalDto): Promise<PortalTicket> => {
    const response = await apiClient.put(`/portal/tickets/${id}`, dto)
    return response.data
  },

  // Anexos
  listarAnexos: async (filtros?: {
    entidade_tipo?: string
    entidade_id?: number
  }): Promise<PortalAnexo[]> => {
    const response = await apiClient.get('/portal/anexos', { params: filtros })
    return response.data
  },

  downloadAnexo: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`/portal/anexos/${id}/download`, {
      responseType: 'blob'
    })
    return response.data
  }
}
