'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'

// Third-party Imports
import classnames from 'classnames'

// API Imports
import { configuracoesAPI } from '@/libs/api/configuracoes/api'
import type { Configuracao } from '@/libs/api/configuracoes/types'

// Component Imports
import EditConfiguracaoDialog from './EditConfiguracaoDialog'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const ConfiguracoesTable = () => {
  // States
  const [configuracoes, setConfiguracoes] = useState<Configuracao[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedConfiguracao, setSelectedConfiguracao] = useState<Configuracao | null>(null)

  // Fetch configuracoes
  const fetchConfiguracoes = async () => {
    try {
      setLoading(true)
      const data = await configuracoesAPI.list()
      setConfiguracoes(data)
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfiguracoes()
  }, [])

  const handleEdit = (configuracao: Configuracao) => {
    setSelectedConfiguracao(configuracao)
    setEditDialogOpen(true)
  }

  const handleConfiguracaoUpdated = () => {
    setEditDialogOpen(false)
    setSelectedConfiguracao(null)
    fetchConfiguracoes()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatValor = (valor: string | null) => {
    if (!valor) return null

    // Check if it's JSON
    try {
      if (valor.trim().startsWith('{')) {
        const parsed = JSON.parse(valor)
        const keys = Object.keys(parsed)
        return `JSON (${keys.length} campo${keys.length !== 1 ? 's' : ''})`
      }
    } catch {
      // Not JSON, return as is
    }

    return valor
  }

  return (
    <>
      <Card>
        <CardHeader
          title='Configurações do Sistema'
          subheader='Gerir configurações globais da aplicação'
        />
        <Divider />

        {loading ? (
          <Box display='flex' justifyContent='center' alignItems='center' minHeight={400}>
            <CircularProgress />
            <Typography className='mli-4'>A carregar configurações...</Typography>
          </Box>
        ) : (
          <div className='overflow-x-auto'>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Última Atualização</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {configuracoes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className='text-center'>
                      <Typography>Nenhuma configuração encontrada</Typography>
                    </td>
                  </tr>
                ) : (
                  configuracoes.map((config) => (
                    <tr key={config.id} className={classnames()}>
                      <td>
                        <Typography color='text.primary' className='font-medium'>
                          {config.codigo}
                        </Typography>
                      </td>
                      <td>
                        <Typography variant='body2' color='text.secondary'>
                          {config.descricao || '-'}
                        </Typography>
                      </td>
                      <td>
                        {config.valor ? (
                          formatValor(config.valor)?.startsWith('JSON') ? (
                            <Chip
                              label={formatValor(config.valor)}
                              size='small'
                              variant='tonal'
                              color='info'
                              title={config.valor}
                            />
                          ) : (
                            <Typography
                              variant='body2'
                              className='max-w-[300px] truncate'
                              title={config.valor}
                            >
                              {formatValor(config.valor)}
                            </Typography>
                          )
                        ) : (
                          <Chip
                            label='Sem valor'
                            size='small'
                            variant='tonal'
                            color='warning'
                          />
                        )}
                      </td>
                      <td>
                        <Typography variant='body2' color='text.secondary'>
                          {formatDate(config.atualizado_em)}
                        </Typography>
                      </td>
                      <td>
                        <div className='flex items-center gap-0.5'>
                          <Tooltip title='Editar'>
                            <IconButton
                              size='small'
                              onClick={() => handleEdit(config)}
                            >
                              <i className='tabler-edit text-[22px] text-textSecondary' />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Edit Dialog */}
      <EditConfiguracaoDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false)
          setSelectedConfiguracao(null)
        }}
        configuracao={selectedConfiguracao}
        onSuccess={handleConfiguracaoUpdated}
      />
    </>
  )
}

export default ConfiguracoesTable
