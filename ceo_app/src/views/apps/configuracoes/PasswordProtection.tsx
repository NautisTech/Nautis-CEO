'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

interface PasswordProtectionProps {
  onSuccess: () => void
}

const PasswordProtection = ({ onSuccess }: PasswordProtectionProps) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Senha: admin@ceo
    if (password === 'admin@ceo') {
      setError(false)
      onSuccess()
    } else {
      setError(true)
      setPassword('')
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%' }}>
        <CardContent>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <i className='tabler-lock text-[64px] text-primary mb-4' />
            <Typography variant='h4' sx={{ mb: 2 }}>
              Área Protegida
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Esta página contém configurações sensíveis do sistema.
              <br />
              Por favor, insira a senha de administrador para continuar.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label='Senha de Administrador'
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
              helperText={error ? 'Senha incorreta. Tente novamente.' : ''}
              autoFocus
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <i className={showPassword ? 'tabler-eye-off' : 'tabler-eye'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {error && (
              <Alert severity='error' sx={{ mb: 3 }}>
                Senha incorreta. Verifique e tente novamente.
              </Alert>
            )}

            <Button
              fullWidth
              variant='contained'
              type='submit'
              size='large'
              startIcon={<i className='tabler-lock-open' />}
            >
              Desbloquear
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default PasswordProtection
