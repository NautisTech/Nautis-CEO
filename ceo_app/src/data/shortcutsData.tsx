// Type Imports
import type { getDictionary } from '@/utils/getDictionary'

export type ShortcutData = {
    id: string
    url: string
    icon: string
    title: string
    subtitle: string
}

interface Modulo {
    modulo: string
    nome: string
    icone: string
    permissoes: Array<{
        codigo: string
        nome: string
        tipo: string
    }>
}

interface TipoConteudo {
    id: number
    codigo: string
    nome: string
    icone?: string
}

export const generateAvailableShortcuts = (
    dictionary: Awaited<ReturnType<typeof getDictionary>>,
    modulos: Modulo[] = [],
    tiposConteudo: TipoConteudo[] = []
): ShortcutData[] => {
    const shortcuts: ShortcutData[] = []
    let itemId = 1

    // Helper para verificar se tem acesso a um módulo (com permissões)
    const hasModuleAccess = (moduloNome: string): boolean => {
        const modulo = modulos.find(m => m.modulo === moduloNome)
        return modulo !== undefined && modulo.permissoes.length > 0
    }

    // Helper para obter um módulo
    const getModulo = (moduloNome: string) => {
        return modulos.find(m => m.modulo === moduloNome)
    }

    // Helper para verificar se tem uma permissão específica por código
    const hasPermission = (moduloNome: string, codigo: string): boolean => {
        const modulo = getModulo(moduloNome)
        return modulo?.permissoes.some(p => p.codigo === codigo) || false
    }

    // ==================== DASHBOARDS ====================
    // Dashboard Principal (sempre visível)
    shortcuts.push({
        id: `shortcut-d${itemId++}`,
        url: '/dashboards/home',
        icon: 'tabler-home',
        title: (dictionary as any)['dashboards']?.menu?.main || 'Home Dashboard',
        subtitle: dictionary['navigation']?.dashboards || 'Dashboards'
    })

    // Dashboard de Conteúdos
    if (hasModuleAccess('CONTEUDOS')) {
        shortcuts.push({
            id: `shortcut-d${itemId++}`,
            url: '/dashboards/conteudos',
            icon: 'tabler-file-analytics',
            title: (dictionary as any)['dashboards']?.menu?.content || 'Contents Dashboard',
            subtitle: dictionary['navigation']?.dashboards || 'Dashboards'
        })
    }

    // Dashboard de Administração
    if (hasModuleAccess('UTILIZADORES')) {
        shortcuts.push({
            id: `shortcut-d${itemId++}`,
            url: '/dashboards/admin',
            icon: 'tabler-dashboard',
            title: (dictionary as any)['dashboards']?.menu?.admin || 'Admin Dashboard',
            subtitle: dictionary['navigation']?.dashboards || 'Dashboards'
        })
    }

    // ==================== CONTEÚDOS ====================
    if (hasModuleAccess('CONTEUDOS')) {
        const conteudoModulo = getModulo('CONTEUDOS')
        const conteudosLabel = dictionary['modules']?.conteudos || 'Conteúdos'

        // Para cada tipo de conteúdo do tenant
        tiposConteudo.forEach(tipo => {
            // Listar
            if (conteudoModulo?.permissoes.some(p => p.codigo === 'CONTEUDOS:Listar')) {
                shortcuts.push({
                    id: `shortcut-c${itemId++}`,
                    url: `/apps/conteudos/${tipo.codigo.toLowerCase()}/list`,
                    icon: 'tabler-list',
                    title: `${tipo.nome} - ${dictionary['actions']?._list || 'Listar'}`,
                    subtitle: conteudosLabel
                })
            }

            // Criar
            if (conteudoModulo?.permissoes.some(p => p.codigo === 'CONTEUDOS:Criar')) {
                shortcuts.push({
                    id: `shortcut-c${itemId++}`,
                    url: `/apps/conteudos/${tipo.codigo.toLowerCase()}/create`,
                    icon: 'tabler-plus',
                    title: `${tipo.nome} - ${dictionary['actions']?.create || 'Criar'}`,
                    subtitle: conteudosLabel
                })
            }
        })
    }

    // ==================== ADMINISTRAÇÃO ====================
    if (hasModuleAccess('UTILIZADORES')) {
        const adminModulo = getModulo('UTILIZADORES')
        const sistemaLabel = dictionary?.sistema?.menu?.sistema || 'Sistema'
        const adminLabel = dictionary['modules']?.admin || 'Administração'

        // Utilizadores
        if (
            adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:Listar') ||
            adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:Gestao')
        ) {
            shortcuts.push({
                id: `shortcut-a${itemId++}`,
                url: '/apps/user/list',
                icon: 'tabler-users',
                title: `${adminLabel} - ${dictionary['navigation']?.users || 'Utilizadores'}`,
                subtitle: sistemaLabel
            })
        }

        // Grupos
        if (
            adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:GruposListar') ||
            adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:GruposGestao')
        ) {
            shortcuts.push({
                id: `shortcut-a${itemId++}`,
                url: '/apps/roles',
                icon: 'tabler-shield',
                title: `${adminLabel} - ${dictionary['navigation']?.roles || 'Grupos'}`,
                subtitle: sistemaLabel
            })
        }

        // Permissões
        if (
            adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:PermissoesListar') ||
            adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:PermissoesGestao')
        ) {
            shortcuts.push({
                id: `shortcut-a${itemId++}`,
                url: '/apps/permissions',
                icon: 'tabler-lock',
                title: `${adminLabel} - ${dictionary['navigation']?.permissions || 'Permissões'}`,
                subtitle: sistemaLabel
            })
        }
    }

    // ==================== RH ====================
    if (hasModuleAccess('RH')) {
        const rhLabel = dictionary['modules']?.rh || 'RH'
        if (hasPermission('RH', 'RH:Listar')) {
            shortcuts.push({
                id: `shortcut-r${itemId++}`,
                url: '/apps/funcionarios/list',
                icon: 'tabler-users',
                title: dictionary['funcionarios']?.menu || 'Funcionários',
                subtitle: rhLabel
            })
        }
    }

    // ==================== EQUIPAMENTOS ====================
    if (hasModuleAccess('EQUIPAMENTOS')) {
        const equipamentosModulo = getModulo('EQUIPAMENTOS')
        const equipamentosLabel = dictionary['equipamentos/suporte']?.menu?.equipamentos || 'Equipamentos'

        // Equipamentos
        if (equipamentosModulo?.permissoes.some(p => p.codigo === 'EQUIPAMENTOS:Listar')) {
            shortcuts.push({
                id: `shortcut-e${itemId++}`,
                url: '/apps/equipamentos',
                icon: 'tabler-devices',
                title: dictionary['equipamentos/suporte']?.menu?.equipamentos || 'Equipamentos',
                subtitle: equipamentosLabel
            })
        }

        // Modelos
        if (equipamentosModulo?.permissoes.some(p => p.codigo === 'EQUIPAMENTOS:Listar')) {
            shortcuts.push({
                id: `shortcut-e${itemId++}`,
                url: '/apps/equipamentos/modelos',
                icon: 'tabler-box-model',
                title: `${equipamentosLabel} - ${dictionary['equipamentos/suporte']?.menu?.modelos || 'Modelos'}`,
                subtitle: equipamentosLabel
            })
        }

        // Marcas
        if (equipamentosModulo?.permissoes.some(p => p.codigo === 'EQUIPAMENTOS:Listar')) {
            shortcuts.push({
                id: `shortcut-e${itemId++}`,
                url: '/apps/equipamentos/marcas',
                icon: 'tabler-brand-apple',
                title: `${equipamentosLabel} - ${dictionary['equipamentos/suporte']?.menu?.marcas || 'Marcas'}`,
                subtitle: equipamentosLabel
            })
        }
    }

    // ==================== SUPORTE ====================
    if (hasModuleAccess('SUPORTE')) {
        const suporteModulo = getModulo('SUPORTE')
        const suporteLabel = dictionary['equipamentos/suporte']?.menu?.suporte || 'Suporte'

        // Meus Tickets
        if (suporteModulo?.permissoes.some(p => p.codigo === 'TICKETS:Listar')) {
            shortcuts.push({
                id: `shortcut-s${itemId++}`,
                url: '/apps/suporte/t-tickets',
                icon: 'tabler-user-check',
                title: dictionary['equipamentos/suporte']?.menu?.myTickets || 'Meus Tickets',
                subtitle: suporteLabel
            })
        }

        // Triagem
        if (suporteModulo?.permissoes.some(p => p.codigo === 'TICKETS:Listar')) {
            shortcuts.push({
                id: `shortcut-s${itemId++}`,
                url: '/apps/suporte/triagem',
                icon: 'tabler-clipboard-list',
                title: `${suporteLabel} - ${dictionary['equipamentos/suporte']?.menu?.triage || 'Triagem'}`,
                subtitle: suporteLabel
            })
        }

        // Tickets
        if (suporteModulo?.permissoes.some(p => p.codigo === 'TICKETS:Listar')) {
            shortcuts.push({
                id: `shortcut-s${itemId++}`,
                url: '/apps/suporte/tickets',
                icon: 'tabler-ticket',
                title: `${suporteLabel} - ${dictionary['equipamentos/suporte']?.menu?.tickets || 'Tickets'}`,
                subtitle: suporteLabel
            })
        }

        // Intervenções
        if (suporteModulo?.permissoes.some(p => p.codigo === 'INTERVENCOES:Listar')) {
            shortcuts.push({
                id: `shortcut-s${itemId++}`,
                url: '/apps/suporte/intervencoes',
                icon: 'tabler-tool',
                title: `${suporteLabel} - ${dictionary['equipamentos/suporte']?.menu?.intervencoes || 'Intervenções'}`,
                subtitle: suporteLabel
            })
        }
    }

    // ==================== SISTEMA ====================
    const sistemaLabel = dictionary?.sistema?.menu?.sistema || 'Sistema'
    const sistemaMenu = dictionary?.sistema?.menu ?? {
        configuracoes: 'Configurações',
        conexoes: 'Conexões'
    }

    shortcuts.push({
        id: `shortcut-sys${itemId++}`,
        url: '/apps/configuracoes',
        icon: 'tabler-settings-cog',
        title: sistemaMenu.configuracoes,
        subtitle: sistemaLabel
    })

    shortcuts.push({
        id: `shortcut-sys${itemId++}`,
        url: '/apps/conexoes',
        icon: 'tabler-plug-connected',
        title: sistemaMenu.conexoes,
        subtitle: sistemaLabel
    })

    return shortcuts
}

// Default shortcuts IDs (will pick first 6 available from the generated list)
export const getDefaultShortcutIds = (availableShortcuts: ShortcutData[]): string[] => {
    // Pick the most relevant 6 shortcuts based on priority
    const priorityOrder = [
        '/dashboards/home', // Home Dashboard (always first)
        '/apps/user/list', // Users (admin)
        '/dashboards/conteudos', // Content Dashboard
        '/apps/conteudos/', // Any content type (partial match)
        '/apps/suporte/t-tickets', // My Tickets
        '/apps/configuracoes' // Settings
    ]

    const selected: string[] = []

    // First, add shortcuts matching priority order
    priorityOrder.forEach(priorityUrl => {
        if (selected.length >= 6) return

        const shortcut = availableShortcuts.find(s =>
            priorityUrl.endsWith('/') ? s.url.startsWith(priorityUrl) : s.url === priorityUrl
        )

        if (shortcut && !selected.includes(shortcut.id)) {
            selected.push(shortcut.id)
        }
    })

    // Fill remaining slots with first available shortcuts
    availableShortcuts.forEach(shortcut => {
        if (selected.length >= 6) return
        if (!selected.includes(shortcut.id)) {
            selected.push(shortcut.id)
        }
    })

    return selected.slice(0, 6)
}
