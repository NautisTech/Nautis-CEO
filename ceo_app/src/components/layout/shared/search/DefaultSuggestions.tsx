// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Locale } from '@configs/i18n'
import type { getDictionary } from '@/utils/getDictionary'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

type DefaultSuggestionsType = {
  sectionLabel: string
  items: {
    label: string
    href: string
    icon?: string
  }[]
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

type Props = {
  setOpen: (value: boolean) => void
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  modulos: Modulo[]
  tiposConteudo: TipoConteudo[]
}

const generateDefaultSuggestions = (
  dictionary: Awaited<ReturnType<typeof getDictionary>>,
  modulos: Modulo[] = [],
  tiposConteudo: TipoConteudo[] = []
): DefaultSuggestionsType[] => {
  const suggestions: DefaultSuggestionsType[] = []

  // Helper para verificar se tem acesso a um módulo
  const hasModuleAccess = (moduloNome: string): boolean => {
    const modulo = modulos.find(m => m.modulo === moduloNome)
    return modulo !== undefined && modulo.permissoes.length > 0
  }

  // Helper para obter um módulo
  const getModulo = (moduloNome: string) => {
    return modulos.find(m => m.modulo === moduloNome)
  }

  // Helper para verificar permissão
  const hasPermission = (moduloNome: string, codigo: string): boolean => {
    const modulo = getModulo(moduloNome)
    return modulo?.permissoes.some(p => p.codigo === codigo) || false
  }

  // ==================== DASHBOARDS (Popular Searches) ====================
  const dashboardsLabel = dictionary['navigation']?.dashboards || 'Dashboards'
  const dashboardItems: { label: string; href: string; icon: string }[] = []

  // Dashboard Principal (sempre visível)
  dashboardItems.push({
    label: (dictionary as any)['dashboards']?.menu?.main || 'Home Dashboard',
    href: '/dashboards/home',
    icon: 'tabler-home'
  })

  // Dashboard de Conteúdos
  if (hasModuleAccess('CONTEUDOS')) {
    dashboardItems.push({
      label: (dictionary as any)['dashboards']?.menu?.content || 'Contents Dashboard',
      href: '/dashboards/conteudos',
      icon: 'tabler-file-analytics'
    })
  }

  // Dashboard de Administração
  if (hasModuleAccess('UTILIZADORES')) {
    dashboardItems.push({
      label: (dictionary as any)['dashboards']?.menu?.admin || 'Admin Dashboard',
      href: '/dashboards/admin',
      icon: 'tabler-dashboard'
    })
  }

  if (dashboardItems.length > 0) {
    suggestions.push({
      sectionLabel: dashboardsLabel,
      items: dashboardItems
    })
  }

  // ==================== CONTEÚDOS ====================
  if (hasModuleAccess('CONTEUDOS') && tiposConteudo.length > 0) {
    const conteudosLabel = dictionary['modules']?.conteudos || 'Conteúdos'
    const conteudoItems: { label: string; href: string; icon: string }[] = []

    // Pegar os primeiros 3-4 tipos de conteúdo mais importantes
    tiposConteudo.slice(0, 3).forEach(tipo => {
      if (hasPermission('CONTEUDOS', 'CONTEUDOS:Listar')) {
        conteudoItems.push({
          label: `${tipo.nome} - ${dictionary['actions']?._list || 'Listar'}`,
          href: `/apps/conteudos/${tipo.codigo.toLowerCase()}/list`,
          icon: 'tabler-list'
        })
      }
    })

    if (conteudoItems.length > 0) {
      suggestions.push({
        sectionLabel: conteudosLabel,
        items: conteudoItems
      })
    }
  }

  // ==================== ADMINISTRAÇÃO (SISTEMA) ====================
  if (hasModuleAccess('UTILIZADORES')) {
    const sistemaLabel = dictionary?.sistema?.menu?.sistema || 'Sistema'
    const adminLabel = dictionary['modules']?.admin || 'Administração'
    const adminItems: { label: string; href: string; icon: string }[] = []

    // Utilizadores
    if (
      hasPermission('UTILIZADORES', 'UTILIZADORES:Listar') ||
      hasPermission('UTILIZADORES', 'UTILIZADORES:Gestao')
    ) {
      adminItems.push({
        label: `${adminLabel} - ${dictionary['navigation']?.users || 'Utilizadores'}`,
        href: '/apps/user/list',
        icon: 'tabler-users'
      })
    }

    // Grupos
    if (
      hasPermission('UTILIZADORES', 'UTILIZADORES:GruposListar') ||
      hasPermission('UTILIZADORES', 'UTILIZADORES:GruposGestao')
    ) {
      adminItems.push({
        label: `${adminLabel} - ${dictionary['navigation']?.roles || 'Grupos'}`,
        href: '/apps/roles',
        icon: 'tabler-shield'
      })
    }

    // Permissões
    if (
      hasPermission('UTILIZADORES', 'UTILIZADORES:PermissoesListar') ||
      hasPermission('UTILIZADORES', 'UTILIZADORES:PermissoesGestao')
    ) {
      adminItems.push({
        label: `${adminLabel} - ${dictionary['navigation']?.permissions || 'Permissões'}`,
        href: '/apps/permissions',
        icon: 'tabler-lock'
      })
    }

    if (adminItems.length > 0) {
      suggestions.push({
        sectionLabel: sistemaLabel,
        items: adminItems
      })
    }
  }

  // ==================== SISTEMA (Configurações) ====================
  const sistemaLabel = dictionary?.sistema?.menu?.sistema || 'Sistema'
  const sistemaMenu = dictionary?.sistema?.menu ?? {
    configuracoes: 'Configurações',
    conexoes: 'Conexões'
  }
  const sistemaItems: { label: string; href: string; icon: string }[] = []

  // Configurações
  sistemaItems.push({
    label: sistemaMenu.configuracoes,
    href: '/apps/configuracoes',
    icon: 'tabler-settings-cog'
  })

  // Conexões
  sistemaItems.push({
    label: sistemaMenu.conexoes,
    href: '/apps/conexoes',
    icon: 'tabler-plug-connected'
  })

  if (sistemaItems.length > 0 && !hasModuleAccess('UTILIZADORES')) {
    // Se não tem admin, mostrar Sistema como seção separada
    suggestions.push({
      sectionLabel: sistemaLabel,
      items: sistemaItems
    })
  } else if (sistemaItems.length > 0 && hasModuleAccess('UTILIZADORES')) {
    // Se tem admin, adicionar às sugestões mas não como seção separada (já está em Sistema acima)
    // Mas vamos adicionar como seção separada também para ter mais links
    const existingSistemaSection = suggestions.find(s => s.sectionLabel === sistemaLabel)
    if (existingSistemaSection) {
      existingSistemaSection.items.push(...sistemaItems)
    }
  }

  // ==================== OUTROS MÓDULOS ====================
  const otherItems: { label: string; href: string; icon: string }[] = []

  // RH
  if (hasModuleAccess('RH')) {
    const rhLabel = dictionary['modules']?.rh || 'RH'
    if (hasPermission('RH', 'RH:Listar')) {
      otherItems.push({
        label: dictionary['funcionarios']?.menu || 'Funcionários',
        href: '/apps/funcionarios/list',
        icon: 'tabler-users'
      })
    }
  }

  // Equipamentos
  if (hasModuleAccess('EQUIPAMENTOS')) {
    if (hasPermission('EQUIPAMENTOS', 'EQUIPAMENTOS:Listar')) {
      otherItems.push({
        label: dictionary['equipamentos/suporte']?.menu?.equipamentos || 'Equipamentos',
        href: '/apps/equipamentos',
        icon: 'tabler-devices'
      })
    }
    if (hasPermission('EQUIPAMENTOS', 'EQUIPAMENTOS:Listar')) {
      otherItems.push({
        label: `${dictionary['equipamentos/suporte']?.menu?.equipamentos || 'Equipamentos'} - ${dictionary['equipamentos/suporte']?.menu?.modelos || 'Modelos'}`,
        href: '/apps/equipamentos/modelos',
        icon: 'tabler-box-model'
      })
    }
  }

  // Suporte
  if (hasModuleAccess('SUPORTE')) {
    if (hasPermission('SUPORTE', 'TICKETS:Listar')) {
      otherItems.push({
        label: dictionary['equipamentos/suporte']?.menu?.myTickets || 'Meus Tickets',
        href: '/apps/suporte/t-tickets',
        icon: 'tabler-user-check'
      })
    }
    if (hasPermission('SUPORTE', 'TICKETS:Listar')) {
      otherItems.push({
        label: `${dictionary['equipamentos/suporte']?.menu?.suporte || 'Suporte'} - ${dictionary['equipamentos/suporte']?.menu?.tickets || 'Tickets'}`,
        href: '/apps/suporte/tickets',
        icon: 'tabler-ticket'
      })
    }
  }

  if (otherItems.length > 0) {
    suggestions.push({
      sectionLabel: dictionary['navigation']?.appsPages || 'Apps & Pages',
      items: otherItems
    })
  }

  return suggestions
}

const DefaultSuggestions = ({ setOpen, dictionary, modulos, tiposConteudo }: Props) => {
  // Hooks
  const { lang: locale } = useParams()

  const suggestions = generateDefaultSuggestions(dictionary, modulos, tiposConteudo)

  return (
    <div className='flex grow flex-wrap gap-x-[48px] gap-y-8 plb-14 pli-16 overflow-y-auto overflow-x-hidden bs-full'>
      {suggestions.map((section, index) => (
        <div
          key={index}
          className='flex flex-col justify-center overflow-x-hidden gap-4 basis-full sm:basis-[calc((100%-3rem)/2)]'
        >
          <p className='text-xs leading-[1.16667] uppercase text-textDisabled tracking-[0.8px]'>
            {section.sectionLabel}
          </p>
          <ul className='flex flex-col gap-4'>
            {section.items.map((item, i) => (
              <li key={i} className='flex'>
                <Link
                  href={getLocalizedUrl(item.href, locale as Locale)}
                  className='flex items-center overflow-x-hidden cursor-pointer gap-2 hover:text-primary focus-visible:text-primary focus-visible:outline-0'
                  onClick={() => setOpen(false)}
                >
                  {item.icon && <i className={classnames(item.icon, 'flex text-xl')} />}
                  <p className='text-[15px] leading-[1.4667] truncate'>{item.label}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default DefaultSuggestions
