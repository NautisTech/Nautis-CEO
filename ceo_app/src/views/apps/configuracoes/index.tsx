'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import ConfiguracoesTable from './ConfiguracoesTable'
import PasswordProtection from './PasswordProtection'

// Utils Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { toastService } from '@/libs/notifications/toasterService'
import { getDictionary } from '@/utils/getDictionary'

const Configuracoes = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
  const [isUnlocked, setIsUnlocked] = useState(false)

  if (!isUnlocked) {
    return <PasswordProtection dictionary={dictionary} onSuccess={() => setIsUnlocked(true)} />
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ConfiguracoesTable dictionary={dictionary} />
      </Grid>
    </Grid>
  )
}

export default Configuracoes
