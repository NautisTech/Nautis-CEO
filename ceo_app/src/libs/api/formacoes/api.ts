import { apiClient } from '../client'
import type { Formacao, Modulo, Aula, Bloco, BlocoAnexo, Quiz, Pergunta } from './types'

export const formacoesAPI = {
  // Criar nova formação
  criar: async (data: Partial<Formacao>): Promise<Formacao> => {
    return await apiClient.post('/formacoes', data)
  },

  // Atualizar formação
  atualizar: async (id: number, data: Partial<Formacao>): Promise<Formacao> => {
    return await apiClient.put(`/formacoes/${id}`, data)
  },

  // Listar todas as formações
  listar: async (filtros?: { categoria?: string; nivel?: string }): Promise<Formacao[]> => {
    return await apiClient.get('/formacoes', { params: filtros })
  },

  // Listar formações disponíveis (funcionários: todas publicadas | clientes: apenas inscritas)
  disponiveis: async (): Promise<Formacao[]> => {
    return await apiClient.get('/formacoes/disponiveis')
  },

  // Listar minhas formações (inscritas)
  minhas: async (): Promise<Formacao[]> => {
    return await apiClient.get('/formacoes/minhas')
  },

  // Obter detalhes de uma formação
  obter: async (id: number): Promise<Formacao> => {
    return await apiClient.get(`/formacoes/${id}`)
  },

  // Inscrever-se numa formação
  inscrever: async (id: number): Promise<{ message: string }> => {
    return await apiClient.post(`/formacoes/${id}/inscrever`)
  },

  // Criar novo módulo
  criarModulo: async (data: Partial<Modulo>): Promise<Modulo> => {
    return await apiClient.post('/formacoes/modulos', data)
  },

  // Listar módulos de uma formação
  listarModulos: async (formacaoId: number): Promise<Modulo[]> => {
    return await apiClient.get(`/formacoes/${formacaoId}/modulos`)
  },

  // Atualizar módulo
  atualizarModulo: async (moduloId: number, data: Partial<Modulo>): Promise<Modulo> => {
    return await apiClient.put(`/formacoes/modulos/${moduloId}`, data)
  },

  // Apagar módulo
  apagarModulo: async (moduloId: number): Promise<void> => {
    return await apiClient.delete(`/formacoes/modulos/${moduloId}`)
  },

  // Criar nova aula
  criarAula: async (data: Partial<Aula>): Promise<Aula> => {
    return await apiClient.post('/formacoes/aulas', data)
  },

  // Listar aulas de um módulo
  listarAulas: async (moduloId: number): Promise<Aula[]> => {
    return await apiClient.get(`/formacoes/modulos/${moduloId}/aulas`)
  },

  // Apagar aula
  apagarAula: async (aulaId: number): Promise<void> => {
    return await apiClient.delete(`/formacoes/aulas/${aulaId}`)
  },

  // Criar novo bloco
  criarBloco: async (data: Partial<Bloco>): Promise<Bloco> => {
    return await apiClient.post('/formacoes/blocos', data)
  },

  // Listar blocos de uma aula
  listarBlocos: async (aulaId: number): Promise<Bloco[]> => {
    return await apiClient.get(`/formacoes/aulas/${aulaId}/blocos`)
  },

  // Adicionar anexo a um bloco
  adicionarAnexoBloco: async (blocoId: number, data: { upload_id: number; nome: string }): Promise<BlocoAnexo> => {
    return await apiClient.post(`/formacoes/blocos/${blocoId}/anexos`, data)
  },

  // Listar anexos de um bloco
  listarAnexosBloco: async (blocoId: number): Promise<BlocoAnexo[]> => {
    return await apiClient.get(`/formacoes/blocos/${blocoId}/anexos`)
  },

  // Remover anexo de um bloco
  removerAnexoBloco: async (blocoId: number, anexoId: number): Promise<void> => {
    return await apiClient.delete(`/formacoes/blocos/${blocoId}/anexos/${anexoId}`)
  },

  // Criar quiz
  criarQuiz: async (data: Partial<Quiz>): Promise<Quiz> => {
    return await apiClient.post('/formacoes/quiz', data)
  },

  // Listar quizzes de uma formação
  listarQuizzes: async (formacaoId: number): Promise<Quiz[]> => {
    return await apiClient.get(`/formacoes/${formacaoId}/quiz`)
  },

  // Obter quiz por ID
  obterQuiz: async (quizId: number): Promise<Quiz> => {
    return await apiClient.get(`/formacoes/quiz/${quizId}`)
  },

  // Atualizar quiz
  atualizarQuiz: async (quizId: number, data: Partial<Quiz>): Promise<Quiz> => {
    return await apiClient.put(`/formacoes/quiz/${quizId}`, data)
  },

  // Remover quiz
  removerQuiz: async (quizId: number): Promise<void> => {
    return await apiClient.delete(`/formacoes/quiz/${quizId}`)
  },

  // Criar pergunta
  criarPergunta: async (data: Partial<Pergunta>): Promise<Pergunta> => {
    return await apiClient.post('/formacoes/quiz/perguntas', data)
  },

  // Listar perguntas de um quiz
  listarPerguntas: async (quizId: number): Promise<Pergunta[]> => {
    return await apiClient.get(`/formacoes/quiz/${quizId}/perguntas`)
  },

  // Atualizar pergunta
  atualizarPergunta: async (perguntaId: number, data: Partial<Pergunta>): Promise<Pergunta> => {
    return await apiClient.put(`/formacoes/quiz/perguntas/${perguntaId}`, data)
  },

  // Remover pergunta
  removerPergunta: async (perguntaId: number): Promise<void> => {
    return await apiClient.delete(`/formacoes/quiz/perguntas/${perguntaId}`)
  },

  // Marcar aula como concluída/não concluída
  marcarAulaConcluida: async (aulaId: number, concluida: boolean): Promise<{ message: string }> => {
    return await apiClient.post(`/formacoes/aulas/${aulaId}/concluir`, { concluida })
  },

  // Obter progresso das aulas de uma formação
  obterProgressoFormacao: async (formacaoId: number): Promise<{ aula_id: number; modulo_id: number; concluida: boolean }[]> => {
    return await apiClient.get(`/formacoes/${formacaoId}/progresso`)
  },

  // Listar clientes associados a uma formação
  listarClientesFormacao: async (formacaoId: number): Promise<any[]> => {
    return await apiClient.get(`/formacoes/${formacaoId}/clientes`)
  },

  // Associar cliente a uma formação
  associarCliente: async (formacaoId: number, clienteId: number): Promise<{ message: string }> => {
    return await apiClient.post(`/formacoes/${formacaoId}/clientes/${clienteId}`)
  },

  // Desassociar cliente de uma formação
  desassociarCliente: async (formacaoId: number, clienteId: number): Promise<{ message: string }> => {
    return await apiClient.delete(`/formacoes/${formacaoId}/clientes/${clienteId}`)
  },

  // Listar todos os clientes disponíveis
  listarTodosClientes: async (): Promise<{ id: number; nome: string; email: string }[]> => {
    return await apiClient.get('/formacoes/clientes/todos')
  }
}
