import { apiClient } from '../client'
import type {
  IntervencaoCusto,
  CriarIntervencaoCustoDto,
  AtualizarIntervencaoCustoDto,
  TotalCustosIntervencao
} from './types'

export const intervencoesCustosAPI = {
  // Listar custos
  list: async (intervencaoId?: number): Promise<IntervencaoCusto[]> => {
    const params = intervencaoId ? { intervencao_id: intervencaoId } : undefined
    const response = await apiClient.get('/intervencoes-custos', { params })
    return response.data
  },

  // Obter custo por ID
  getById: async (id: number): Promise<IntervencaoCusto> => {
    const response = await apiClient.get(`/intervencoes-custos/${id}`)
    return response.data
  },

  // Criar custo
  create: async (dto: CriarIntervencaoCustoDto): Promise<IntervencaoCusto> => {
    const response = await apiClient.post('/intervencoes-custos', dto)
    return response.data
  },

  // Atualizar custo
  update: async (id: number, dto: AtualizarIntervencaoCustoDto): Promise<IntervencaoCusto> => {
    const response = await apiClient.put(`/intervencoes-custos/${id}`, dto)
    return response.data
  },

  // Remover custo
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/intervencoes-custos/${id}`)
  },

  // Obter total de uma intervenção
  getTotal: async (intervencaoId: number): Promise<TotalCustosIntervencao> => {
    const response = await apiClient.get(`/intervencoes-custos/intervencao/${intervencaoId}/total`)
    return response.data
  }
}
