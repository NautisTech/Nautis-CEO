'use client'

import { useState, useEffect, useMemo } from 'react'
import type { ShortcutData } from '@/data/shortcutsData'
import { getDefaultShortcutIds } from '@/data/shortcutsData'

const SHORTCUTS_STORAGE_KEY = 'user-shortcuts'

export const useShortcuts = (availableShortcuts: ShortcutData[]) => {
    const [selectedShortcutIds, setSelectedShortcutIds] = useState<string[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Memoize available shortcut IDs to prevent unnecessary effect runs
    const availableShortcutIds = useMemo(
        () => availableShortcuts.map(s => s.id).join(','),
        [availableShortcuts]
    )

    // Load shortcuts from localStorage on mount or when available shortcuts change
    useEffect(() => {
        if (availableShortcuts.length === 0) return

        const stored = localStorage.getItem(SHORTCUTS_STORAGE_KEY)

        if (stored) {
            try {
                const parsed = JSON.parse(stored) as string[]
                // Validate that stored IDs exist in available shortcuts
                const validIds = parsed.filter(id =>
                    availableShortcuts.some(s => s.id === id)
                )

                if (validIds.length > 0) {
                    setSelectedShortcutIds(validIds)
                } else {
                    // No valid stored shortcuts, use defaults
                    setSelectedShortcutIds(getDefaultShortcutIds(availableShortcuts))
                }
            } catch (error) {
                console.error('Failed to parse stored shortcuts:', error)
                // Fall back to defaults
                setSelectedShortcutIds(getDefaultShortcutIds(availableShortcuts))
            }
        } else {
            // No stored shortcuts, use defaults
            setSelectedShortcutIds(getDefaultShortcutIds(availableShortcuts))
        }

        setIsLoaded(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableShortcutIds]) // Only re-run when the IDs change, not the entire array    // Save to localStorage whenever shortcuts change
    useEffect(() => {
        if (isLoaded && selectedShortcutIds.length > 0) {
            localStorage.setItem(SHORTCUTS_STORAGE_KEY, JSON.stringify(selectedShortcutIds))
        }
    }, [selectedShortcutIds, isLoaded])

    // Get actual shortcut objects from IDs
    const shortcuts = useMemo(() => {
        return selectedShortcutIds
            .map(id => availableShortcuts.find(s => s.id === id))
            .filter((s): s is ShortcutData => s !== undefined)
    }, [selectedShortcutIds, availableShortcuts])

    // Add a shortcut
    const addShortcut = (shortcutId: string) => {
        if (!selectedShortcutIds.includes(shortcutId) && selectedShortcutIds.length < 8) {
            setSelectedShortcutIds(prev => [...prev, shortcutId])
        }
    }

    // Remove a shortcut
    const removeShortcut = (shortcutId: string) => {
        setSelectedShortcutIds(prev => prev.filter(id => id !== shortcutId))
    }

    // Toggle a shortcut
    const toggleShortcut = (shortcutId: string) => {
        if (selectedShortcutIds.includes(shortcutId)) {
            removeShortcut(shortcutId)
        } else {
            addShortcut(shortcutId)
        }
    }

    // Check if a shortcut is selected
    const isShortcutSelected = (shortcutId: string) => {
        return selectedShortcutIds.includes(shortcutId)
    }

    // Reset to defaults
    const resetToDefaults = () => {
        setSelectedShortcutIds(getDefaultShortcutIds(availableShortcuts))
    }

    return {
        shortcuts,
        selectedShortcutIds,
        addShortcut,
        removeShortcut,
        toggleShortcut,
        isShortcutSelected,
        resetToDefaults,
        isLoaded,
        canAddMore: selectedShortcutIds.length < 8
    }
}
