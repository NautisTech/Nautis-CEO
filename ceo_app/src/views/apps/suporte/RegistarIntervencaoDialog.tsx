'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import CustomTextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid2'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs, { Dayjs } from 'dayjs'

// API Imports
import { intervencoesAPI } from '@/libs/api/intervencoes'
import type { CriarIntervencaoDto, TipoIntervencao, StatusIntervencao, Intervencao } from '@/libs/api/intervencoes'
import { equipamentosAPI } from '@/libs/api/equipamentos'
import { funcionariosAPI } from '@/libs/api/funcionarios'

interface RegistarIntervencaoDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  ticketId?: number
  equipamentoId?: number
  intervencao?: Intervencao | null
  mode?: 'create' | 'edit'
}

const RegistarIntervencaoDialog = ({
  open,
  onClose,
  onSuccess,
  ticketId,
  equipamentoId,
  intervencao,
  mode = 'create'
}: RegistarIntervencaoDialogProps) => {
  const [loading, setLoading] = useState(false)
  const [equipamentos, setEquipamentos] = useState<any[]>([])
  const [tecnicos, setTecnicos] = useState<any[]>([])

  const [formData, setFormData] = useState<{
    equipamento_id: number | ''
    tipo: TipoIntervencao | ''
    titulo: string
    descricao: string
    diagnostico: string
    solucao: string
    tecnico_id: number | ''
    data_inicio: Dayjs | null
    data_fim: Dayjs | null
    duracao_minutos: number | ''
    custo_mao_obra: number | ''
    custo_pecas: number | ''
    fornecedor_externo: string
    numero_fatura: string
    garantia: boolean
    observacoes: string
    status: StatusIntervencao
  }>({
    equipamento_id: equipamentoId || '',
    tipo: '',
    titulo: '',
    descricao: '',
    diagnostico: '',
    solucao: '',
    tecnico_id: '',
    data_inicio: dayjs(),
    data_fim: null,
    duracao_minutos: '',
    custo_mao_obra: '',
    custo_pecas: '',
    fornecedor_externo: '',
    numero_fatura: '',
    garantia: false,
    observacoes: '',
    status: 'agendada'
  })

  useEffect(() => {
    if (open) {
      fetchEquipamentos()
      fetchTecnicos()

      // Se estamos em modo de edição e temos uma intervenção, preencher o formulário
      if (mode === 'edit' && intervencao) {
        setFormData({
          equipamento_id: intervencao.equipamento_id,
          tipo: intervencao.tipo as TipoIntervencao,
          titulo: intervencao.titulo,
          descricao: intervencao.descricao || '',
          diagnostico: intervencao.diagnostico || '',
          solucao: intervencao.solucao || '',
          tecnico_id: intervencao.tecnico_id,
          data_inicio: intervencao.data_inicio ? dayjs(intervencao.data_inicio) : dayjs(),
          data_fim: intervencao.data_fim ? dayjs(intervencao.data_fim) : null,
          duracao_minutos: intervencao.duracao_minutos || '',
          custo_mao_obra: intervencao.custo_mao_obra || '',
          custo_pecas: intervencao.custo_pecas || '',
          fornecedor_externo: intervencao.fornecedor_externo || '',
          numero_fatura: intervencao.numero_fatura || '',
          garantia: intervencao.garantia || false,
          observacoes: intervencao.observacoes || '',
          status: intervencao.status as StatusIntervencao
        })
      }
    }
  }, [open, mode, intervencao])

  const fetchEquipamentos = async () => {
    try {
      const data = await equipamentosAPI.list()
      setEquipamentos(Array.isArray(data) ? data : data.data || [])
    } catch (error) {
      console.error('Erro ao carregar equipamentos:', error)
    }
  }

  const fetchTecnicos = async () => {
    try {
      const data = await funcionariosAPI.list()
      setTecnicos(Array.isArray(data) ? data : data.data || [])
    } catch (error) {
      console.error('Erro ao carregar técnicos:', error)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Calculate custo_total
      const custoMaoObra = Number(formData.custo_mao_obra) || 0
      const custoPecas = Number(formData.custo_pecas) || 0
      const custoTotal = custoMaoObra + custoPecas

      const dto: CriarIntervencaoDto = {
        ticket_id: ticketId,
        equipamento_id: Number(formData.equipamento_id),
        tipo: formData.tipo as TipoIntervencao,
        titulo: formData.titulo,
        descricao: formData.descricao || undefined,
        diagnostico: formData.diagnostico || undefined,
        solucao: formData.solucao || undefined,
        tecnico_id: Number(formData.tecnico_id),
        data_inicio: formData.data_inicio?.toISOString() || dayjs().toISOString(),
        data_fim: formData.data_fim?.toISOString() || undefined,
        duracao_minutos: formData.duracao_minutos ? Number(formData.duracao_minutos) : undefined,
        custo_mao_obra: custoMaoObra || undefined,
        custo_pecas: custoPecas || undefined,
        custo_total: custoTotal || undefined,
        fornecedor_externo: formData.fornecedor_externo || undefined,
        numero_fatura: formData.numero_fatura || undefined,
        garantia: formData.garantia,
        observacoes: formData.observacoes || undefined,
        status: formData.status
      }

      if (mode === 'edit' && intervencao) {
        await intervencoesAPI.update(intervencao.id, dto)
      } else {
        await intervencoesAPI.create(dto)
      }

      onSuccess()
      handleClose()
    } catch (error) {
      console.error(`Erro ao ${mode === 'edit' ? 'atualizar' : 'criar'} intervenção:`, error)
      alert(`Erro ao ${mode === 'edit' ? 'atualizar' : 'criar'} intervenção`)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      equipamento_id: equipamentoId || '',
      tipo: '',
      titulo: '',
      descricao: '',
      diagnostico: '',
      solucao: '',
      tecnico_id: '',
      data_inicio: dayjs(),
      data_fim: null,
      duracao_minutos: '',
      custo_mao_obra: '',
      custo_pecas: '',
      fornecedor_externo: '',
      numero_fatura: '',
      garantia: false,
      observacoes: '',
      status: 'agendada'
    })
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle>{mode === 'edit' ? 'Editar Intervenção' : 'Registar Intervenção'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={4} className='mt-2'>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              select
              fullWidth
              label='Equipamento'
              value={formData.equipamento_id}
              onChange={e => setFormData({ ...formData, equipamento_id: Number(e.target.value) })}
              required
            >
              {equipamentos.map(eq => (
                <MenuItem key={eq.id} value={eq.id}>
                  {eq.numero_interno} - {eq.marca_nome} {eq.modelo_nome}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              select
              fullWidth
              label='Tipo'
              value={formData.tipo}
              onChange={e => setFormData({ ...formData, tipo: e.target.value as TipoIntervencao })}
              required
            >
              <MenuItem value='preventiva'>Preventiva</MenuItem>
              <MenuItem value='corretiva'>Corretiva</MenuItem>
              <MenuItem value='instalacao'>Instalação</MenuItem>
              <MenuItem value='configuracao'>Configuração</MenuItem>
              <MenuItem value='upgrade'>Upgrade</MenuItem>
              <MenuItem value='manutencao'>Manutenção</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CustomTextField
              fullWidth
              label='Título'
              value={formData.titulo}
              onChange={e => setFormData({ ...formData, titulo: e.target.value })}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CustomTextField
              fullWidth
              multiline
              rows={3}
              label='Descrição'
              value={formData.descricao}
              onChange={e => setFormData({ ...formData, descricao: e.target.value })}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              multiline
              rows={2}
              label='Diagnóstico'
              value={formData.diagnostico}
              onChange={e => setFormData({ ...formData, diagnostico: e.target.value })}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              multiline
              rows={2}
              label='Solução'
              value={formData.solucao}
              onChange={e => setFormData({ ...formData, solucao: e.target.value })}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              select
              fullWidth
              label='Técnico Responsável'
              value={formData.tecnico_id}
              onChange={e => setFormData({ ...formData, tecnico_id: Number(e.target.value) })}
              required
            >
              {tecnicos.map(tec => (
                <MenuItem key={tec.id} value={tec.id}>
                  {tec.nome_completo}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              select
              fullWidth
              label='Status'
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as StatusIntervencao })}
              required
            >
              <MenuItem value='agendada'>Agendada</MenuItem>
              <MenuItem value='em_progresso'>Em Progresso</MenuItem>
              <MenuItem value='concluida'>Concluída</MenuItem>
              <MenuItem value='cancelada'>Cancelada</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label='Data Início'
                value={formData.data_inicio}
                onChange={newValue => setFormData({ ...formData, data_inicio: newValue })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label='Data Fim'
                value={formData.data_fim}
                onChange={newValue => setFormData({ ...formData, data_fim: newValue })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <CustomTextField
              fullWidth
              type='number'
              label='Duração (minutos)'
              value={formData.duracao_minutos}
              onChange={e => setFormData({ ...formData, duracao_minutos: Number(e.target.value) })}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <CustomTextField
              fullWidth
              type='number'
              label='Custo Mão de Obra (€)'
              value={formData.custo_mao_obra}
              onChange={e => setFormData({ ...formData, custo_mao_obra: Number(e.target.value) })}
              inputProps={{ step: '0.01' }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <CustomTextField
              fullWidth
              type='number'
              label='Custo Peças (€)'
              value={formData.custo_pecas}
              onChange={e => setFormData({ ...formData, custo_pecas: Number(e.target.value) })}
              inputProps={{ step: '0.01' }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              label='Fornecedor Externo'
              value={formData.fornecedor_externo}
              onChange={e => setFormData({ ...formData, fornecedor_externo: e.target.value })}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              label='Número da Fatura'
              value={formData.numero_fatura}
              onChange={e => setFormData({ ...formData, numero_fatura: e.target.value })}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.garantia}
                  onChange={e => setFormData({ ...formData, garantia: e.target.checked })}
                />
              }
              label='Em Garantia'
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CustomTextField
              fullWidth
              multiline
              rows={3}
              label='Observações'
              value={formData.observacoes}
              onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant='contained'
          disabled={loading || !formData.equipamento_id || !formData.tipo || !formData.titulo || !formData.tecnico_id}
        >
          {loading
            ? mode === 'edit' ? 'A atualizar...' : 'A criar...'
            : mode === 'edit' ? 'Atualizar Intervenção' : 'Criar Intervenção'
          }
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RegistarIntervencaoDialog
