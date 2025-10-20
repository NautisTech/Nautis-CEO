import { apiClient, type RequestConfig } from '../client'

export interface UploadResponse {
    id: number
    nome: string
    nome_original: string
    url: string
    tipo: string
    tamanho_bytes: number
}

class UploadsAPI {
    private baseUrl = '/uploads'

    async uploadSingle(file: File, config?: RequestConfig): Promise<UploadResponse> {
        const formData = new FormData()
        formData.append('file', file)

        return apiClient.post<UploadResponse>(`${this.baseUrl}/single`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            successMessage: 'Arquivo enviado com sucesso!',
            ...config,
        })
    }

    async uploadMultiple(files: File[], config?: RequestConfig): Promise<UploadResponse[]> {
        const formData = new FormData()
        files.forEach(file => {
            formData.append('files', file)
        })

        return apiClient.post<UploadResponse[]>(`${this.baseUrl}/multiple`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            successMessage: `${files.length} arquivo(s) enviado(s) com sucesso!`,
            ...config,
        })
    }

    async delete(id: number, config?: RequestConfig): Promise<{ success: boolean }> {
        return apiClient.delete<{ success: boolean }>(`${this.baseUrl}/${id}`, {
            successMessage: 'Arquivo removido com sucesso!',
            ...config,
        })
    }
}

export const uploadsAPI = new UploadsAPI()