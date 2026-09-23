const r = ['Quote', 'Pending', 'Verified', 'Active', 'Expired']
function l(t) {
  const e = Number(t)
  return isFinite(e) ? Math.round((e + Number.EPSILON) * 100) / 100 : 0
}
const s = [
  'declared_value',
  'sum_assured',
  'subtotal',
  'basic_premium',
  'vat',
  'doc_stamp',
  'lgt',
  'grand_total',
  'net_premium_due',
  'agent_selling_price',
  'agent_markup_pct',
  'commission_gross',
  'commission_income_tax',
  'commission_net',
  'deductible'
]
function h(t) {
  const e = { ...t }
  for (const a of s) e[a] != null && (e[a] = l(e[a]))
  return (Array.isArray(e.items) && (e.items = e.items.map((a) => ({ ...a, amount: l(a.amount) }))), e)
}
const y = [
    { key: 'product_type', label: 'Product', type: 'select', options: m() },
    { key: 'client_name', label: 'Client name', type: 'text' },
    { key: 'insured_mobile_number', label: 'Mobile number', type: 'text' },
    { key: 'insured_email_address', label: 'Email address', type: 'text' },
    { key: 'insurer_name', label: 'Insurer', type: 'text' },
    { key: 'coverage_type', label: 'Coverage type', type: 'text' },
    { key: 'inception_from', label: 'Inception from', type: 'date' },
    { key: 'inception_to', label: 'Inception to', type: 'date' },
    { key: 'basic_premium', label: 'Basic premium', type: 'money' },
    { key: 'vat', label: 'VAT', type: 'money' },
    { key: 'doc_stamp', label: 'Doc stamp', type: 'money' },
    { key: 'lgt', label: 'LGT', type: 'money' },
    { key: 'grand_total', label: 'Grand total', type: 'money' },
    { key: 'net_premium_due', label: 'Net premium due', type: 'money' },
    { key: 'policy_number', label: 'Policy number', type: 'text' },
    { key: 'issued_date', label: 'Issued date', type: 'date' },
    { key: 'policy_status', label: 'Status', type: 'select', options: r },
    { key: 'notes', label: 'Notes', type: 'textarea' }
  ],
  p = [
    { key: 'vehicle_label', label: 'Vehicle', type: 'text' },
    { key: 'vehicle_plate', label: 'Plate', type: 'text' },
    { key: 'vin', label: 'VIN', type: 'text' },
    { key: 'engine_no', label: 'Engine no', type: 'text' },
    { key: 'chassis_no', label: 'Chassis no', type: 'text' },
    { key: 'fuel_type', label: 'Fuel type', type: 'text' },
    { key: 'declared_value', label: 'Declared value', type: 'money' },
    { key: 'deductible', label: 'Deductible', type: 'money' },
    { key: 'mortgagee', label: 'Mortgagee', type: 'text' },
    { key: 'client_address', label: 'Client address', type: 'text' },
    { key: 'insured_birthday', label: 'Birthdate', type: 'date' },
    { key: 'aon', label: 'Acts of Nature', type: 'boolean' }
  ],
  o = [
    { key: 'insured_birthday', label: 'Birthdate', type: 'date' },
    { key: 'vehicle_label', label: 'Vehicle', type: 'text' },
    { key: 'vehicle_plate', label: 'Plate', type: 'text' },
    { key: 'vehicle_type', label: 'Vehicle type', type: 'text' },
    { key: 'class_label', label: 'Category / Term', type: 'text' },
    { key: 'declared_value', label: 'Declared value', type: 'money' }
  ],
  n = [
    { key: 'insured_birthday', label: 'Birthdate', type: 'date' },
    { key: 'vehicle_label', label: 'Device', type: 'text' },
    { key: 'declared_value', label: 'Insurable value (FMV)', type: 'money' },
    { key: 'template_fields', label: 'Quote snapshot', type: 'snapshot' }
  ],
  i = [
    { key: 'insured_person', label: 'Insured person', type: 'text' },
    { key: 'insured_address', label: 'Insured address', type: 'text' },
    { key: 'insured_birthday', label: 'Insured birthday', type: 'date' },
    { key: 'sum_assured', label: 'Sum assured', type: 'money' },
    { key: 'beneficiaries', label: 'Beneficiaries', type: 'beneficiaries' }
  ],
  d = [
    { key: 'insured_person', label: 'Insured person', type: 'text' },
    { key: 'insured_birthday', label: 'Birthdate', type: 'date' },
    { key: 'sum_assured', label: 'Sum assured', type: 'money' },
    { key: 'beneficiaries', label: 'Beneficiaries', type: 'beneficiaries' }
  ],
  u = [
    { key: 'insured_person', label: 'Insured person', type: 'text' },
    { key: 'insured_birthday', label: 'Insured birthday', type: 'date' },
    { key: 'trip_type', label: 'Trip type', type: 'text' },
    { key: 'destination_region', label: 'Destination region', type: 'text' },
    { key: 'destination', label: 'Destination', type: 'text' },
    { key: 'departure_date', label: 'Departure date', type: 'date' },
    { key: 'return_date', label: 'Return date', type: 'date' },
    { key: 'flight_number', label: 'Flight number', type: 'text' },
    { key: 'passport_number', label: 'Passport number', type: 'text' },
    { key: 'nationality', label: 'Nationality', type: 'text' },
    { key: 'itinerary', label: 'Itinerary', type: 'itinerary' }
  ],
  b = [
    { key: 'insured_birthday', label: 'Birthdate', type: 'date' },
    { key: 'vehicle_label', label: 'Property', type: 'text' },
    { key: 'client_address', label: 'Property address', type: 'text' },
    { key: 'declared_value', label: 'Declared value', type: 'money' },
    { key: 'sum_assured', label: 'Sum assured', type: 'money' }
  ],
  _ = [
    { key: 'insured_person', label: 'Insured person', type: 'text' },
    { key: 'insured_birthday', label: 'Birthdate', type: 'date' },
    { key: 'template_fields', label: 'Quote fields', type: 'snapshot' }
  ],
  c = {
    'Car Comprehensive': p,
    'Car CTPL': o,
    Cellphone: n,
    Device: n,
    Home: b,
    'Personal Accident': i,
    Health: i,
    'Term Life': d,
    'Travel Insurance': u
  }
function m() {
  return [
    'Cellphone',
    'Car CTPL',
    'Car Comprehensive',
    'Home',
    'Personal Accident',
    'Health',
    'Term Life',
    'Travel Insurance'
  ]
}
function k(t) {
  const e = t == null ? void 0 : t.product_type
  if (t != null && t.product_id) return [...y, ..._]
  const a = c[e] || []
  return [...y, ...a]
}
function x(t) {
  return k(t)
    .filter(
      (e) => e.type !== 'snapshot' && e.type !== 'beneficiaries' && e.type !== 'itinerary' && e.type !== 'boolean'
    )
    .map((e) => e.key)
}
export { l as a, x as e, k as g, h as r }
