'use client'

import { useState } from 'react'
import { Box, Button, TextField, Typography, IconButton, CircularProgress, Alert } from '@mui/material'
import { useUploadSingle } from '@/libs/api/uploads'

interface DocumentoAnexoProps {
  value: string | null
  onChange: (url: string | null) => void
  disabled?: boolean
}

const DocumentoAnexo = ({ value, onChange, disabled }: DocumentoAnexoProps) => {
  const [error, setError] = useState<string | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)

  const uploadMutation = useUploadSingle()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo (PDF ou imagem)
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ]

    if (!allowedTypes.includes(file.type)) {
      setError('Tipo de arquivo não permitido. Use PDF ou imagem (JPG, PNG, GIF, WEBP).')
      return
    }

    // Validar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Arquivo muito grande. Tamanho máximo: 10MB')
      return
    }

    try {
      setError(null)
      const result = await uploadMutation.mutateAsync(file)
      onChange(result.url)
    } catch (err: any) {
      console.error('Erro ao fazer upload:', err)
      setError(err.message || 'Erro ao fazer upload do arquivo')
    }
  }

  const isUploading = uploadMutation.isPending

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      setError('Digite uma URL válida')
      return
    }

    try {
      new URL(urlInput) // Valida se é uma URL válida
      onChange(urlInput)
      setUrlInput('')
      setShowUrlInput(false)
      setError(null)
    } catch {
      setError('URL inválida')
    }
  }

  const handleRemove = () => {
    onChange(null)
    setError(null)
  }

  const getFileType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase()
    if (extension === 'pdf') return 'PDF'
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) return 'Imagem'
    return 'Arquivo'
  }

  const isImage = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase()
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')
  }

  return (
    <Box>
      <Typography variant='body2' color='text.secondary' className='mb-2'>
        Anexo do Documento
      </Typography>

      {error && (
        <Alert severity='error' className='mb-4' onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {value ? (
        <Box className='border rounded p-4'>
          <div className='flex items-center justify-between mb-2'>
            <Typography variant='body2' className='font-medium'>
              {getFileType(value)}
            </Typography>
            <IconButton size='small' onClick={handleRemove} disabled={disabled}>
              <i className='tabler-trash text-error' />
            </IconButton>
          </div>

          {isImage(value) ? (
            <img
              src={value}
              alt='Documento'
              className='max-w-full h-auto max-h-[200px] rounded mb-2'
            />
          ) : (
            <div className='flex items-center gap-2 p-4 bg-gray-100 rounded mb-2'>
              <i className='tabler-file-text text-4xl' />
              <Typography variant='body2' className='break-all'>
                {value.split('/').pop()}
              </Typography>
            </div>
          )}

          <Button
            size='small'
            variant='outlined'
            href={value}
            target='_blank'
            startIcon={<i className='tabler-eye' />}
          >
            Visualizar
          </Button>
        </Box>
      ) : (
        <Box>
          {showUrlInput ? (
            <Box className='flex gap-2 mb-2'>
              <TextField
                size='small'
                fullWidth
                placeholder='https://exemplo.com/documento.pdf'
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                disabled={disabled}
              />
              <Button onClick={handleUrlSubmit} disabled={disabled}>
                Adicionar
              </Button>
              <Button onClick={() => setShowUrlInput(false)} disabled={disabled}>
                Cancelar
              </Button>
            </Box>
          ) : (
            <Box className='flex gap-2'>
              <Button
                component='label'
                variant='outlined'
                startIcon={isUploading ? <CircularProgress size={20} /> : <i className='tabler-upload' />}
                disabled={disabled || isUploading}
              >
                {isUploading ? 'Enviando...' : 'Fazer Upload'}
                <input
                  type='file'
                  hidden
                  accept='.pdf,.jpg,.jpeg,.png,.gif,.webp'
                  onChange={handleFileChange}
                  disabled={disabled || isUploading}
                />
              </Button>
              <Button
                variant='outlined'
                startIcon={<i className='tabler-link' />}
                onClick={() => setShowUrlInput(true)}
                disabled={disabled}
              >
                URL Externa
              </Button>
            </Box>
          )}

          <Typography variant='caption' color='text.secondary' className='block mt-2'>
            Formatos aceitos: PDF, JPG, PNG, GIF, WEBP (máx. 10MB)
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default DocumentoAnexo
