'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'


// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'

// Third-party Imports
import { signIn } from 'next-auth/react'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { email, object, minLength, string, pipe, nonEmpty } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'
import type { InferInput } from 'valibot'
import classnames from 'classnames'

// Type Imports
import type { SystemMode } from '@core/types'
import type { Locale } from '@/configs/i18n'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { toastService } from '@/libs/notifications/toasterService'
import { getDictionary } from '@/utils/getDictionary'

// Styled Custom Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

const Login = ({ mode, dictionary }: { mode: SystemMode; dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorState, setErrorState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

  // Hooks
  const router = useRouter()
  const { lang: locale } = useParams()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  type FormData = InferInput<typeof schema>

  const schema = object({
    codigoCliente: pipe(
      string(),
      nonEmpty(`${dictionary['common']?.fieldRequired}`),
      minLength(2, `${dictionary['login']?.clientCodeMinLength}`)
    ),
    email: pipe(string(), minLength(1, `${dictionary['common']?.fieldRequired}`), email(`${dictionary['login']?.invalidEmail}`)),
    password: pipe(
      string(),
      nonEmpty(`${dictionary['common']?.fieldRequired}`),
      minLength(5, `${dictionary['login']?.passwordMinLength}`)
    )
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      codigoCliente: '',
      email: '',
      password: ''
    }
  })

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    setErrorState(null)
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        tenant_slug: data.codigoCliente.toLowerCase().trim(),
        redirect: false
      })

      if (result?.error) {
        // Parse do erro retornado pelo NextAuth
        try {
          const errorData = JSON.parse(result.error)
          const errorMessage = errorData.message || `${dictionary['login']?.invalidCredentials}`
          setErrorState(errorMessage)
          toastService.error(errorMessage)
        } catch (error) {
          setErrorState(`${dictionary['login']?.loginError}`)
          toastService.error(`${dictionary['login']?.loginError}`)
        }
      } else if (result?.ok) {
        // Login bem-sucedido
        toastService.success(`${dictionary['login']?.loginSuccess}`)

        // Aguarda um pouco para o toast aparecer antes do redirect
        setTimeout(() => {
          router.push(getLocalizedUrl('/dashboards/home', locale as Locale))
          router.refresh() // Force refresh para atualizar a sessão
        }, 500)
      }
    } catch (err: any) {
      const errorMessage = `${dictionary['common']?.errorOccurred}`
      setErrorState(errorMessage)
      toastService.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <LoginIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && <MaskImg alt='mask' src={authBackground} />}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>{dictionary['login']?.welcome}</Typography>
            <Typography>{dictionary['login']?.subtitle}</Typography>
          </div>

          <form
            noValidate
            autoComplete='off'
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-6'
          >
            <Controller
              name='codigoCliente'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  autoFocus
                  fullWidth
                  label={dictionary['login']?.clientCode}
                  placeholder={dictionary['login']?.clientCodePlaceholder}
                  disabled={isLoading}
                  onChange={e => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  {...(errors.codigoCliente && {
                    error: true,
                    helperText: errors.codigoCliente.message
                  })}
                />
              )}
            />
            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  type='email'
                  label={dictionary['login']?.email}
                  placeholder={dictionary['login']?.emailPlaceholder}
                  disabled={isLoading}
                  onChange={e => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  {...(errors.email && {
                    error: true,
                    helperText: errors.email.message
                  })}
                />
              )}
            />
            <Controller
              name='password'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label={dictionary['login']?.password}
                  placeholder={dictionary['login']?.passwordPlaceholder}
                  id='login-password'
                  type={isPasswordShown ? 'text' : 'password'}
                  disabled={isLoading}
                  onChange={e => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                            disabled={isLoading}
                          >
                            <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                  {...(errors.password && { error: true, helperText: errors.password.message })}
                />
              )}
            />
            <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label={dictionary['login']?.rememberMe}
                disabled={isLoading}
              />
              {/* <Typography
                className='text-end'
                color='primary.main'
                component={Link}
                href={getLocalizedUrl('/forgot-password', locale as Locale)}
              >
                Esqueceu a senha?
              </Typography> */}
            </div>
            <Button
              fullWidth
              variant='contained'
              type='submit'
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} color='inherit' className='mr-2' />
                  {dictionary['login']?.loggingIn}
                </>
              ) : (
                dictionary['login']?.loginButton
              )}
            </Button>
            {/* <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>New on our platform?</Typography>
              <Typography component={Link} href={getLocalizedUrl('/register', locale as Locale)} color='primary.main'>
                Create an account
              </Typography>
            </div> */}
            <Divider className='gap-2'>{dictionary['common']?.or}</Divider>
            <Button
              color='secondary'
              variant='outlined'
              fullWidth
              className='text-textPrimary'
              disabled={isLoading}
              onClick={async () => {
                const tenantName = process.env.NEXT_PUBLIC_TENANT_SLUG || 'nautis'
                router.push(getLocalizedUrl(`/login/portal?tenant=${tenantName}`, locale as Locale))
              }}
            >
              {dictionary['login']?.accessPortal}
            </Button>
            <Button
              color='secondary'
              variant='outlined'
              fullWidth
              className='text-textPrimary'
              disabled={isLoading}
              onClick={async () => {
                const tenantName = process.env.NEXT_PUBLIC_TENANT_SLUG || 'nautis'
                router.push(getLocalizedUrl(`/login/fornecedor?tenant=${tenantName}`, locale as Locale))
              }}
            >
              {dictionary['login']?.accessSupplierPortal}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login