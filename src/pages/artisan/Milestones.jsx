import React from 'react'
import { Trophy, Gift, Lock, ChevronRight } from 'lucide-react'
import { useArtisan } from '../../context/ArtisanContext'
import { MILESTONES } from '../../data/schemes'
import { MeenakariBorder } from '../../components/IndianMotifs'

export default function Milestones() {
  const { artisan } = useArtisan()
  const orders = artisan?.totalOrders || 0
  const next = 1000
  const pct = Math.min(100, (orders / next) * 100)

  const unlockedBadges = (artisan?.badges || []).map((b) => ({ title: b, unlocked: true }))
  const all = [...unlockedBadges, ...MILESTONES.filter((m) => orders >= m.at).map((m) => ({ title: m.title, icon: m.icon, unlocked: true }))]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-white">Milestones 🏆</h1>
        <p className="text-sm text-white/60">बैज, पुरस्कार और 1000-ऑर्डर विरासत यात्रा</p>
      </div>

      {/* 1000-order tracker */}
      <div className="card relative overflow-hidden bg-gradient-to-br from-amber-500 to-saffron-dark p-6 text-white">
        <Trophy className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 opacity-20" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold"><Gift size={24} /> Government Heritage Certificate</h2>
            <p className="mt-1 text-sm text-white/85">Reach 1,000 orders to unlock the official certificate + cultural gift hamper.</p>
          </div>
          <div className="rounded-2xl bg-white/20 px-5 py-3 text-center">
            <div className="font-display text-3xl font-extrabold">{orders}</div>
            <div className="text-xs text-white/80">of {next} orders</div>
          </div>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/25">
          <div className="h-full rounded-full bg-gradient-to-r from-white to-emerald-200 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-xs font-semibold text-white/85">{next - orders} orders to go!</p>
      </div>

      {/* Badges */}
      <MeenakariBorder className="text-saffron/50" />
      <div>
        <h3 className="font-display text-lg font-bold text-white">Badges Earned</h3>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {all.map((b) => (
            <div key={b.title} className="card flex items-center gap-3 bg-white p-4">
              <span className="text-3xl">{b.icon || '🏅'}</span>
              <div>
                <div className="text-sm font-bold text-india-night">{b.title}</div>
                <div className="text-[10px] font-bold text-emerald-600">✓ Unlocked</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full roadmap */}
      <div className="space-y-2">
        {MILESTONES.map((m) => {
          const won = orders >= m.at
          return (
            <div key={m.at} className={`card flex items-center gap-3 p-4 ${won ? 'bg-white' : 'bg-white/50'}`}>
              <span className="text-3xl">{won ? m.icon : <Lock size={22} className="text-india-night/30" />}</span>
              <div className="flex-1">
                <div className={`font-semibold ${won ? 'text-india-night' : 'text-india-night/50'}`}>{m.title}</div>
                <div className="text-xs text-india-night/50">{m.at} orders{m.unlock ? ' · Government Heritage Upgrade' : ''}</div>
              </div>
              {won ? (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Achieved</span>
              ) : (
                <ChevronRight size={18} className="text-india-night/30" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}