'use client'

import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import ButtonGroup from '@mui/material/ButtonGroup'
import { styled } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import { useDropzone } from 'react-dropzone'
import CustomAvatar from '@core/components/mui/Avatar'
import AppReactDropzone from '@/libs/styles/AppReactDropzone'
import { formacoesAPI } from '@/libs/api/formacoes'
import { useUploadMultiple, useDeleteUpload, useExternalFile } from '@/libs/api/uploads'

const Dropzone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
  '& .dropzone': {
    minHeight: 'unset',
    padding: theme.spacing(8),
    [theme.breakpoints.down('sm')]: {
      paddingInline: theme.spacing(5)
    }
  }
}))

interface AnexoLocal {
  id?: number
  bloco_anexo_id?: number
  nome: string
  nome_original: string
  url: string
  tipo: string
  tamanho_bytes: number
  uploaded: boolean
  isExternal?: boolean
}

interface GerirAnexosDialogProps {
  open: boolean
  onClose: () => void
  blocoId: number
  blocoTitulo: string
  onSuccess?: () => void
}

const MAX_ANEXOS = 10

const GerirAnexosDialog = ({ open, onClose, blocoId, blocoTitulo, onSuccess }: GerirAnexosDialogProps) => {
  const apiBase = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9833'
  const [anexos, setAnexos] = useState<AnexoLocal[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [urlDialogOpen, setUrlDialogOpen] = useState(false)
  const [externalUrl, setExternalUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewAnexo, setPreviewAnexo] = useState<AnexoLocal | null>(null)

  const uploadMutation = useUploadMultiple()
  const deleteMutation = useDeleteUpload()
  const registerMutation = useExternalFile()

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles: File[]) => {
      if (anexos.length + acceptedFiles.length > MAX_ANEXOS) {
        alert(`Máximo de ${MAX_ANEXOS} anexos permitidos`)
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
          uploaded: true
        }))

        // Adicionar anexos ao bloco via API
        for (const anexo of novosAnexos) {
          await formacoesAPI.adicionarAnexoBloco(blocoId, {
            upload_id: anexo.id!,
            nome: anexo.nome_original
          })
        }

        await fetchAnexos()
        onSuccess?.()
      } catch (error) {
        console.error('Erro ao fazer upload:', error)
      } finally {
        setUploading(false)
      }
    },
    disabled: anexos.length >= MAX_ANEXOS,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.mpeg'],
      'audio/*': ['.mp3', '.wav'],
      'application/pdf': ['.pdf']
    },
    multiple: true,
    maxSize: 10485760
  })

  const fetchAnexos = async () => {
    try {
      setLoading(true)
      const data = await formacoesAPI.listarAnexosBloco(blocoId)

      const anexosCarregados: AnexoLocal[] = data.map(a => ({
        bloco_anexo_id: a.id,
        id: a.upload_id,
        nome: a.nome,
        nome_original: a.nome_original || a.nome,
        url: a.url,
        tipo: a.tipo || 'file',
        tamanho_bytes: a.tamanho_bytes || 0,
        uploaded: true,
        isExternal: (a.url.startsWith('http://') || a.url.startsWith('https://')) && !a.url.includes(apiBase)
      }))

      setAnexos(anexosCarregados)
    } catch (err) {
      console.error('Erro ao carregar anexos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && blocoId) {
      fetchAnexos()
    }
  }, [open, blocoId])

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

    if (anexos.length >= MAX_ANEXOS) {
      setUrlError(`Máximo de ${MAX_ANEXOS} anexos permitidos`)
      return
    }

    try {
      const urlPath = externalUrl.split('?')[0]
      const extension = urlPath.split('.').pop()?.toLowerCase() || 'url'

      let tipo = extension

      if (['mp4', 'mpeg', 'avi', 'mov'].includes(extension)) {
        tipo = 'video'
      } else if (['mp3', 'wav', 'ogg'].includes(extension)) {
        tipo = 'audio'
      }

      const registerData = { url: externalUrl, tipo: tipo }
      const result = await registerMutation.mutateAsync(registerData)

      // Adicionar anexo externo ao bloco
      await formacoesAPI.adicionarAnexoBloco(blocoId, {
        upload_id: result.id,
        nome: result.nome_original
      })

      await fetchAnexos()
      onSuccess?.()

      setUrlDialogOpen(false)
      setExternalUrl('')
      setUrlError('')
    } catch (error) {
      console.error('Erro ao adicionar URL externa:', error)
      setUrlError('Erro ao adicionar URL')
    }
  }

  const handleRemove = async (anexo: AnexoLocal) => {
    if (!anexo.bloco_anexo_id) return

    try {
      await formacoesAPI.removerAnexoBloco(blocoId, anexo.bloco_anexo_id)
      await fetchAnexos()
      onSuccess?.()
    } catch (error) {
      console.error('Erro ao remover anexo:', error)
    }
  }

  const handlePreview = (anexo: AnexoLocal) => {
    setPreviewAnexo(anexo)
    setPreviewOpen(true)
  }

  const getFileIcon = (anexo: AnexoLocal) => {
    const tipo = anexo.tipo || ''

    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'image'].includes(tipo)) {
      return 'tabler-photo'
    }
    if (['mp4', 'mpeg', 'video'].includes(tipo)) {
      return 'tabler-video'
    }
    if (['mp3', 'wav', 'audio'].includes(tipo)) {
      return 'tabler-music'
    }
    if (tipo === 'pdf') {
      return 'tabler-file-text'
    }

    return 'tabler-file'
  }

  const isImage = (anexo: AnexoLocal) => {
    const tipo = anexo.tipo || ''

    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'image'].includes(tipo)
  }

  const isVideo = (anexo: AnexoLocal) => {
    const tipo = anexo.tipo || ''

    return ['mp4', 'mpeg', 'video'].includes(tipo)
  }

  const isAudio = (anexo: AnexoLocal) => {
    const tipo = anexo.tipo || ''

    return ['mp3', 'wav', 'audio'].includes(tipo)
  }

  const handleClose = () => {
    setAnexos([])
    onClose()
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
        <DialogTitle>
          Gerir Anexos - {blocoTitulo}
          <Typography variant='caption' display='block' color='text.secondary'>
            {anexos.length}/{MAX_ANEXOS} anexos
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Dropzone>
            <div className='space-y-4'>
              {anexos.length < MAX_ANEXOS && (
                <div {...getRootProps({ className: 'dropzone' })}>
                  <input {...getInputProps()} />
                  <div className='flex items-center flex-col gap-2 text-center'>
                    <CustomAvatar variant='rounded' skin='light' color='secondary'>
                      <i className='tabler-paperclip' />
                    </CustomAvatar>
                    <Typography variant='body1'>Arraste ficheiros aqui</Typography>
                    <Typography variant='caption' color='text.disabled'>
                      ou clique para selecionar
                    </Typography>
                    <ButtonGroup variant='tonal' size='small'>
                      <Button>Adicionar Ficheiros</Button>
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
                  <Typography variant='body2'>A fazer upload...</Typography>
                </Alert>
              )}

              {loading && <LinearProgress />}

              {anexos.length > 0 && (
                <List className='p-0 space-y-2'>
                  {anexos.map((anexo, index) => (
                    <ListItem key={index} className='pis-4 plb-3 border rounded'>
                      <div className='flex items-center gap-3 flex-1 min-w-0'>
                        {isImage(anexo) ? (
                          <div className='cursor-pointer flex-shrink-0' onClick={() => handlePreview(anexo)}>
                            <img
                              src={anexo.url}
                              alt={anexo.nome_original}
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
                          </div>
                        </div>

                        <div className='flex gap-1'>
                          {(isImage(anexo) || isVideo(anexo) || isAudio(anexo)) && (
                            <IconButton size='small' onClick={() => handlePreview(anexo)}>
                              <i className='tabler-eye text-[22px] text-textSecondary' />
                            </IconButton>
                          )}

                          <IconButton
                            size='small'
                            component='a'
                            href={anexo.url}
                            download={anexo.nome_original}
                            target='_blank'
                          >
                            <i className='tabler-download text-[22px] text-textSecondary' />
                          </IconButton>

                          <IconButton size='small' onClick={() => handleRemove(anexo)}>
                            <i className='tabler-trash text-[22px] text-textSecondary' />
                          </IconButton>
                        </div>
                      </div>
                    </ListItem>
                  ))}
                </List>
              )}

              {anexos.length === 0 && !uploading && !loading && (
                <Alert severity='info'>Nenhum anexo adicionado ainda</Alert>
              )}
            </div>
          </Dropzone>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Preview */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth='lg' fullWidth>
        <DialogContent className='p-0'>
          {previewAnexo && (
            <>
              {isImage(previewAnexo) && (
                <img src={previewAnexo.url} alt={previewAnexo.nome_original} className='w-full h-auto' />
              )}

              {isVideo(previewAnexo) && (
                <video controls className='w-full'>
                  <source src={previewAnexo.url} />
                  O seu navegador não suporta vídeos
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
                    <source src={previewAnexo.url} />
                    O seu navegador não suporta áudio
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
              href={previewAnexo.url}
              download={previewAnexo.nome_original}
              target='_blank'
              startIcon={<i className='tabler-download' />}
            >
              Download
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
        <DialogTitle>Adicionar URL Externa</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='URL do Ficheiro'
            type='url'
            fullWidth
            variant='outlined'
            value={externalUrl}
            onChange={e => setExternalUrl(e.target.value)}
            error={!!urlError}
            helperText={urlError || 'Exemplo: https://example.com/image.jpg'}
            placeholder='https://example.com/image.jpg'
          />
          <Alert severity='info' className='mt-4'>
            Ficheiros externos não são otimizados automaticamente
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

export default GerirAnexosDialog
