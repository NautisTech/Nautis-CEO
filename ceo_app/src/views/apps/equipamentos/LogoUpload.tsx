'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'

// Third-party Imports
import { useDropzone } from 'react-dropzone'

// API Imports
import { uploadsAPI } from '@/libs/api/uploads'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import AppReactDropzone from '@/libs/styles/AppReactDropzone'

const Dropzone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
  '& .dropzone': {
    minHeight: 'unset',
    padding: theme.spacing(6),
    [theme.breakpoints.down('sm')]: {
      paddingInline: theme.spacing(5)
    }
  }
}))

interface LogoUploadProps {
  value: string
  onChange: (url: string) => void
  disabled?: boolean
}

const LogoUpload = ({ value, onChange, disabled = false }: LogoUploadProps) => {
  const [uploading, setUploading] = useState(false)
  const [uploadedFileId, setUploadedFileId] = useState<number | null>(null)

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]

      setUploading(true)
      try {
        const result = await uploadsAPI.uploadSingle(file)
        onChange(result.url)
        setUploadedFileId(result.id)
      } catch (error) {
        console.error('Erro ao fazer upload:', error)
      } finally {
        setUploading(false)
      }
    },
    disabled: disabled || uploading,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']
    },
    multiple: false,
    maxSize: 5242880 // 5MB
  })

  const handleRemove = async () => {
    if (uploadedFileId) {
      try {
        await uploadsAPI.delete(uploadedFileId)
      } catch (error) {
        console.error('Erro ao remover ficheiro:', error)
      }
    }
    onChange('')
    setUploadedFileId(null)
  }

  return (
    <Box>
      {value ? (
        <Box className='flex items-center gap-4 p-4 border rounded'>
          <Avatar
            src={value}
            sx={{ width: 80, height: 80 }}
            variant='rounded'
            className='bg-actionHover object-contain'
          />
          <Box className='flex-1'>
            <Typography variant='body2' color='text.primary' className='font-medium'>
              Logo carregado
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {value}
            </Typography>
          </Box>
          {!disabled && (
            <IconButton size='small' color='error' onClick={handleRemove}>
              <i className='tabler-trash text-xl' />
            </IconButton>
          )}
        </Box>
      ) : (
        <Dropzone>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <div className='flex items-center flex-col gap-2 text-center'>
              {uploading ? (
                <CircularProgress size={40} />
              ) : (
                <>
                  <CustomAvatar variant='rounded' skin='light' color='secondary' size={50}>
                    <i className='tabler-upload' />
                  </CustomAvatar>
                  <Typography variant='body2' color='text.primary'>
                    Arraste uma imagem aqui
                  </Typography>
                  <Typography variant='caption' color='text.disabled'>
                    ou
                  </Typography>
                  <Button variant='tonal' size='small' disabled={disabled}>
                    Selecionar Imagem
                  </Button>
                  <Typography variant='caption' color='text.disabled'>
                    PNG, JPG, GIF, SVG até 5MB
                  </Typography>
                </>
              )}
            </div>
          </div>
        </Dropzone>
      )}
    </Box>
  )
}

export default LogoUpload
