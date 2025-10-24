// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'

// API Imports
import { useCategorias } from '@/libs/api/conteudos'
import { StatusConteudo } from '@/libs/api/conteudos/types'
import type { FiltrarConteudosDto } from '@/libs/api/conteudos/types'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'

interface TableFiltersProps {
  onFilterChange: (filters: FiltrarConteudosDto) => void
  dictionary: Awaited<ReturnType<typeof getDictionary>>
}

const TableFilters = ({ onFilterChange, dictionary }: TableFiltersProps) => {
  // Estados dos filtros
  const [categoriaId, setCategoriaId] = useState<number | ''>('')
  const [status, setStatus] = useState<StatusConteudo | ''>('')
  const [destaque, setDestaque] = useState<'true' | 'false' | ''>('')

  // Buscar categorias
  const { data: categorias, isLoading: loadingCategorias } = useCategorias()

  // Atualizar filtros quando algum valor mudar
  useEffect(() => {
    const filters: FiltrarConteudosDto = {}

    if (categoriaId) filters.categoriaId = Number(categoriaId)
    if (status) filters.status = status
    if (destaque) filters.destaque = destaque === 'true'

    onFilterChange(filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriaId, status, destaque])

  return (
    <CardContent>
      <Grid container spacing={6}>
        {/* Filtro: Status */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            select
            fullWidth
            label="Status"
            value={status}
            onChange={e => setStatus(e.target.value as StatusConteudo | '')}
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value="">{dictionary['conteudos']?.filter.status.all}</MenuItem>
            <MenuItem value={StatusConteudo.PUBLICADO}>{dictionary['conteudos']?.filter.status.published}</MenuItem>
            <MenuItem value={StatusConteudo.RASCUNHO}>{dictionary['conteudos']?.filter.status.draft}</MenuItem>
            <MenuItem value={StatusConteudo.EM_REVISAO}>{dictionary['conteudos']?.filter.status.underReview}</MenuItem>
            <MenuItem value={StatusConteudo.AGENDADO}>{dictionary['conteudos']?.filter.status.scheduled}</MenuItem>
            <MenuItem value={StatusConteudo.ARQUIVADO}>{dictionary['conteudos']?.filter.status.archived}</MenuItem>
          </CustomTextField>
        </Grid>

        {/* Filtro: Categoria */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            select
            fullWidth
            label="Categoria"
            value={categoriaId}
            onChange={e => setCategoriaId(e.target.value === '' ? '' : Number(e.target.value))}
            disabled={loadingCategorias}
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value="">{dictionary['conteudos']?.filter.category}</MenuItem>
            {categorias?.map(categoria => (
              <MenuItem key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>

        {/* Filtro: Destaque */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            select
            fullWidth
            label="Destaque"
            value={destaque}
            onChange={e => setDestaque(e.target.value as 'true' | 'false' | '')}
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value="">{dictionary['conteudos']?.filter.highlight.all}</MenuItem>
            <MenuItem value="true">{dictionary['conteudos']?.filter.highlight.true}</MenuItem>
            <MenuItem value="false">{dictionary['conteudos']?.filter.highlight.false}</MenuItem>
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters