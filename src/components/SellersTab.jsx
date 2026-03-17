const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function fmt(n) {
  return n >= 1000 ? `$${(n/1000).toFixed(0)}K` : `$${n}`
}

export default function SellersTab({ scenario, update }) {
  const { sellers, dealCadence } = scenario

  function patchSeller(id, key, val) {
    update({
      sellers: sellers.map(s => s.id === id ? { ...s, [key]: val } : s)
    })
  }

  function addSeller() {
    const name = prompt('Seller name:')
    if (!name?.trim()) return
    const newSeller = {
      id: crypto.randomUUID(), name: name.trim(), active: true, rampMonth: 1,
      nlDealARR: 50000, expDealARR: 30000, closeRateOverride: null, expansionRateOverride: null, notes: '',
    }
    const newDC = {
      ...dealCadence,
      [name.trim()]: { NL: Array(12).fill(0), Exp: Array(12).fill(0) }
    }
    update({ sellers: [...sellers, newSeller], dealCadence: newDC })
  }

  function removeSeller(id) {
    const seller = sellers.find(s => s.id === id)
    if (!confirm(`Remove "${seller?.name}"?`)) return
    const newDC = { ...dealCadence }
    delete newDC[seller.name]
    update({ sellers: sellers.filter(s => s.id !== id), dealCadence: newDC })
  }

  return (
    <div className="card overflow-x-auto max-w-full">
      <table className="text-xs w-full border-collapse">
        <thead>
          <tr className="bg-slate-100">
            <th className="table-cell text-left w-10">On</th>
            <th className="table-cell text-left">Name</th>
            <th className="table-cell text-center">Ramp<br/>Month</th>
            <th className="table-cell text-right">NL Deal ARR</th>
            <th className="table-cell text-right">Exp Deal ARR</th>
            <th className="table-cell text-right">Close Rate<br/>Override</th>
            <th className="table-cell text-left">Notes</th>
            <th className="table-cell text-center w-8"></th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((s, i) => (
            <tr key={s.id} className={`${!s.active ? 'opacity-50' : ''} ${i % 2 === 0 ? '' : 'bg-slate-50'}`}>
              <td className="table-cell text-center">
                <input type="checkbox" checked={s.active} onChange={e => patchSeller(s.id, 'active', e.target.checked)} className="w-4 h-4" />
              </td>
              <td className="table-cell">
                <input value={s.name} onChange={e => {
                  const oldName = s.name
                  const newName = e.target.value
                  const newDC = { ...dealCadence }
                  if (oldName !== newName && newDC[oldName]) {
                    newDC[newName] = newDC[oldName]
                    delete newDC[oldName]
                  }
                  update({ sellers: sellers.map(sel => sel.id === s.id ? { ...sel, name: newName } : sel), dealCadence: newDC })
                }} className="border-0 bg-transparent w-full focus:outline-none focus:bg-white focus:border focus:border-blue-400 focus:rounded px-1 py-0.5" />
              </td>
              <td className="table-cell text-center">
                <select value={s.rampMonth} onChange={e => patchSeller(s.id, 'rampMonth', parseInt(e.target.value))}
                  className="border-0 bg-transparent text-center focus:outline-none focus:bg-white focus:border focus:border-blue-400 rounded w-12">
                  {MONTHS.map((m, idx) => <option key={idx} value={idx+1}>{m}</option>)}
                </select>
              </td>
              <td className="table-cell text-right">
                <input type="number" value={s.nlDealARR} onChange={e => patchSeller(s.id, 'nlDealARR', parseFloat(e.target.value)||0)}
                  className="border-0 bg-transparent text-right w-20 focus:outline-none focus:bg-white focus:border focus:border-blue-400 rounded px-1" />
              </td>
              <td className="table-cell text-right">
                <input type="number" value={s.expDealARR} onChange={e => patchSeller(s.id, 'expDealARR', parseFloat(e.target.value)||0)}
                  className="border-0 bg-transparent text-right w-20 focus:outline-none focus:bg-white focus:border focus:border-blue-400 rounded px-1" />
              </td>
              <td className="table-cell text-center">
                <input value={s.closeRateOverride ?? ''} placeholder="default" onChange={e => patchSeller(s.id, 'closeRateOverride', e.target.value || null)}
                  className="border-0 bg-transparent text-center w-16 focus:outline-none focus:bg-white focus:border focus:border-blue-400 rounded px-1 placeholder-slate-300" />
              </td>
              <td className="table-cell">
                <input value={s.notes} onChange={e => patchSeller(s.id, 'notes', e.target.value)}
                  placeholder="…" className="border-0 bg-transparent w-full focus:outline-none focus:bg-white focus:border focus:border-blue-400 rounded px-1 placeholder-slate-300" />
              </td>
              <td className="table-cell text-center">
                <button onClick={() => removeSeller(s.id)} className="text-slate-300 hover:text-red-500 font-bold text-base leading-none">×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-3 border-t border-slate-200">
        <button onClick={addSeller} className="text-xs text-blue-600 hover:text-blue-800 font-medium">+ Add Seller</button>
      </div>
    </div>
  )
}
