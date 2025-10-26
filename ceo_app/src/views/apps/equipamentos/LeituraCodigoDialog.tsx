'use client'

// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// Third-party Imports
import QRCode from 'qrcode'
import JsBarcode from 'jsbarcode'

interface LeituraCodigoDialogProps {
  open: boolean
  onClose: () => void
  codigo: string
  tipo: string
  marcaNome: string
}

const LeituraCodigoDialog = ({ open, onClose, codigo, tipo, marcaNome }: LeituraCodigoDialogProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!open || !codigo) return

    const tipoLower = tipo?.toLowerCase() || 'qrcode'

    if (tipoLower.includes('qr') || tipoLower === 'qrcode') {
      // Generate QR Code
      if (canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, codigo, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        }).catch(err => {
          console.error('Error generating QR code:', err)
        })
      }
    } else if (tipoLower.includes('bar') || tipoLower === 'barcode') {
      // Generate Barcode
      if (svgRef.current) {
        try {
          JsBarcode(svgRef.current, codigo, {
            format: 'CODE128',
            width: 2,
            height: 100,
            displayValue: true,
            fontSize: 14,
            margin: 10
          })
        } catch (err) {
          console.error('Error generating barcode:', err)
        }
      }
    }
  }, [open, codigo, tipo])

  const tipoLower = tipo?.toLowerCase() || 'qrcode'
  const isQRCode = tipoLower.includes('qr') || tipoLower === 'qrcode'
  const isBarcode = tipoLower.includes('bar') || tipoLower === 'barcode'

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        <Typography variant='h5'>Código de Leitura - {marcaNome}</Typography>
      </DialogTitle>

      <DialogContent>
        <div className='flex flex-col items-center gap-4 pbs-5'>
          <Typography variant='body1' color='text.secondary'>
            Tipo: <strong>{tipo || 'N/A'}</strong>
          </Typography>

          <Typography variant='body1' color='text.secondary'>
            Código: <strong>{codigo}</strong>
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 200,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              padding: 3,
              backgroundColor: 'background.paper'
            }}
          >
            {isQRCode && (
              <canvas ref={canvasRef} />
            )}
            {isBarcode && (
              <svg ref={svgRef} />
            )}
            {!isQRCode && !isBarcode && (
              <Typography variant='body2' color='text.disabled'>
                Tipo de código não suportado para visualização gráfica
              </Typography>
            )}
          </Box>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant='contained'>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LeituraCodigoDialog
