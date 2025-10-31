'use client'

import { useState, useEffect } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import OutlinedInput from '@mui/material/OutlinedInput'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

import { conteudosAPI } from '@/libs/api/conteudos'
import type { ConfiguracoesIdiomas } from '@/libs/api/conteudos/types'

// Mapa de nomes de idiomas para exibição
const LANGUAGE_NAMES: Record<string, string> = {
  'pt-PT': 'Português',
  'en': 'English',
  'es': 'Español',
  'fr': 'Français',
  'de': 'Deutsch',
  'it': 'Italiano',
  'ar': 'العربية'
}

const ConteudoIdiomas = () => {
  const { control } = useFormContext()
  const [config, setConfig] = useState<ConfiguracoesIdiomas | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await conteudosAPI.getConfiguracoesIdiomas()
        setConfig(data)
      } catch (error) {
        console.error('Erro ao carregar configurações de idiomas:', error)
        setConfig({ site_enabled: false, idiomas: [], mostrar_selector: false })
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [])

  // Se não deve mostrar o seletor (site desativado ou apenas 1 idioma), não renderizar nada
  if (loading) {
    return (
      <Card>
        <CardContent className='flex justify-center items-center py-8'>
          <CircularProgress size={24} />
        </CardContent>
      </Card>
    )
  }

  if (!config || !config.mostrar_selector) {
    return null
  }

  return (
    <Card>
      <CardHeader
        title='Idiomas'
        subheader='Selecione os idiomas em que este conteúdo está disponível'
      />
      <CardContent>
        <Controller
          name='idiomas'
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id='idiomas-label'>Idiomas Disponíveis</InputLabel>
              <Select
                labelId='idiomas-label'
                id='idiomas-select'
                multiple
                value={field.value || []}
                onChange={field.onChange}
                input={<OutlinedInput label='Idiomas Disponíveis' />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip
                        key={value}
                        label={LANGUAGE_NAMES[value] || value}
                        size='small'
                      />
                    ))}
                  </Box>
                )}
              >
                {config.idiomas.map((idioma) => (
                  <MenuItem key={idioma} value={idioma}>
                    <Typography>
                      {LANGUAGE_NAMES[idioma] || idioma}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
        <Typography variant='caption' color='text.secondary' className='mt-2 block'>
          Deixe vazio para disponibilizar em todos os idiomas configurados
        </Typography>
      </CardContent>
    </Card>
  )
}

export default ConteudoIdiomas
