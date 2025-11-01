// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

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

interface TipoFuncionario {
  id: number
  codigo: string
  nome: string
  icone?: string
}

const verticalMenuData = (
  dictionary: Awaited<ReturnType<typeof getDictionary>>,
  modulos: Modulo[] = [],
  tiposConteudo: TipoConteudo[] = [],
): VerticalMenuDataType[] => {

  const menuItems: VerticalMenuDataType[] = []
  // Optional admin section to be inserted into Sistema
  let adminSection: VerticalMenuDataType | null = null

  // Helper para verificar se tem acesso a um módulo (com permissões)
  const hasModuleAccess = (moduloNome: string): boolean => {
    const modulo = modulos.find(m => m.modulo === moduloNome)
    // Retorna true apenas se o módulo existe E tem pelo menos uma permissão
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

  // ==================== HOME ====================

  // ==================== DASHBOARDS ====================
  const dashboardChildren: VerticalMenuDataType[] = []

  // Dashboard de Conteúdos
  if (hasModuleAccess('CONTEUDOS') && hasPermissionType('CONTEUDOS', 'Listar')) {
    dashboardChildren.push({
      label: dictionary['modules']?.conteudos,
      icon: 'tabler-file-analytics',
      href: '/dashboards/conteudos'
    })
  }

  // Dashboard de Administração
  if (hasModuleAccess('EQUIPAMENTOS') && hasPermissionType('EQUIPAMENTOS', 'Listar')) {
    dashboardChildren.push({
      label: dictionary['equipamentos/suporte'].menu.equipamentos,
      icon: 'tabler-devices',
      href: '/dashboards/equipamentos'
    })
  }

  // Dashboard de Administração
  if (hasModuleAccess('SUPORTE') && hasPermissionType('SUPORTE', 'Listar')) {
    dashboardChildren.push({
      label: dictionary['modules']?.suporte,
      icon: 'tabler-headset',
      href: '/dashboards/suporte'
    })
  }

  // Dashboard de Administração
  if (hasModuleAccess('UTILIZADORES') && hasPermissionType('UTILIZADORES', 'Listar')) {
    dashboardChildren.push({
      label: dictionary['modules']?.admin,
      icon: 'tabler-dashboard',
      href: '/dashboards/admin'
    })
  }

  // Se houver pelo menos um dashboard com permissão, adicionar ao menu
  if (dashboardChildren.length > 0) {
    menuItems.push({
      label: dictionary['navigation']?.dashboards,
      icon: 'tabler-chart-line',
      children: dashboardChildren
    })
  }

  // ==================== APPS & PAGES ====================
  const appsChildren: VerticalMenuDataType[] = []

  // ========== UTILIZADORES ==========
  if (hasModuleAccess('UTILIZADORES')) {
    const adminModulo = getModulo('UTILIZADORES')
    const adminChildren: VerticalMenuDataType[] = []

    // Utilizadores
    if (adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:Listar') || adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:Gestao')) {
      adminChildren.push({
        label: dictionary['navigation']?.users,
        icon: 'tabler-users',
        href: '/apps/user/list'
      })
    }

    // Grupos/Roles
    if (adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:GruposListar') || adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:GruposGestao')) {
      adminChildren.push({
        label: dictionary['navigation']?.roles,
        icon: 'tabler-shield',
        href: '/apps/roles'
      })
    }

    // Permissões
    if (adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:PermissoesListar') || adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:PermissoesGestao')) {
      adminChildren.push({
        label: dictionary['navigation']?.permissions,
        icon: 'tabler-lock',
        href: '/apps/permissions'
      })
    }

    // Prepare admin section to be placed under Sistema (if there are items)
    if (adminChildren.length > 0) {
      adminSection = {
        label: dictionary['modules']?.admin,
        icon: 'tabler-settings',
        children: adminChildren
      }
    }
  }

  // ========== CONTEUDOS ==========
  const conteudosModuleChildren: VerticalMenuDataType[] = []

  if (hasModuleAccess('CONTEUDOS')) {
    const conteudoModulo = getModulo('CONTEUDOS')
    const conteudoChildren: VerticalMenuDataType[] = []

    tiposConteudo.forEach(tipo => {
      // Adicionar tipo se tiver ações
      if (conteudoModulo?.permissoes.some(p => p.codigo === 'CONTEUDOS:Listar') || conteudoModulo?.permissoes.some(p => p.codigo === 'CONTEUDOS:Criar')) {
        conteudoChildren.push({
          label: tipo.nome,
          icon: tipo.icone || 'tabler-file',
          href: `/apps/conteudos/${tipo.codigo.toLowerCase()}/list`
        })
      }
    })

    // Agrupar publicações dentro de um único filho "publicacoes"
    const publicacoesChild: VerticalMenuDataType | null = conteudoChildren.length > 0 ? {
      label: dictionary['conteudos']?.menu.publicacoes || 'Publicações',
      icon: 'tabler-file',
      children: conteudoChildren
    } : null

    if (publicacoesChild) conteudosModuleChildren.push(publicacoesChild)
  }

  // ADICIONAR VALIDACAO DE PERMISSOES
  const formacoesChild: VerticalMenuDataType | null = {
    label: dictionary['conteudos']?.menu.formacoes || 'Formações',
    icon: 'tabler-school',
    href: '/apps/formacoes/list'
  }
  if (formacoesChild) conteudosModuleChildren.push(formacoesChild)

  // Adicionar módulo Conteúdos
  if (conteudosModuleChildren.length > 0) {
    appsChildren.push({
      label: dictionary['modules'].conteudos,
      icon: 'tabler-file-text',
      children: conteudosModuleChildren
    })
  }

  // ========== RH (RECURSOS HUMANOS) ==========
  if (hasModuleAccess('RH')) {
    const rhModulo = getModulo('RH')

    // Adicionar módulo RH se tiver itens
    if (rhModulo?.permissoes.some(p => p.codigo === 'RH:Listar')) {
      appsChildren.push({
        label: dictionary['modules'].rh,
        icon: 'tabler-briefcase',
        children: [
          {
            label: dictionary['funcionarios'].menu,
            icon: 'tabler-users',
            href: '/apps/funcionarios/list',
          }
        ]
      })
    }
  }

  // ========== EQUIPAMENTOS ==========
  if (hasModuleAccess('EQUIPAMENTOS')) {
    const equipamentosModulo = getModulo('EQUIPAMENTOS')
    const equipamentosChildren: VerticalMenuDataType[] = []

    // Equipamentos
    if (equipamentosModulo?.permissoes.some(p => p.codigo === 'EQUIPAMENTOS:Listar')) {
      equipamentosChildren.push({
        label: dictionary['equipamentos/suporte'].menu.equipamentos,
        icon: 'tabler-devices',
        href: '/apps/equipamentos'
      })
    }

    // Modelos
    if (equipamentosModulo?.permissoes.some(p => p.codigo === 'EQUIPAMENTOS:Listar')) {
      equipamentosChildren.push({
        label: dictionary['equipamentos/suporte'].menu.modelos,
        icon: 'tabler-box-model',
        href: '/apps/equipamentos/modelos'
      })
    }

    // Marcas
    if (equipamentosModulo?.permissoes.some(p => p.codigo === 'EQUIPAMENTOS:Listar')) {
      equipamentosChildren.push({
        label: dictionary['equipamentos/suporte'].menu.marcas,
        icon: 'tabler-brand-apple',
        href: '/apps/equipamentos/marcas'
      })
    }

    // Adicionar módulo Equipamentos se tiver itens
    if (equipamentosChildren.length > 0) {
      appsChildren.push({
        label: dictionary['equipamentos/suporte'].menu.equipamentos,
        icon: 'tabler-device-laptop',
        children: equipamentosChildren
      })
    }
  }

  // ========== SUPORTE ==========
  if (hasModuleAccess('SUPORTE')) {
    const suporteModulo = getModulo('SUPORTE')
    const suporteChildren: VerticalMenuDataType[] = []

    // Meus Tickets
    if (suporteModulo?.permissoes.some(p => p.codigo === 'TICKETS:Listar')) {
      suporteChildren.push({
        label: dictionary['equipamentos/suporte'].menu.myTickets,
        icon: 'tabler-user-check',
        href: '/apps/suporte/t-tickets'
      })
    }

    // Triagem
    if (suporteModulo?.permissoes.some(p => p.codigo === 'TICKETS:Listar')) {
      suporteChildren.push({
        label: dictionary['equipamentos/suporte'].menu.triage,
        icon: 'tabler-clipboard-list',
        href: '/apps/suporte/triagem'
      })
    }

    // Tickets
    if (suporteModulo?.permissoes.some(p => p.codigo === 'TICKETS:Listar')) {
      suporteChildren.push({
        label: dictionary['equipamentos/suporte'].menu.tickets,
        icon: 'tabler-ticket',
        href: '/apps/suporte/tickets'
      })
    }

    // Intervenções
    if (suporteModulo?.permissoes.some(p => p.codigo === 'INTERVENCOES:Listar')) {
      suporteChildren.push({
        label: dictionary['equipamentos/suporte'].menu.intervencoes,
        icon: 'tabler-tool',
        href: '/apps/suporte/intervencoes'
      })
    }

    // Adicionar módulo Suporte se tiver itens
    if (suporteChildren.length > 0) {
      appsChildren.push({
        label: dictionary['equipamentos/suporte'].menu.suporte,
        icon: 'tabler-headset',
        children: suporteChildren
      })
    }
  }

  // ========== COMMON APPS (sempre visíveis) ==========
  // appsChildren.push(
  //   {
  //     label: dictionary['navigation'].email,
  //     icon: 'tabler-mail',
  //     href: '/apps/email',
  //     exactMatch: false,
  //     activeUrl: '/apps/email'
  //   },
  //   {
  //     label: dictionary['navigation'].chat,
  //     icon: 'tabler-message-circle-2',
  //     href: '/apps/chat'
  //   },
  //   {
  //     label: dictionary['navigation'].calendar,
  //     icon: 'tabler-calendar',
  //     href: '/apps/calendar'
  //   }
  // )

  // Adicionar seção de Apps se houver itens
  if (appsChildren.length > 0) {
    menuItems.push({
      label: dictionary['navigation'].appsPages,
      isSection: true,
      children: appsChildren
    })
  }

  // ========== SISTEMA ==========
  const sistemaChildren: VerticalMenuDataType[] = [
    {
      label: dictionary.sistema.menu.configuracoes,
      icon: 'tabler-settings-cog',
      href: '/apps/configuracoes'
    },
    {
      label: dictionary.sistema.menu.conexoes,
      icon: 'tabler-plug-connected',
      href: '/apps/conexoes'
    }
  ]

  // Inserir seção de Administração dentro de Sistema, se existir
  if (adminSection) {
    sistemaChildren.push(adminSection)
  }

  menuItems.push({
    label: dictionary['sistema'].menu.sistema,
    isSection: true,
    children: sistemaChildren
  })

  return menuItems
}

export default verticalMenuData