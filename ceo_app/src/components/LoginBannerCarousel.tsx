'use client'

import { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'

// Types
interface Banner {
  id: number
  titulo: string
  imagem_destaque: string
}

// Styled Components
const CarouselContainer = styled('div')({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden'
})

const BannerImage = styled('img')<{ active: boolean }>(({ active }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  opacity: active ? 1 : 0,
  transition: 'opacity 1s ease-in-out',
  zIndex: active ? 1 : 0
}))

const Overlay = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.3) 100%)',
  zIndex: 2,
  pointerEvents: 'none'
})

const LoadingContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  backgroundColor: 'var(--mui-palette-background-default)'
})

const DotsContainer = styled('div')({
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '8px',
  zIndex: 3
})

const Dot = styled('button')<{ active: boolean }>(({ active }) => ({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: active ? 'var(--mui-palette-primary-main)' : 'rgba(255, 255, 255, 0.5)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: active ? 'var(--mui-palette-primary-main)' : 'rgba(255, 255, 255, 0.8)'
  }
}))

const LoginBannerCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchBanners = async () => {
      const tenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG

      // Se não houver slug configurado, não carregar banners
      if (!tenantSlug) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Buscar banners de login através do endpoint público usando o slug
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conteudos/public/login-banners/${tenantSlug}`)

        if (!response.ok) {
          throw new Error('Erro ao carregar banners')
        }

        const result = await response.json()
        setBanners(result.data || [])
      } catch (error) {
        console.error('Erro ao carregar banners:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  // Auto-avançar banners
  useEffect(() => {
    if (banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % banners.length)
    }, 5000) // Trocar a cada 5 segundos

    return () => clearInterval(interval)
  }, [banners.length])

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    )
  }

  if (banners.length === 0) {
    return (
      <LoadingContainer>
        <div style={{ textAlign: 'center', color: 'var(--mui-palette-text-secondary)' }}>
          Nenhum banner disponível
        </div>
      </LoadingContainer>
    )
  }

  return (
    <CarouselContainer>
      {banners.map((banner, index) => (
        <BannerImage
          key={banner.id}
          src={banner.imagem_destaque!}
          alt={banner.titulo}
          active={index === currentIndex}
        />
      ))}

      <Overlay />

      {banners.length > 1 && (
        <DotsContainer>
          {banners.map((_, index) => (
            <Dot
              key={index}
              active={index === currentIndex}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Ir para banner ${index + 1}`}
            />
          ))}
        </DotsContainer>
      )}
    </CarouselContainer>
  )
}

export default LoginBannerCarousel
