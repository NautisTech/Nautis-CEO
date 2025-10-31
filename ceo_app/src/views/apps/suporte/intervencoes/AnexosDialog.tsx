'use client'

import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'

import { intervencoesAPI } from '@/libs/api/intervencoes'
import type { IntervencaoAnexo } from '@/libs/api/intervencoes/types'
import OptimizedImage from '@/components/OptimizedImage'

interface AnexosDialogProps {
  open: boolean
  onClose: () => void
  intervencaoId: number
  intervencaoNumero: string
}

const AnexosDialog = ({ open, onClose, intervencaoId, intervencaoNumero }: AnexosDialogProps) => {
  const [anexos, setAnexos] = useState<IntervencaoAnexo[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadAnexos()
    }
  }, [open, intervencaoId])

  const loadAnexos = async () => {
    try {
      setLoading(true)
      const data = await intervencoesAPI.getAnexos(intervencaoId)
      console.log('Anexos carregados:', data)
      setAnexos(data)
    } catch (error) {
      console.error('Erro ao carregar anexos:', error)
      setAnexos([])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenInNewTab = (anexo: IntervencaoAnexo) => {
    console.log('handleOpenInNewTab chamado', anexo)
    const url = anexo.variants?.original || anexo.url
    console.log('URL a abrir:', url)
    if (url) {
      window.open(url, '_blank')
    } else {
      console.error('URL não encontrada no anexo:', anexo)
    }
  }

  const isImage = (anexo: IntervencaoAnexo) => {
    return anexo.mime_type?.startsWith('image/') || anexo.tipo === 'imagem'
  }

  const isVideo = (anexo: IntervencaoAnexo) => {
    return anexo.mime_type?.startsWith('video/') || anexo.tipo === 'video'
  }

  const isAudio = (anexo: IntervencaoAnexo) => {
    return anexo.mime_type?.startsWith('audio/') || anexo.tipo === 'audio'
  }

  const getFileIcon = (anexo: IntervencaoAnexo) => {
    if (isImage(anexo)) return 'tabler-photo'
    if (isVideo(anexo)) return 'tabler-video'
    if (isAudio(anexo)) return 'tabler-music'
    if (anexo.mime_type?.includes('pdf')) return 'tabler-file-type-pdf'
    if (anexo.mime_type?.includes('word') || anexo.mime_type?.includes('document')) return 'tabler-file-type-doc'
    if (anexo.mime_type?.includes('excel') || anexo.mime_type?.includes('spreadsheet')) return 'tabler-file-type-xls'
    return 'tabler-file'
  }

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB'
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Anexos da Intervenção {intervencaoNumero}
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : anexos.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Nenhum anexo encontrado para esta intervenção.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {anexos.map((anexo) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={anexo.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* Thumbnail or Icon */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 120,
                            bgcolor: 'action.hover',
                            borderRadius: 1,
                            overflow: 'hidden',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleOpenInNewTab(anexo)}
                        >
                          {isImage(anexo) && anexo.variants?.thumb && anexo.url ? (
                            <OptimizedImage
                              src={anexo.url}
                              alt={anexo.nome_original}
                              variant="thumb"
                              variants={anexo.variants}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <i className={`${getFileIcon(anexo)} text-6xl text-textSecondary`} />
                          )}
                        </Box>

                        {/* File Info */}
                        <Box>
                          <Typography variant="body2" fontWeight="medium" noWrap title={anexo.nome_original}>
                            {anexo.nome_original}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatFileSize(anexo.tamanho_bytes)}
                          </Typography>
                        </Box>

                        {/* Chips */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          <Chip label={anexo.tipo} size="small" variant="tonal" color="primary" />
                          {anexo.url && anexo.url.startsWith('http') && !anexo.url.includes('/uploads/') && (
                            <Chip label="URL Externa" size="small" variant="tonal" color="info" />
                          )}
                          {anexo.variants && (
                            <Chip label="Otimizado" size="small" variant="tonal" color="success" />
                          )}
                        </Box>

                        {/* Actions */}
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <IconButton size="small" onClick={() => handleOpenInNewTab(anexo)} title="Abrir em nova página">
                            <i className="tabler-eye text-xl" />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AnexosDialog
