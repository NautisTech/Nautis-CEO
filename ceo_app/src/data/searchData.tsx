// Type Imports
import type { getDictionary } from '@/utils/getDictionary'

type SearchData = {
  id: string
  name: string
  url: string
  excludeLang?: boolean
  icon: string
  section: string
  shortcut?: string
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

const generateSearchData = (
  dictionary: Awaited<ReturnType<typeof getDictionary>>,
  modulos: Modulo[] = [],
  tiposConteudo: TipoConteudo[] = []
): SearchData[] => {
  const searchItems: SearchData[] = []
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

  // Helper para verificar se tem permissão de um tipo específico
  const hasPermissionType = (moduloNome: string, tipo: string): boolean => {
    const modulo = getModulo(moduloNome)
    return modulo?.permissoes.some(p => p.tipo === tipo) || false
  }

  // Helper para verificar se tem uma permissão específica por código
  const hasPermission = (moduloNome: string, codigo: string): boolean => {
    const modulo = getModulo(moduloNome)
    return modulo?.permissoes.some(p => p.codigo === codigo) || false
  }

  // ==================== DASHBOARDS ====================
  const dashboardsLabel = dictionary['navigation']?.dashboards || 'Dashboards'

  searchItems.push({
    id: `d${itemId++}`,
    name: (dictionary as any)['dashboards']?.menu?.main || 'Home Dashboard',
    url: '/dashboards/home',
    icon: 'tabler-home',
    section: dashboardsLabel
  })

  // Dashboard de Conteúdos
  if (hasModuleAccess('CONTEUDOS') && hasPermissionType('CONTEUDOS', 'Listar')) {
    searchItems.push({
      id: `d${itemId++}`,
      name: (dictionary as any)['dashboards']?.menu?.content || 'Contents Dashboard',
      url: '/dashboards/conteudos',
      icon: 'tabler-file-analytics',
      section: dashboardsLabel
    })
  }

  // Dashboard de Administração
  if (hasModuleAccess('UTILIZADORES') && hasPermissionType('UTILIZADORES', 'Listar')) {
    searchItems.push({
      id: `d${itemId++}`,
      name: (dictionary as any)['dashboards']?.menu?.admin || 'Admin Dashboard',
      url: '/dashboards/admin',
      icon: 'tabler-dashboard',
      section: dashboardsLabel
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
        searchItems.push({
          id: `c${itemId++}`,
          name: `${tipo.nome} - ${dictionary['actions']?._list || 'Listar'}`,
          url: `/apps/conteudos/${tipo.codigo.toLowerCase()}/list`,
          icon: 'tabler-list',
          section: conteudosLabel
        })
      }

      // Criar
      if (conteudoModulo?.permissoes.some(p => p.codigo === 'CONTEUDOS:Criar')) {
        searchItems.push({
          id: `c${itemId++}`,
          name: `${tipo.nome} - ${dictionary['actions']?.create || 'Criar'}`,
          url: `/apps/conteudos/${tipo.codigo.toLowerCase()}/create`,
          icon: 'tabler-plus',
          section: conteudosLabel
        })
      }
    })
  }

  // ==================== RH (RECURSOS HUMANOS) ====================
  if (hasModuleAccess('RH')) {
    const rhModulo = getModulo('RH')
    const rhLabel = dictionary['modules']?.rh || 'RH'

    if (rhModulo?.permissoes.some(p => p.codigo === 'RH:Listar')) {
      searchItems.push({
        id: `r${itemId++}`,
        name: dictionary['funcionarios']?.menu || 'Funcionários',
        url: '/apps/funcionarios/list',
        icon: 'tabler-users',
        section: rhLabel
      })
    }
  }

  // ==================== EQUIPAMENTOS ====================
  if (hasModuleAccess('EQUIPAMENTOS')) {
    const equipamentosModulo = getModulo('EQUIPAMENTOS')
    const equipamentosLabel = dictionary['equipamentos/suporte']?.menu?.equipamentos || 'Equipamentos'

    // Equipamentos
    if (equipamentosModulo?.permissoes.some(p => p.codigo === 'EQUIPAMENTOS:Listar')) {
      searchItems.push({
        id: `e${itemId++}`,
        name: dictionary['equipamentos/suporte']?.menu?.equipamentos || 'Equipamentos',
        url: '/apps/equipamentos',
        icon: 'tabler-devices',
        section: equipamentosLabel
      })
    }

    // Modelos
    if (equipamentosModulo?.permissoes.some(p => p.codigo === 'EQUIPAMENTOS:Listar')) {
      searchItems.push({
        id: `e${itemId++}`,
        name: `${equipamentosLabel} - ${dictionary['equipamentos/suporte']?.menu?.modelos || 'Modelos'}`,
        url: '/apps/equipamentos/modelos',
        icon: 'tabler-box-model',
        section: equipamentosLabel
      })
    }

    // Marcas
    if (equipamentosModulo?.permissoes.some(p => p.codigo === 'EQUIPAMENTOS:Listar')) {
      searchItems.push({
        id: `e${itemId++}`,
        name: `${equipamentosLabel} - ${dictionary['equipamentos/suporte']?.menu?.marcas || 'Marcas'}`,
        url: '/apps/equipamentos/marcas',
        icon: 'tabler-brand-apple',
        section: equipamentosLabel
      })
    }
  }

  // ==================== SUPORTE ====================
  if (hasModuleAccess('SUPORTE')) {
    const suporteModulo = getModulo('SUPORTE')
    const suporteLabel = dictionary['equipamentos/suporte']?.menu?.suporte || 'Suporte'

    // Meus Tickets
    if (suporteModulo?.permissoes.some(p => p.codigo === 'TICKETS:Listar')) {
      searchItems.push({
        id: `s${itemId++}`,
        name: dictionary['equipamentos/suporte']?.menu?.myTickets || 'Meus Tickets',
        url: '/apps/suporte/t-tickets',
        icon: 'tabler-user-check',
        section: suporteLabel
      })
    }

    // Triagem
    if (suporteModulo?.permissoes.some(p => p.codigo === 'TICKETS:Listar')) {
      searchItems.push({
        id: `s${itemId++}`,
        name: `${suporteLabel} - ${dictionary['equipamentos/suporte']?.menu?.triage || 'Triagem'}`,
        url: '/apps/suporte/triagem',
        icon: 'tabler-clipboard-list',
        section: suporteLabel
      })
    }

    // Tickets
    if (suporteModulo?.permissoes.some(p => p.codigo === 'TICKETS:Listar')) {
      searchItems.push({
        id: `s${itemId++}`,
        name: `${suporteLabel} - ${dictionary['equipamentos/suporte']?.menu?.tickets || 'Tickets'}`,
        url: '/apps/suporte/tickets',
        icon: 'tabler-ticket',
        section: suporteLabel
      })
    }

    // Intervenções
    if (suporteModulo?.permissoes.some(p => p.codigo === 'INTERVENCOES:Listar')) {
      searchItems.push({
        id: `s${itemId++}`,
        name: `${suporteLabel} - ${dictionary['equipamentos/suporte']?.menu?.intervencoes || 'Intervenções'}`,
        url: '/apps/suporte/intervencoes',
        icon: 'tabler-tool',
        section: suporteLabel
      })
    }
  }

  // ==================== ADMINISTRAÇÃO (SISTEMA) ====================
  if (hasModuleAccess('UTILIZADORES')) {
    const adminModulo = getModulo('UTILIZADORES')
    const sistemaLabel = dictionary?.sistema?.menu?.sistema || 'Sistema'
    const adminLabel = dictionary['modules']?.admin || 'Administração'

    // Utilizadores
    if (
      adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:Listar') ||
      adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:Gestao')
    ) {
      searchItems.push({
        id: `a${itemId++}`,
        name: `${adminLabel} - ${dictionary['navigation']?.users || 'Utilizadores'}`,
        url: '/apps/user/list',
        icon: 'tabler-users',
        section: sistemaLabel
      })
    }

    // Grupos/Roles
    if (
      adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:GruposListar') ||
      adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:GruposGestao')
    ) {
      searchItems.push({
        id: `a${itemId++}`,
        name: `${adminLabel} - ${dictionary['navigation']?.roles || 'Grupos'}`,
        url: '/apps/roles',
        icon: 'tabler-shield',
        section: sistemaLabel
      })
    }

    // Permissões
    if (
      adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:PermissoesListar') ||
      adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:PermissoesGestao')
    ) {
      searchItems.push({
        id: `a${itemId++}`,
        name: `${adminLabel} - ${dictionary['navigation']?.permissions || 'Permissões'}`,
        url: '/apps/permissions',
        icon: 'tabler-lock',
        section: sistemaLabel
      })
    }
  }

  // ==================== SISTEMA (Configurações) ====================
  const sistemaLabel = dictionary?.sistema?.menu?.sistema || 'Sistema'
  const sistemaMenu = dictionary?.sistema?.menu ?? {
    configuracoes: 'Configurações',
    conexoes: 'Conexões'
  }

  searchItems.push({
    id: `sys${itemId++}`,
    name: sistemaMenu.configuracoes,
    url: '/apps/configuracoes',
    icon: 'tabler-settings-cog',
    section: sistemaLabel
  })

  searchItems.push({
    id: `sys${itemId++}`,
    name: sistemaMenu.conexoes,
    url: '/apps/conexoes',
    icon: 'tabler-plug-connected',
    section: sistemaLabel
  })

  return searchItems
}

export default generateSearchData
