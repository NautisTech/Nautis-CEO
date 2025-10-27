import { apiClient } from '../client'
import type {
  Intervencao,
  CriarIntervencaoDto,
  AtualizarIntervencaoDto,
  IntervencaoFiltros,
  IntervencoesEstatisticas
} from './types'

export const intervencoesAPI = {
  // Listar intervenções
  list: async (filtros?: IntervencaoFiltros): Promise<Intervencao[]> => {
    const response = await apiClient.get('/intervencoes', { params: filtros })
    return response.data
  },

  // Obter intervenção por ID
  getById: async (id: number): Promise<Intervencao> => {
    const response = await apiClient.get(`/intervencoes/${id}`)
    return response.data
  },

  // Criar intervenção
  create: async (dto: CriarIntervencaoDto): Promise<Intervencao> => {
    const response = await apiClient.post('/intervencoes', dto)
    return response.data
  },

  // Atualizar intervenção
  update: async (id: number, dto: AtualizarIntervencaoDto): Promise<Intervencao> => {
    const response = await apiClient.put(`/intervencoes/${id}`, dto)
    return response.data
  },

  // Remover intervenção
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/intervencoes/${id}`)
  },

  // Obter intervenções de um ticket
  getByTicket: async (ticketId: number): Promise<Intervencao[]> => {
    const response = await apiClient.get(`/intervencoes/ticket/${ticketId}`)
    return response.data
  },

  // Obter estatísticas
  getEstatisticas: async (filtros?: { data_inicio?: string; data_fim?: string }): Promise<IntervencoesEstatisticas> => {
    const response = await apiClient.get('/intervencoes/estatisticas', { params: filtros })
    return response.data
  }
}
