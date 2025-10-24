'use client'

// MUI Imports
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Types
import type { FuncionarioContato } from '@/libs/api/funcionarios/types'

interface ContatosProps {
  funcionarioId: number
  contatos: FuncionarioContato[]
  onUpdate: () => void
}

const Contatos = ({ funcionarioId, contatos, onUpdate }: ContatosProps) => {
  return (
    <div>
      {contatos.length === 0 ? (
        <Typography color='text.secondary'>Nenhum contato registrado</Typography>
      ) : (
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Principal</th>
              </tr>
            </thead>
            <tbody>
              {contatos.map((contato) => (
                <tr key={contato.id}>
                  <td>
                    <Typography color='text.primary'>{contato.tipo}</Typography>
                  </td>
                  <td>
                    <Typography variant='body2'>{contato.valor}</Typography>
                  </td>
                  <td>
                    {contato.principal && (
                      <Chip label='Principal' size='small' color='primary' variant='tonal' />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Contatos
