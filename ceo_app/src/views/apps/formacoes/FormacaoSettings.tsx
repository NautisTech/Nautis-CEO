'use client'

// React Imports
import { useState, useEffect } from 'react'
import type { SyntheticEvent, ReactElement } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'

const FormacaoSettings = ({
  tabContentList,
  formacaoId,
  selectedModuloForAulas,
  onGerirAulas
}: {
  tabContentList: { [key: string]: ReactElement }
  formacaoId: number
  selectedModuloForAulas?: number | null
  onGerirAulas?: (moduloId: number) => void
}) => {
  // States
  const [activeTab, setActiveTab] = useState('informacoes-gerais')

  const handleChange = (_event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  // Mudar para tab de aulas quando um módulo for selecionado
  useEffect(() => {
    if (selectedModuloForAulas) {
      setActiveTab('aulas')
    }
  }, [selectedModuloForAulas])

  const isCreate = formacaoId === 0

  const tabs = [
    <Tab
      key='informacoes-gerais'
      label='Informações Gerais'
      icon={<i className='tabler-info-circle' />}
      iconPosition='start'
      value='informacoes-gerais'
    />
  ]

  if (!isCreate) {
    tabs.push(
      <Tab
        key='modulos'
        label='Módulos'
        icon={<i className='tabler-books' />}
        iconPosition='start'
        value='modulos'
      />,
      <Tab
        key='aulas'
        label='Aulas'
        icon={<i className='tabler-video' />}
        iconPosition='start'
        value='aulas'
      />,
      <Tab
        key='blocos'
        label='Blocos de Conteúdo'
        icon={<i className='tabler-layout-grid' />}
        iconPosition='start'
        value='blocos'
      />,
      <Tab
        key='quiz'
        label='Quiz'
        icon={<i className='tabler-file-check' />}
        iconPosition='start'
        value='quiz'
      />,
      <Tab
        key='clientes'
        label='Clientes Associados'
        icon={<i className='tabler-users' />}
        iconPosition='start'
        value='clientes'
      />
    )
  }

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
            {tabs}
          </CustomTabList>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TabPanel value='informacoes-gerais' className='p-0'>
            {tabContentList['informacoes-gerais']}
          </TabPanel>
          {!isCreate && (
            <>
              <TabPanel value='modulos' className='p-0'>
                {tabContentList['modulos']}
              </TabPanel>
              <TabPanel value='aulas' className='p-0'>
                {tabContentList['aulas']}
              </TabPanel>
              <TabPanel value='blocos' className='p-0'>
                {tabContentList['blocos']}
              </TabPanel>
              <TabPanel value='quiz' className='p-0'>
                {tabContentList['quiz']}
              </TabPanel>
              <TabPanel value='clientes' className='p-0'>
                {tabContentList['clientes']}
              </TabPanel>
            </>
          )}
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default FormacaoSettings
