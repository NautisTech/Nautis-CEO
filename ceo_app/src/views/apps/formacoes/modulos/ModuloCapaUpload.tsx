'use client'

import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import ButtonGroup from '@mui/material/ButtonGroup'
import { styled } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import { useDropzone } from 'react-dropzone'
import { useUploadSingle } from '@/libs/api/uploads'
import CustomAvatar from '@core/components/mui/Avatar'
import AppReactDropzone from '@/libs/styles/AppReactDropzone'

const Dropzone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
  '& .dropzone': {
    minHeight: 'unset',
    padding: theme.spacing(8),
    [theme.breakpoints.down('sm')]: {
      paddingInline: theme.spacing(5)
    }
  }
}))

interface ModuloCapaUploadProps {
  value: string
  onChange: (url: string) => void
  disabled?: boolean
}

const ModuloCapaUpload = ({ value, onChange, disabled }: ModuloCapaUploadProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>(value || '')
  const [uploading, setUploading] = useState(false)
  const [urlDialogOpen, setUrlDialogOpen] = useState(false)
  const [externalUrl, setExternalUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const [isExternal, setIsExternal] = useState(false)

  const uploadMutation = useUploadSingle()
  const apiBase = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9833'

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0]
      if (!selectedFile) return

      setFile(selectedFile)
      const previewUrl = URL.createObjectURL(selectedFile)
      setPreview(previewUrl)

      // Upload automático
      if (!disabled) {
        setUploading(true)
        try {
          const result = await uploadMutation.mutateAsync(selectedFile)
          onChange(result.url)
          setPreview(result.url)
        } catch (error) {
          console.error('Erro ao fazer upload:', error)
        } finally {
          setUploading(false)
        }
      }
    },
    disabled: disabled || uploading,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: false,
    maxSize: 10485760 // 10MB
  })

  // Atualizar preview quando value muda
  useEffect(() => {
    if (value && value !== preview) {
      setPreview(value)
      const isFullUrl = value.startsWith('http://') || value.startsWith('https://')
      setIsExternal(isFullUrl && !value.includes(apiBase))
    }
  }, [value])

  const handleAddExternalUrl = () => {
    setUrlError('')

    if (!externalUrl.trim()) {
      setUrlError('Por favor, insira uma URL')
      return
    }

    try {
      const url = new URL(externalUrl)
      if (!url.protocol.startsWith('http')) {
        setUrlError('A URL deve começar com http:// ou https://')
        return
      }
    } catch (e) {
      setUrlError('URL inválida')
      return
    }

    // Validar se é uma imagem
    const urlPath = externalUrl.split('?')[0]
    const extension = urlPath.split('.').pop()?.toLowerCase() || ''
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']

    if (extension && !validExtensions.includes(extension)) {
      setUrlError('A URL deve apontar para uma imagem válida')
      return
    }

    setPreview(externalUrl)
    setIsExternal(true)
    onChange(externalUrl)

    setUrlDialogOpen(false)
    setExternalUrl('')
    setUrlError('')
  }

  const handleRemove = () => {
    setFile(null)
    setPreview('')
    setIsExternal(false)
    onChange('')
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
  }

  return (
    <Dropzone>
      <Card variant='outlined'>
        <CardContent>
          {preview ? (
            <div className='space-y-4'>
              <div className='relative rounded overflow-hidden border'>
                <img
                  src={preview}
                  alt='Capa do módulo'
                  className='w-full h-auto max-h-[300px] object-cover'
                />

                {uploading && (
                  <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                    <div className='text-center'>
                      <LinearProgress className='w-48 mb-2' />
                      <Typography color='white'>A fazer upload...</Typography>
                    </div>
                  </div>
                )}
              </div>

              {file && (
                <Typography variant='body2' color='text.secondary'>
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </Typography>
              )}

              {isExternal && !file && (
                <Alert severity='info' icon={<i className='tabler-link' />}>
                  <Typography variant='body2'>
                    Imagem externa - Não será otimizada automaticamente
                  </Typography>
                </Alert>
              )}

              {!disabled && !uploading && (
                <ButtonGroup fullWidth variant='tonal' color='secondary' size='small'>
                  <Button onClick={handleRemove}>Alterar Imagem</Button>
                  <Button onClick={() => setUrlDialogOpen(true)} startIcon={<i className='tabler-link' />}>
                    Usar URL
                  </Button>
                </ButtonGroup>
              )}
            </div>
          ) : (
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <div className='flex items-center flex-col gap-2 text-center'>
                <CustomAvatar variant='rounded' skin='light' color='secondary' size={40}>
                  <i className='tabler-upload text-xl' />
                </CustomAvatar>
                <Typography variant='body2' className='font-medium'>
                  Arraste uma imagem ou clique para selecionar
                </Typography>
                <Typography variant='caption' color='text.disabled'>
                  PNG, JPG, GIF ou WEBP (máx. 10 MB)
                </Typography>
                <Button
                  variant='tonal'
                  size='small'
                  onClick={e => {
                    e.stopPropagation()
                    setUrlDialogOpen(true)
                  }}
                  startIcon={<i className='tabler-link' />}
                  className='mbs-2'
                >
                  Usar URL Externa
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para adicionar URL externa */}
      <Dialog
        open={urlDialogOpen}
        onClose={() => {
          setUrlDialogOpen(false)
          setExternalUrl('')
          setUrlError('')
        }}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Adicionar URL Externa</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='URL da imagem'
            type='url'
            fullWidth
            variant='outlined'
            value={externalUrl}
            onChange={e => setExternalUrl(e.target.value)}
            error={!!urlError}
            helperText={urlError || 'Cole a URL completa da imagem'}
            placeholder='https://exemplo.com/imagem.jpg'
            className='mbs-2'
          />
          <Alert severity='info' className='mbs-4'>
            Imagens externas não serão otimizadas automaticamente
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setUrlDialogOpen(false)
              setExternalUrl('')
              setUrlError('')
            }}
          >
            Cancelar
          </Button>
          <Button onClick={handleAddExternalUrl} variant='contained' startIcon={<i className='tabler-check' />}>
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Dropzone>
  )
}

export default ModuloCapaUpload
