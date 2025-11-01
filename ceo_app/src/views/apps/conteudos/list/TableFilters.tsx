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
  // Buscar categorias
  const { data: categorias, isLoading: loadingCategorias } = useCategorias()

  // Handler para mudança de filtros
  const handleChange = (field: keyof FiltrarConteudosDto, value: any) => {
    onFilterChange({ [field]: value })
  }

  return (
    <CardContent>
      <Grid container spacing={6}>
        {/* Filtro: Status */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            select
            fullWidth
            label="Status"
            defaultValue=""
            onChange={e => handleChange('status', e.target.value || undefined)}
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
            defaultValue=""
            onChange={e => handleChange('categoriaId', e.target.value ? Number(e.target.value) : undefined)}
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
            defaultValue=""
            onChange={e => handleChange('destaque', e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined)}
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