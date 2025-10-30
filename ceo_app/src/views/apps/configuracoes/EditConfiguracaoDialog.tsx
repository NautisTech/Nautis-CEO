'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import CustomTextField from '@/@core/components/mui/TextField'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// API Imports
import { configuracoesAPI } from '@/libs/api/configuracoes'
import type { Configuracao } from '@/libs/api/configuracoes/types'

interface EditConfiguracaoDialogProps {
  open: boolean
  onClose: () => void
  configuracao: Configuracao | null
  onSuccess: () => void
}

const EditConfiguracaoDialog = ({ open, onClose, configuracao, onSuccess }: EditConfiguracaoDialogProps) => {
  const [valor, setValor] = useState('')
  const [jsonFields, setJsonFields] = useState<Record<string, string>>({})
  const [isJsonType, setIsJsonType] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (configuracao) {
      const valorString = configuracao.valor || ''

      try {
        if (valorString && valorString.trim().startsWith('{')) {
          const parsed = JSON.parse(valorString)
          setJsonFields(parsed)
          setIsJsonType(true)
          setValor('')
        } else {
          setValor(valorString)
          setJsonFields({})
          setIsJsonType(false)
        }
      } catch {
        // Not valid JSON, treat as plain text
        setValor(valorString)
        setJsonFields({})
        setIsJsonType(false)
      }
    } else {
      setValor('')
      setJsonFields({})
      setIsJsonType(false)
    }
    setError(null)
  }, [configuracao, open])

  const handleJsonFieldChange = (key: string, value: string) => {
    setJsonFields(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSubmit = async () => {
    if (!configuracao) return

    try {
      setLoading(true)
      setError(null)

      let finalValue = valor

      // If it's a JSON type, stringify the fields
      if (isJsonType) {
        finalValue = JSON.stringify(jsonFields, null, 2)
      }

      await configuracoesAPI.update(configuracao.codigo, {
        codigo: configuracao.codigo,
        valor: finalValue
      })

      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar configuração')
      console.error('Erro ao atualizar configuração:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setValor('')
      setJsonFields({})
      setIsJsonType(false)
      setError(null)
      onClose()
    }
  }

  // Render helper for field label
  const formatFieldLabel = (key: string) => {
    return key.charAt(0).toUpperCase() + key.slice(1)
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        <Typography variant='h5'>Editar Configuração</Typography>
      </DialogTitle>

      <DialogContent>
        <div className='flex flex-col gap-4 pbs-5'>
          <CustomTextField
            label='Código'
            value={configuracao?.codigo || ''}
            disabled
            fullWidth
          />

          <CustomTextField
            label='Descrição'
            value={configuracao?.descricao || ''}
            disabled
            fullWidth
            multiline
            rows={2}
          />

          {/* Render JSON fields or plain text field */}
          {isJsonType ? (
            <>
              <Alert severity='info' className='mbe-2'>
                Esta configuração contém valores estruturados (JSON)
              </Alert>
              {Object.keys(jsonFields).map((key) => (
                <CustomTextField
                  key={key}
                  label={formatFieldLabel(key)}
                  value={jsonFields[key]}
                  onChange={(e) => handleJsonFieldChange(key, e.target.value)}
                  fullWidth
                  placeholder={`Insira ${key}`}
                  autoFocus={key === Object.keys(jsonFields)[0]}
                />
              ))}
            </>
          ) : (
            <CustomTextField
              label='Valor'
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              fullWidth
              multiline
              rows={4}
              placeholder='Insira o valor da configuração'
              autoFocus
            />
          )}

          {error && (
            <Typography color='error' variant='body2'>
              {error}
            </Typography>
          )}
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading} color='secondary'>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant='contained' disabled={loading}>
          {loading ? <CircularProgress size={20} /> : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditConfiguracaoDialog
