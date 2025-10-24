import { apiClient, type RequestConfig } from '../client'

export interface ImageVariants {
  original: string
  large: string
  medium: string
  small: string
  thumbnail: string
}

export interface UploadResponse {
  id: number
  nome: string
  nome_original: string
  url: string
  tipo: string
  tamanho_bytes: number
  variants?: ImageVariants | null
}

class UploadsAPI {
  private baseUrl = '/uploads'

  async uploadSingle(file: File, config?: RequestConfig): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    return apiClient.post<UploadResponse>(`${this.baseUrl}/single`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      successMessage: 'Ficheiro enviado com sucesso!',
      ...config
    })
  }

  async uploadMultiple(files: File[], config?: RequestConfig): Promise<UploadResponse[]> {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    return apiClient.post<UploadResponse[]>(`${this.baseUrl}/multiple`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      successMessage: `${files.length} ficheiro(s) enviado(s) com sucesso!`,
      ...config
    })
  }

  async delete(id: number, config?: RequestConfig): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`${this.baseUrl}/${id}`, {
      successMessage: 'Ficheiro removido com sucesso!',
      ...config
    })
  }

  async registerExternalFile(data: { url: string; tipo: string }, config?: RequestConfig): Promise<UploadResponse> {
    return apiClient.post<UploadResponse>(`${this.baseUrl}/external`, data, {
      successMessage: 'Ficheiro externo registrado com sucesso!',
      ...config
    })
  }
}

export const uploadsAPI = new UploadsAPI()
