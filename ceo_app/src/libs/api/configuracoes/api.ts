import { apiClient, type RequestConfig } from '../client'
import type { Configuracao, AtualizarConfiguracaoDto } from './types'

class ConfiguracoesAPI {
  private baseUrl = '/configuracoes'

  /**
   * Listar todas as configurações
   */
  async list(config?: RequestConfig): Promise<Configuracao[]> {
    return apiClient.get<Configuracao[]>(this.baseUrl, {
      showErrorToast: false,
      ...config,
    })
  }

  /**
   * Obter configuração por código
   */
  async getById(codigo: string, config?: RequestConfig): Promise<Configuracao> {
    return apiClient.get<Configuracao>(`${this.baseUrl}/${codigo}`, {
      showErrorToast: false,
      ...config,
    })
  }

  /**
   * Atualizar configuração
   */
  async update(
    codigo: string,
    data: AtualizarConfiguracaoDto,
    config?: RequestConfig
  ): Promise<{ message: string }> {
    return apiClient.put<{ message: string }>(`${this.baseUrl}/${codigo}`, data, {
      successMessage: 'Configuração atualizada com sucesso!',
      ...config,
    })
  }
}

export const configuracoesAPI = new ConfiguracoesAPI()
