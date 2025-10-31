import { apiClient } from '../client'
import type {
  PortalDashboardStats,
  PortalTicket,
  CriarTicketPortalDto,
  AtualizarTicketPortalDto,
  PortalAnexo,
  NoticiaPortal,
  ContaCorrente,
  Transacao,
  TransacoesResponse,
  FiltrarTransacoesDto
} from './types'

export const portalAPI = {
  // Dashboard
  getDashboard: async (): Promise<PortalDashboardStats> => {
    return await apiClient.get('/portal/dashboard')
  },

  // Tickets
  listarTickets: async (filtros?: {
    status?: string
    prioridade?: string
    search?: string
  }): Promise<PortalTicket[]> => {
    return await apiClient.get('/portal/tickets', { params: filtros })
  },

  obterTicket: async (id: number): Promise<PortalTicket> => {
    return await apiClient.get(`/portal/tickets/${id}`)
  },

  criarTicket: async (dto: CriarTicketPortalDto): Promise<PortalTicket> => {
    return await apiClient.post('/portal/tickets', dto)
  },

  atualizarTicket: async (id: number, dto: AtualizarTicketPortalDto): Promise<PortalTicket> => {
    return await apiClient.put(`/portal/tickets/${id}`, dto)
  },

  // Anexos
  listarAnexos: async (filtros?: {
    entidade_tipo?: string
    entidade_id?: number
  }): Promise<PortalAnexo[]> => {
    return await apiClient.get('/portal/anexos', { params: filtros })
  },

  downloadAnexo: async (id: number): Promise<Blob> => {
    return await apiClient.get(`/portal/anexos/${id}/download`, {
      responseType: 'blob'
    })
  },

  // Intervenções
  listarIntervencoesTicket: async (ticketId: number): Promise<any[]> => {
    return await apiClient.get(`/portal/tickets/${ticketId}/intervencoes`)
  },

  aprovarIntervencao: async (intervencaoId: number): Promise<{ message: string }> => {
    return await apiClient.put(`/portal/intervencoes/${intervencaoId}/aprovar`)
  },

  rejeitarIntervencao: async (intervencaoId: number): Promise<{ message: string }> => {
    return await apiClient.put(`/portal/intervencoes/${intervencaoId}/rejeitar`)
  },

  // Notícias
  listarNoticias: async (limit?: number): Promise<NoticiaPortal[]> => {
    return await apiClient.get('/portal/noticias', { params: { limit } })
  },

  // Transações e Conta Corrente
  obterContaCorrente: async (): Promise<ContaCorrente> => {
    return await apiClient.get('/portal/conta-corrente')
  },

  listarTransacoes: async (filtros?: FiltrarTransacoesDto): Promise<TransacoesResponse> => {
    return await apiClient.get('/portal/transacoes', { params: filtros })
  },

  obterTransacao: async (id: number): Promise<Transacao> => {
    return await apiClient.get(`/portal/transacoes/${id}`)
  },

  // Ticket por código (público)
  obterPorCodigo: async (codigo: string, tenant: string): Promise<PortalTicket> => {
    return await apiClient.get(`/portal/codigo/${codigo}?tenant=${tenant}`)
  }
}
