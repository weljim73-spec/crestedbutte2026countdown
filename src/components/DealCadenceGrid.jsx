const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function Cell({ value, onChange, disabled }) {
  return (
    <input
      type="number"
      value={disabled ? '' : (value ?? 0)}
      disabled={disabled}
      onChange={e => onChange(parseFloat(e.target.value) || 0)}
      className={`w-full text-center text-xs border-0 bg-transparent focus:outline-none focus:bg-blue-50 focus:rounded py-1 px-0
        ${disabled ? 'text-slate-200 cursor-not-allowed' : 'text-slate-700'}`}
    />
  )
}

export default function DealCadenceGrid({ scenario, update }) {
  const { sellers, dealCadence } = scenario

  function setCell(sellerName, type, monthIdx, val) {
    const current = dealCadence[sellerName] || { NL: Array(12).fill(0), Exp: Array(12).fill(0) }
    const newArr = [...(current[type] || Array(12).fill(0))]
    newArr[monthIdx] = val
    update({ dealCadence: { ...dealCadence, [sellerName]: { ...current, [type]: newArr } } })
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {sellers.map(seller => {
        const dc = dealCadence[seller.name] || { NL: Array(12).fill(0), Exp: Array(12).fill(0) }
        const nlTotal  = dc.NL.reduce((s,v)  => s + (typeof v === 'number' ? v : 0), 0)
        const expTotal = dc.Exp.reduce((s,v) => s + (typeof v === 'number' ? v : 0), 0)

        return (
          <div key={seller.id} className={`card overflow-x-auto ${!seller.active ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-100">
              <span className="text-sm font-semibold text-slate-700">{seller.name}</span>
              <span className="text-xs text-slate-400">
                Ramp: {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][seller.rampMonth-1]}
              </span>
            </div>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50">
                  <th className="table-cell text-left w-12 text-slate-500">Type</th>
                  {MONTHS.map(m => (
                    <th key={m} className="table-cell text-center text-slate-500">{m}</th>
                  ))}
                  <th className="table-cell text-center font-semibold text-slate-600">FY</th>
                </tr>
              </thead>
              <tbody>
                {['NL','Exp'].map(type => (
                  <tr key={type} className={type === 'Exp' ? 'bg-slate-50' : ''}>
                    <td className="table-cell font-medium text-slate-500">{type}</td>
                    {MONTHS.map((_, i) => {
                      const disabled = !seller.active || (i + 1) < seller.rampMonth
                      return (
                        <td key={i} className={`table-cell p-0 ${disabled ? 'bg-slate-50' : ''}`}>
                          <Cell
                            value={dc[type]?.[i] ?? 0}
                            onChange={v => setCell(seller.name, type, i, v)}
                            disabled={disabled}
                          />
                        </td>
                      )
                    })}
                    <td className="table-cell text-center font-semibold text-blue-700">
                      {type === 'NL' ? nlTotal : expTotal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}
