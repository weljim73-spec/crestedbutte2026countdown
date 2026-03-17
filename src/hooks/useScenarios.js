import { useState, useEffect, useCallback } from 'react'
import { createDefaultScenario } from '../data/defaults'

const STORAGE_KEY = 'arr_plan_2026_scenarios'
const ACTIVE_KEY  = 'arr_plan_2026_active'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function save(scenarios) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios))
}

export function useScenarios() {
  const [scenarios, setScenarios] = useState(() => {
    const stored = load()
    if (stored && stored.length > 0) return stored
    return [createDefaultScenario('Base Case')]
  })

  const [activeId, setActiveId] = useState(() => {
    const stored = load()
    const savedId = localStorage.getItem(ACTIVE_KEY)
    if (stored && stored.length > 0) {
      return savedId && stored.find(s => s.id === savedId) ? savedId : stored[0].id
    }
    return null
  })

  useEffect(() => {
    if (!activeId && scenarios.length > 0) setActiveId(scenarios[0].id)
  }, [scenarios, activeId])

  useEffect(() => { save(scenarios) }, [scenarios])
  useEffect(() => { if (activeId) localStorage.setItem(ACTIVE_KEY, activeId) }, [activeId])

  const active = scenarios.find(s => s.id === activeId) || scenarios[0]

  const updateScenario = useCallback((patch) => {
    setScenarios(prev => prev.map(s =>
      s.id === active?.id ? { ...s, ...patch, updatedAt: new Date().toISOString() } : s
    ))
  }, [active?.id])

  const newScenario = useCallback((name = 'New Scenario') => {
    const s = createDefaultScenario(name)
    setScenarios(prev => [...prev, s])
    setActiveId(s.id)
    return s
  }, [])

  const duplicateScenario = useCallback(() => {
    if (!active) return
    const copy = { ...JSON.parse(JSON.stringify(active)), id: crypto.randomUUID(), name: active.name + ' (copy)', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    setScenarios(prev => [...prev, copy])
    setActiveId(copy.id)
  }, [active])

  const renameScenario = useCallback((newName) => {
    updateScenario({ name: newName })
  }, [updateScenario])

  const deleteScenario = useCallback(() => {
    if (scenarios.length <= 1) return
    setScenarios(prev => {
      const next = prev.filter(s => s.id !== active?.id)
      setActiveId(next[0]?.id)
      return next
    })
  }, [scenarios.length, active?.id])

  const exportScenario = useCallback(() => {
    if (!active) return
    const blob = new Blob([JSON.stringify(active, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${active.name.replace(/[^a-z0-9]/gi, '_')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [active])

  const importScenario = useCallback((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        const imported = { ...data, id: crypto.randomUUID(), name: data.name || file.name.replace('.json', ''), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        setScenarios(prev => [...prev, imported])
        setActiveId(imported.id)
      } catch { alert('Invalid JSON file') }
    }
    reader.readAsText(file)
  }, [])

  return {
    scenarios,
    active,
    activeId,
    setActiveId,
    updateScenario,
    newScenario,
    duplicateScenario,
    renameScenario,
    deleteScenario,
    exportScenario,
    importScenario,
  }
}
