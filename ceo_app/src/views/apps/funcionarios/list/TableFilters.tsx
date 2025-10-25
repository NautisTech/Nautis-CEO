'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'

// Type Imports
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import { useTiposFuncionario } from '@/libs/api/funcionarios'

const TableFilters = ({
  setTipoFuncionarioId,
  setAtivo,
  tipoFuncionarioId,
  ativo
}: {
  setTipoFuncionarioId: (val: number | undefined) => void
  setAtivo: (val: boolean | undefined) => void
  tipoFuncionarioId?: number
  ativo?: boolean
}) => {
  const { data: tiposFuncionario } = useTiposFuncionario()

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            select
            fullWidth
            id='select-tipo'
            value={tipoFuncionarioId || ''}
            onChange={e => setTipoFuncionarioId(e.target.value ? Number(e.target.value) : undefined)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Todos os Tipos</MenuItem>
            {tiposFuncionario?.map(tipo => (
              <MenuItem key={tipo.id} value={tipo.id}>
                {tipo.nome}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            select
            fullWidth
            id='select-status'
            value={ativo === undefined ? '' : ativo ? 'true' : 'false'}
            onChange={e => {
              const val = e.target.value
              setAtivo(val === '' ? undefined : val === 'true')
            }}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Todos os Estados</MenuItem>
            <MenuItem value='true'>Ativo</MenuItem>
            <MenuItem value='false'>Inativo</MenuItem>
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
