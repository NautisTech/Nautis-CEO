'use client'

import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import CustomTextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid2'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import type { Pergunta } from '@/libs/api/formacoes'
import { formacoesAPI } from '@/libs/api/formacoes'

interface CriarPerguntaDialogProps {
  open: boolean
  onClose: () => void
  quizId: number
  proximaOrdem: number
  onSuccess: (pergunta: Pergunta) => void
}

const CriarPerguntaDialog = ({ open, onClose, quizId, proximaOrdem, onSuccess }: CriarPerguntaDialogProps) => {
  const [loading, setLoading] = useState(false)
  const [tipo, setTipo] = useState<'multipla' | 'aberta'>('multipla')
  const [enunciado, setEnunciado] = useState('')
  const [pontuacao, setPontuacao] = useState('1')
  const [opcoes, setOpcoes] = useState([
    { texto: '', correta: false },
    { texto: '', correta: false },
    { texto: '', correta: false },
    { texto: '', correta: false }
  ])

  const handleOpcaoChange = (index: number, value: string) => {
    const novasOpcoes = [...opcoes]
    novasOpcoes[index].texto = value
    setOpcoes(novasOpcoes)
  }

  const handleCorretaChange = (index: number) => {
    const novasOpcoes = opcoes.map((opcao, idx) => ({
      ...opcao,
      correta: idx === index
    }))
    setOpcoes(novasOpcoes)
  }

  const handleSubmit = async () => {
    if (!enunciado.trim()) {
      alert('O enunciado da pergunta é obrigatório')
      return
    }

    const pontos = parseInt(pontuacao)
    if (isNaN(pontos) || pontos < 1) {
      alert('A pontuação deve ser um número positivo')
      return
    }

    if (tipo === 'multipla') {
      const todasPreenchidas = opcoes.every(op => op.texto.trim())
      if (!todasPreenchidas) {
        alert('Por favor, preencha todas as 4 opções de resposta')
        return
      }

      const temCorreta = opcoes.some(op => op.correta)
      if (!temCorreta) {
        alert('Por favor, marque qual é a resposta correta')
        return
      }
    }

    try {
      setLoading(true)

      const payload: any = {
        quiz_id: quizId,
        tipo,
        enunciado: enunciado.trim(),
        pontuacao: pontos,
        ordem: proximaOrdem
      }

      if (tipo === 'multipla') {
        payload.opcoes = opcoes.map((opcao, idx) => ({
          texto: opcao.texto.trim(),
          correta: opcao.correta,
          ordem: idx + 1
        }))
      }

      const novaPergunta = await formacoesAPI.criarPergunta(payload)
      onSuccess(novaPergunta)
      handleClose()
    } catch (err) {
      console.error('Erro ao criar pergunta:', err)
      alert('Erro ao criar pergunta')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setTipo('multipla')
    setEnunciado('')
    setPontuacao('1')
    setOpcoes([
      { texto: '', correta: false },
      { texto: '', correta: false },
      { texto: '', correta: false },
      { texto: '', correta: false }
    ])
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <div className='flex items-center justify-between'>
          <Typography variant='h5'>Adicionar Pergunta</Typography>
          <IconButton onClick={handleClose} size='small'>
            <i className='tabler-x' />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={5} className='pbs-5'>
          <Grid size={{ xs: 12 }}>
            <FormLabel component='legend'>Tipo de Pergunta</FormLabel>
            <RadioGroup row value={tipo} onChange={(e) => setTipo(e.target.value as 'multipla' | 'aberta')}>
              <FormControlLabel value='multipla' control={<Radio />} label='Múltipla Escolha (4 opções)' />
              <FormControlLabel value='aberta' control={<Radio />} label='Pergunta Aberta' />
            </RadioGroup>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CustomTextField
              fullWidth
              label='Enunciado da Pergunta'
              value={enunciado}
              onChange={(e) => setEnunciado(e.target.value)}
              placeholder='Digite a pergunta...'
              multiline
              rows={3}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              label='Pontuação'
              type='number'
              value={pontuacao}
              onChange={(e) => setPontuacao(e.target.value)}
              InputProps={{ inputProps: { min: 1 } }}
              required
            />
          </Grid>

          {tipo === 'multipla' && (
            <Grid size={{ xs: 12 }}>
              <FormLabel component='legend' className='mbe-2'>
                Opções de Resposta (marque a correta)
              </FormLabel>
              <Grid container spacing={4}>
                {opcoes.map((opcao, index) => (
                  <Grid size={{ xs: 12 }} key={index}>
                    <div className='flex items-center gap-4'>
                      <div className='flex items-center gap-2' style={{ minWidth: '120px' }}>
                        <Typography variant='body1' className='font-medium'>
                          {String.fromCharCode(65 + index)}.
                        </Typography>
                        <Checkbox
                          checked={opcao.correta}
                          onChange={() => handleCorretaChange(index)}
                          color='success'
                        />
                        <Typography variant='body2' color='text.secondary'>
                          Correta
                        </Typography>
                      </div>
                      <CustomTextField
                        fullWidth
                        placeholder={`Opção ${String.fromCharCode(65 + index)}`}
                        value={opcao.texto}
                        onChange={(e) => handleOpcaoChange(index, e.target.value)}
                        required
                      />
                    </div>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}

          {tipo === 'aberta' && (
            <Grid size={{ xs: 12 }}>
              <Typography variant='body2' color='text.secondary'>
                Esta pergunta será respondida em formato de texto livre pelos alunos. A correção deverá ser feita
                manualmente.
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant='tonal' color='secondary'>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant='contained' disabled={loading}>
          {loading ? 'Adicionando...' : 'Adicionar Pergunta'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CriarPerguntaDialog
