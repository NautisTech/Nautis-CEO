'use client'

import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CustomTextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import ButtonGroup from '@mui/material/ButtonGroup'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import { useDropzone } from 'react-dropzone'

import { useUploadSingle } from '@/libs/api/uploads'
import type { ImageVariants } from '@/libs/api/conteudos/types'
import CustomAvatar from '@core/components/mui/Avatar'
import AppReactDropzone from '@/libs/styles/AppReactDropzone'
import OptimizedImage from '@/components/OptimizedImage'

const Dropzone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
  '& .dropzone': {
    minHeight: 'unset',
    padding: theme.spacing(12),
    [theme.breakpoints.down('sm')]: {
      paddingInline: theme.spacing(5)
    }
  }
}))

type Props = {
  value: string | null
  onChange: (url: string | null) => void
  disabled?: boolean
}

const FuncionarioFoto = ({ value, onChange, disabled = false }: Props) => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(value)
  const [variants, setVariants] = useState<ImageVariants | null>(null)
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
      setPreview(URL.createObjectURL(selectedFile))

      // Upload automático
      if (!disabled) {
        setUploading(true)
        try {
          const result = await uploadMutation.mutateAsync(selectedFile)
          onChange(result.url)
          setVariants(result.variants || null)
        } catch (error) {
          console.error('Erro ao fazer upload:', error)
        } finally {
          setUploading(false)
        }
      }
    },
    disabled: disabled,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: false,
    maxSize: 10485760 // 10MB
  })

  // Carregar foto existente
  useEffect(() => {
    if (value && !file) {
      setPreview(value)
      try {
        const isFullUrl = value.startsWith('http://') || value.startsWith('https://')
        setIsExternal(isFullUrl && !value.includes(apiBase))
      } catch {
        setIsExternal(false)
      }
    }
  }, [value, file, apiBase])

  const handleAddExternalUrl = () => {
    setUrlError('')

    // Validar URL
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

    // Validar se é uma imagem (baseado na extensão)
    const urlPath = externalUrl.split('?')[0]
    const extension = urlPath.split('.').pop()?.toLowerCase() || ''
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']

    if (extension && !validExtensions.includes(extension)) {
      setUrlError('A URL deve apontar para uma imagem válida')
      return
    }

    // Definir imagem externa
    setPreview(externalUrl)
    setIsExternal(true)
    setVariants(null)
    onChange(externalUrl)

    // Fechar diálogo e limpar
    setUrlDialogOpen(false)
    setExternalUrl('')
    setUrlError('')
  }

  const handleRemove = () => {
    setFile(null)
    setPreview(null)
    setVariants(null)
    setIsExternal(false)
    onChange(null)
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
  }

  return (
    <Dropzone>
      <Card>
        <CardHeader
          title='Foto do Funcionário'
          subheader='Adicione uma foto para identificação do funcionário'
        />
        <CardContent>
          {preview ? (
            <div className='space-y-4'>
              <div className='relative rounded overflow-hidden flex justify-center'>
                {/* Avatar circular para a foto */}
                <OptimizedImage
                  src={preview}
                  alt='Foto do funcionário'
                  variants={variants}
                  size='large'
                  className='w-48 h-48 rounded-full object-cover'
                  width={200}
                  height={200}
                />

                {uploading && (
                  <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full'>
                    <div className='text-center'>
                      <LinearProgress className='w-32 mb-2' />
                      <Typography color='white' variant='body2'>A enviar...</Typography>
                    </div>
                  </div>
                )}
              </div>

              {file && (
                <List className='p-0'>
                  <ListItem className='pis-4 plb-3 border rounded'>
                    <div className='file-details flex-1'>
                      <Typography className='font-medium' color='text.primary'>
                        {file.name}
                      </Typography>
                      <div className='flex items-center gap-2'>
                        <Typography variant='body2' color='text.secondary'>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                        {variants && (
                          <Typography variant='caption' color='success.main'>
                            Versões otimizadas criadas
                          </Typography>
                        )}
                      </div>
                    </div>
                    {!disabled && !uploading && (
                      <IconButton onClick={handleRemove} color='error'>
                        <i className='tabler-x text-xl' />
                      </IconButton>
                    )}
                  </ListItem>
                </List>
              )}

              {isExternal && !file && (
                <Alert severity='info' icon={<i className='tabler-link' />}>
                  <Typography variant='body2' className='font-medium'>
                    Imagem Externa
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    Esta imagem não pode ser otimizada automaticamente
                  </Typography>
                </Alert>
              )}

              {!disabled && !uploading && (
                <ButtonGroup fullWidth variant='tonal' color='secondary'>
                  <Button onClick={handleRemove}>Alterar Foto</Button>
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
                <CustomAvatar variant='rounded' skin='light' color='secondary' size={48}>
                  <i className='tabler-upload text-2xl' />
                </CustomAvatar>
                <Typography variant='h5'>Arraste a foto aqui</Typography>
                <Typography color='text.disabled'>ou clique para selecionar</Typography>
                <ButtonGroup variant='tonal' size='small' className='mbs-2'>
                  <Button>Procurar Foto</Button>
                  <Button
                    onClick={e => {
                      e.stopPropagation()
                      setUrlDialogOpen(true)
                    }}
                    startIcon={<i className='tabler-link' />}
                  >
                    URL Externa
                  </Button>
                </ButtonGroup>
                <Typography variant='caption' color='text.disabled' className='mbs-2'>
                  Tamanho máximo: 10 MB (PNG, JPG, JPEG, GIF, WEBP)
                </Typography>
                <Typography variant='caption' color='primary' className='mbs-1'>
                  A imagem será otimizada automaticamente
                </Typography>
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
        <DialogTitle>Adicionar URL de Imagem Externa</DialogTitle>
        <DialogContent>
          <CustomTextField
            autoFocus
            margin='dense'
            label='URL da foto'
            type='url'
            fullWidth
            variant='outlined'
            value={externalUrl}
            onChange={e => setExternalUrl(e.target.value)}
            error={!!urlError}
            helperText={urlError || 'Cole a URL completa da foto'}
            placeholder='https://exemplo.com/foto.jpg'
          />
          <Alert severity='info' className='mt-4'>
            Imagens externas não serão otimizadas automaticamente pelo sistema
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

export default FuncionarioFoto
