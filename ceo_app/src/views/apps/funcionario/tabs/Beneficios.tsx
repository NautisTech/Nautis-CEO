'use client'

import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import tableStyles from '@core/styles/table.module.css'
import type { FuncionarioBeneficio } from '@/libs/api/funcionarios/types'

interface BeneficiosProps {
  funcionarioId: number
  beneficios: FuncionarioBeneficio[]
  onUpdate: () => void
}

const Beneficios = ({ funcionarioId, beneficios, onUpdate }: BeneficiosProps) => {
  return (
    <div>
      {beneficios.length === 0 ? (
        <Typography color='text.secondary'>Nenhum benefício registrado</Typography>
      ) : (
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Data Início</th>
                <th>Data Fim</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {beneficios.map((beneficio) => (
                <tr key={beneficio.id}>
                  <td><Typography color='text.primary'>{beneficio.tipo_beneficio}</Typography></td>
                  <td><Typography variant='body2'>{beneficio.valor ? `€${beneficio.valor.toLocaleString('pt-PT')}` : '-'}</Typography></td>
                  <td><Typography variant='body2'>{new Date(beneficio.data_inicio).toLocaleDateString('pt-PT')}</Typography></td>
                  <td><Typography variant='body2'>{beneficio.data_fim ? new Date(beneficio.data_fim).toLocaleDateString('pt-PT') : '-'}</Typography></td>
                  <td><Chip label={beneficio.ativo ? 'Ativo' : 'Inativo'} size='small' color={beneficio.ativo ? 'success' : 'error'} variant='tonal' /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Beneficios
