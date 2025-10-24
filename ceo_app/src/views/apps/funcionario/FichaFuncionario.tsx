'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid2'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'

// API Imports
import { funcionariosAPI } from '@/libs/api/funcionarios'
import type { FuncionarioDetalhado } from '@/libs/api/funcionarios/types'

// Component Imports
import DadosPessoais from './tabs/DadosPessoais'
import Contatos from './tabs/Contatos'
import Enderecos from './tabs/Enderecos'
import Dependentes from './tabs/Dependentes'
import Empregos from './tabs/Empregos'
import Beneficios from './tabs/Beneficios'
import Documentos from './tabs/Documentos'

interface FichaFuncionarioProps {
  funcionarioId: number
}

const FichaFuncionario = ({ funcionarioId }: FichaFuncionarioProps) => {
  const [activeTab, setActiveTab] = useState('dados-pessoais')
  const [funcionario, setFuncionario] = useState<FuncionarioDetalhado | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFuncionario()
  }, [funcionarioId])

  const fetchFuncionario = async () => {
    try {
      setLoading(true)
      const data = await funcionariosAPI.getById(funcionarioId)
      setFuncionario(data)
    } catch (error) {
      console.error('Erro ao carregar funcionário:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center p-10'>
          <CircularProgress />
          <Typography className='mli-4'>A carregar ficha de funcionário...</Typography>
        </CardContent>
      </Card>
    )
  }

  if (!funcionario) {
    return (
      <Card>
        <CardContent>
          <Typography>Funcionário não encontrado</Typography>
        </CardContent>
      </Card>
    )
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
  }

  return (
    <Grid container spacing={6}>
      {/* Header Card */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <div className='flex items-center gap-4'>
              <Avatar
                sx={{ width: 80, height: 80, fontSize: '2rem' }}
              >
                {funcionario.nome.charAt(0).toUpperCase()}
              </Avatar>
              <div className='flex-grow'>
                <Typography variant='h4'>{funcionario.nome}</Typography>
                <div className='flex items-center gap-2 mt-2'>
                  <Chip
                    label={funcionario.ativo ? 'Ativo' : 'Inativo'}
                    color={funcionario.ativo ? 'success' : 'error'}
                    size='small'
                  />
                  {funcionario.email && (
                    <Typography variant='body2' color='text.secondary'>
                      {funcionario.email}
                    </Typography>
                  )}
                  {funcionario.telefone && (
                    <Typography variant='body2' color='text.secondary'>
                      • {funcionario.telefone}
                    </Typography>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Grid>

      {/* Tabs Card */}
      <Grid size={{ xs: 12 }}>
        <TabContext value={activeTab}>
          <Card>
            <TabList onChange={handleTabChange} aria-label='Ficha de Funcionário'>
              <Tab value='dados-pessoais' label='Dados Pessoais' icon={<i className='tabler-user' />} iconPosition='start' />
              <Tab value='contatos' label='Contatos' icon={<i className='tabler-phone' />} iconPosition='start' />
              <Tab value='enderecos' label='Endereços' icon={<i className='tabler-map-pin' />} iconPosition='start' />
              <Tab value='dependentes' label='Dependentes' icon={<i className='tabler-users' />} iconPosition='start' />
              <Tab value='empregos' label='Empregos' icon={<i className='tabler-briefcase' />} iconPosition='start' />
              <Tab value='beneficios' label='Benefícios' icon={<i className='tabler-gift' />} iconPosition='start' />
              <Tab value='documentos' label='Documentos' icon={<i className='tabler-file' />} iconPosition='start' />
            </TabList>
            <Divider />
            <TabPanel value='dados-pessoais'>
              <DadosPessoais funcionario={funcionario} onUpdate={fetchFuncionario} />
            </TabPanel>
            <TabPanel value='contatos'>
              <Contatos funcionarioId={funcionario.id} contatos={funcionario.contatos || []} onUpdate={fetchFuncionario} />
            </TabPanel>
            <TabPanel value='enderecos'>
              <Enderecos funcionarioId={funcionario.id} enderecos={funcionario.enderecos || []} onUpdate={fetchFuncionario} />
            </TabPanel>
            <TabPanel value='dependentes'>
              <Dependentes funcionarioId={funcionario.id} dependentes={funcionario.dependentes || []} onUpdate={fetchFuncionario} />
            </TabPanel>
            <TabPanel value='empregos'>
              <Empregos funcionarioId={funcionario.id} empregos={funcionario.empregos || []} onUpdate={fetchFuncionario} />
            </TabPanel>
            <TabPanel value='beneficios'>
              <Beneficios funcionarioId={funcionario.id} beneficios={funcionario.beneficios || []} onUpdate={fetchFuncionario} />
            </TabPanel>
            <TabPanel value='documentos'>
              <Documentos funcionarioId={funcionario.id} documentos={funcionario.documentos || []} onUpdate={fetchFuncionario} />
            </TabPanel>
          </Card>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default FichaFuncionario
