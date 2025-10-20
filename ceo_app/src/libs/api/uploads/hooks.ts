import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadsAPI } from './api'

export function useUploadSingle() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (file: File) => uploadsAPI.uploadSingle(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['uploads'] })
        },
    })
}

export function useUploadMultiple() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (files: File[]) => uploadsAPI.uploadMultiple(files),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['uploads'] })
        },
    })
}

export function useDeleteUpload() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => uploadsAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['uploads'] })
        },
    })
}