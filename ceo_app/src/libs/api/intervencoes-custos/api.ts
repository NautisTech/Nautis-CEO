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
    return await apiClient.get('/intervencoes-custos', { params })
  },

  // Obter custo por ID
  getById: async (id: number): Promise<IntervencaoCusto> => {
    return await apiClient.get(`/intervencoes-custos/${id}`)
  },

  // Criar custo
  create: async (dto: CriarIntervencaoCustoDto): Promise<IntervencaoCusto> => {
    return await apiClient.post('/intervencoes-custos', dto)
  },

  // Atualizar custo
  update: async (id: number, dto: AtualizarIntervencaoCustoDto): Promise<IntervencaoCusto> => {
    return await apiClient.put(`/intervencoes-custos/${id}`, dto)
  },

  // Remover custo
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/intervencoes-custos/${id}`)
  },

  // Obter total de uma intervenção
  getTotal: async (intervencaoId: number): Promise<TotalCustosIntervencao> => {
    return await apiClient.get(`/intervencoes-custos/intervencao/${intervencaoId}/total`)
  }
}
