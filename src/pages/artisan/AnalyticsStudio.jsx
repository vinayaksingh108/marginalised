import React, { useMemo } from 'react'
import { TrendingUp, PiggyBank, Wrench, Wallet, BarChart3 } from 'lucide-react'
import { useArtisan } from '../../context/ArtisanContext'
import { inr } from '../../lib/speech'

export default function AnalyticsStudio() {
  const { analytics } = useArtisan()
  const a = analytics
  const netProfit = a.laborEarnings
  const maxMonth = Math.max(...a.monthly.map((m) => m.units))
  const maxCraft = Math.max(...a.topCrafts.map((c) => c.units))

  const kpis = [
    { label: 'Gross Revenue', en: 'Gross Revenue', value: inr(a.grossRevenue), icon: TrendingUp, tint: 'text-emerald-600 bg-emerald-100' },
    { label: 'Net Profit', en: 'Net Profit', value: inr(netProfit), icon: Wallet, tint: 'text-blue-600 bg-blue-100' },
    { label: 'Material Cost', en: 'Material Cost', value: inr(a.materialCost), icon: Wrench, tint: 'text-amber-600 bg-amber-100' },
    { label: 'Auto-Savings → PPF', en: 'PPF Diverted', value: inr(a.autoSavings), icon: PiggyBank, tint: 'text-purple-600 bg-purple-100' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-white">Analytics Studio 📊</h1>
        <p className="text-sm text-white/60">कमाई, लागत और बचत — एक नज़र में</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.en} className="card bg-white p-5">
            <span className={`inline-flex rounded-xl p-2.5 ${k.tint}`}><k.icon size={20} /></span>
            <div className="mt-3 text-xl font-extrabold text-india-night">{k.value}</div>
            <div className="text-sm text-india-night/60">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Revenue vs profit */}
        <div className="card bg-white p-5">
          <h3 className="flex items-center gap-2 font-display font-bold"><BarChart3 size={18} className="text-saffron-dark" /> Revenue vs Labour Earnings</h3>
          <div className="mt-4 space-y-4">
            <BarRow label="Gross Revenue" val={a.grossRevenue} max={a.grossRevenue} color="from-saffron to-saffron-dark" />
            <BarRow label="Net Labour Earnings" val={netProfit} max={a.grossRevenue} color="from-emerald-400 to-emerald-600" />
            <BarRow label="Material Cost" val={a.materialCost} max={a.grossRevenue} color="from-slate-300 to-slate-400" />
            <BarRow label="Platform Fees" val={a.platformFees} max={a.grossRevenue} color="from-orange-300 to-orange-400" />
          </div>
        </div>

        {/* Monthly units */}
        <div className="card bg-white p-5">
          <h3 className="font-display font-bold">Units Sold per Month</h3>
          <div className="mt-4 flex h-44 items-end gap-2">
            {a.monthly.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-india-night/60">{m.units}</span>
                <div className="w-full rounded-t-md bg-gradient-to-t from-saffron to-saffron-light"
                  style={{ height: `${Math.max(6, (m.units / maxMonth) * 100)}%` }} />
                <span className="text-[10px] text-india-night/50">{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top crafts */}
      <div className="card bg-white p-5">
        <h3 className="font-display font-bold">Top-Performing Craft Items</h3>
        <div className="mt-3 space-y-2">
          {a.topCrafts.map((c) => (
            <div key={c.name} className="flex items-center gap-3">
              <span className="w-40 shrink-0 text-sm font-medium text-india-night/70">{c.name}</span>
              <div className="h-4 flex-1 overflow-hidden rounded-full bg-black/5">
                <div className="h-full rounded-full bg-gradient-to-r from-india-blue to-india-green" style={{ width: `${(c.units / maxCraft) * 100}%` }} />
              </div>
              <span className="w-12 text-right text-sm font-bold">{c.units}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BarRow({ label, val, max, color }) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-india-night/70">{label}</span><span className="font-bold text-india-night">{inr(val)}</span>
      </div>
      <div className="mt-1 h-3 overflow-hidden rounded-full bg-black/5">
        <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${Math.min(100, (val / max) * 100)}%` }} />
      </div>
    </div>
  )
}