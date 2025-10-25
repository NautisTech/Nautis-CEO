export * from './api'
export * from './types'

import { useQuery } from '@tanstack/react-query'
import { funcionariosAPI } from './api'

/**
 * Hook para buscar tipos de funcionário
 */
export function useTiposFuncionario() {
    return useQuery({
        queryKey: ['tipos-funcionario'],
        queryFn: () => funcionariosAPI.getTiposFuncionario(),
        staleTime: 1000 * 60 * 5, // 5 minutos
    })
}
