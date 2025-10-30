'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { formacoesAPI } from '@/libs/api/formacoes'
import type { Bloco, BlocoAnexo } from '@/libs/api/formacoes'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './swiper-custom.css'

interface BlocoComAnexos extends Bloco {
  anexos: BlocoAnexo[]
}

interface AulaDetailsProps {
  formacaoId: number
  aulaId: number
}

const AulaDetails = ({ formacaoId, aulaId }: AulaDetailsProps) => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const [blocos, setBlocos] = useState<BlocoComAnexos[]>([])
  const [loading, setLoading] = useState(true)
  const [concluida, setConcluida] = useState(false)
  const [marcandoConcluida, setMarcandoConcluida] = useState(false)
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  useEffect(() => {
    loadAula()
  }, [aulaId])

  const loadAula = async () => {
    try {
      setLoading(true)

      // Carregar blocos da aula e progresso
      const [blocosData, progressoData] = await Promise.all([
        formacoesAPI.listarBlocos(aulaId),
        formacoesAPI.obterProgressoFormacao(formacaoId)
      ])

      // Carregar anexos de cada bloco
      const blocosComAnexos = await Promise.all(
        blocosData.map(async (bloco) => {
          const anexos = await formacoesAPI.listarAnexosBloco(bloco.id)
          return { ...bloco, anexos }
        })
      )

      // Verificar se a aula já está concluída
      const aulaProgresso = progressoData.find(p => p.aula_id === aulaId)
      setConcluida(aulaProgresso?.concluida || false)

      setBlocos(blocosComAnexos)
    } catch (error) {
      console.error('Erro ao carregar aula:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVoltar = () => {
    router.push(getLocalizedUrl(`/apps/t-formacoes/${formacaoId}`, locale as Locale))
  }

  const handleMarcarConcluida = async () => {
    try {
      setMarcandoConcluida(true)
      const novoConcluida = !concluida
      await formacoesAPI.marcarAulaConcluida(aulaId, novoConcluida)
      setConcluida(novoConcluida)
      setMarcandoConcluida(false)

      // Atualizar sidebar sem reload completo
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      console.error('Erro ao marcar aula:', error)
      setMarcandoConcluida(false)
    }
  }

  const handlePdfClick = (url: string) => {
    setPdfUrl(url)
    setPdfDialogOpen(true)
  }

  const isPdfAnexo = (anexo: BlocoAnexo) => {
    const tipo = anexo.tipo?.toLowerCase() || ''
    const url = anexo.url?.toLowerCase() || ''
    return tipo.includes('pdf') || url.endsWith('.pdf')
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo?.toLowerCase()) {
      case 'video':
        return 'tabler-video'
      case 'texto':
        return 'tabler-file-text'
      case 'pdf':
        return 'tabler-file-type-pdf'
      case 'imagem':
        return 'tabler-photo'
      default:
        return 'tabler-file'
    }
  }

  const getTipoColor = (tipo: string): 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' => {
    switch (tipo?.toLowerCase()) {
      case 'video':
        return 'error'
      case 'texto':
        return 'info'
      case 'pdf':
        return 'warning'
      case 'imagem':
        return 'success'
      default:
        return 'secondary'
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    const mb = bytes / (1024 * 1024)
    return mb < 1 ? `${(bytes / 1024).toFixed(2)} KB` : `${mb.toFixed(2)} MB`
  }

  const isMediaAnexo = (anexo: BlocoAnexo) => {
    const tipo = anexo.tipo?.toLowerCase() || ''
    const url = anexo.url?.toLowerCase() || ''

    // Verificar tipo ou extensão do ficheiro
    return tipo.includes('video') ||
           tipo.includes('imagem') ||
           tipo.includes('image') ||
           url.endsWith('.jpg') ||
           url.endsWith('.jpeg') ||
           url.endsWith('.png') ||
           url.endsWith('.gif') ||
           url.endsWith('.webp') ||
           url.endsWith('.mp4') ||
           url.endsWith('.webm') ||
           url.endsWith('.mov')
  }

  const isVideoAnexo = (anexo: BlocoAnexo) => {
    const tipo = anexo.tipo?.toLowerCase() || ''
    const url = anexo.url?.toLowerCase() || ''

    return tipo.includes('video') ||
           url.endsWith('.mp4') ||
           url.endsWith('.webm') ||
           url.endsWith('.mov')
  }

  if (loading) {
    return (
      <Card className='flex items-center justify-center p-10'>
        <CircularProgress />
      </Card>
    )
  }

  // Juntar todos os anexos de mídia de todos os blocos para o carousel
  const todosMediaAnexos = blocos.flatMap(bloco =>
    bloco.anexos.filter(isMediaAnexo)
  )

  return (
    <Card>
      <CardContent className='flex flex-wrap items-center justify-between gap-4'>
        <IconButton onClick={handleVoltar}>
          <i className='tabler-arrow-left' />
        </IconButton>
      </CardContent>
      <CardContent>
        <div className='border rounded'>
          {/* CAROUSEL DE MÍDIA NO TOPO - IGUAL À CAPA DA FORMAÇÃO */}
          {todosMediaAnexos.length > 0 && (
            <div className='mli-2 mbs-2 overflow-hidden rounded'>
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={10}
                slidesPerView={1}
                className='is-full'
              >
                {todosMediaAnexos.map((anexo) => (
                  <SwiperSlide key={anexo.id}>
                    {isVideoAnexo(anexo) ? (
                      <video
                        src={anexo.url}
                        controls
                        controlsList='nodownload'
                        onContextMenu={(e) => e.preventDefault()}
                        className='is-full bs-auto object-cover max-bs-[440px]'
                      >
                        O teu navegador não suporta vídeos.
                      </video>
                    ) : (
                      <img
                        src={anexo.url}
                        alt={anexo.nome || anexo.nome_original}
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                        className='is-full bs-auto object-cover max-bs-[440px]'
                      />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          {/* CONTEÚDO DOS BLOCOS */}
          <div className='flex flex-col gap-6 p-5'>
            {blocos.length === 0 ? (
              <div className='text-center py-10'>
                <Typography variant='h6' color='text.secondary'>
                  Esta aula ainda não tem conteúdo
                </Typography>
              </div>
            ) : (
              <>
                {blocos.map((bloco, index) => {
                  const outrosAnexos = bloco.anexos.filter(anexo => !isMediaAnexo(anexo))
                  const pdfAnexos = outrosAnexos.filter(isPdfAnexo)
                  const restanteAnexos = outrosAnexos.filter(anexo => !isPdfAnexo(anexo))

                  return (
                    <div key={bloco.id}>
                      {index > 0 && <Divider />}
                      <div className='flex flex-col gap-4'>
                        <div className='flex items-center gap-2'>
                          <Typography variant='h5'>{bloco.titulo}</Typography>
                          <Chip
                            icon={<i className={getTipoIcon(bloco.tipo)} />}
                            label={bloco.tipo}
                            size='small'
                            color={getTipoColor(bloco.tipo)}
                            variant='tonal'
                          />
                        </div>

                        {bloco.conteudo && (
                          <Typography>{bloco.conteudo}</Typography>
                        )}

                        {pdfAnexos.length > 0 && (
                          <>
                            <Divider />
                            <div className='flex flex-col gap-4'>
                              <Typography variant='h5'>Documentos PDF</Typography>
                              <div className='flex flex-col gap-3'>
                                {pdfAnexos.map((anexo) => (
                                  <div
                                    key={anexo.id}
                                    className='border rounded p-4 flex items-center gap-4 cursor-pointer hover:bg-actionHover transition-colors'
                                    onClick={() => handlePdfClick(anexo.url)}
                                  >
                                    <div className='flex items-center justify-center w-12 h-12 rounded bg-warning text-white'>
                                      <i className='tabler-file-type-pdf text-2xl' />
                                    </div>
                                    <div className='flex-1'>
                                      <Typography className='font-medium'>
                                        {anexo.nome || anexo.nome_original}
                                      </Typography>
                                      {anexo.tamanho_bytes && (
                                        <Typography variant='caption' color='text.secondary'>
                                          PDF • {formatFileSize(anexo.tamanho_bytes)}
                                        </Typography>
                                      )}
                                    </div>
                                    <i className='tabler-eye text-textSecondary text-xl' />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}

                        {restanteAnexos.length > 0 && (
                          <>
                            <Divider />
                            <div className='flex flex-col gap-4'>
                              <Typography variant='h5'>Outros Anexos</Typography>
                              <div className='flex flex-wrap gap-x-12 gap-y-2'>
                                <List role='list' component='div' className='flex flex-col gap-2 plb-0'>
                                  {restanteAnexos.map((anexo) => (
                                    <ListItem
                                      key={anexo.id}
                                      role='listitem'
                                      className='flex items-center gap-2 p-0'
                                    >
                                      <i className={`${getTipoIcon(anexo.tipo || 'file')} text-xl text-textSecondary`} />
                                      <Typography>
                                        {anexo.nome || anexo.nome_original}
                                        {(anexo.tipo || anexo.tamanho_bytes) && (
                                          <span className='text-textSecondary text-xs mli-1'>
                                            ({anexo.tipo?.toUpperCase()}
                                            {anexo.tipo && anexo.tamanho_bytes && ' • '}
                                            {formatFileSize(anexo.tamanho_bytes)})
                                          </span>
                                        )}
                                      </Typography>
                                    </ListItem>
                                  ))}
                                </List>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}

                {/* BOTÃO MARCAR COMO CONCLUÍDA */}
                <Divider />
                <div className='flex flex-col gap-4 items-center pbs-2'>
                  {concluida && (
                    <Alert severity='success' icon={<i className='tabler-circle-check' />} className='is-full'>
                      <Typography variant='body1'>Esta aula foi marcada como concluída!</Typography>
                    </Alert>
                  )}
                  <Button
                    fullWidth
                    variant='contained'
                    color={concluida ? 'error' : 'success'}
                    size='large'
                    startIcon={marcandoConcluida ? null : <i className={concluida ? 'tabler-x' : 'tabler-check'} />}
                    onClick={handleMarcarConcluida}
                    disabled={marcandoConcluida}
                  >
                    {marcandoConcluida ? (
                      <CircularProgress size={24} color='inherit' />
                    ) : concluida ? (
                      'Desmarcar Conclusão'
                    ) : (
                      'Marcar como Concluída'
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>

      {/* PDF VIEWER DIALOG */}
      <Dialog
        open={pdfDialogOpen}
        onClose={() => setPdfDialogOpen(false)}
        maxWidth='lg'
        fullWidth
      >
        <DialogTitle className='flex items-center justify-between'>
          <Typography variant='h5'>Visualizar PDF</Typography>
          <IconButton onClick={() => setPdfDialogOpen(false)}>
            <i className='tabler-x' />
          </IconButton>
        </DialogTitle>
        <DialogContent className='p-0'>
          {pdfUrl && (
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className='is-full'
              style={{ height: '80vh', border: 'none' }}
              title='PDF Viewer'
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default AulaDetails
