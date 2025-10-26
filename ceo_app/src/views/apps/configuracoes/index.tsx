'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import ConfiguracoesTable from './ConfiguracoesTable'
import PasswordProtection from './PasswordProtection'

const Configuracoes = () => {
  const [isUnlocked, setIsUnlocked] = useState(false)

  if (!isUnlocked) {
    return <PasswordProtection onSuccess={() => setIsUnlocked(true)} />
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ConfiguracoesTable />
      </Grid>
    </Grid>
  )
}

export default Configuracoes
