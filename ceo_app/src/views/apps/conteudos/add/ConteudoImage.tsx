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
import { styled } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import { useDropzone } from 'react-dropzone'
import { useFormContext } from 'react-hook-form'
import { useConteudo } from '@/libs/api/conteudos'

import Link from '@components/Link'
import CustomAvatar from '@core/components/mui/Avatar'
import AppReactDropzone from '@/libs/styles/AppReactDropzone'

type FileProp = {
  name: string
  type: string
  size: number
}

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
  const [files, setFiles] = useState<File[]>([])
  const { setValue } = useFormContext()
  const { data: conteudo } = useConteudo(id || 0, !!id)

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
      setValue('imagemDestaque', acceptedFiles[0])
    },
    disabled: viewOnly,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: false
  })

  useEffect(() => {
    if (conteudo?.imagem_destaque && id) {
      // Carregar imagem existente se necessário
    }
  }, [conteudo, id])

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <i className='tabler-file-description' />
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    setFiles([...filtered])
    setValue('imagemDestaque', null)
  }

  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name} className='pis-4 plb-3'>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name font-medium' color='text.primary'>
            {file.name}
          </Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      {!viewOnly && (
        <IconButton onClick={() => handleRemoveFile(file)}>
          <i className='tabler-x text-xl' />
        </IconButton>
      )}
    </ListItem>
  ))

  return (
    <Dropzone>
      <Card>
        <CardHeader
          title='Imagem de Destaque'
          action={
            !viewOnly && (
              <Typography component={Link} color='primary.main' className='font-medium'>
                Adicionar de URL
              </Typography>
            )
          }
        />
        <CardContent>
          {conteudo?.imagem_destaque && !files.length && (
            <div className='mbe-4'>
              <img
                src={conteudo.imagem_destaque}
                alt='Imagem atual'
                className='max-w-full h-auto rounded'
              />
            </div>
          )}

          {!viewOnly && (
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <div className='flex items-center flex-col gap-2 text-center'>
                <CustomAvatar variant='rounded' skin='light' color='secondary'>
                  <i className='tabler-upload' />
                </CustomAvatar>
                <Typography variant='h4'>Arraste e solte a imagem aqui</Typography>
                <Typography color='text.disabled'>ou</Typography>
                <Button variant='tonal' size='small'>
                  Procurar Imagem
                </Button>
              </div>
            </div>
          )}

          {files.length > 0 && (
            <>
              <List>{fileList}</List>
              {!viewOnly && (
                <div className='buttons'>
                  <Button color='error' variant='tonal' onClick={() => setFiles([])}>
                    Remover
                  </Button>
                  <Button variant='contained'>Upload</Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Dropzone>
  )
}

export default ConteudoImage