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
import { styled } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import { useDropzone } from 'react-dropzone'
import { useFormContext } from 'react-hook-form'

import { useConteudo } from '@/libs/api/conteudos'
import { useUploadSingle } from '@/libs/api/uploads'
import type { ImageVariants } from '@/libs/api/conteudos/types'
import CustomAvatar from '@core/components/mui/Avatar'
import AppReactDropzone from '@/libs/styles/AppReactDropzone'
import OptimizedImage from '@/components/OptimizedImage'
import { getDictionary } from '@/utils/getDictionary'

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
  id: number | null
  viewOnly: boolean
  dictionary: Awaited<ReturnType<typeof getDictionary>>
}

const ConteudoImage = ({ id, viewOnly, dictionary }: Props) => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [variants, setVariants] = useState<ImageVariants | null>(null) // Adicionar
  const [uploading, setUploading] = useState(false)
  const [urlDialogOpen, setUrlDialogOpen] = useState(false)
  const [externalUrl, setExternalUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const [isExternal, setIsExternal] = useState(false)

  const { setValue, watch } = useFormContext()

  const { data: conteudo } = useConteudo(id || 0, !!id)
  const uploadMutation = useUploadSingle()
  const apiBase = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9833'

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0]
      if (!selectedFile) return

      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))

      // Upload automático
      if (!viewOnly) {
        setUploading(true)
        try {
          const result = await uploadMutation.mutateAsync(selectedFile)
          setValue('imagemDestaque', result.url)
          setVariants(result.variants || null) // Guardar variants
        } catch (error) {
        } finally {
          setUploading(false)
        }
      }
    },
    disabled: viewOnly,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: false,
    maxSize: 10485760
  })

  // Carregar imagem existente
  useEffect(() => {
    if (conteudo?.imagem_destaque && !file) {
      setPreview(conteudo.imagem_destaque)
      try {
        const isFullUrl =
          conteudo.imagem_destaque.startsWith('http://') || conteudo.imagem_destaque.startsWith('https://')
        setIsExternal(isFullUrl && !conteudo.imagem_destaque.includes(apiBase))
      } catch {
        setIsExternal(false)
      }
      // TODO: Se tiver variants no conteudo, carregar aqui também
    }
  }, [conteudo, file])

  const handleAddExternalUrl = () => {
    setUrlError('')

    // Validar URL
    if (!externalUrl.trim()) {
      setUrlError(dictionary['conteudos'].notifications.insertUrl)
      return
    }

    try {
      const url = new URL(externalUrl)
      if (!url.protocol.startsWith('http')) {
        setUrlError(dictionary['conteudos'].notifications.urlProtocol)
        return
      }
    } catch (e) {
      setUrlError(dictionary['conteudos'].notifications.invalidUrl)
      return
    }

    // Validar se é uma imagem (opcional, baseado na extensão)
    const urlPath = externalUrl.split('?')[0]
    const extension = urlPath.split('.').pop()?.toLowerCase() || ''
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']

    if (extension && !validExtensions.includes(extension)) {
      setUrlError(dictionary['conteudos'].notifications.imageUrl)
      return
    }

    // Definir imagem externa
    setPreview(externalUrl)
    setIsExternal(true)
    setVariants(null)
    setValue('imagemDestaque', externalUrl)

    // Fechar diálogo e limpar
    setUrlDialogOpen(false)
    setExternalUrl('')
    setUrlError('')
  }

  const handleRemove = () => {
    setFile(null)
    setPreview(null)
    setVariants(null) // Limpar variants
    setIsExternal(false)
    setValue('imagemDestaque', null)
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
  }

  return (
    <Dropzone>
      <Card>
        <CardHeader
          title={dictionary['conteudos'].labels.featuredImage}
          subheader={dictionary['conteudos'].labels.featuredImageSubtitle}
        />
        <CardContent>
          {preview ? (
            <div className='space-y-4'>
              <div className='relative rounded overflow-hidden'>
                {/* Usar OptimizedImage */}
                <OptimizedImage
                  src={preview}
                  alt={dictionary['conteudos'].labels.featuredImageAlt}
                  variants={variants}
                  size='large'
                  className='w-full h-auto max-h-[400px] object-contain'
                  width={800}
                  height={600}
                />

                {uploading && (
                  <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                    <div className='text-center'>
                      <LinearProgress className='w-48 mb-2' />
                      <Typography color='white'>{dictionary['conteudos'].actions.uploadingSingle}</Typography>
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
                            {dictionary['conteudos'].labels.optimizedVersions}
                          </Typography>
                        )}
                      </div>
                    </div>
                    {!viewOnly && !uploading && (
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
                    {dictionary['conteudos'].labels.externalImage}
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    {dictionary['conteudos'].labels.notOptimizable}
                  </Typography>
                </Alert>
              )}

              {!viewOnly && !uploading && (
                <ButtonGroup fullWidth variant='tonal' color='secondary'>
                  <Button onClick={handleRemove}>{dictionary['conteudos'].actions.changeImage}</Button>
                  <Button onClick={() => setUrlDialogOpen(true)} startIcon={<i className='tabler-link' />}>
                    {dictionary['conteudos'].actions.useUrl}
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
                <Typography variant='h5'>{dictionary['conteudos'].labels.dragHereSingle}</Typography>
                <Typography color='text.disabled'>{dictionary['conteudos'].labels.selectFiles}</Typography>
                <ButtonGroup variant='tonal' size='small' className='mbs-2'>
                  <Button>{dictionary['conteudos'].actions.searchImage}</Button>
                  <Button
                    onClick={e => {
                      e.stopPropagation()
                      setUrlDialogOpen(true)
                    }}
                    startIcon={<i className='tabler-link' />}
                  >
                    {dictionary['conteudos'].actions.externalUrl}
                  </Button>
                </ButtonGroup>
                <Typography variant='caption' color='text.disabled' className='mbs-2'>
                  {dictionary['conteudos'].labels.imageHelper.replace('{{maxSize}}', '10 MB')}
                </Typography>
                <Typography variant='caption' color='primary' className='mbs-1'>
                  {dictionary['conteudos'].labels.autoOptimized}
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
        <DialogTitle>{dictionary['conteudos'].labels.addExternalUrl}</DialogTitle>
        <DialogContent>
          <CustomTextField
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
            placeholder='https://example.com/image.jpg'
          />
          <Alert severity='info' className='mt-4'>
            {dictionary['conteudos'].notifications.externalNotOptimized}
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
            {dictionary.actions.cancel}
          </Button>
          <Button onClick={handleAddExternalUrl} variant='contained' startIcon={<i className='tabler-check' />}>
            {dictionary.actions.add}
          </Button>
        </DialogActions>
      </Dialog>
    </Dropzone>
  )
}

export default ConteudoImage
