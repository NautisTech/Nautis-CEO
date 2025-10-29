'use client'

import { useState, useEffect } from 'react'
import type { SyntheticEvent, ChangeEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { styled } from '@mui/material/styles'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ListItem from '@mui/material/ListItem'
import List from '@mui/material/List'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import type { AccordionProps } from '@mui/material/Accordion'
import type { AccordionSummaryProps } from '@mui/material/AccordionSummary'
import type { AccordionDetailsProps } from '@mui/material/AccordionDetails'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'
import { formacoesAPI } from '@/libs/api/formacoes'
import type { Modulo, Aula, Quiz, Bloco, BlocoAnexo } from '@/libs/api/formacoes'

// Styled component for Accordion component
export const Accordion = styled(MuiAccordion)<AccordionProps>({
  margin: '0 !important',
  boxShadow: 'none !important',
  border: '1px solid var(--mui-palette-divider) !important',
  borderRadius: '0 !important',
  overflow: 'hidden',
  background: 'none',
  '&:not(:last-of-type)': {
    borderBottom: '0 !important'
  },
  '&:before': {
    display: 'none'
  },
  '&:first-of-type': {
    borderTopLeftRadius: 'var(--mui-shape-borderRadius) !important',
    borderTopRightRadius: 'var(--mui-shape-borderRadius) !important'
  },
  '&:last-of-type': {
    borderBottomLeftRadius: 'var(--mui-shape-borderRadius) !important',
    borderBottomRightRadius: 'var(--mui-shape-borderRadius) !important'
  }
})

// Styled component for AccordionSummary component
export const AccordionSummary = styled(MuiAccordionSummary)<AccordionSummaryProps>(({ theme }) => ({
  padding: theme.spacing(3, 6),
  transition: 'none',
  backgroundColor: 'var(--mui-palette-action-hover)',
  borderBlockEnd: '0 !important',
  '&.Mui-expanded': {
    borderBlockEnd: '1px solid var(--mui-palette-divider) !important'
  }
}))

// Styled component for AccordionDetails component
export const AccordionDetails = styled(MuiAccordionDetails)<AccordionDetailsProps>(({ theme }) => ({
  padding: `${theme.spacing(4, 3)} !important`,
  backgroundColor: 'var(--mui-palette-background-paper)'
}))

interface AulaWithProgresso extends Aula {
  concluida: boolean
}

interface ModuloWithAulas extends Modulo {
  aulas: AulaWithProgresso[]
}

const FormacaoSidebar = ({ formacaoId }: { formacaoId: number }) => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const [expanded, setExpanded] = useState<number | false>(0)
  const [modulos, setModulos] = useState<ModuloWithAulas[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [moduloDetalhesAberto, setModuloDetalhesAberto] = useState<number | null>(null)

  useEffect(() => {
    loadData()
  }, [formacaoId])

  const loadData = async () => {
    try {
      setLoading(true)

      // Carregar módulos, aulas e progresso
      const [modulosData, progressoData, quizzesData] = await Promise.all([
        formacoesAPI.listarModulos(formacaoId),
        formacoesAPI.obterProgressoFormacao(formacaoId),
        formacoesAPI.listarQuizzes(formacaoId)
      ])

      // Mapear progresso para cada aula
      const progressoMap = new Map(progressoData.map(p => [p.aula_id, p.concluida]))

      // Carregar aulas para cada módulo com progresso
      const modulosComAulas = await Promise.all(
        modulosData.map(async (modulo) => {
          const aulas = await formacoesAPI.listarAulas(modulo.id)
          const aulasComProgresso = aulas.map(aula => ({
            ...aula,
            concluida: progressoMap.get(aula.id) || false
          }))
          return { ...modulo, aulas: aulasComProgresso }
        })
      )

      setModulos(modulosComAulas)
      setQuizzes(quizzesData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (panel: number) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handleAulaClick = (aulaId: number) => {
    router.push(getLocalizedUrl(`/t-formacoes/${formacaoId}/aula/${aulaId}`, locale as Locale))
  }

  const handleModuloDetalhesClick = (e: React.MouseEvent, moduloId: number) => {
    e.stopPropagation()
    setModuloDetalhesAberto(moduloDetalhesAberto === moduloId ? null : moduloId)
  }

  const handleQuizClick = (quizId: number) => {
    router.push(getLocalizedUrl(`/t-formacoes/${formacaoId}/quiz/${quizId}`, locale as Locale))
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center p-10 border rounded'>
        <CircularProgress />
      </div>
    )
  }

  const totalAulas = modulos.reduce((sum, mod) => sum + mod.aulas.length, 0)
  const aulasConcluidas = modulos.reduce((sum, mod) => sum + mod.aulas.filter(a => a.concluida).length, 0)

  return (
    <>
      {modulos.map((modulo, moduloIndex) => {
        const totalDuracao = modulo.aulas.reduce((sum, aula) => sum + (aula.duracao_minutos || 0), 0)
        const aulasconcluidas = modulo.aulas.filter(a => a.concluida).length

        return (
          <Accordion key={modulo.id} expanded={expanded === moduloIndex} onChange={handleChange(moduloIndex)}>
            <AccordionSummary
              expandIcon={<i className='tabler-chevron-right text-textSecondary' />}
            >
              <div className='is-full flex items-center justify-between gap-2'>
                <div className='flex-1'>
                  <Typography variant='h5'>{modulo.titulo}</Typography>
                  <Typography className='!font-normal !text-textSecondary'>
                    {aulasconcluidas}/{modulo.aulas.length} • {totalDuracao} min
                  </Typography>
                </div>
                <IconButton
                  size='small'
                  onClick={(e) => handleModuloDetalhesClick(e, modulo.id)}
                  className='text-textSecondary hover:text-primary'
                >
                  <i className='tabler-eye' />
                </IconButton>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              {moduloDetalhesAberto === modulo.id && (
                <div className='border rounded p-4 mbe-4 bg-actionHover'>
                  <Typography variant='h6' className='mbe-2'>Detalhes do Módulo</Typography>
                  {modulo.descricao && (
                    <Typography variant='body2' color='text.secondary' className='mbe-3'>
                      {modulo.descricao}
                    </Typography>
                  )}
                  <List className='flex flex-col gap-2 plb-0'>
                    {modulo.categoria && (
                      <ListItem className='flex items-center gap-2 p-0'>
                        <i className='tabler-folder text-xl text-textSecondary' />
                        <Typography variant='body2'>Categoria: {modulo.categoria}</Typography>
                      </ListItem>
                    )}
                    {modulo.nivel && (
                      <ListItem className='flex items-center gap-2 p-0'>
                        <i className='tabler-chart-bar text-xl text-textSecondary' />
                        <Typography variant='body2'>Nível: {modulo.nivel}</Typography>
                      </ListItem>
                    )}
                    <ListItem className='flex items-center gap-2 p-0'>
                      <i className='tabler-clock text-xl text-textSecondary' />
                      <Typography variant='body2'>Duração total: {modulo.duracao_total || totalDuracao} min</Typography>
                    </ListItem>
                    <ListItem className='flex items-center gap-2 p-0'>
                      <i className='tabler-book text-xl text-textSecondary' />
                      <Typography variant='body2'>Aulas: {modulo.aulas.length}</Typography>
                    </ListItem>
                  </List>
                </div>
              )}
              {modulo.aulas.length > 0 ? (
                <List role='list' component='div' className='flex flex-col gap-4 plb-0'>
                  {modulo.aulas.map((aula, aulaIndex) => (
                    <ListItem
                      key={aula.id}
                      role='listitem'
                      className='gap-3 p-0 cursor-pointer rounded transition-colors'
                      onClick={() => handleAulaClick(aula.id)}
                    >
                      {aula.concluida && (
                        <i className='tabler-circle-check text-success text-xl' />
                      )}
                      <div className='flex-1 py-2'>
                        <Typography className='font-medium !text-textPrimary'>
                          {aulaIndex + 1}. {aula.titulo}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {aula.duracao_minutos ? `${aula.duracao_minutos} min` : 'Duração não definida'}
                        </Typography>
                      </div>
                      <i className='tabler-chevron-right text-textSecondary' />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant='body2' color='text.secondary' className='text-center'>
                  Nenhuma aula neste módulo
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        )
      })}

      {quizzes.length > 0 && (
        <>
          <Divider className='mbs-4 mbe-4' />
          <div className='border rounded p-4'>
            <div className='flex items-center gap-2 mbe-4'>
              <i className='tabler-file-check text-2xl text-primary' />
              <Typography variant='h5'>Quizzes</Typography>
            </div>
            <List className='flex flex-col gap-3 plb-0'>
              {quizzes.map((quiz) => (
                <ListItem key={quiz.id} className='p-0'>
                  <Button
                    fullWidth
                    variant='tonal'
                    startIcon={<i className='tabler-trophy' />}
                    onClick={() => handleQuizClick(quiz.id)}
                    className='justify-start'
                  >
                    <div className='flex flex-col items-start flex-1'>
                      <Typography className='font-medium'>{quiz.titulo}</Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {quiz.total_perguntas || 0} {quiz.total_perguntas === 1 ? 'pergunta' : 'perguntas'}
                      </Typography>
                    </div>
                  </Button>
                </ListItem>
              ))}
            </List>
          </div>
        </>
      )}
    </>
  )
}

export default FormacaoSidebar
