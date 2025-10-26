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
  tiposFuncionario: TipoFuncionario[] = []
): VerticalMenuDataType[] => {

  const menuItems: VerticalMenuDataType[] = []

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
      label: 'Dashboard Conteúdos',
      icon: 'tabler-file-analytics',
      href: '/dashboards/conteudos'
    })
  }

  // Dashboard de Administração
  if (hasModuleAccess('UTILIZADORES') && hasPermissionType('UTILIZADORES', 'Listar')) {
    dashboardChildren.push({
      label: 'Dashboard Administração',
      icon: 'tabler-dashboard',
      href: '/dashboards/admin'
    })
  }

  // Se houver pelo menos um dashboard com permissão, adicionar ao menu
  if (dashboardChildren.length > 0) {
    menuItems.push({
      label: 'Dashboards',
      icon: 'tabler-chart-line',
      children: dashboardChildren
    })
  }

  // ==================== APPS & PAGES ====================
  const appsChildren: VerticalMenuDataType[] = []

  // ========== ECOMMERCE ==========
  // if (hasModuleAccess('ecommerce')) {
  //   const ecommerceChildren: VerticalMenuDataType[] = []
  //   const ecommerceModulo = getModulo('ecommerce')

  //   // Dashboard
  //   if (hasPermissionType('ecommerce', 'dashboard')) {
  //     ecommerceChildren.push({
  //       label: dictionary['navigation'].dashboard,
  //       href: '/apps/ecommerce/dashboard'
  //     })
  //   }

  //   // Products (baseado nos tipos de permissão)
  //   if (hasPermissionType('ecommerce', 'products')) {
  //     ecommerceChildren.push({
  //       label: dictionary['navigation'].products || 'Products',
  //       href: '/apps/ecommerce/products/list'
  //     })
  //   }

  //   // Orders
  //   if (hasPermissionType('ecommerce', 'orders')) {
  //     ecommerceChildren.push({
  //       label: dictionary['navigation'].orders || 'Orders',
  //       href: '/apps/ecommerce/orders/list'
  //     })
  //   }

  //   // Customers
  //   if (hasPermissionType('ecommerce', 'customers')) {
  //     ecommerceChildren.push({
  //       label: dictionary['navigation'].customers || 'Customers',
  //       href: '/apps/ecommerce/customers/list'
  //     })
  //   }

  //   // Settings
  //   if (hasPermissionType('ecommerce', 'settings')) {
  //     ecommerceChildren.push({
  //       label: dictionary['navigation'].settings || 'Settings',
  //       href: '/apps/ecommerce/settings'
  //     })
  //   }

  //   if (ecommerceChildren.length > 0) {
  //     appsChildren.push({
  //       label: dictionary['navigation'].eCommerce,
  //       icon: 'tabler-shopping-cart',
  //       children: ecommerceChildren
  //     })
  //   }
  // }

  // ========== ACADEMY ==========
  // if (hasModuleAccess('academy')) {
  //   const academyChildren: VerticalMenuDataType[] = []

  //   if (hasPermissionType('academy', 'dashboard')) {
  //     academyChildren.push({
  //       label: dictionary['navigation'].dashboard,
  //       href: '/apps/academy/dashboard'
  //     })
  //   }

  //   if (hasPermissionType('academy', 'courses')) {
  //     academyChildren.push({
  //       label: dictionary['navigation'].myCourses,
  //       href: '/apps/academy/my-courses'
  //     })
  //   }

  //   if (hasPermissionType('academy', 'details')) {
  //     academyChildren.push({
  //       label: dictionary['navigation'].courseDetails,
  //       href: '/apps/academy/course-details'
  //     })
  //   }

  //   if (academyChildren.length > 0) {
  //     appsChildren.push({
  //       label: dictionary['navigation'].academy,
  //       icon: 'tabler-school',
  //       children: academyChildren
  //     })
  //   }
  // }

  // ========== LOGISTICS ==========
  // if (hasModuleAccess('logistics')) {
  //   const logisticsChildren: VerticalMenuDataType[] = []

  //   if (hasPermissionType('logistics', 'dashboard')) {
  //     logisticsChildren.push({
  // label: dictionary['navigation'].dashboard,
  //       href: '/apps/logistics/dashboard'
  //     })
  //   }

  //   if (hasPermissionType('logistics', 'fleet')) {
  //     logisticsChildren.push({
  //       label: dictionary['navigation'].fleet,
  //       href: '/apps/logistics/fleet'
  //     })
  //   }

  //   if (logisticsChildren.length > 0) {
  //     appsChildren.push({
  //       label: dictionary['navigation'].logistics,
  //       icon: 'tabler-truck',
  //       children: logisticsChildren
  //     })
  //   }
  // }

  // ========== ADMINISTRAÇÃO (ADMIN) ==========
  if (hasModuleAccess('UTILIZADORES')) {
    const adminModulo = getModulo('UTILIZADORES')
    const adminChildren: VerticalMenuDataType[] = []

    // Utilizadores
    if (adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:Listar') || adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:Gestao')) {
      adminChildren.push({
        label: dictionary['navigation']?.users || 'Utilizadores',
        icon: 'tabler-users',
        href: '/apps/user/list'
      })
    }

    // Grupos/Roles
    if (adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:GruposListar') || adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:GruposGestao')) {
      adminChildren.push({
        label: dictionary['navigation']?.roles || 'Grupos',
        icon: 'tabler-shield',
        href: '/apps/roles'
      })
    }

    // Permissões
    if (adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:PermissoesListar') || adminModulo?.permissoes.some(p => p.codigo === 'UTILIZADORES:PermissoesGestao')) {
      adminChildren.push({
        label: 'Permissões',
        icon: 'tabler-lock',
        href: '/apps/permissions'
      })
    }

    // Adicionar módulo Admin se tiver itens
    if (adminChildren.length > 0) {
      appsChildren.push({
        label: 'Administração',
        icon: 'tabler-settings',
        children: adminChildren
      })
    }
  }

  // ========== CONTEUDOS ==========
  if (hasModuleAccess('CONTEUDOS')) {
    const conteudoModulo = getModulo('CONTEUDOS')
    const conteudoChildren: VerticalMenuDataType[] = []

    // Para cada tipo de conteúdo do tenant
    tiposConteudo.forEach(tipo => {
      const tipoChildren: VerticalMenuDataType[] = []

      // Verificar se tem permissão de Listar
      if (conteudoModulo?.permissoes.some(p => p.codigo === 'CONTEUDOS:Listar')) {
        tipoChildren.push({
          label: dictionary['actions']._list || 'Listar',
          icon: 'tabler-list',
          href: `/apps/conteudos/${tipo.codigo.toLowerCase()}/list`
        })
      }

      // Verificar se tem permissão de Criar
      if (conteudoModulo?.permissoes.some(p => p.codigo === 'CONTEUDOS:Criar')) {
        tipoChildren.push({
          label: dictionary['actions'].create || 'Criar',
          icon: 'tabler-plus',
          href: `/apps/conteudos/${tipo.codigo.toLowerCase()}/create`
        })
      }

      // Adicionar tipo se tiver ações
      if (tipoChildren.length > 0) {
        conteudoChildren.push({
          label: tipo.nome,
          icon: tipo.icone || 'tabler-file',
          children: tipoChildren
        })
      }
    })

    // Adicionar módulo Conteúdos
    if (conteudoChildren.length > 0) {
      appsChildren.push({
        label: dictionary['modules'].conteudos || 'Conteúdos',
        icon: 'tabler-file-text',
        children: conteudoChildren
      })
    }
  }

  // ========== RH (RECURSOS HUMANOS) ==========
  if (hasModuleAccess('RH')) {
    const rhModulo = getModulo('RH')
    const funcionariosChildren: VerticalMenuDataType[] = []

    // Opção "Todos" para listar todos os funcionários
    if (rhModulo?.permissoes.some(p => p.codigo === 'RH:Listar')) {
      funcionariosChildren.push({
        label: 'Todos',
        icon: 'tabler-users',
        href: '/apps/funcionarios/list'
      })
    }

    // Para cada tipo de funcionário do tenant
    tiposFuncionario.forEach(tipo => {
      if (rhModulo?.permissoes.some(p => p.codigo === 'RH:Listar')) {
        funcionariosChildren.push({
          label: tipo.nome,
          icon: tipo.icone || 'tabler-user',
          href: `/apps/funcionarios/list?tipo=${tipo.codigo.toLowerCase()}`
        })
      }
    })

    // Adicionar módulo RH se tiver itens
    if (funcionariosChildren.length > 0) {
      appsChildren.push({
        label: 'RH',
        icon: 'tabler-briefcase',
        children: [
          {
            label: 'Funcionários',
            icon: 'tabler-users',
            children: funcionariosChildren
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
        label: 'Equipamentos',
        icon: 'tabler-devices',
        href: '/apps/equipamentos'
      })
    }

    // Modelos
    if (equipamentosModulo?.permissoes.some(p => p.codigo === 'EQUIPAMENTOS:Listar')) {
      equipamentosChildren.push({
        label: 'Modelos',
        icon: 'tabler-box-model',
        href: '/apps/equipamentos/modelos'
      })
    }

    // Marcas
    if (equipamentosModulo?.permissoes.some(p => p.codigo === 'EQUIPAMENTOS:Listar')) {
      equipamentosChildren.push({
        label: 'Marcas',
        icon: 'tabler-brand-apple',
        href: '/apps/equipamentos/marcas'
      })
    }

    // Adicionar módulo Equipamentos se tiver itens
    if (equipamentosChildren.length > 0) {
      appsChildren.push({
        label: 'Equipamentos',
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
        label: 'Meus Tickets',
        icon: 'tabler-user-check',
        href: '/apps/suporte/t-tickets'
      })
    }

    // Triagem
    if (suporteModulo?.permissoes.some(p => p.codigo === 'TICKETS:Listar')) {
      suporteChildren.push({
        label: 'Triagem',
        icon: 'tabler-clipboard-list',
        href: '/apps/suporte/triagem'
      })
    }

    // Tickets
    if (suporteModulo?.permissoes.some(p => p.codigo === 'TICKETS:Listar')) {
      suporteChildren.push({
        label: 'Tickets',
        icon: 'tabler-ticket',
        href: '/apps/suporte/tickets'
      })
    }

    // Intervenções
    if (suporteModulo?.permissoes.some(p => p.codigo === 'INTERVENCOES:Listar')) {
      suporteChildren.push({
        label: 'Intervenções',
        icon: 'tabler-tool',
        href: '/apps/suporte/intervencoes'
      })
    }

    // Adicionar módulo Suporte se tiver itens
    if (suporteChildren.length > 0) {
      appsChildren.push({
        label: 'Suporte',
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
  menuItems.push({
    label: 'Sistema',
    isSection: true,
    children: [
      {
        label: 'Configurações',
        icon: 'tabler-settings-cog',
        href: '/apps/configuracoes'
      },
      {
        label: 'Conexões',
        icon: 'tabler-plug-connected',
        href: '/apps/conexoes'
      }
    ]
  })

  return menuItems
}

export default verticalMenuData