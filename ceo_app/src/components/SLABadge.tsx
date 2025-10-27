'use client'

// MUI Imports
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'

interface SLABadgeProps {
  slaStatus?: 'ok' | 'warning' | 'overdue'
  tempoRestanteMinutos?: number
  slaHoras?: number
  dataLimite?: string
}

const SLABadge = ({ slaStatus, tempoRestanteMinutos, slaHoras, dataLimite }: SLABadgeProps) => {
  if (!slaStatus) return null

  // Se temos dataLimite mas não temos slaHoras, calculamos
  let slaHorasCalculado = slaHoras
  if (!slaHorasCalculado && dataLimite && tempoRestanteMinutos !== undefined) {
    // Estimar SLA em horas baseado no tempo restante
    slaHorasCalculado = Math.abs(Math.ceil(tempoRestanteMinutos / 60))
  }

  if (!slaHorasCalculado) return null

  const getColor = () => {
    switch (slaStatus) {
      case 'ok':
        return 'success'
      case 'warning':
        return 'warning'
      case 'overdue':
        return 'error'
      default:
        return 'default'
    }
  }

  const getLabel = () => {
    if (!tempoRestanteMinutos) return 'N/A'

    if (tempoRestanteMinutos < 0) {
      const horasAtrasadas = Math.abs(Math.floor(tempoRestanteMinutos / 60))
      const minutosAtrasados = Math.abs(tempoRestanteMinutos % 60)

      if (horasAtrasadas > 0) {
        return `Atrasado ${horasAtrasadas}h${minutosAtrasados > 0 ? ` ${minutosAtrasados}m` : ''}`
      }

      return `Atrasado ${minutosAtrasados}m`
    }

    const horas = Math.floor(tempoRestanteMinutos / 60)
    const minutos = tempoRestanteMinutos % 60

    if (horas > 0) {
      return `${horas}h${minutos > 0 ? ` ${minutos}m` : ''}`
    }

    return `${minutos}m`
  }

  const getTooltip = () => {
    return `SLA: ${slaHorasCalculado}h | ${getLabel()}`
  }

  return (
    <Tooltip title={getTooltip()}>
      <Chip
        label={getLabel()}
        size='small'
        color={getColor()}
        variant='tonal'
        icon={
          <i
            className={`tabler-${slaStatus === 'overdue' ? 'alert-triangle' : slaStatus === 'warning' ? 'clock-hour-4' : 'circle-check'} text-sm`}
          />
        }
      />
    </Tooltip>
  )
}

export default SLABadge
