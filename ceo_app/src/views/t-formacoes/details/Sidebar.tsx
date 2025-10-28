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
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import type { AccordionProps } from '@mui/material/Accordion'
import type { AccordionSummaryProps } from '@mui/material/AccordionSummary'
import type { AccordionDetailsProps } from '@mui/material/AccordionDetails'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'
import { formacoesAPI } from '@/libs/api/formacoes'
import type { Modulo, Aula, Quiz } from '@/libs/api/formacoes'

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

  const handleCheckboxChange = async (e: ChangeEvent<HTMLInputElement>, aulaId: number, moduloIndex: number, aulaIndex: number) => {
    const concluida = e.target.checked

    try {
      await formacoesAPI.marcarAulaConcluida(aulaId, concluida)

      // Atualizar estado local
      setModulos(prev => prev.map((mod, modIdx) => {
        if (modIdx === moduloIndex) {
          return {
            ...mod,
            aulas: mod.aulas.map((aula, aulaIdx) => {
              if (aulaIdx === aulaIndex) {
                return { ...aula, concluida }
              }
              return aula
            })
          }
        }
        return mod
      }))
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error)
    }
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
        const totalDuracao = modulo.aulas.reduce((sum, aula) => sum + (aula.duracao || 0), 0)
        const aulasconcluidas = modulo.aulas.filter(a => a.concluida).length

        return (
          <Accordion key={modulo.id} expanded={expanded === moduloIndex} onChange={handleChange(moduloIndex)}>
            <AccordionSummary
              expandIcon={<i className='tabler-chevron-right text-textSecondary' />}
            >
              <div className='is-full'>
                <Typography variant='h5'>{modulo.titulo}</Typography>
                <div className='flex items-center justify-between gap-4'>
                  <Typography className='!font-normal !text-textSecondary'>
                    {totalDuracao} min
                  </Typography>
                  <Typography className='!font-normal !text-textSecondary'>
                    {aulasconcluidas}/{modulo.aulas.length}
                  </Typography>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              {modulo.aulas.length > 0 ? (
                <List role='list' component='div' className='flex flex-col gap-4 plb-0'>
                  {modulo.aulas.map((aula, aulaIndex) => (
                    <ListItem key={aula.id} role='listitem' className='gap-3 p-0'>
                      <Checkbox
                        checked={aula.concluida}
                        onChange={(e) => handleCheckboxChange(e, aula.id, moduloIndex, aulaIndex)}
                        tabIndex={-1}
                      />
                      <div className='flex-1'>
                        <Typography className='font-medium !text-textPrimary'>
                          {aulaIndex + 1}. {aula.titulo}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {aula.duracao ? `${aula.duracao} min` : 'Duração não definida'}
                        </Typography>
                      </div>
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
