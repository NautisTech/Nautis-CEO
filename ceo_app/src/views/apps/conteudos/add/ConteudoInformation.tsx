'use client'

import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import CustomTextField from '@core/components/mui/TextField'
import { useConteudo } from '@/libs/api/conteudos'

// Importar editor (igual ao ProductInformation)
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import type { Editor } from '@tiptap/core'
import CustomIconButton from '@core/components/mui/IconButton'
import classnames from 'classnames'

// @ts-ignore
import '@/libs/styles/tiptapEditor.css'

type Props = {
  tipo: string
  id: number | null
  viewOnly: boolean
}

const EditorToolbar = ({ editor, disabled }: { editor: Editor | null; disabled?: boolean }) => {
  if (!editor) return null

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 pbs-6 pbe-4 pli-6'>
      <CustomIconButton
        {...(editor.isActive('bold') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={disabled}
      >
        <i className={classnames('tabler-bold', { 'text-textSecondary': !editor.isActive('bold') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('italic') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={disabled}
      >
        <i className={classnames('tabler-italic', { 'text-textSecondary': !editor.isActive('italic') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('underline') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={disabled}
      >
        <i className={classnames('tabler-underline', { 'text-textSecondary': !editor.isActive('underline') })} />
      </CustomIconButton>
      {/* Adicionar mais botões conforme necessário */}
    </div>
  )
}

const ConteudoInformation = ({ tipo, id, viewOnly }: Props) => {
  const { control, setValue, watch } = useFormContext()
  const { data: conteudo } = useConteudo(id || 0, !!id)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Escreva o conteúdo aqui...'
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline
    ],
    editable: !viewOnly,
    immediatelyRender: false,
    content: '',
    onUpdate: ({ editor }) => {
      if (!viewOnly) {
        setValue('conteudo', editor.getHTML())
      }
    }
  })

  // Preencher campos quando carregar dados existentes
  useEffect(() => {
    if (conteudo && id) {
      setValue('titulo', conteudo.titulo)
      setValue('slug', conteudo.slug)
      setValue('subtitulo', conteudo.subtitulo || '')
      setValue('resumo', conteudo.resumo || '')

      if (editor && conteudo.conteudo) {
        editor.commands.setContent(conteudo.conteudo)
      }
    }
  }, [conteudo, id, setValue, editor])

  return (
    <Card>
      <CardHeader title='Informações do Conteúdo' />
      <CardContent>
        <Grid container spacing={6} className='mbe-6'>
          <Grid size={{ xs: 12 }}>
            <Controller
              name='titulo'
              control={control}
              rules={{ required: 'Título é obrigatório' }}
              render={({ field, fieldState }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Título'
                  placeholder='Digite o título'
                  disabled={viewOnly}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name='slug'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Slug'
                  placeholder='slug-do-conteudo'
                  disabled={viewOnly}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name='subtitulo'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Subtítulo'
                  placeholder='Subtítulo (opcional)'
                  disabled={viewOnly}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name='resumo'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Resumo'
                  placeholder='Breve resumo do conteúdo'
                  multiline
                  rows={3}
                  disabled={viewOnly}
                />
              )}
            />
          </Grid>
        </Grid>

        <Typography className='mbe-1'>Conteúdo</Typography>
        <Card className='p-0 border shadow-none'>
          <CardContent className='p-0'>
            <EditorToolbar editor={editor} disabled={viewOnly} />
            <Divider className='mli-6' />
            <EditorContent
              editor={editor}
              className='bs-[300px] overflow-y-auto flex'
            />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

export default ConteudoInformation