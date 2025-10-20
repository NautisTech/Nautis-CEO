'use client'

import { useState } from 'react'
import Image from 'next/image'
import Skeleton from '@mui/material/Skeleton'
import type { ImageVariants } from '@/libs/api/conteudos/types'

interface OptimizedImageProps {
    src: string
    alt: string
    variants?: ImageVariants | null
    size?: 'thumbnail' | 'small' | 'medium' | 'large' | 'original'
    className?: string
    width?: number
    height?: number
    fill?: boolean
    priority?: boolean
    onLoad?: () => void
    onError?: () => void
}

const OptimizedImage = ({
    src,
    alt,
    variants,
    size = 'medium',
    className = '',
    width,
    height,
    fill,
    priority,
    onLoad,
    onError
}: OptimizedImageProps) => {
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)

    // Usar a variante apropriada se disponível, senão usar src original
    const imageSrc = variants && !error ? variants[size] : src

    const handleLoad = () => {
        setLoading(false)
        onLoad?.()
    }

    const handleError = () => {
        console.warn(`Erro ao carregar imagem: ${imageSrc}`)

        // Se falhou com variant, tentar com src original
        if (variants && !error) {
            setError(true)
            setLoading(true)
        } else {
            setLoading(false)
            onError?.()
        }
    }

    // Determinar dimensões para o skeleton
    const skeletonWidth = width || 800
    const skeletonHeight = height || 600

    return (
        <div className={`relative ${className}`} style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}>
            {loading && (
                <Skeleton
                    variant="rectangular"
                    width={fill ? '100%' : skeletonWidth}
                    height={fill ? '100%' : skeletonHeight}
                    animation="wave"
                    className='absolute inset-0'
                />
            )}

            {fill ? (
                <Image
                    src={imageSrc}
                    alt={alt}
                    fill
                    className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                    priority={priority}
                    onLoad={handleLoad}
                    onError={handleError}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            ) : (
                <Image
                    src={imageSrc}
                    alt={alt}
                    width={width || 800}
                    height={height || 600}
                    className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                    priority={priority}
                    onLoad={handleLoad}
                    onError={handleError}
                />
            )}
        </div>
    )
}

export default OptimizedImage