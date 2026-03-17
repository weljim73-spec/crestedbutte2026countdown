import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'

const fmt = (n) => n >= 1e6
  ? `$${(n / 1e6).toFixed(2)}M`
  : n >= 1e3 ? `$${(n / 1e3).toFixed(0)}K`
  : `$${Math.round(n).toLocaleString()}`

const SELLER_COLORS = ['#3b82f6','#f59e0b','#10b981','#ef4444','#8b5cf6','#06b6d4','#f97316']

export default function OutputTab({ result, scenario }) {
  const { finalExitARR, finalExitMRR, gapToTarget, chartData, sellerFYTotals, monthlyBySeller } = result
  const target = scenario.assumptions.targetARR
  const pctOfTarget = ((finalExitARR / target) * 100).toFixed(1)
  const sellers = scenario.sellers.filter(s => s.active)

  const kpis = [
    { label: 'Dec Exit ARR',    value: fmt(finalExitARR),  sub: `${pctOfTarget}% of target`, color: 'text-blue-600' },
    { label: 'Dec Exit MRR',    value: fmt(finalExitMRR),  sub: 'monthly recurring',         color: 'text-indigo-600' },
    { label: 'Gap to $9.4M',    value: fmt(Math.abs(gapToTarget)), sub: gapToTarget < 0 ? 'below target' : 'above target', color: gapToTarget < 0 ? 'text-red-600' : 'text-green-600' },
    { label: 'Target ARR',      value: fmt(target),         sub: 'FY 2026 goal',             color: 'text-slate-500' },
  ]

  // Per-seller bar data
  const sellerData = sellers.map((s, i) => ({
    name: s.name.split(' ')[0] + (s.name.includes('—') ? ' ' + s.name.split('—')[1]?.trim().slice(0, 8) : ''),
    fullName: s.name,
    arrAdded: Math.round(sellerFYTotals[s.name] || 0),
    color: SELLER_COLORS[i % SELLER_COLORS.length],
  }))

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="card p-4">
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{k.label}</div>
            <div className={`text-2xl font-bold mt-1 ${k.color}`}>{k.value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Exit ARR progression chart */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Exit ARR — Monthly Progression</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="arrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={v => fmt(v)} tick={{ fontSize: 11 }} width={64} />
            <Tooltip formatter={(v) => fmt(v)} />
            <ReferenceLine y={target} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Target', position: 'right', fontSize: 11, fill: '#ef4444' }} />
            <Area type="monotone" dataKey="exitARR" name="Exit ARR" stroke="#3b82f6" fill="url(#arrGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Per-seller FY contribution */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">FY ARR Added by Seller</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={sellerData} margin={{ top: 4, right: 16, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" interval={0} />
            <YAxis tickFormatter={v => fmt(v)} tick={{ fontSize: 11 }} width={64} />
            <Tooltip formatter={(v) => fmt(v)} labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''} />
            {sellerData.map((s, i) => (
              <Bar key={s.fullName} dataKey="arrAdded" name={s.fullName} fill={s.color} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly ARR plan table */}
      <div className="card p-5 overflow-x-auto">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Monthly ARR Added — Detail</h3>
        <table className="text-xs w-full border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="table-cell text-left font-semibold w-36">Seller</th>
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','FY Total'].map(m => (
                <th key={m} className="table-cell text-right font-semibold">{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller, si) => {
              const row = monthlyBySeller[seller.name] || Array(12).fill(0)
              const total = row.reduce((s, v) => s + v, 0)
              return (
                <tr key={seller.id} className={si % 2 === 0 ? '' : 'bg-slate-50'}>
                  <td className="table-cell font-medium truncate max-w-[9rem]">{seller.name}</td>
                  {row.map((v, i) => (
                    <td key={i} className={`table-cell text-right ${v > 0 ? 'text-slate-800' : 'text-slate-300'}`}>
                      {v > 0 ? fmt(v) : '—'}
                    </td>
                  ))}
                  <td className="table-cell text-right font-semibold text-blue-700">{fmt(total)}</td>
                </tr>
              )
            })}
            {/* Totals row */}
            <tr className="bg-slate-100 font-semibold border-t-2 border-slate-300">
              <td className="table-cell">Total ARR Added</td>
              {result.monthlyTotal.map((v, i) => (
                <td key={i} className="table-cell text-right">{fmt(v)}</td>
              ))}
              <td className="table-cell text-right">{fmt(result.monthlyTotal.reduce((s,v)=>s+v,0))}</td>
            </tr>
            <tr className="bg-slate-50">
              <td className="table-cell text-slate-500">MRR Added</td>
              {result.monthlyTotal.map((v, i) => (
                <td key={i} className="table-cell text-right text-slate-500">{fmt(v/12)}</td>
              ))}
              <td className="table-cell text-right text-slate-500">{fmt(result.monthlyTotal.reduce((s,v)=>s+v,0)/12)}</td>
            </tr>
            <tr className="bg-blue-50 font-semibold">
              <td className="table-cell text-blue-700">Exit ARR</td>
              {result.exitARR.map((v, i) => (
                <td key={i} className="table-cell text-right text-blue-700">{fmt(v)}</td>
              ))}
              <td className="table-cell text-right text-blue-700">{fmt(result.finalExitARR)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
