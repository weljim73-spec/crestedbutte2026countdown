const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export function computeARR(scenario) {
  const { assumptions, sellers, dealCadence, actuals } = scenario

  const monthlyBySeller = {}

  for (const seller of sellers) {
    const monthly = Array(12).fill(0)

    if (!seller.active) {
      monthlyBySeller[seller.name] = monthly
      continue
    }

    for (let i = 0; i < 12; i++) {
      const month = i + 1
      if (month < seller.rampMonth) { monthly[i] = 0; continue }

      const actual = actuals.find(a => a.seller === seller.name && a.monthNum === month)
      if (actual && actual.amount > 0) { monthly[i] = actual.amount; continue }

      const dc = dealCadence[seller.name] || { NL: [], Exp: [] }
      const nlCount  = typeof dc.NL[i]  === 'number' ? dc.NL[i]  : 0
      const expCount = typeof dc.Exp[i] === 'number' ? dc.Exp[i] : 0
      monthly[i] = nlCount * seller.nlDealARR + expCount * seller.expDealARR
    }

    monthlyBySeller[seller.name] = monthly
  }

  const monthlyTotal = Array(12).fill(0).map((_, i) =>
    Object.values(monthlyBySeller).reduce((sum, m) => sum + m[i], 0)
  )

  const exitMRR = []
  let mrrRunning = assumptions.startingMRR
  for (let i = 0; i < 12; i++) {
    mrrRunning += monthlyTotal[i] / 12
    exitMRR.push(mrrRunning)
  }

  const exitARR = exitMRR.map(m => m * 12)

  // Per-seller FY total
  const sellerFYTotals = {}
  for (const [name, monthly] of Object.entries(monthlyBySeller)) {
    sellerFYTotals[name] = monthly.reduce((s, v) => s + v, 0)
  }

  // Monthly chart data
  const chartData = MONTHS.map((label, i) => {
    const row = { month: label, exitARR: Math.round(exitARR[i]), mrrAdded: Math.round(monthlyTotal[i] / 12) }
    for (const [name, monthly] of Object.entries(monthlyBySeller)) {
      row[name] = Math.round(monthly[i])
    }
    return row
  })

  return {
    monthlyBySeller,
    monthlyTotal,
    exitMRR,
    exitARR,
    sellerFYTotals,
    chartData,
    finalExitARR: exitARR[11],
    finalExitMRR: exitMRR[11],
    gapToTarget: exitARR[11] - assumptions.targetARR,
  }
}

export const MONTHS_LABELS = MONTHS
