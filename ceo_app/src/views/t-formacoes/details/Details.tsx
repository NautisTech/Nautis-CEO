'use client'

import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import CustomAvatar from '@core/components/mui/Avatar'
import { formacoesAPI } from '@/libs/api/formacoes'
import type { Formacao } from '@/libs/api/formacoes'

const FormacaoDetails = ({ formacaoId }: { formacaoId: number }) => {
  const [formacao, setFormacao] = useState<Formacao | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFormacao()
  }, [formacaoId])

  const loadFormacao = async () => {
    try {
      setLoading(true)
      const data = await formacoesAPI.obter(formacaoId)
      setFormacao(data)
    } catch (error) {
      console.error('Erro ao carregar formação:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className='flex items-center justify-center p-10'>
        <CircularProgress />
      </Card>
    )
  }

  if (!formacao) {
    return (
      <Card>
        <CardContent>
          <Typography>Formação não encontrada</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <Typography variant='h5'>{formacao.titulo}</Typography>
          <Typography>
            Autor: <span className='font-medium text-textPrimary'>{formacao.autor_nome}</span>
          </Typography>
        </div>
        <div className='flex items-center gap-4'>
          <Chip label={formacao.categoria} variant='tonal' size='small' color='primary' />
          <Chip label={formacao.nivel} variant='tonal' size='small' color='secondary' />
        </div>
      </CardContent>
      <CardContent>
        <div className='border rounded'>
          {formacao.capa_url && (
            <div className='mli-2 mbs-2 overflow-hidden rounded'>
              <img
                src={formacao.capa_url}
                alt={formacao.titulo}
                className='is-full bs-auto object-cover max-bs-[440px]'
              />
            </div>
          )}
          <div className='flex flex-col gap-6 p-5'>
            <div className='flex flex-col gap-4'>
              <Typography variant='h5'>Sobre esta formação</Typography>
              <Typography>{formacao.descricao}</Typography>
            </div>
            <Divider />
            <div className='flex flex-col gap-4'>
              <Typography variant='h5'>Informações</Typography>
              <div className='flex flex-wrap gap-x-12 gap-y-2'>
                <List role='list' component='div' className='flex flex-col gap-2 plb-0'>
                  <ListItem role='listitem' className='flex items-center gap-2 p-0'>
                    <i className='tabler-chart-bar text-xl text-textSecondary' />
                    <Typography>Nível: {formacao.nivel}</Typography>
                  </ListItem>
                  <ListItem role='listitem' className='flex items-center gap-2 p-0'>
                    <i className='tabler-users text-xl text-textSecondary' />
                    <Typography>Alunos: {formacao.total_alunos || 0}</Typography>
                  </ListItem>
                  <ListItem role='listitem' className='flex items-center gap-2 p-0'>
                    <i className='tabler-folder text-xl text-textSecondary' />
                    <Typography>Categoria: {formacao.categoria}</Typography>
                  </ListItem>
                </List>
                <List role='list' component='div' className='flex flex-col gap-2 plb-0'>
                  <ListItem role='listitem' className='flex items-center gap-2 p-0'>
                    <i className='tabler-books text-xl text-textSecondary' />
                    <Typography>Módulos: {formacao.total_modulos || 0}</Typography>
                  </ListItem>
                  <ListItem role='listitem' className='flex items-center gap-2 p-0'>
                    <i className='tabler-clock text-xl text-textSecondary' />
                    <Typography>Duração: {formacao.duracao_minutos} minutos</Typography>
                  </ListItem>
                  <ListItem role='listitem' className='flex items-center gap-2 p-0'>
                    <i className='tabler-calendar text-xl text-textSecondary' />
                    <Typography>
                      Criada em: {new Date(formacao.criado_em).toLocaleDateString('pt-PT')}
                    </Typography>
                  </ListItem>
                </List>
              </div>
            </div>
            {formacao.progresso !== undefined && (
              <>
                <Divider />
                <div className='flex flex-col gap-4'>
                  <Typography variant='h5'>O Meu Progresso</Typography>
                  <List role='list' component='div' className='flex flex-col gap-2 plb-0'>
                    <ListItem role='listitem' className='flex items-center gap-2 p-0'>
                      <i className='tabler-progress text-xl text-textSecondary' />
                      <Typography>Progresso: {formacao.progresso}%</Typography>
                    </ListItem>
                    {formacao.horas_estudo && (
                      <ListItem role='listitem' className='flex items-center gap-2 p-0'>
                        <i className='tabler-clock-hour-4 text-xl text-textSecondary' />
                        <Typography>Horas de estudo: {formacao.horas_estudo}h</Typography>
                      </ListItem>
                    )}
                    {formacao.nota_final && (
                      <ListItem role='listitem' className='flex items-center gap-2 p-0'>
                        <i className='tabler-star text-xl text-textSecondary' />
                        <Typography>Nota final: {formacao.nota_final}%</Typography>
                      </ListItem>
                    )}
                    {formacao.data_inscricao && (
                      <ListItem role='listitem' className='flex items-center gap-2 p-0'>
                        <i className='tabler-calendar-check text-xl text-textSecondary' />
                        <Typography>
                          Inscrito em: {new Date(formacao.data_inscricao).toLocaleDateString('pt-PT')}
                        </Typography>
                      </ListItem>
                    )}
                    {formacao.data_conclusao && (
                      <ListItem role='listitem' className='flex items-center gap-2 p-0'>
                        <i className='tabler-trophy text-xl text-textSecondary' />
                        <Typography>
                          Concluído em: {new Date(formacao.data_conclusao).toLocaleDateString('pt-PT')}
                        </Typography>
                      </ListItem>
                    )}
                  </List>
                </div>
              </>
            )}
            <Divider />
            <div className='flex flex-col gap-4'>
              <Typography variant='h5'>Autor</Typography>
              <div className='flex items-center gap-4'>
                <CustomAvatar skin='light-static' color='primary' size={38}>
                  <i className='tabler-user' />
                </CustomAvatar>
                <div className='flex flex-col gap-1'>
                  <Typography className='font-medium' color='text.primary'>
                    {formacao.autor_nome}
                  </Typography>
                  <Typography variant='body2'>Instrutor</Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FormacaoDetails
