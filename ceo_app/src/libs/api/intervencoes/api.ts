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
    return await apiClient.get('/intervencoes', { params: filtros })
  },

  // Obter intervenção por ID
  getById: async (id: number): Promise<Intervencao> => {
    return await apiClient.get(`/intervencoes/${id}`)
  },

  // Criar intervenção
  create: async (dto: CriarIntervencaoDto): Promise<Intervencao> => {
    return await apiClient.post('/intervencoes', dto)
  },

  // Atualizar intervenção
  update: async (id: number, dto: AtualizarIntervencaoDto): Promise<Intervencao> => {
    return await apiClient.put(`/intervencoes/${id}`, dto)
  },

  // Remover intervenção
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/intervencoes/${id}`)
  },

  // Obter intervenções de um ticket
  getByTicket: async (ticketId: number): Promise<Intervencao[]> => {
    return await apiClient.get(`/intervencoes/ticket/${ticketId}`)
  },

  // Obter estatísticas
  getEstatisticas: async (filtros?: { data_inicio?: string; data_fim?: string }): Promise<IntervencoesEstatisticas> => {
    return await apiClient.get('/intervencoes/estatisticas', { params: filtros })
  }
}
