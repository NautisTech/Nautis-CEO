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
import { styled } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import { useDropzone } from 'react-dropzone'
import { useFormContext } from 'react-hook-form'

import { useConteudo, useTipoConteudo } from '@/libs/api/conteudos'
import { useUploadMultiple, useDeleteUpload } from '@/libs/api/uploads'
import type { UploadResponse } from '@/libs/api/uploads'
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
}

const ConteudoAnexos = ({ id, viewOnly }: Props) => {
    const [anexos, setAnexos] = useState<AnexoLocal[]>([])
    const [uploading, setUploading] = useState(false)
    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewAnexo, setPreviewAnexo] = useState<AnexoLocal | null>(null)

    const { setValue, watch } = useFormContext()
    const tipoConteudoId = watch('tipoConteudoId')

    const { data: conteudo, isLoading: loadingConteudo } = useConteudo(id || 0, !!id)
    const { data: tipoConteudo } = useTipoConteudo(tipoConteudoId)
    const uploadMutation = useUploadMultiple()
    const deleteMutation = useDeleteUpload()

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
                    uploaded: true
                }))

                setAnexos(prev => [...prev, ...novosAnexos])

                const anexosIds = [...anexos, ...novosAnexos]
                    .filter(a => a.id)
                    .map(a => a.id!)
                setValue('anexosIds', anexosIds)

            } catch (error) {
                console.error('Erro no upload:', error)
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

    // 🔥 Carregar anexos existentes
    useEffect(() => {
        if (conteudo?.anexos && id && !loadingConteudo) {
            console.log('Anexos carregados:', conteudo.anexos)

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
                ordem: a.ordem
            }))

            setAnexos(anexosExistentes)

            const anexosIds = anexosExistentes.filter(a => a.id).map(a => a.id!)
            setValue('anexosIds', anexosIds)
        }
    }, [conteudo, id, loadingConteudo, setValue])

    const handleRemove = async (index: number) => {
        const anexo = anexos[index]

        if (anexo.id) {
            try {
                await deleteMutation.mutateAsync(anexo.id)
            } catch (error) {
                console.error('Erro ao deletar:', error)
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
                                    <Button variant='tonal' size='small'>
                                        Adicionar Arquivos
                                    </Button>
                                </div>
                            </div>
                        )}

                        {uploading && (
                            <Alert severity='info' icon={false}>
                                <LinearProgress className='mb-2' />
                                <Typography variant='body2'>A enviar arquivos...</Typography>
                            </Alert>
                        )}

                        {anexos.length > 0 && (
                            <List className='p-0 space-y-2'>
                                {anexos.map((anexo, index) => (
                                    <ListItem
                                        key={index}
                                        className='pis-4 plb-3 border rounded'
                                    >
                                        <div className='flex items-center gap-3 flex-1 min-w-0'>
                                            {isImage(anexo) ? (
                                                <div
                                                    className='cursor-pointer'
                                                    onClick={() => handlePreview(anexo)}
                                                >
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
                                                <Typography
                                                    className='font-medium truncate'
                                                    color='text.primary'
                                                >
                                                    {anexo.nome_original}
                                                </Typography>
                                                <div className='flex items-center gap-2 flex-wrap'>
                                                    <Typography variant='caption' color='text.secondary'>
                                                        {(anexo.tamanho_bytes / 1024 / 1024).toFixed(2)} MB
                                                    </Typography>
                                                    <Chip
                                                        label={anexo.tipo.toUpperCase()}
                                                        size='small'
                                                        variant='tonal'
                                                    />
                                                    {anexo.tipo_anexo && (
                                                        <Chip
                                                            label={anexo.tipo_anexo}
                                                            size='small'
                                                            color='primary'
                                                            variant='tonal'
                                                        />
                                                    )}
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
                                                    <IconButton
                                                        size='small'
                                                        onClick={() => handlePreview(anexo)}
                                                        color='primary'
                                                    >
                                                        <i className='tabler-eye text-xl' />
                                                    </IconButton>
                                                )}

                                                {/* Botão Download */}
                                                <IconButton
                                                    size='small'
                                                    component='a'
                                                    href={anexo.url}
                                                    download={anexo.nome_original}
                                                    target='_blank'
                                                >
                                                    <i className='tabler-download text-xl' />
                                                </IconButton>

                                                {/* Botão Remover */}
                                                {!viewOnly && (
                                                    <IconButton
                                                        size='small'
                                                        onClick={() => handleRemove(index)}
                                                        color='error'
                                                    >
                                                        <i className='tabler-trash text-xl' />
                                                    </IconButton>
                                                )}
                                            </div>
                                        </div>
                                    </ListItem>
                                ))}
                            </List>
                        )}

                        {anexos.length === 0 && !uploading && (
                            <Alert severity='info'>
                                Nenhum anexo adicionado
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </Dropzone>

            {/* 🔥 Dialog de Preview */}
            <Dialog
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                maxWidth='md'
                fullWidth
            >
                <DialogContent className='p-0'>
                    {previewAnexo && (
                        <>
                            {isImage(previewAnexo) && (
                                <img
                                    src={previewAnexo.url}
                                    alt={previewAnexo.nome_original}
                                    className='w-full h-auto'
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
                    <Button onClick={() => setPreviewOpen(false)}>
                        Fechar
                    </Button>
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
        </>
    )
}

export default ConteudoAnexos