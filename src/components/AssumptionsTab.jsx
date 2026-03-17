function Field({ label, value, onChange, type = 'number', prefix, suffix, help }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {help && <p className="text-xs text-slate-400 mb-1.5">{help}</p>}
      <div className="flex items-center gap-1">
        {prefix && <span className="text-sm text-slate-500">{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={e => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
          className="border border-slate-300 rounded px-3 py-1.5 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {suffix && <span className="text-sm text-slate-500">{suffix}</span>}
      </div>
    </div>
  )
}

export default function AssumptionsTab({ scenario, update }) {
  const { assumptions } = scenario

  function patch(key, val) {
    update({ assumptions: { ...assumptions, [key]: val } })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card p-6">
        <h2 className="text-base font-semibold text-slate-800 mb-5">Starting Position</h2>
        <div className="grid grid-cols-2 gap-5">
          <Field label="Starting ARR" value={assumptions.startingARR} onChange={v => patch('startingARR', v)} prefix="$" help="Jan 1, 2026 opening ARR" />
          <Field label="Starting MRR" value={assumptions.startingMRR} onChange={v => patch('startingMRR', v)} prefix="$" help="Starting MRR = ARR / 12" />
          <Field label="Target ARR"   value={assumptions.targetARR}   onChange={v => patch('targetARR', v)}   prefix="$" help="Dec 31, 2026 exit goal" />
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-base font-semibold text-slate-800 mb-2">How the engine works</h2>
        <p className="text-sm text-slate-500 mb-4">
          Monthly ARR added = (NL deals × NL deal size) + (Exp deals × Exp deal size).
          Deal counts come from the Deal Cadence tab. Actuals override the engine for specific months.
          Per-seller deal sizes are set on the Sellers tab.
        </p>
        <div className="bg-slate-50 rounded-lg p-3 text-xs font-mono text-slate-600">
          cell = IF(active, IF(actuals &gt; 0, actuals, DC_NL × NL_size + DC_Exp × Exp_size), 0)
        </div>
      </div>
    </div>
  )
}
