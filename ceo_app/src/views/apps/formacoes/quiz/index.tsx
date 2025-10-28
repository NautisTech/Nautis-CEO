'use client'

import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import type { Quiz, Pergunta } from '@/libs/api/formacoes'
import { formacoesAPI } from '@/libs/api/formacoes'
import CriarQuizDialog from './CriarQuizDialog'
import CriarPerguntaDialog from './CriarPerguntaDialog'

interface QuizProps {
  formacaoId: number
}

const QuizTab = ({ formacaoId }: QuizProps) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null)
  const [perguntas, setPerguntas] = useState<Pergunta[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingPerguntas, setLoadingPerguntas] = useState(false)
  const [quizDialogOpen, setQuizDialogOpen] = useState(false)
  const [perguntaDialogOpen, setPerguntaDialogOpen] = useState(false)

  const fetchQuizzes = async () => {
    try {
      setLoading(true)
      const data = await formacoesAPI.listarQuizzes(formacaoId)
      setQuizzes(data)

      if (data.length > 0 && !selectedQuiz) {
        setSelectedQuiz(data[0].id)
      }
    } catch (err) {
      console.error('Erro ao carregar quizzes:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchPerguntas = async (quizId: number) => {
    try {
      setLoadingPerguntas(true)
      const data = await formacoesAPI.listarPerguntas(quizId)
      setPerguntas(data)
    } catch (err) {
      console.error('Erro ao carregar perguntas:', err)
    } finally {
      setLoadingPerguntas(false)
    }
  }

  useEffect(() => {
    if (formacaoId > 0) {
      fetchQuizzes()
    }
  }, [formacaoId])

  useEffect(() => {
    if (selectedQuiz) {
      fetchPerguntas(selectedQuiz)
    } else {
      setPerguntas([])
    }
  }, [selectedQuiz])

  const handleQuizCreated = (novoQuiz: Quiz) => {
    setQuizzes(prev => [...prev, novoQuiz])
    setSelectedQuiz(novoQuiz.id)
  }

  const handlePerguntaCreated = (novaPergunta: Pergunta) => {
    setPerguntas(prev => [...prev, novaPergunta])
  }

  const handleDeletePergunta = async (perguntaId: number) => {
    if (!confirm('Tem certeza que deseja remover esta pergunta?')) return

    try {
      await formacoesAPI.removerPergunta(perguntaId)
      setPerguntas(prev => prev.filter(p => p.id !== perguntaId))
    } catch (err) {
      console.error('Erro ao remover pergunta:', err)
      alert('Erro ao remover pergunta')
    }
  }

  if (loading) {
    return (
      <Card className='flex items-center justify-center p-10'>
        <CircularProgress />
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardContent className='flex flex-col gap-6'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div>
              <Typography variant='h5'>Quiz da Formação</Typography>
              <Typography>Adicione perguntas de múltipla escolha ou abertas para avaliar os alunos</Typography>
            </div>
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => setQuizDialogOpen(true)}
            >
              Criar Novo Quiz
            </Button>
          </div>

          {quizzes.length > 0 ? (
            <>
              <TextField
                select
                label='Selecionar Quiz'
                value={selectedQuiz || ''}
                onChange={(e) => setSelectedQuiz(Number(e.target.value))}
                fullWidth
              >
                {quizzes.map((quiz) => (
                  <MenuItem key={quiz.id} value={quiz.id}>
                    {quiz.titulo} ({quiz.total_perguntas || 0} perguntas)
                  </MenuItem>
                ))}
              </TextField>

              {selectedQuiz && (
                <>
                  <div className='flex flex-wrap items-center justify-between gap-4'>
                    <Typography variant='h6'>
                      Perguntas ({perguntas.length})
                    </Typography>
                    <Button
                      variant='tonal'
                      startIcon={<i className='tabler-plus' />}
                      onClick={() => setPerguntaDialogOpen(true)}
                    >
                      Adicionar Pergunta
                    </Button>
                  </div>

                  {loadingPerguntas ? (
                    <div className='flex items-center justify-center p-10'>
                      <CircularProgress />
                    </div>
                  ) : perguntas.length > 0 ? (
                    <Grid container spacing={6}>
                      {perguntas.map((pergunta) => (
                        <Grid size={{ xs: 12, md: 6 }} key={pergunta.id}>
                          <div className='border rounded p-5 flex flex-col gap-4'>
                            <div className='flex items-start justify-between gap-4'>
                              <div className='flex-1'>
                                <div className='flex items-center gap-2 mb-2'>
                                  <Chip
                                    label={pergunta.tipo === 'multipla' ? 'Múltipla Escolha' : 'Aberta'}
                                    size='small'
                                    color={pergunta.tipo === 'multipla' ? 'primary' : 'secondary'}
                                    variant='tonal'
                                  />
                                  <Chip
                                    label={`${pergunta.pontuacao} ${pergunta.pontuacao === 1 ? 'ponto' : 'pontos'}`}
                                    size='small'
                                    variant='tonal'
                                    color='success'
                                  />
                                </div>
                                <Typography variant='body1' className='font-medium'>
                                  {pergunta.enunciado}
                                </Typography>
                              </div>
                              <div className='flex items-center gap-1'>
                                <IconButton size='small'>
                                  <i className='tabler-edit text-[22px] text-textSecondary' />
                                </IconButton>
                                <IconButton size='small' onClick={() => handleDeletePergunta(pergunta.id)}>
                                  <i className='tabler-trash text-[22px] text-textSecondary' />
                                </IconButton>
                              </div>
                            </div>

                            {pergunta.tipo === 'multipla' && pergunta.opcoes && pergunta.opcoes.length > 0 && (
                              <div className='flex flex-col gap-2 mt-2'>
                                {pergunta.opcoes.map((opcao, idx) => (
                                  <div
                                    key={opcao.id}
                                    className={`flex items-start gap-2 p-2 rounded ${
                                      opcao.correta ? 'bg-success-lightOpacity' : 'bg-actionHover'
                                    }`}
                                  >
                                    <Typography variant='body2' className='font-medium min-w-[24px]'>
                                      {String.fromCharCode(65 + idx)}.
                                    </Typography>
                                    <Typography variant='body2' className='flex-1'>
                                      {opcao.texto}
                                    </Typography>
                                    {opcao.correta && (
                                      <i className='tabler-check text-success' />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography className='text-center' color='text.secondary'>
                      Nenhuma pergunta criada ainda. Clique em "Adicionar Pergunta" para começar.
                    </Typography>
                  )}
                </>
              )}
            </>
          ) : (
            <Typography className='text-center' color='text.secondary'>
              Nenhum quiz criado ainda. Clique em "Criar Novo Quiz" para começar.
            </Typography>
          )}
        </CardContent>
      </Card>

      <CriarQuizDialog
        open={quizDialogOpen}
        onClose={() => setQuizDialogOpen(false)}
        formacaoId={formacaoId}
        onSuccess={handleQuizCreated}
      />

      {selectedQuiz && (
        <CriarPerguntaDialog
          open={perguntaDialogOpen}
          onClose={() => setPerguntaDialogOpen(false)}
          quizId={selectedQuiz}
          proximaOrdem={perguntas.length + 1}
          onSuccess={handlePerguntaCreated}
        />
      )}
    </>
  )
}

export default QuizTab
