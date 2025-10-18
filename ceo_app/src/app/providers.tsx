'use client'

import { AuthProvider } from '@/contexts/AuthProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SessionProvider } from 'next-auth/react'
import { useState, type ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000 * 5, // 5 minutes
                        refetchOnWindowFocus: false,
                        retry: 1
                    },
                    mutations: {
                        retry: 0
                    }
                }
            })
    )

    return (
        <SessionProvider basePath="/auth-next">
            <AuthProvider>
                <QueryClientProvider client={queryClient}>
                    <ToastContainer />
                    {children}
                    {process.env.NODE_ENV === 'development' && (
                        <ReactQueryDevtools initialIsOpen={false} />
                    )}
                </QueryClientProvider>
            </AuthProvider>
        </SessionProvider>

    )
}