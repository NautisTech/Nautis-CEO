'use client'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

interface EspecificacoesDialogProps {
  open: boolean
  onClose: () => void
  modeloNome: string
  especificacoes: string
}

const EspecificacoesDialog = ({ open, onClose, modeloNome, especificacoes }: EspecificacoesDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <Typography variant='h5'>Especificações - {modeloNome}</Typography>
      </DialogTitle>
      <Divider />

      <DialogContent>
        <Typography variant='body1' className='whitespace-pre-line pbs-5'>
          {especificacoes || 'Sem especificações disponíveis'}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant='contained'>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EspecificacoesDialog
