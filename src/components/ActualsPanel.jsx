const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function ActualsPanel({ scenario, update }) {
  const { actuals, sellers } = scenario

  function addRow() {
    update({ actuals: [...actuals, { id: crypto.randomUUID(), seller: sellers[0]?.name || '', monthNum: 1, amount: 0, type: 'NL', notes: '' }] })
  }

  function removeRow(id) {
    update({ actuals: actuals.filter(a => a.id !== id) })
  }

  function patchRow(id, key, val) {
    update({ actuals: actuals.map(a => a.id === id ? { ...a, [key]: val } : a) })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="text-sm text-slate-500 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
        Actuals override the deal-cadence engine for the matching seller + month. Enter confirmed closed ARR here (e.g. from HubSpot).
      </div>

      <div className="card overflow-x-auto">
        <table className="text-xs w-full border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="table-cell text-left">Seller</th>
              <th className="table-cell text-center">Month</th>
              <th className="table-cell text-right">ARR Amount ($)</th>
              <th className="table-cell text-center">Type</th>
              <th className="table-cell text-left">Notes</th>
              <th className="table-cell w-8"></th>
            </tr>
          </thead>
          <tbody>
            {actuals.length === 0 && (
              <tr><td colSpan={6} className="table-cell text-center text-slate-400 py-6">No actuals — engine formula used for all months.</td></tr>
            )}
            {actuals.map((a, i) => (
              <tr key={a.id} className={i % 2 === 0 ? '' : 'bg-slate-50'}>
                <td className="table-cell">
                  <select value={a.seller} onChange={e => patchRow(a.id, 'seller', e.target.value)}
                    className="border-0 bg-transparent w-full focus:outline-none focus:bg-white focus:border focus:border-blue-400 rounded">
                    {sellers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </td>
                <td className="table-cell text-center">
                  <select value={a.monthNum} onChange={e => patchRow(a.id, 'monthNum', parseInt(e.target.value))}
                    className="border-0 bg-transparent text-center focus:outline-none focus:bg-white focus:border focus:border-blue-400 rounded">
                    {MONTHS.map((m, idx) => <option key={idx} value={idx+1}>{m}</option>)}
                  </select>
                </td>
                <td className="table-cell text-right">
                  <input type="number" value={a.amount} onChange={e => patchRow(a.id, 'amount', parseFloat(e.target.value)||0)}
                    className="border-0 bg-transparent text-right w-28 focus:outline-none focus:bg-white focus:border focus:border-blue-400 rounded px-1" />
                </td>
                <td className="table-cell text-center">
                  <select value={a.type} onChange={e => patchRow(a.id, 'type', e.target.value)}
                    className="border-0 bg-transparent text-center focus:outline-none focus:bg-white focus:border focus:border-blue-400 rounded">
                    <option>NL</option><option>Expansion</option><option>Mixed</option>
                  </select>
                </td>
                <td className="table-cell">
                  <input value={a.notes} onChange={e => patchRow(a.id, 'notes', e.target.value)}
                    placeholder="…" className="border-0 bg-transparent w-full focus:outline-none focus:bg-white focus:border focus:border-blue-400 rounded px-1 placeholder-slate-300" />
                </td>
                <td className="table-cell text-center">
                  <button onClick={() => removeRow(a.id)} className="text-slate-300 hover:text-red-500 font-bold text-base leading-none">×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 border-t border-slate-200">
          <button onClick={addRow} className="text-xs text-blue-600 hover:text-blue-800 font-medium">+ Add Actual</button>
        </div>
      </div>
    </div>
  )
}
