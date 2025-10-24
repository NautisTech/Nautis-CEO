'use client'

import Typography from '@mui/material/Typography'
import tableStyles from '@core/styles/table.module.css'
import type { FuncionarioDocumento } from '@/libs/api/funcionarios/types'

interface DocumentosProps {
  funcionarioId: number
  documentos: FuncionarioDocumento[]
  onUpdate: () => void
}

const Documentos = ({ funcionarioId, documentos, onUpdate }: DocumentosProps) => {
  return (
    <div>
      {documentos.length === 0 ? (
        <Typography color='text.secondary'>Nenhum documento registrado</Typography>
      ) : (
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Número</th>
                <th>Data de Emissão</th>
                <th>Data de Validade</th>
              </tr>
            </thead>
            <tbody>
              {documentos.map((documento) => (
                <tr key={documento.id}>
                  <td><Typography color='text.primary'>{documento.tipo_documento}</Typography></td>
                  <td><Typography variant='body2'>{documento.numero_documento}</Typography></td>
                  <td><Typography variant='body2'>{documento.data_emissao ? new Date(documento.data_emissao).toLocaleDateString('pt-PT') : '-'}</Typography></td>
                  <td><Typography variant='body2'>{documento.data_validade ? new Date(documento.data_validade).toLocaleDateString('pt-PT') : '-'}</Typography></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Documentos
