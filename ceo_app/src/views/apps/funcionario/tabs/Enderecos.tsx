'use client'

import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import tableStyles from '@core/styles/table.module.css'
import type { FuncionarioEndereco } from '@/libs/api/funcionarios/types'

interface EnderecosProps {
  funcionarioId: number
  enderecos: FuncionarioEndereco[]
  onUpdate: () => void
}

const Enderecos = ({ funcionarioId, enderecos, onUpdate }: EnderecosProps) => {
  return (
    <div>
      {enderecos.length === 0 ? (
        <Typography color='text.secondary'>Nenhum endereço registrado</Typography>
      ) : (
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Endereço</th>
                <th>Cidade</th>
                <th>CEP</th>
                <th>Principal</th>
              </tr>
            </thead>
            <tbody>
              {enderecos.map((endereco) => (
                <tr key={endereco.id}>
                  <td><Typography color='text.primary'>{endereco.tipo}</Typography></td>
                  <td><Typography variant='body2'>{endereco.rua}, {endereco.numero}</Typography></td>
                  <td><Typography variant='body2'>{endereco.cidade}</Typography></td>
                  <td><Typography variant='body2'>{endereco.cep}</Typography></td>
                  <td>{endereco.principal && <Chip label='Principal' size='small' color='primary' variant='tonal' />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Enderecos
