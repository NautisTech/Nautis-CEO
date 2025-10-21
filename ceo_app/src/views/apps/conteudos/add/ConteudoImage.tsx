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
}

const ConteudoImage = ({ id, viewOnly }: Props) => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [variants, setVariants] = useState<ImageVariants | null>(null) // Adicionar
  const [uploading, setUploading] = useState(false)

  const { setValue, watch } = useFormContext()

  const { data: conteudo } = useConteudo(id || 0, !!id)
  const uploadMutation = useUploadSingle()

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
      // TODO: Se tiver variants no conteudo, carregar aqui também
    }
  }, [conteudo, file])

  const handleRemove = () => {
    setFile(null)
    setPreview(null)
    setVariants(null) // Limpar variants
    setValue('imagemDestaque', null)
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
  }

  return (
    <Dropzone>
      <Card>
        <CardHeader
          title='Imagem de Destaque'
          subheader='Imagem principal do conteúdo (otimizada automaticamente)'
        />
        <CardContent>
          {preview ? (
            <div className='space-y-4'>
              <div className='relative rounded overflow-hidden'>
                {/* Usar OptimizedImage */}
                <OptimizedImage
                  src={preview}
                  alt='Preview da imagem de destaque'
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
                      <Typography color='white'>A processar e otimizar...</Typography>
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
                            ✓ 5 versões otimizadas criadas
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

              {!viewOnly && !uploading && (
                <Button
                  fullWidth
                  variant='tonal'
                  color='secondary'
                  onClick={handleRemove}
                >
                  Alterar Imagem
                </Button>
              )}
            </div>
          ) : (
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <div className='flex items-center flex-col gap-2 text-center'>
                <CustomAvatar variant='rounded' skin='light' color='secondary' size={48}>
                  <i className='tabler-upload text-2xl' />
                </CustomAvatar>
                <Typography variant='h5'>Arraste a imagem aqui</Typography>
                <Typography color='text.disabled'>ou clique para selecionar</Typography>
                <Button variant='tonal' size='small' className='mbs-2'>
                  Procurar Imagem
                </Button>
                <Typography variant='caption' color='text.disabled' className='mbs-2'>
                  JPG, PNG, GIF, WEBP (máx. 10MB)
                </Typography>
                <Typography variant='caption' color='primary' className='mbs-1'>
                  A imagem será automaticamente otimizada em 5 tamanhos
                </Typography>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Dropzone>
  )
}

export default ConteudoImage