'use client'

import { useState, useEffect } from 'react'
import { useKeenSlider } from 'keen-slider/react'
import type { KeenSliderPlugin } from 'keen-slider/react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'
import classnames from 'classnames'

import AppKeenSlider from '@/libs/styles/AppKeenSlider'
import { portalAPI } from '@/libs/api/portal'
import type { NoticiaPortal } from '@/libs/api/portal/types'

const NewsCarousel = () => {
  const [noticias, setNoticias] = useState<NoticiaPortal[]>([])
  const [loaded, setLoaded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  const theme = useTheme()

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const data = await portalAPI.listarNoticias(5)
        setNoticias(data)
      } catch (error) {
        console.error('Erro ao carregar notícias:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNoticias()
  }, [])

  const ResizePlugin: KeenSliderPlugin = slider => {
    const observer = new ResizeObserver(function () {
      slider.update()
    })

    slider.on('created', () => {
      observer.observe(slider.container)
    })
    slider.on('destroyed', () => {
      observer.unobserve(slider.container)
    })
  }

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      initial: 0,
      rtl: theme.direction === 'rtl',
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel)
      },
      created() {
        setLoaded(true)
      }
    },
    [
      ResizePlugin,
      slider => {
        let mouseOver = false
        let timeout: number | ReturnType<typeof setTimeout>

        const clearNextTimeout = () => {
          clearTimeout(timeout as number)
        }

        const nextTimeout = () => {
          clearTimeout(timeout as number)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 5000) // Auto-rotate every 5 seconds
        }

        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true
            clearNextTimeout()
          })
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false
            nextTimeout()
          })
          nextTimeout()
        })
        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant='body2' color='text.secondary'>
            A carregar notícias...
          </Typography>
        </CardContent>
      </Card>
    )
  }

  if (noticias.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant='h5' className='mbe-2'>
            Notícias
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Não há notícias disponíveis no momento.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <AppKeenSlider>
      <Card>
        <div ref={sliderRef} className='keen-slider relative'>
          {loaded && instanceRef.current && noticias.length > 1 && (
            <div className='swiper-dots absolute top-4 inline-end-6 z-10'>
              {[...Array(instanceRef.current.track.details.slides.length).keys()].map(idx => {
                return (
                  <Badge
                    key={idx}
                    variant='dot'
                    component='div'
                    className={classnames({
                      active: currentSlide === idx
                    })}
                    onClick={() => {
                      instanceRef.current?.moveToIdx(idx)
                    }}
                    sx={{
                      cursor: 'pointer',
                      '& .MuiBadge-dot': {
                        width: '8px !important',
                        height: '8px !important',
                        backgroundColor: 'var(--mui-palette-primary-main) !important',
                        opacity: 0.4
                      },
                      '&.active .MuiBadge-dot': {
                        opacity: 1
                      }
                    }}
                  ></Badge>
                )
              })}
            </div>
          )}

          {noticias.map((noticia, index) => (
            <div key={index} className='keen-slider__slide'>
              {noticia.imagem_destaque && (
                <Box
                  sx={{
                    width: '100%',
                    height: 300,
                    backgroundImage: `url(${noticia.imagem_destaque})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)'
                    }
                  }}
                />
              )}
              <CardContent className={noticia.imagem_destaque ? 'relative -mt-24 z-10' : ''}>
                {noticia.imagem_destaque && (
                  <div className='flex gap-2 mb-2'>
                    {noticia.categoria_nome && (
                      <Chip
                        label={noticia.categoria_nome}
                        size='small'
                        sx={{
                          backgroundColor: noticia.categoria_cor || 'primary.main',
                          color: 'white'
                        }}
                      />
                    )}
                  </div>
                )}

                <Typography
                  variant='h4'
                  className={`mbe-2 ${noticia.imagem_destaque ? 'text-white' : ''}`}
                  sx={{
                    textShadow: noticia.imagem_destaque ? '2px 2px 4px rgba(0,0,0,0.8)' : 'none'
                  }}
                >
                  {noticia.titulo}
                </Typography>

                {noticia.subtitulo && (
                  <Typography
                    variant='subtitle1'
                    className={`mbe-2 ${noticia.imagem_destaque ? 'text-white' : ''}`}
                    sx={{
                      textShadow: noticia.imagem_destaque ? '1px 1px 3px rgba(0,0,0,0.8)' : 'none'
                    }}
                  >
                    {noticia.subtitulo}
                  </Typography>
                )}

                {noticia.resumo && (
                  <Typography
                    variant='body2'
                    className={`mbe-4 ${noticia.imagem_destaque ? 'text-white' : 'text-textSecondary'}`}
                    sx={{
                      textShadow: noticia.imagem_destaque ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {noticia.resumo}
                  </Typography>
                )}

                <div className='flex gap-2 items-center'>
                  {!noticia.imagem_destaque && noticia.categoria_nome && (
                    <Chip
                      label={noticia.categoria_nome}
                      size='small'
                      sx={{
                        backgroundColor: noticia.categoria_cor || 'primary.main',
                        color: 'white'
                      }}
                    />
                  )}
                  <Typography
                    variant='caption'
                    className={noticia.imagem_destaque ? 'text-white' : 'text-textSecondary'}
                    sx={{
                      textShadow: noticia.imagem_destaque ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'
                    }}
                  >
                    {new Date(noticia.publicado_em).toLocaleDateString('pt-PT', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </Typography>
                </div>
              </CardContent>
            </div>
          ))}
        </div>
      </Card>
    </AppKeenSlider>
  )
}

export default NewsCarousel
