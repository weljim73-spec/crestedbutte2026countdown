export function createDefaultScenario(name = 'Base Case') {
  return {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assumptions: {
      startingARR: 444000,
      startingMRR: 37000,
      targetARR: 9400000,
    },
    sellers: [
      { id: 's1', name: 'Jim Wells',             active: true,  rampMonth: 1, nlDealARR: 54000,  expDealARR: 62719, closeRateOverride: null, expansionRateOverride: null, notes: '' },
      { id: 's2', name: 'Lisa Copland',           active: true,  rampMonth: 1, nlDealARR: 75000,  expDealARR: 60000, closeRateOverride: null, expansionRateOverride: null, notes: '' },
      { id: 's3', name: 'Bill Rohrer',            active: true,  rampMonth: 1, nlDealARR: 60000,  expDealARR: 45000, closeRateOverride: null, expansionRateOverride: null, notes: '' },
      { id: 's4', name: 'Ryan — own sourced',     active: true,  rampMonth: 4, nlDealARR: 30000,  expDealARR: 22500, closeRateOverride: null, expansionRateOverride: null, notes: '' },
      { id: 's5', name: 'Ryan — champions',       active: true,  rampMonth: 4, nlDealARR: 30000,  expDealARR: 22500, closeRateOverride: null, expansionRateOverride: null, notes: '' },
      { id: 's6', name: 'VP / Director hire',     active: true,  rampMonth: 5, nlDealARR: 75000,  expDealARR: 30000, closeRateOverride: null, expansionRateOverride: null, notes: '' },
      { id: 's7', name: 'Patrick — LATAM',        active: true,  rampMonth: 4, nlDealARR: 30000,  expDealARR: 22500, closeRateOverride: null, expansionRateOverride: null, notes: '' },
    ],
    dealCadence: {
      'Jim Wells':          { NL: [1,1,1,1,1,1,1,1,1,1,1,1], Exp: [2,2,2,2,2,2,2,2,2,2,2,1] },
      'Lisa Copland':       { NL: [1,1,1,1,1,1,1,1,1,1,1,1], Exp: [2,1,1,2,1,1,2,1,1,2,1,1] },
      'Bill Rohrer':        { NL: [1,0,1,0,1,0,1,0,1,0,1,0], Exp: [0,0,1,0,0,1,0,0,1,0,0,0] },
      'Ryan — own sourced': { NL: [0,0,0,1,0,1,0,1,1,1,0,0], Exp: [0,0,0,0,0,1,0,0,1,0,0,0] },
      'Ryan — champions':   { NL: [0,0,0,1,1,0,1,1,1,0,0,0], Exp: [0,0,0,0,0,1,0,0,1,0,0,0] },
      'VP / Director hire': { NL: [0,0,0,0,1,1,1,1,0,0,0,0], Exp: [0,0,0,0,0,1,0,1,0,0,0,0] },
      'Patrick — LATAM':    { NL: [0,0,0,1,1,1,1,1,0,0,0,0], Exp: [0,0,0,0,1,0,0,1,0,0,0,0] },
    },
    actuals: [],
  }
}
