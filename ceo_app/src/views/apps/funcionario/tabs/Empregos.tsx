'use client'

import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import tableStyles from '@core/styles/table.module.css'
import type { FuncionarioEmprego } from '@/libs/api/funcionarios/types'

interface EmpregosProps {
  funcionarioId: number
  empregos: FuncionarioEmprego[]
  onUpdate: () => void
}

const Empregos = ({ funcionarioId, empregos, onUpdate }: EmpregosProps) => {
  return (
    <div>
      {empregos.length === 0 ? (
        <Typography color='text.secondary'>Nenhum emprego registrado</Typography>
      ) : (
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Cargo</th>
                <th>Departamento</th>
                <th>Salário</th>
                <th>Data Início</th>
                <th>Data Fim</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {empregos.map((emprego) => (
                <tr key={emprego.id}>
                  <td><Typography color='text.primary'>{emprego.cargo}</Typography></td>
                  <td><Typography variant='body2'>{emprego.departamento || '-'}</Typography></td>
                  <td><Typography variant='body2'>{emprego.salario ? `€${emprego.salario.toLocaleString('pt-PT')}` : '-'}</Typography></td>
                  <td><Typography variant='body2'>{new Date(emprego.data_inicio).toLocaleDateString('pt-PT')}</Typography></td>
                  <td><Typography variant='body2'>{emprego.data_fim ? new Date(emprego.data_fim).toLocaleDateString('pt-PT') : '-'}</Typography></td>
                  <td>{emprego.atual && <Chip label='Atual' size='small' color='success' variant='tonal' />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Empregos
