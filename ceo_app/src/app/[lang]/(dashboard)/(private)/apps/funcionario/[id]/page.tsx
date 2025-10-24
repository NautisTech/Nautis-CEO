// Component Imports
import FichaFuncionario from '@views/apps/funcionario/FichaFuncionario'

const FuncionarioPage = ({ params }: { params: { id: string } }) => {
  return <FichaFuncionario funcionarioId={parseInt(params.id)} />
}

export default FuncionarioPage
