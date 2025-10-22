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
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import ButtonGroup from '@mui/material/ButtonGroup'
import { styled } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import { useDropzone } from 'react-dropzone'
import { useFormContext } from 'react-hook-form'

import { useConteudo, useTipoConteudo } from '@/libs/api/conteudos'
import { useUploadMultiple, useDeleteUpload, useExternalFile } from '@/libs/api/uploads'
import type { UploadResponse } from '@/libs/api/uploads'
import type { ImageVariants } from '@/libs/api/conteudos/types'
import CustomAvatar from '@core/components/mui/Avatar'
import AppReactDropzone from '@/libs/styles/AppReactDropzone'
import OptimizedImage from '@/components/OptimizedImage'

const Dropzone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
  '& .dropzone': {
    minHeight: 'unset',
    padding: theme.spacing(8),
    [theme.breakpoints.down('sm')]: {
      paddingInline: theme.spacing(5)
    }
  }
}))

type Props = {
  id: number | null
  viewOnly: boolean
}

interface AnexoLocal {
  id?: number
  conteudo_anexo_id?: number
  file?: File
  nome: string
  nome_original: string
  url: string
  tipo: string
  tipo_anexo?: string
  mime_type?: string
  tamanho_bytes: number
  uploaded: boolean
  legenda?: string
  ordem?: number
  variants?: ImageVariants | null
  isExternal?: boolean // Indica se é URL externa
}

const ConteudoAnexos = ({ id, viewOnly }: Props) => {
  const apiBase = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9833'
  const [anexos, setAnexos] = useState<AnexoLocal[]>([])
  const [uploading, setUploading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewAnexo, setPreviewAnexo] = useState<AnexoLocal | null>(null)
  const [urlDialogOpen, setUrlDialogOpen] = useState(false)
  const [externalUrl, setExternalUrl] = useState('')
  const [urlError, setUrlError] = useState('')

  const { setValue, watch } = useFormContext()
  const tipoConteudoId = watch('tipoConteudoId')

  const { data: conteudo, isLoading: loadingConteudo } = useConteudo(id || 0, !!id)
  const { data: tipoConteudo } = useTipoConteudo(tipoConteudoId)
  const uploadMutation = useUploadMultiple()
  const deleteMutation = useDeleteUpload()
  const registerMutation = useExternalFile()

  const maxAnexos = tipoConteudo?.max_anexos || 5
  const permiteAnexos = tipoConteudo?.permite_anexos || false

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles: File[]) => {
      if (anexos.length + acceptedFiles.length > maxAnexos) {
        alert(`Máximo de ${maxAnexos} anexos permitidos`)
        return
      }

      setUploading(true)
      try {
        const results = await uploadMutation.mutateAsync(acceptedFiles)

        const novosAnexos: AnexoLocal[] = results.map(result => ({
          id: result.id,
          nome: result.nome,
          nome_original: result.nome_original,
          url: result.url,
          tipo: result.tipo,
          tamanho_bytes: result.tamanho_bytes,
          uploaded: true,
          variants: result.variants || null
        }))

        setAnexos(prev => [...prev, ...novosAnexos])

        const anexosIds = [...anexos, ...novosAnexos].filter(a => a.id).map(a => a.id!)
        setValue('anexosIds', anexosIds)
      } catch (error) {
      } finally {
        setUploading(false)
      }
    },
    disabled: viewOnly || anexos.length >= maxAnexos,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.mpeg'],
      'audio/*': ['.mp3', '.wav'],
      'application/pdf': ['.pdf']
    },
    multiple: true,
    maxSize: 10485760
  })

  // Carregar anexos existentes
  useEffect(() => {
    if (conteudo?.anexos && id && !loadingConteudo) {
      const anexosExistentes: AnexoLocal[] = conteudo.anexos.map(a => ({
        id: a.id,
        conteudo_anexo_id: a.conteudo_anexo_id,
        nome: a.nome,
        nome_original: a.nome_original,
        url: a.url,
        tipo: a.tipo,
        tipo_anexo: a.tipo_anexo,
        mime_type: a.mime_type,
        tamanho_bytes: a.tamanho_bytes,
        uploaded: true,
        legenda: a.legenda,
        ordem: a.ordem,
        variants: a.variants,
        isExternal: (a.url.startsWith('http://') || a.url.startsWith('https://')) && !a.url.includes(apiBase)
      }))

      setAnexos(anexosExistentes)

      const anexosIds = anexosExistentes.filter(a => a.id).map(a => a.id!)
      setValue('anexosIds', anexosIds)
    }
  }, [conteudo, id, loadingConteudo, setValue])

  const handleAddExternalUrl = async () => {
    setUrlError('')

    if (!externalUrl.trim()) {
      setUrlError('Por favor, insira uma URL')
      return
    }

    try {
      const url = new URL(externalUrl)
      if (!url.protocol.startsWith('http')) {
        setUrlError('URL deve começar com http:// ou https://')
        return
      }
    } catch (e) {
      setUrlError('URL inválida')
      return
    }

    if (anexos.length >= maxAnexos) {
      setUrlError(`Máximo de ${maxAnexos} anexos permitidos`)
      return
    }

    const urlPath = externalUrl.split('?')[0]
    const extension = urlPath.split('.').pop()?.toLowerCase() || 'url'

    let tipo = extension

    if (['mp4', 'mpeg', 'avi', 'mov'].includes(extension)) {
      tipo = 'video'
    } else if (['mp3', 'wav', 'ogg'].includes(extension)) {
      tipo = 'audio'
    }

    const registerData = { url: externalUrl, tipo: tipo }
    console.log('Registering external file with data:', registerData)
    const result = await registerMutation.mutateAsync(registerData)

    const novoAnexo: AnexoLocal = {
      id: result.id,
      nome: result.nome,
      nome_original: result.nome_original,
      url: result.url,
      tipo: result.tipo,
      tamanho_bytes: result.tamanho_bytes,
      uploaded: true,
      variants: result.variants || null
    }

    setAnexos(prev => [...prev, novoAnexo])
    const anexosIds = anexos.filter(a => a.id).map(a => a.id!)
    setValue('anexosIds', anexosIds)

    setUrlDialogOpen(false)
    setExternalUrl('')
    setUrlError('')
  }

  const handleRemove = async (index: number) => {
    const anexo = anexos[index]

    if (anexo.id) {
      try {
        await deleteMutation.mutateAsync(anexo.id)
      } catch (error) {
        return
      }
    }

    const novosAnexos = anexos.filter((_, i) => i !== index)
    setAnexos(novosAnexos)

    const anexosIds = novosAnexos.filter(a => a.id).map(a => a.id!)
    setValue('anexosIds', anexosIds)
  }

  const handlePreview = (anexo: AnexoLocal) => {
    setPreviewAnexo(anexo)
    setPreviewOpen(true)
  }

  const getFileIcon = (anexo: AnexoLocal) => {
    const mimeType = anexo.mime_type || ''
    const tipo = anexo.tipo || ''

    if (mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(tipo)) {
      return 'tabler-photo'
    }
    if (mimeType.startsWith('video/') || ['mp4', 'mpeg'].includes(tipo)) {
      return 'tabler-video'
    }
    if (mimeType.startsWith('audio/') || ['mp3', 'wav'].includes(tipo)) {
      return 'tabler-music'
    }
    if (tipo === 'pdf') {
      return 'tabler-file-text'
    }
    return 'tabler-file'
  }

  const isImage = (anexo: AnexoLocal) => {
    const mimeType = anexo.mime_type || ''
    const tipo = anexo.tipo || ''
    return mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(tipo)
  }

  const isVideo = (anexo: AnexoLocal) => {
    const mimeType = anexo.mime_type || ''
    const tipo = anexo.tipo || ''
    return mimeType.startsWith('video/') || ['mp4', 'mpeg'].includes(tipo)
  }

  const isAudio = (anexo: AnexoLocal) => {
    const mimeType = anexo.mime_type || ''
    const tipo = anexo.tipo || ''
    return mimeType.startsWith('audio/') || ['mp3', 'wav'].includes(tipo)
  }

  if (!permiteAnexos) {
    return null
  }

  return (
    <>
      <Dropzone>
        <Card>
          <CardHeader
            title='Anexos Adicionais'
            subheader={`Máximo ${maxAnexos} arquivo(s)`}
            action={
              <Chip
                label={`${anexos.length}/${maxAnexos}`}
                color={anexos.length >= maxAnexos ? 'error' : 'primary'}
                size='small'
              />
            }
          />
          <CardContent className='space-y-4'>
            {anexos.length < maxAnexos && !viewOnly && (
              <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <div className='flex items-center flex-col gap-2 text-center'>
                  <CustomAvatar variant='rounded' skin='light' color='secondary'>
                    <i className='tabler-paperclip' />
                  </CustomAvatar>
                  <Typography variant='body1'>Arraste os arquivos aqui</Typography>
                  <Typography variant='caption' color='text.disabled'>
                    ou clique para selecionar
                  </Typography>
                  <ButtonGroup variant='tonal' size='small'>
                    <Button>Adicionar Arquivos</Button>
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
                </div>
              </div>
            )}

            {uploading && (
              <Alert severity='info' icon={false}>
                <LinearProgress className='mb-2' />
                <Typography variant='body2'>A enviar e processar arquivos...</Typography>
              </Alert>
            )}

            {anexos.length > 0 && (
              <List className='p-0 space-y-2'>
                {anexos.map((anexo, index) => (
                  <ListItem key={index} className='pis-4 plb-3 border rounded'>
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                      {/* Usar OptimizedImage para thumbnails */}
                      {isImage(anexo) ? (
                        <div className='cursor-pointer flex-shrink-0' onClick={() => handlePreview(anexo)}>
                          <OptimizedImage
                            src={anexo.url}
                            alt={anexo.nome_original}
                            variants={anexo.variants}
                            size='thumbnail'
                            width={60}
                            height={60}
                            className='w-[60px] h-[60px] object-cover rounded'
                          />
                        </div>
                      ) : (
                        <CustomAvatar variant='rounded' skin='light' size={60}>
                          <i className={`${getFileIcon(anexo)} text-2xl`} />
                        </CustomAvatar>
                      )}

                      <div className='flex-1 min-w-0'>
                        <Typography className='font-medium truncate' color='text.primary'>
                          {anexo.nome_original}
                        </Typography>
                        <div className='flex items-center gap-2 flex-wrap'>
                          <Typography variant='caption' color='text.secondary'>
                            {(anexo.tamanho_bytes / 1024 / 1024).toFixed(2)} MB
                          </Typography>
                          <Chip label={anexo.tipo.toUpperCase()} size='small' variant='tonal' />
                          {anexo.isExternal && (
                            <Chip
                              label='URL Externa'
                              size='small'
                              color='info'
                              variant='tonal'
                              icon={<i className='tabler-link' />}
                            />
                          )}
                          {anexo.tipo_anexo && (
                            <Chip label={anexo.tipo_anexo} size='small' color='primary' variant='tonal' />
                          )}
                          {anexo.variants && <Chip label='✓ Otimizado' size='small' color='success' variant='tonal' />}
                        </div>
                        {anexo.legenda && (
                          <Typography variant='caption' color='text.disabled'>
                            {anexo.legenda}
                          </Typography>
                        )}
                      </div>

                      <div className='flex gap-1'>
                        {/* Botão Preview */}
                        {(isImage(anexo) || isVideo(anexo) || isAudio(anexo)) && (
                          <IconButton size='small' onClick={() => handlePreview(anexo)} color='primary'>
                            <i className='tabler-eye text-xl' />
                          </IconButton>
                        )}

                        {/* Botão Download - sempre usar original */}
                        <IconButton
                          size='small'
                          component='a'
                          href={anexo.variants?.original || anexo.url}
                          download={anexo.nome_original}
                          target='_blank'
                        >
                          <i className='tabler-download text-xl' />
                        </IconButton>

                        {/* Botão Remover */}
                        {!viewOnly && (
                          <IconButton size='small' onClick={() => handleRemove(index)} color='error'>
                            <i className='tabler-trash text-xl' />
                          </IconButton>
                        )}
                      </div>
                    </div>
                  </ListItem>
                ))}
              </List>
            )}

            {anexos.length === 0 && !uploading && <Alert severity='info'>Nenhum anexo adicionado</Alert>}
          </CardContent>
        </Card>
      </Dropzone>

      {/* Dialog de Preview com OptimizedImage */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth='lg' fullWidth>
        <DialogContent className='p-0'>
          {previewAnexo && (
            <>
              {isImage(previewAnexo) && (
                <OptimizedImage
                  src={previewAnexo.url}
                  alt={previewAnexo.nome_original}
                  variants={previewAnexo.variants}
                  size='large'
                  className='w-full h-auto'
                  priority
                />
              )}

              {isVideo(previewAnexo) && (
                <video controls className='w-full'>
                  <source src={previewAnexo.url} type={previewAnexo.mime_type} />
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              )}

              {isAudio(previewAnexo) && (
                <div className='p-8 text-center'>
                  <CustomAvatar variant='rounded' size={80} className='mx-auto mb-4'>
                    <i className='tabler-music text-4xl' />
                  </CustomAvatar>
                  <Typography variant='h6' className='mb-4'>
                    {previewAnexo.nome_original}
                  </Typography>
                  <audio controls className='w-full'>
                    <source src={previewAnexo.url} type={previewAnexo.mime_type} />
                    Seu navegador não suporta o elemento de áudio.
                  </audio>
                </div>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Fechar</Button>
          {previewAnexo && (
            <Button
              component='a'
              href={previewAnexo.variants?.original || previewAnexo.url}
              download={previewAnexo.nome_original}
              target='_blank'
              startIcon={<i className='tabler-download' />}
            >
              Download Original
            </Button>
          )}
        </DialogActions>
      </Dialog>

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
        <DialogTitle>Adicionar Anexo por URL Externa</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='URL do arquivo'
            type='url'
            fullWidth
            variant='outlined'
            value={externalUrl}
            onChange={e => setExternalUrl(e.target.value)}
            error={!!urlError}
            helperText={urlError || 'Cole a URL completa do arquivo (imagem, vídeo, PDF, etc.)'}
            placeholder='https://example.com/image.jpg'
          />
          <Alert severity='info' className='mt-4'>
            URLs externas não serão processadas ou otimizadas. Certifique-se de que o arquivo está acessível
            publicamente.
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
    </>
  )
}

export default ConteudoAnexos
