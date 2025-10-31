// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'
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

const horizontalMenuData = (
  dictionary: Awaited<ReturnType<typeof getDictionary>>,
  modulos: Modulo[] = [],
  tiposConteudo: TipoConteudo[] = [],
): HorizontalMenuDataType[] => {

  const menuItems: HorizontalMenuDataType[] = []

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

  // Helper para verificar se tem uma permissão específica por código
  const hasPermission = (moduloNome: string, codigo: string): boolean => {
    const modulo = getModulo(moduloNome)
    return modulo?.permissoes.some(p => p.codigo === codigo) || false
  }

  // ==================== HOME ====================
  // menuItems.push({
  //   label: dictionary['navigation']?.home || 'Home',
  //   icon: 'tabler-home',
  //   href: '/'
  // })

  // ==================== DASHBOARDS ====================
  const dashboardChildren: HorizontalMenuDataType[] = []

  // Dashboard Principal
  dashboardChildren.push({
    label: dictionary['dashboards']?.menu.main,
    icon: 'tabler-home',
    href: '/dashboards/home'
  })

  // Dashboard de Conteúdos
  if (hasModuleAccess('CONTEUDOS') && hasPermissionType('CONTEUDOS', 'Listar')) {
    dashboardChildren.push({
      label: dictionary['dashboards']?.menu.content,
      icon: 'tabler-file-analytics',
      href: '/dashboards/conteudos'
    })
  }

  // Dashboard de Administração
  if (hasModuleAccess('EQUIPAMENTOS') && hasPermissionType('EQUIPAMENTOS', 'Listar')) {
    dashboardChildren.push({
      label: dictionary['dashboards'].menu.equipamentos,
      icon: 'tabler-devices',
      href: '/dashboards/equipamentos'
    })
  }

  // Dashboard de Administração
  if (hasModuleAccess('SUPORTE') && hasPermissionType('SUPORTE', 'Listar')) {
    dashboardChildren.push({
      label: dictionary['dashboards']?.menu.suporte,
      icon: 'tabler-headset',
      href: '/dashboards/suporte'
    })
  }

  // Dashboard de Administração
  if (hasModuleAccess('UTILIZADORES') && hasPermissionType('UTILIZADORES', 'Listar')) {
    dashboardChildren.push({
      label: dictionary['dashboards']?.menu.admin,
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

  // ==================== APPS ====================

  // ========== ECOMMERCE ==========
  // if (hasModuleAccess('ecommerce')) {
  //   const ecommerceChildren: HorizontalMenuDataType[] = []

  //   if (hasPermissionType('ecommerce', 'dashboard')) {
  //     ecommerceChildren.push({
  //       label: dictionary['navigation']?.dashboard || 'Dashboard',
  //       href: '/apps/ecommerce/dashboard'
  //     })
  //   }

  //   // Products
  //   if (hasPermissionType('ecommerce', 'products')) {
  //     const productsChildren: HorizontalMenuDataType[] = []

  //     productsChildren.push({
  //       label: dictionary['navigation']?.list || 'List',
  //       href: '/apps/ecommerce/products/list'
  //     })

  //     productsChildren.push({
  //       label: dictionary['navigation']?.add || 'Add',
  //       href: '/apps/ecommerce/products/add'
  //     })

  //     productsChildren.push({
  //       label: dictionary['navigation']?.category || 'Category',
  //       href: '/apps/ecommerce/products/category'
  //     })

  //     ecommerceChildren.push({
  //       label: dictionary['navigation']?.products || 'Products',
  //       children: productsChildren
  //     })
  //   }

  //   // Orders
  //   if (hasPermissionType('ecommerce', 'orders')) {
  //     const ordersChildren: HorizontalMenuDataType[] = []

  //     ordersChildren.push({
  //       label: dictionary['navigation']?.list || 'List',
  //       href: '/apps/ecommerce/orders/list'
  //     })

  //     ordersChildren.push({
  //       label: dictionary['navigation']?.details || 'Details',
  //       href: '/apps/ecommerce/orders/details/5434',
  //       exactMatch: false,
  //       activeUrl: '/apps/ecommerce/orders/details'
  //     })

  //     ecommerceChildren.push({
  //       label: dictionary['navigation']?.orders || 'Orders',
  //       children: ordersChildren
  //     })
  //   }

  //   // Customers
  //   if (hasPermissionType('ecommerce', 'customers')) {
  //     const customersChildren: HorizontalMenuDataType[] = []

  //     customersChildren.push({
  //       label: dictionary['navigation']?.list || 'List',
  //       href: '/apps/ecommerce/customers/list'
  //     })

  //     customersChildren.push({
  //       label: dictionary['navigation']?.details || 'Details',
  //       href: '/apps/ecommerce/customers/details/879861',
  //       exactMatch: false,
  //       activeUrl: '/apps/ecommerce/customers/details'
  //     })

  //     ecommerceChildren.push({
  //       label: dictionary['navigation']?.customers || 'Customers',
  //       children: customersChildren
  //     })
  //   }

  //   if (hasPermissionType('ecommerce', 'reviews')) {
  //     ecommerceChildren.push({
  //       label: dictionary['navigation']?.manageReviews || 'Manage Reviews',
  //       href: '/apps/ecommerce/manage-reviews'
  //     })
  //   }

  //   if (hasPermissionType('ecommerce', 'referrals')) {
  //     ecommerceChildren.push({
  //       label: dictionary['navigation']?.referrals || 'Referrals',
  //       href: '/apps/ecommerce/referrals'
  //     })
  //   }

  //   if (hasPermissionType('ecommerce', 'settings')) {
  //     ecommerceChildren.push({
  //       label: dictionary['navigation']?.settings || 'Settings',
  //       href: '/apps/ecommerce/settings'
  //     })
  //   }

  //   if (ecommerceChildren.length > 0) {
  //     appsChildren.push({
  //       label: dictionary['navigation']?.eCommerce || 'eCommerce',
  //       icon: 'tabler-shopping-cart',
  //       children: ecommerceChildren
  //     })
  //   }
  // }

  // ========== ACADEMY ==========
  // if (hasModuleAccess('academy')) {
  //   const academyChildren: HorizontalMenuDataType[] = []

  //   if (hasPermissionType('academy', 'dashboard')) {
  //     academyChildren.push({
  //       label: dictionary['navigation']?.dashboard || 'Dashboard',
  //       href: '/apps/academy/dashboard'
  //     })
  //   }

  //   if (hasPermissionType('academy', 'courses')) {
  //     academyChildren.push({
  //       label: dictionary['navigation']?.myCourses || 'My Courses',
  //       href: '/apps/academy/my-courses'
  //     })
  //   }

  //   if (hasPermissionType('academy', 'details')) {
  //     academyChildren.push({
  //       label: dictionary['navigation']?.courseDetails || 'Course Details',
  //       href: '/apps/academy/course-details'
  //     })
  //   }

  //   if (academyChildren.length > 0) {
  //     appsChildren.push({
  //       label: dictionary['navigation']?.academy || 'Academy',
  //       icon: 'tabler-school',
  //       children: academyChildren
  //     })
  //   }
  // }

  // ========== LOGISTICS ==========
  // if (hasModuleAccess('logistics')) {
  //   const logisticsChildren: HorizontalMenuDataType[] = []

  //   if (hasPermissionType('logistics', 'dashboard')) {
  //     logisticsChildren.push({
  //       label: dictionary['navigation']?.dashboard || 'Dashboard',
  //       href: '/apps/logistics/dashboard'
  //     })
  //   }

  //   if (hasPermissionType('logistics', 'fleet')) {
  //     logisticsChildren.push({
  //       label: dictionary['navigation']?.fleet || 'Fleet',
  //       href: '/apps/logistics/fleet'
  //     })
  //   }

  //   if (logisticsChildren.length > 0) {
  //     appsChildren.push({
  //       label: dictionary['navigation']?.logistics || 'Logistics',
  //       icon: 'tabler-truck',
  //       children: logisticsChildren
  //     })
  //   }
  // }

  // ========== CONTEUDOS ==========
  if (hasModuleAccess('CONTEUDOS')) {
    const conteudoModulo = getModulo('CONTEUDOS')
    const conteudoChildren: HorizontalMenuDataType[] = []

    tiposConteudo.forEach(tipo => {
      const tipoChildren: HorizontalMenuDataType[] = []

      if (hasPermission('CONTEUDOS', 'CONTEUDOS:Listar')) {
        tipoChildren.push({
          label: dictionary['actions']?._list || 'Listar',
          icon: 'tabler-list',
          href: `/apps/conteudos/${tipo.codigo.toLowerCase()}/list`
        })
      }

      if (hasPermission('CONTEUDOS', 'CONTEUDOS:Criar')) {
        tipoChildren.push({
          label: dictionary['actions']?.create || 'Criar',
          icon: 'tabler-plus',
          href: `/apps/conteudos/${tipo.codigo.toLowerCase()}/create`
        })
      }

      if (tipoChildren.length > 0) {
        conteudoChildren.push({
          label: tipo.nome,
          icon: tipo.icone || 'tabler-file',
          children: tipoChildren
        })
      }
    })

    // Agrupar publicações dentro de um grupo 'publicacoes' e adicionar 'formacoes' como link direto
    const conteudoRootChildren: HorizontalMenuDataType[] = []

    if (conteudoChildren.length > 0) {
      conteudoRootChildren.push({
        label: dictionary['conteudos']?.menu?.publicacoes || 'Publicações',
        icon: 'tabler-file',
        children: conteudoChildren
      })
    }

    // Adiciona 'Formações' como item direto ao nível do módulo Conteúdos
    conteudoRootChildren.push({
      label: dictionary['conteudos']?.menu?.formacoes || 'Formações',
      icon: 'tabler-school',
      href: '/apps/formacoes/list'
    })

    if (conteudoRootChildren.length > 0) {
      menuItems.push({
        label: dictionary['modules']?.conteudos || 'Conteúdos',
        icon: 'tabler-file-text',
        children: conteudoRootChildren
      })
    }
  }

  // ========== RH (RECURSOS HUMANOS) ==========
  if (hasModuleAccess('RH')) {
    // Adicionar módulo RH se tiver itens
    if (hasPermission('RH', 'RH:Listar')) {
      menuItems.push({
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

  // ========== EQUIPAMENTOS & SUPORTE ==========
  const equipamentosSuporteChildren: HorizontalMenuDataType[] = []

  if (hasModuleAccess('EQUIPAMENTOS')) {
    const equipamentosChildren: HorizontalMenuDataType[] = []
    // Equipamentos
    if (hasPermission('EQUIPAMENTOS', 'EQUIPAMENTOS:Listar')) {
      equipamentosChildren.push({
        label: dictionary['equipamentos/suporte'].menu.equipamentos,
        icon: 'tabler-devices',
        href: '/apps/equipamentos'
      })
    }

    // Modelos
    if (hasPermission('EQUIPAMENTOS', 'EQUIPAMENTOS:Listar')) {
      equipamentosChildren.push({
        label: dictionary['equipamentos/suporte'].menu.modelos,
        icon: 'tabler-box-model',
        href: '/apps/equipamentos/modelos'
      })
    }

    // Marcas
    if (hasPermission('EQUIPAMENTOS', 'EQUIPAMENTOS:Listar')) {
      equipamentosChildren.push({
        label: dictionary['equipamentos/suporte'].menu.marcas,
        icon: 'tabler-brand-apple',
        href: '/apps/equipamentos/marcas'
      })
    }

    // Adicionar módulo Equipamentos se tiver itens
    if (equipamentosChildren.length > 0) {
      equipamentosSuporteChildren.push({
        label: dictionary['equipamentos/suporte'].menu.equipamentos,
        icon: 'tabler-device-laptop',
        children: equipamentosChildren
      })
    }
  }

  if (hasModuleAccess('SUPORTE')) {
    const suporteChildren: HorizontalMenuDataType[] = []

    // Meus Tickets
    if (hasPermission('SUPORTE', 'TICKETS:Listar')) {
      suporteChildren.push({
        label: dictionary['equipamentos/suporte'].menu.myTickets,
        icon: 'tabler-user-check',
        href: '/apps/suporte/t-tickets'
      })
    }

    // Triagem
    if (hasPermission('SUPORTE', 'TICKETS:Listar')) {
      suporteChildren.push({
        label: dictionary['equipamentos/suporte'].menu.triage,
        icon: 'tabler-clipboard-list',
        href: '/apps/suporte/triagem'
      })
    }

    // Tickets
    if (hasPermission('SUPORTE', 'TICKETS:Listar')) {
      suporteChildren.push({
        label: dictionary['equipamentos/suporte'].menu.tickets,
        icon: 'tabler-ticket',
        href: '/apps/suporte/tickets'
      })
    }

    // Intervenções
    if (hasPermission('SUPORTE', 'INTERVENCOES:Listar')) {
      suporteChildren.push({
        label: dictionary['equipamentos/suporte'].menu.intervencoes,
        icon: 'tabler-tool',
        href: '/apps/suporte/intervencoes'
      })
    }

    // Adicionar módulo Suporte se tiver itens
    if (suporteChildren.length > 0) {
      equipamentosSuporteChildren.push({
        label: dictionary['equipamentos/suporte'].menu.suporte,
        icon: 'tabler-headset',
        children: suporteChildren
      })
    }
  }

  if (equipamentosSuporteChildren.length > 0) {
    menuItems.push({
      label: dictionary['equipamentos/suporte'].menu.equipamentosSuporte,
      icon: 'tabler-device-laptop',
      children: equipamentosSuporteChildren
    })
  }

  // ========== COMMON APPS ==========
  // appsChildren.push({
  //   label: dictionary['navigation']?.email || 'Email',
  //   icon: 'tabler-mail',
  //   href: '/apps/email',
  //   exactMatch: false,
  //   activeUrl: '/apps/email'
  // })

  // appsChildren.push({
  //   label: dictionary['navigation']?.chat || 'Chat',
  //   icon: 'tabler-message-circle-2',
  //   href: '/apps/chat'
  // })

  // appsChildren.push({
  //   label: dictionary['navigation']?.calendar || 'Calendar',
  //   icon: 'tabler-calendar',
  //   href: '/apps/calendar'
  // })

  // appsChildren.push({
  //   label: dictionary['navigation']?.kanban || 'Kanban',
  //   icon: 'tabler-copy',
  //   href: '/apps/kanban'
  // })

  // // Invoice
  // appsChildren.push({
  //   label: dictionary['navigation']?.invoice || 'Invoice',
  //   icon: 'tabler-file-description',
  //   children: [
  //     {
  //       label: dictionary['navigation']?.list || 'List',
  //       href: '/apps/invoice/list'
  //     },
  //     {
  //       label: dictionary['navigation']?.preview || 'Preview',
  //       href: '/apps/invoice/preview/4987',
  //       exactMatch: false,
  //       activeUrl: '/apps/invoice/preview'
  //     },
  //     {
  //       label: dictionary['navigation']?.edit || 'Edit',
  //       href: '/apps/invoice/edit/4987',
  //       exactMatch: false,
  //       activeUrl: '/apps/invoice/edit'
  //     },
  //     {
  //       label: dictionary['navigation']?.add || 'Add',
  //       href: '/apps/invoice/add'
  //     }
  //   ]
  // })

  // // User
  // appsChildren.push({
  //   label: dictionary['navigation']?.user || 'User',
  //   icon: 'tabler-user',
  //   children: [
  //     {
  //       label: dictionary['navigation']?.list || 'List',
  //       href: '/apps/user/list'
  //     },
  //     {
  //       label: dictionary['navigation']?.view || 'View',
  //       href: '/apps/user/view'
  //     }
  //   ]
  // })

  // // Roles & Permissions
  // appsChildren.push({
  //   label: dictionary['navigation']?.rolesPermissions || 'Roles & Permissions',
  //   icon: 'tabler-lock',
  //   children: [
  //     {
  //       label: dictionary['navigation']?.roles || 'Roles',
  //       href: '/apps/roles'
  //     },
  //     {
  //       label: dictionary['navigation']?.permissions || 'Permissions',
  //       href: '/apps/permissions'
  //     }
  //   ]
  // })

  // // Add Apps menu if has children
  // if (appsChildren.length > 0) {
  //   menuItems.push({
  //     label: dictionary['navigation']?.apps || 'Apps',
  //     icon: 'tabler-layout-grid',
  //     children: appsChildren
  //   })
  // }

  // ==================== PAGES ====================
  // const pagesChildren: HorizontalMenuDataType[] = []

  // pagesChildren.push({
  //   label: dictionary['navigation']?.userProfile || 'User Profile',
  //   icon: 'tabler-user-circle',
  //   href: '/pages/user-profile'
  // })

  // pagesChildren.push({
  //   label: dictionary['navigation']?.accountSettings || 'Account Settings',
  //   icon: 'tabler-settings',
  //   href: '/pages/account-settings'
  // })

  // pagesChildren.push({
  //   label: dictionary['navigation']?.faq || 'FAQ',
  //   icon: 'tabler-help-circle',
  //   href: '/pages/faq'
  // })

  // pagesChildren.push({
  //   label: dictionary['navigation']?.pricing || 'Pricing',
  //   icon: 'tabler-currency-dollar',
  //   href: '/pages/pricing'
  // })

  // if (pagesChildren.length > 0) {
  //   menuItems.push({
  //     label: dictionary['navigation']?.pages || 'Pages',
  //     icon: 'tabler-file',
  //     children: pagesChildren
  //   })
  // }

  // ========== SISTEMA (sempre visível) ==========
  // ========== ADMINISTRAÇÃO ==========
  const sistemaChildren: HorizontalMenuDataType[] = []

  const adminChildren: HorizontalMenuDataType[] = []
  if (hasModuleAccess('UTILIZADORES')) {

    if (hasPermission('UTILIZADORES', 'UTILIZADORES:Listar') || hasPermission('UTILIZADORES', 'UTILIZADORES:Gestao')) {
      adminChildren.push({
        label: dictionary['navigation']?.users || 'Utilizadores',
        icon: 'tabler-users',
        href: '/apps/user/list'
      })
    }

    if (hasPermission('UTILIZADORES', 'UTILIZADORES:GruposListar') || hasPermission('UTILIZADORES', 'UTILIZADORES:GruposGestao')) {
      adminChildren.push({
        label: dictionary['navigation']?.roles || 'Grupos',
        icon: 'tabler-user-shield',
        href: '/apps/roles'
      })
    }

    if (hasPermission('UTILIZADORES', 'UTILIZADORES:PermissoesListar') || hasPermission('UTILIZADORES', 'UTILIZADORES:PermissoesGestao')) {
      adminChildren.push({
        label: dictionary['navigation']?.permissions || 'Permissões',
        icon: 'tabler-lock',
        href: '/apps/permissions'
      })
    }

    if (adminChildren.length > 0) {
      sistemaChildren.push({
        label: dictionary['modules']?.admin || 'Administração',
        icon: 'tabler-settings',
        children: adminChildren
      })
    }
  }

  sistemaChildren.push(
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
  )

  menuItems.push({
    label: dictionary['sistema'].menu.sistema,
    icon: 'tabler-settings',
    children: sistemaChildren
  })

  return menuItems
}

export default horizontalMenuData