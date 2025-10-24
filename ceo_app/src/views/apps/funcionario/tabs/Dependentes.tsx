'use client'

import Typography from '@mui/material/Typography'
import tableStyles from '@core/styles/table.module.css'
import type { FuncionarioDependente } from '@/libs/api/funcionarios/types'

interface DependentesProps {
  funcionarioId: number
  dependentes: FuncionarioDependente[]
  onUpdate: () => void
}

const Dependentes = ({ funcionarioId, dependentes, onUpdate }: DependentesProps) => {
  return (
    <div>
      {dependentes.length === 0 ? (
        <Typography color='text.secondary'>Nenhum dependente registrado</Typography>
      ) : (
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Parentesco</th>
                <th>Data de Nascimento</th>
                <th>CPF</th>
              </tr>
            </thead>
            <tbody>
              {dependentes.map((dependente) => (
                <tr key={dependente.id}>
                  <td><Typography color='text.primary'>{dependente.nome}</Typography></td>
                  <td><Typography variant='body2'>{dependente.parentesco}</Typography></td>
                  <td><Typography variant='body2'>{new Date(dependente.data_nascimento).toLocaleDateString('pt-PT')}</Typography></td>
                  <td><Typography variant='body2'>{dependente.cpf || '-'}</Typography></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Dependentes
