'use client'

import { useEffect, useState, SyntheticEvent } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

import CustomTextField from '@core/components/mui/TextField'
import CustomTabList from '@core/components/mui/TabList'
import { useSchemaTipo, useConteudo } from '@/libs/api/conteudos'
import type { CampoPersonalizado } from '@/libs/api/conteudos/types'

type Props = {
  tipo: string
  id: number | null
  viewOnly: boolean
}

// Mapear tipos antigos para novos
const normalizarTipo = (tipo: string): string => {
  const mapeamento: Record<string, string> = {
    'text': 'texto',
    'url': 'texto',
    'email': 'texto',
    'tel': 'texto',
    'number': 'numero',
    'date': 'data',
    'datetime': 'datetime',
    'datetime-local': 'datetime',
    'checkbox': 'checkbox',
    'boolean': 'boolean',
    'select': 'select',
    'radio': 'radio',
    'textarea': 'textarea',
    'json': 'json'
  }

  return mapeamento[tipo] || tipo
}

const ConteudoCamposPersonalizados = ({ tipo, id, viewOnly }: Props) => {
  const [activeTab, setActiveTab] = useState('0')
  const { control, setValue, watch } = useFormContext()
  const { data: conteudo, isLoading: loadingConteudo } = useConteudo(id || 0, !!id)

  // Obter o tipoConteudoId do form
  const tipoConteudoId = watch('tipoConteudoId')

  // Buscar schema usando o hook
  const { data: schemaData, isLoading: loadingSchema } = useSchemaTipo(tipoConteudoId || 0)

  const camposPersonalizados = schemaData?.campos_personalizados || []

  // Agrupar campos por grupo
  const camposPorGrupo = camposPersonalizados.reduce((acc, campo) => {
    const grupo = campo.grupo || 'Geral'
    if (!acc[grupo]) {
      acc[grupo] = []
    }
    acc[grupo].push(campo)
    return acc
  }, {} as Record<string, CampoPersonalizado[]>)

  const grupos = Object.keys(camposPorGrupo)

  // Preencher valores dos campos personalizados quando carregar o conteúdo
  useEffect(() => {
    if (conteudo?.campos_personalizados && id && camposPersonalizados.length > 0) {
      conteudo.campos_personalizados.forEach(valor => {
        const campo = camposPersonalizados.find(c => c.codigo === valor.codigo_campo)
        if (!campo) {
          return
        }

        const tipoNormalizado = normalizarTipo(campo.tipo)
        let fieldValue: any = ''


        switch (tipoNormalizado) {
          case 'texto':
          case 'textarea':
          case 'select':
          case 'radio':
            fieldValue = valor.valor_texto || ''
            break
          case 'numero':
            fieldValue = valor.valor_numero !== null && valor.valor_numero !== undefined
              ? valor.valor_numero
              : ''
            break
          case 'data':
            fieldValue = valor.valor_data || ''
            break
          case 'datetime':
            if (valor.valor_datetime) {
              try {
                fieldValue = new Date(valor.valor_datetime).toISOString().slice(0, 16)
              } catch {
                fieldValue = ''
              }
            } else {
              fieldValue = ''
            }
            break
          case 'boolean':
          case 'checkbox':
            fieldValue = valor.valor_boolean || false
            break
          case 'json':
            fieldValue = valor.valor_json ? JSON.stringify(valor.valor_json, null, 2) : ''
            break
          default:
            fieldValue = valor.valor_texto || ''
        }

        setValue(`campos.${valor.codigo_campo}`, fieldValue, { shouldValidate: false })
      })
    }
  }, [conteudo, id, camposPersonalizados, setValue])

  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
  }

  if (loadingSchema || (loadingConteudo && id)) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center p-10'>
          <CircularProgress />
          <Typography className='mli-4'>Carregando campos personalizados...</Typography>
        </CardContent>
      </Card>
    )
  }

  if (!camposPersonalizados.length) {
    return null
  }

  const renderCampo = (campo: CampoPersonalizado) => {
    const fieldName = `campos.${campo.codigo}`
    const tipoNormalizado = normalizarTipo(campo.tipo)
    const isFullWidth = tipoNormalizado === 'textarea' || tipoNormalizado === 'json'

    const fieldComponent = (() => {
      switch (tipoNormalizado) {
        case 'texto':
          return (
            <Controller
              name={fieldName}
              control={control}
              defaultValue=''
              rules={{ required: campo.obrigatorio ? `${campo.nome} é obrigatório` : false }}
              render={({ field, fieldState }) => (
                <CustomTextField
                  {...field}
                  value={field.value || ''}
                  fullWidth
                  label={campo.nome}
                  placeholder={campo.descricao}
                  disabled={viewOnly}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || campo.descricao}
                  type={campo.tipo === 'url' ? 'url' : campo.tipo === 'email' ? 'email' : 'text'}
                />
              )}
            />
          )

        case 'textarea':
          return (
            <Controller
              name={fieldName}
              control={control}
              defaultValue=''
              rules={{ required: campo.obrigatorio ? `${campo.nome} é obrigatório` : false }}
              render={({ field, fieldState }) => (
                <CustomTextField
                  {...field}
                  value={field.value || ''}
                  fullWidth
                  multiline
                  rows={4}
                  label={campo.nome}
                  placeholder={campo.descricao}
                  disabled={viewOnly}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || campo.descricao}
                />
              )}
            />
          )

        case 'numero':
          return (
            <Controller
              name={fieldName}
              control={control}
              defaultValue=''
              rules={{ required: campo.obrigatorio ? `${campo.nome} é obrigatório` : false }}
              render={({ field, fieldState }) => (
                <CustomTextField
                  {...field}
                  value={field.value || ''}
                  fullWidth
                  type='number'
                  label={campo.nome}
                  placeholder={campo.descricao}
                  disabled={viewOnly}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || campo.descricao}
                />
              )}
            />
          )

        case 'data':
          return (
            <Controller
              name={fieldName}
              control={control}
              defaultValue=''
              rules={{ required: campo.obrigatorio ? `${campo.nome} é obrigatório` : false }}
              render={({ field, fieldState }) => (
                <CustomTextField
                  {...field}
                  value={field.value || ''}
                  fullWidth
                  type='date'
                  label={campo.nome}
                  disabled={viewOnly}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || campo.descricao}
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                />
              )}
            />
          )

        case 'datetime':
          return (
            <Controller
              name={fieldName}
              control={control}
              defaultValue=''
              rules={{ required: campo.obrigatorio ? `${campo.nome} é obrigatório` : false }}
              render={({ field, fieldState }) => (
                <CustomTextField
                  {...field}
                  value={field.value || ''}
                  fullWidth
                  type='datetime-local'
                  label={campo.nome}
                  disabled={viewOnly}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || campo.descricao}
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                />
              )}
            />
          )

        case 'boolean':
        case 'checkbox':
          return (
            <Controller
              name={fieldName}
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value || false}
                      onChange={field.onChange}
                      disabled={viewOnly}
                    />
                  }
                  label={
                    <div>
                      <Typography variant='body1'>{campo.nome}</Typography>
                      {campo.descricao && (
                        <Typography variant='caption' color='text.secondary'>
                          {campo.descricao}
                        </Typography>
                      )}
                    </div>
                  }
                />
              )}
            />
          )

        case 'select':
          return (
            <Controller
              name={fieldName}
              control={control}
              defaultValue=''
              rules={{ required: campo.obrigatorio ? `${campo.nome} é obrigatório` : false }}
              render={({ field, fieldState }) => (
                <CustomTextField
                  {...field}
                  value={field.value || ''}
                  select
                  fullWidth
                  label={campo.nome}
                  disabled={viewOnly}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || campo.descricao}
                >
                  <MenuItem value=''>Selecione...</MenuItem>
                  {campo.opcoes?.map(opcao => (
                    <MenuItem key={opcao.value} value={opcao.value}>
                      {opcao.label}
                    </MenuItem>
                  ))}
                </CustomTextField>
              )}
            />
          )

        case 'radio':
          return (
            <Controller
              name={fieldName}
              control={control}
              defaultValue=''
              rules={{ required: campo.obrigatorio ? `${campo.nome} é obrigatório` : false }}
              render={({ field, fieldState }) => (
                <CustomTextField
                  {...field}
                  value={field.value || ''}
                  select
                  fullWidth
                  label={campo.nome}
                  disabled={viewOnly}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || campo.descricao}
                >
                  <MenuItem value=''>Selecione...</MenuItem>
                  {campo.opcoes?.map(opcao => (
                    <MenuItem key={opcao.value} value={opcao.value}>
                      {opcao.label}
                    </MenuItem>
                  ))}
                </CustomTextField>
              )}
            />
          )

        case 'json':
          return (
            <Controller
              name={fieldName}
              control={control}
              defaultValue=''
              rules={{
                required: campo.obrigatorio ? `${campo.nome} é obrigatório` : false,
                validate: (value) => {
                  if (!value) return true
                  try {
                    JSON.parse(value)
                    return true
                  } catch {
                    return 'JSON inválido'
                  }
                }
              }}
              render={({ field, fieldState }) => (
                <CustomTextField
                  {...field}
                  value={field.value || ''}
                  fullWidth
                  multiline
                  rows={6}
                  label={campo.nome}
                  placeholder='{"chave": "valor"}'
                  disabled={viewOnly}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || campo.descricao}
                />
              )}
            />
          )

        default:
          return (
            <Typography color='error'>
              Tipo de campo não suportado: {tipoNormalizado}
            </Typography>
          )
      }
    })()

    return (
      <Grid key={campo.codigo} size={{ xs: 12, sm: isFullWidth ? 12 : 6 }}>
        {fieldComponent}
      </Grid>
    )
  }

  // Se só há um grupo, não mostrar tabs
  if (grupos.length === 1) {
    return (
      <Card>
        <CardHeader title='Campos Personalizados' />
        <CardContent>
          <Grid container spacing={6}>
            {camposPorGrupo[grupos[0]].map(campo => renderCampo(campo))}
          </Grid>
        </CardContent>
      </Card>
    )
  }

  // Múltiplos grupos - mostrar tabs
  return (
    <Card>
      <CardHeader title='Campos Personalizados' />
      <CardContent>
        <TabContext value={activeTab}>
          <CustomTabList onChange={handleTabChange} variant='scrollable' pill='true'>
            {grupos.map((grupo, index) => (
              <Tab
                key={grupo}
                value={index.toString()}
                label={grupo}
                icon={<i className='tabler-folder' />}
                iconPosition='start'
              />
            ))}
          </CustomTabList>
          {grupos.map((grupo, index) => (
            <TabPanel key={grupo} value={index.toString()} className='p-0 mbs-6'>
              <Grid container spacing={6}>
                {camposPorGrupo[grupo].map(campo => renderCampo(campo))}
              </Grid>
            </TabPanel>
          ))}
        </TabContext>
      </CardContent>
    </Card>
  )
}

export default ConteudoCamposPersonalizados