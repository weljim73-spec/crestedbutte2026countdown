import { useState } from 'react'
import { useScenarios } from './hooks/useScenarios'
import { computeARR } from './engine/arrEngine'
import ScenarioBar from './components/ScenarioBar'
import OutputTab from './components/OutputTab'
import AssumptionsTab from './components/AssumptionsTab'
import SellersTab from './components/SellersTab'
import DealCadenceGrid from './components/DealCadenceGrid'
import ActualsPanel from './components/ActualsPanel'

const TABS = ['Output', 'Assumptions', 'Sellers', 'Deal Cadence', 'Actuals']

export default function App() {
  const [tab, setTab] = useState('Output')
  const scenariosApi = useScenarios()
  const { active, updateScenario } = scenariosApi

  const result = active ? computeARR(active) : null

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white px-4 py-3 flex items-center gap-4 shadow-md">
        <div className="font-bold text-lg tracking-tight whitespace-nowrap">2026 ARR Plan</div>
        <div className="flex-1">
          <ScenarioBar {...scenariosApi} />
        </div>
      </header>

      {/* Tabs */}
      <nav className="bg-white border-b border-slate-200 px-4 flex gap-1">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="flex-1 p-4 overflow-auto">
        {active && result && (
          <>
            {tab === 'Output'       && <OutputTab result={result} scenario={active} />}
            {tab === 'Assumptions'  && <AssumptionsTab scenario={active} update={updateScenario} />}
            {tab === 'Sellers'      && <SellersTab scenario={active} update={updateScenario} />}
            {tab === 'Deal Cadence' && <DealCadenceGrid scenario={active} update={updateScenario} />}
            {tab === 'Actuals'      && <ActualsPanel scenario={active} update={updateScenario} />}
          </>
        )}
      </main>
    </div>
  )
}
