import { useState, useRef } from 'react'

export default function ScenarioBar({
  scenarios, active, activeId, setActiveId,
  newScenario, duplicateScenario, renameScenario, deleteScenario,
  exportScenario, importScenario,
}) {
  const [renaming, setRenaming] = useState(false)
  const [nameVal, setNameVal] = useState('')
  const fileRef = useRef()

  function startRename() {
    setNameVal(active?.name || '')
    setRenaming(true)
  }

  function commitRename() {
    if (nameVal.trim()) renameScenario(nameVal.trim())
    setRenaming(false)
  }

  function handleImport(e) {
    const file = e.target.files?.[0]
    if (file) importScenario(file)
    e.target.value = ''
  }

  function handleNew() {
    const name = prompt('Scenario name:', 'New Scenario')
    if (name?.trim()) newScenario(name.trim())
  }

  function handleDelete() {
    if (scenarios.length <= 1) return alert('Cannot delete the last scenario.')
    if (confirm(`Delete "${active?.name}"?`)) deleteScenario()
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Scenario selector */}
      <select
        value={activeId || ''}
        onChange={e => setActiveId(e.target.value)}
        className="bg-slate-700 text-white text-sm rounded px-2 py-1.5 border border-slate-600 max-w-xs"
      >
        {scenarios.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      {/* Rename inline */}
      {renaming ? (
        <div className="flex items-center gap-1">
          <input
            autoFocus
            value={nameVal}
            onChange={e => setNameVal(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setRenaming(false) }}
            className="bg-slate-700 text-white text-sm rounded px-2 py-1.5 border border-blue-400 w-44"
          />
          <button onClick={commitRename} className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1.5 rounded">Save</button>
          <button onClick={() => setRenaming(false)} className="text-xs text-slate-300 hover:text-white px-2 py-1.5">✕</button>
        </div>
      ) : (
        <button onClick={startRename} className="btn-ghost text-xs">Rename</button>
      )}

      <button onClick={handleNew}          className="btn-ghost text-xs">+ New</button>
      <button onClick={duplicateScenario}  className="btn-ghost text-xs">Duplicate</button>
      <button onClick={handleDelete}       className="btn-ghost text-xs text-red-400 hover:text-red-300">Delete</button>

      <div className="w-px h-4 bg-slate-600 mx-1" />

      <button onClick={exportScenario} className="btn-ghost text-xs">⬇ Export</button>
      <button onClick={() => fileRef.current?.click()} className="btn-ghost text-xs">⬆ Import</button>
      <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
    </div>
  )
}
