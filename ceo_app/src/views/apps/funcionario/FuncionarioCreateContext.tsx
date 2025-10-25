'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface FuncionarioCreateData {
  contatos: any[]
  enderecos: any[]
  empregos: any[]
  beneficios: any[]
  documentos: any[]
}

interface FuncionarioCreateContextType {
  data: FuncionarioCreateData
  addContato: (contato: any) => void
  updateContato: (index: number, contato: any) => void
  removeContato: (index: number) => void
  addEndereco: (endereco: any) => void
  updateEndereco: (index: number, endereco: any) => void
  removeEndereco: (index: number) => void
  addEmprego: (emprego: any) => void
  updateEmprego: (index: number, emprego: any) => void
  removeEmprego: (index: number) => void
  addBeneficio: (beneficio: any) => void
  updateBeneficio: (index: number, beneficio: any) => void
  removeBeneficio: (index: number) => void
  addDocumento: (documento: any) => void
  updateDocumento: (index: number, documento: any) => void
  removeDocumento: (index: number) => void
  clearAll: () => void
}

const FuncionarioCreateContext = createContext<FuncionarioCreateContextType | undefined>(undefined)

export function FuncionarioCreateProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FuncionarioCreateData>({
    contatos: [],
    enderecos: [],
    empregos: [],
    beneficios: [],
    documentos: []
  })

  const addContato = (contato: any) => {
    setData(prev => ({ ...prev, contatos: [...prev.contatos, contato] }))
  }

  const updateContato = (index: number, contato: any) => {
    setData(prev => ({
      ...prev,
      contatos: prev.contatos.map((c, i) => (i === index ? contato : c))
    }))
  }

  const removeContato = (index: number) => {
    setData(prev => ({
      ...prev,
      contatos: prev.contatos.filter((_, i) => i !== index)
    }))
  }

  const addEndereco = (endereco: any) => {
    setData(prev => ({ ...prev, enderecos: [...prev.enderecos, endereco] }))
  }

  const updateEndereco = (index: number, endereco: any) => {
    setData(prev => ({
      ...prev,
      enderecos: prev.enderecos.map((e, i) => (i === index ? endereco : e))
    }))
  }

  const removeEndereco = (index: number) => {
    setData(prev => ({
      ...prev,
      enderecos: prev.enderecos.filter((_, i) => i !== index)
    }))
  }

  const addEmprego = (emprego: any) => {
    setData(prev => ({ ...prev, empregos: [...prev.empregos, emprego] }))
  }

  const updateEmprego = (index: number, emprego: any) => {
    setData(prev => ({
      ...prev,
      empregos: prev.empregos.map((e, i) => (i === index ? emprego : e))
    }))
  }

  const removeEmprego = (index: number) => {
    setData(prev => ({
      ...prev,
      empregos: prev.empregos.filter((_, i) => i !== index)
    }))
  }

  const addBeneficio = (beneficio: any) => {
    setData(prev => ({ ...prev, beneficios: [...prev.beneficios, beneficio] }))
  }

  const updateBeneficio = (index: number, beneficio: any) => {
    setData(prev => ({
      ...prev,
      beneficios: prev.beneficios.map((b, i) => (i === index ? beneficio : b))
    }))
  }

  const removeBeneficio = (index: number) => {
    setData(prev => ({
      ...prev,
      beneficios: prev.beneficios.filter((_, i) => i !== index)
    }))
  }

  const addDocumento = (documento: any) => {
    setData(prev => ({ ...prev, documentos: [...prev.documentos, documento] }))
  }

  const updateDocumento = (index: number, documento: any) => {
    setData(prev => ({
      ...prev,
      documentos: prev.documentos.map((d, i) => (i === index ? documento : d))
    }))
  }

  const removeDocumento = (index: number) => {
    setData(prev => ({
      ...prev,
      documentos: prev.documentos.filter((_, i) => i !== index)
    }))
  }

  const clearAll = () => {
    setData({
      contatos: [],
      enderecos: [],
      empregos: [],
      beneficios: [],
      documentos: []
    })
  }

  return (
    <FuncionarioCreateContext.Provider
      value={{
        data,
        addContato,
        updateContato,
        removeContato,
        addEndereco,
        updateEndereco,
        removeEndereco,
        addEmprego,
        updateEmprego,
        removeEmprego,
        addBeneficio,
        updateBeneficio,
        removeBeneficio,
        addDocumento,
        updateDocumento,
        removeDocumento,
        clearAll
      }}
    >
      {children}
    </FuncionarioCreateContext.Provider>
  )
}

export function useFuncionarioCreate() {
  const context = useContext(FuncionarioCreateContext)
  if (context === undefined) {
    throw new Error('useFuncionarioCreate must be used within a FuncionarioCreateProvider')
  }
  return context
}
