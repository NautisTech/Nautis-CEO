'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import CircularProgress from '@mui/material/CircularProgress'

// Component Imports
import CustomIconButton from '@core/components/mui/IconButton'

// API Imports
import { socialAPI } from '@/libs/api/social'
import { toastService } from '@/libs/notifications/toasterService'

type ConnectedAccountsType = {
  title: string
  logo: string
  checked: boolean
  subtitle: string
}

type SocialAccountsType = {
  title: string
  logo: string
  provider: string
  username?: string
  isConnected: boolean
  href?: string
}

// Vars
const connectedAccountsArr: ConnectedAccountsType[] = [
  {
    checked: true,
    title: 'Google',
    logo: '/images/logos/google.png',
    subtitle: 'Calendar and Contacts'
  },
  {
    checked: false,
    title: 'Slack',
    logo: '/images/logos/slack.png',
    subtitle: 'Communications'
  },
  {
    checked: true,
    title: 'Github',
    logo: '/images/logos/github.png',
    subtitle: 'Manage your Git repositories'
  },
  {
    checked: true,
    title: 'Mailchimp',
    subtitle: 'Email marketing service',
    logo: '/images/logos/mailchimp.png'
  },
  {
    title: 'Asana',
    checked: false,
    subtitle: 'Task Communication',
    logo: '/images/logos/asana.png'
  }
]

const Connections = () => {
  const [socialAccounts, setSocialAccounts] = useState<SocialAccountsType[]>([
    {
      title: 'Facebook',
      provider: 'facebook',
      isConnected: false,
      logo: '/images/logos/facebook.png'
    },
    {
      title: 'Instagram',
      provider: 'instagram',
      isConnected: false,
      logo: '/images/logos/instagram.png'
    },
    {
      title: 'LinkedIn',
      provider: 'linkedin',
      isConnected: false,
      logo: '/images/logos/linkedin.png'
    }
  ])
  const [loading, setLoading] = useState(true)
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null)

  useEffect(() => {
    fetchConnectedAccounts()
  }, [])

  const fetchConnectedAccounts = async () => {
    try {
      setLoading(true)
      const response = await socialAPI.getConnectedAccounts()

      // Update social accounts with connection status
      setSocialAccounts(prev => prev.map(account => {
        const connectedAccount = response.accounts.find(
          (a: any) => a.platform === account.provider
        )
        return {
          ...account,
          isConnected: connectedAccount?.connected || false,
          username: connectedAccount?.username
        }
      }))
    } catch (error) {
      console.error('Error fetching connected accounts:', error)
      toastService.error('Erro ao carregar contas conectadas')
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (provider: string) => {
    try {
      setConnectingProvider(provider)
      const response = await socialAPI.startOAuthFlow(provider)

      // Open OAuth URL in a new window
      const width = 600
      const height = 700
      const left = window.screen.width / 2 - width / 2
      const top = window.screen.height / 2 - height / 2

      const popup = window.open(
        response.authUrl,
        `${provider}_oauth`,
        `width=${width},height=${height},left=${left},top=${top}`
      )

      // Poll for popup closure or success
      const checkPopup = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkPopup)
          setConnectingProvider(null)
          // Refresh accounts after popup closes
          setTimeout(() => fetchConnectedAccounts(), 1000)
        }
      }, 500)
    } catch (error: any) {
      console.error('Error connecting account:', error)

      // Show more helpful error messages
      const errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido'

      if (errorMessage.includes('Credentials not configured')) {
        toastService.error(
          `Credenciais do ${provider} não configuradas. Configure ${provider.toUpperCase()}_APP_CREDENTIALS nas definições.`
        )
      } else if (errorMessage.includes('redirect_uri')) {
        toastService.error(`Erro: URI de redirecionamento inválido. Verifique as configurações no console de desenvolvedor do ${provider}.`)
      } else if (errorMessage.includes('Invalid Scopes')) {
        toastService.error(`Erro: Permissões inválidas. Verifique as permissões da app ${provider}.`)
      } else {
        toastService.error(`Erro ao conectar com ${provider}: ${errorMessage}`)
      }

      setConnectingProvider(null)
    }
  }

  const handleDisconnect = async (provider: string) => {
    try {
      setConnectingProvider(provider)
      await socialAPI.disconnectAccount({ platform: provider })
      toastService.success(`Conta ${provider} desconectada com sucesso`)
      fetchConnectedAccounts()
    } catch (error) {
      console.error('Error disconnecting account:', error)
      toastService.error(`Erro ao desconectar conta ${provider}`)
    } finally {
      setConnectingProvider(null)
    }
  }


  return (
    <Card>
      <Grid container>
        <Grid size={{ xs: 12, md: 6 }}>
          <CardHeader
            title='Connected Accounts'
            subheader='Display content from your connected accounts on your site'
          />
          <CardContent className='flex flex-col gap-4'>
            {connectedAccountsArr.map((item, index) => (
              <div key={index} className='flex items-center justify-between gap-4'>
                <div className='flex flex-grow items-center gap-4'>
                  <img height={32} width={32} src={item.logo} alt={item.title} />
                  <div className='flex-grow'>
                    <Typography className='text-textPrimary font-medium'>{item.title}</Typography>
                    <Typography variant='body2'>{item.subtitle}</Typography>
                  </div>
                </div>
                <Switch defaultChecked={item.checked} />
              </div>
            ))}
          </CardContent>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CardHeader title='Social Accounts' subheader='Connect your social media accounts to publish content' />
          <CardContent className='flex flex-col gap-4'>
            {loading ? (
              <div className='flex justify-center items-center py-8'>
                <CircularProgress size={24} />
              </div>
            ) : (
              socialAccounts.map((item, index) => (
                <div key={index} className='flex items-center justify-between gap-4'>
                  <div className='flex flex-grow items-center gap-4'>
                    <img height={32} width={32} src={item.logo} alt={item.title} />
                    <div className='flex-grow'>
                      <Typography className='text-textPrimary font-medium'>{item.title}</Typography>
                      {item.isConnected ? (
                        <Typography variant='body2' color='success.main'>
                          {item.username || 'Conectado'}
                        </Typography>
                      ) : (
                        <Typography variant='body2' color='text.secondary'>
                          Não conectado
                        </Typography>
                      )}
                    </div>
                  </div>
                  <CustomIconButton
                    variant='tonal'
                    color={item.isConnected ? 'error' : 'secondary'}
                    onClick={() =>
                      item.isConnected ? handleDisconnect(item.provider) : handleConnect(item.provider)
                    }
                    disabled={connectingProvider === item.provider}
                  >
                    {connectingProvider === item.provider ? (
                      <CircularProgress size={20} />
                    ) : (
                      <i className={item.isConnected ? 'tabler-trash' : 'tabler-link'} />
                    )}
                  </CustomIconButton>
                </div>
              ))
            )}
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default Connections
