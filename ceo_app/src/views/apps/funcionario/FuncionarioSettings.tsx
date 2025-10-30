'use client'

// React Imports
import { useState } from 'react'
import type { SyntheticEvent, ReactElement } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'
import { FuncionarioCreateProvider } from './FuncionarioCreateContext'

const FuncionarioSettings = ({
  tabContentList,
  funcionarioId,
  viewOnly = false
}: {
  tabContentList: { [key: string]: ReactElement }
  funcionarioId: number
  viewOnly?: boolean
}) => {
  // States
  const [activeTab, setActiveTab] = useState('dados-pessoais')

  const handleChange = (_event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  const isCreate = funcionarioId === 0

  const tabs = [
    <Tab
      key='dados-pessoais'
      label='Dados Pessoais'
      icon={<i className='tabler-user' />}
      iconPosition='start'
      value='dados-pessoais'
    />
  ]

  if (!isCreate) {
    tabs.push(
      <Tab
        key='contatos'
        label='Contactos'
        icon={<i className='tabler-phone' />}
        iconPosition='start'
        value='contatos'
      />,
      <Tab
        key='enderecos'
        label='Endereços'
        icon={<i className='tabler-map-pin' />}
        iconPosition='start'
        value='enderecos'
      />,
      <Tab
        key='empregos'
        label='Empregos'
        icon={<i className='tabler-briefcase' />}
        iconPosition='start'
        value='empregos'
      />,
      <Tab
        key='beneficios'
        label='Benefícios'
        icon={<i className='tabler-gift' />}
        iconPosition='start'
        value='beneficios'
      />,
      <Tab
        key='documentos'
        label='Documentos'
        icon={<i className='tabler-file-text' />}
        iconPosition='start'
        value='documentos'
      />
    )
  }

  return (
    <FuncionarioCreateProvider>
      <TabContext value={activeTab}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
              {tabs}
            </CustomTabList>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TabPanel value='dados-pessoais' className='p-0'>
              {tabContentList['dados-pessoais']}
            </TabPanel>
            {!isCreate && (
              <>
                <TabPanel value='contatos' className='p-0'>
                  {tabContentList['contatos']}
                </TabPanel>
                <TabPanel value='enderecos' className='p-0'>
                  {tabContentList['enderecos']}
                </TabPanel>
                <TabPanel value='empregos' className='p-0'>
                  {tabContentList['empregos']}
                </TabPanel>
                <TabPanel value='beneficios' className='p-0'>
                  {tabContentList['beneficios']}
                </TabPanel>
                <TabPanel value='documentos' className='p-0'>
                  {tabContentList['documentos']}
                </TabPanel>
              </>
            )}
          </Grid>
        </Grid>
      </TabContext>
    </FuncionarioCreateProvider>
  )
}

export default FuncionarioSettings
