import React, { useState } from 'react'
import { PiggyBank, Wallet, ArrowUpRight, ShieldAlert } from 'lucide-react'
import { db } from '../../data/db'
import { useArtisan } from '../../context/ArtisanContext'
import { useLang } from '../../context/LanguageContext'
import { inr } from '../../lib/speech'

const TIERS = [
  { label: 'Tier 1', range: '0 – 100 orders', fee: 5, color: 'bg-slate-300', min: 0 },
  { label: 'Tier 2', range: '101 – 500 orders', fee: 3.5, color: 'bg-amber-300', min: 101 },
  { label: 'Tier 3', range: '501 – 1,000 orders', fee: 2, color: 'bg-saffron', min: 501 },
  { label: 'Tier 4', range: '1,000+ orders', fee: 0, color: 'bg-emerald-400', min: 1000, } ,
]

export default function SmartWallet() {
  const { artisan, setArtisan } = useArtisan()
  const { t } = useLang()
  const [rate, setRate] = useState(artisan?.savingRate || 15)
  const [toast, setToast] = useState('')
  const baseRate = artisan?.savingRate || 15
  const ppf = artisan?.ppfBalance || 48200
  const wallet = artisan?.walletBalance || 18250
  const orders = artisan?.totalOrders || 0

  const persistRate = async (v) => {
    setRate(v)
    await db.artisan.update('me', { savingRate: v })
    setArtisan((prev) => ({ ...prev, savingRate: v }))
    setToast(`Auto-savings set to ${v}% of each profit 💰`)
    setTimeout(() => setToast(''), 2500)
  }

  const emergency = () => {
    setToast('⚠️ Emergency payout ₹5,000 released to your bank ****4821 (simulated)')
    setTimeout(() => setToast(''), 3500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-white">{t('wallet')} 💳</h1>
        <p className="text-sm text-white/60">फ़ायदे का 10–20% खुद-ब-खुद PPF में जमा</p>
      </div>

      {toast && <div className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white">{toast}</div>}

      {/* Balances */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card bg-white p-5">
          <span className="inline-flex rounded-xl bg-emerald-100 p-2.5 text-emerald-600"><Wallet size={20} /></span>
          <div className="mt-3 text-2xl font-extrabold text-india-night">{inr(wallet)}</div>
          <div className="text-sm text-india-night/60">Available Wallet</div>
        </div>
        <div className="card bg-white p-5">
          <span className="inline-flex rounded-xl bg-saffron/15 p-2.5 text-saffron-dark"><PiggyBank size={20} /></span>
          <div className="mt-3 text-2xl font-extrabold text-india-night">{inr(ppf)}</div>
          <div className="text-sm text-india-night/60">PPF Balance (Bhavishya Nidhi)</div>
        </div>
        <div className="card bg-white p-5">
          <span className="inline-flex rounded-xl bg-indigo-100 p-2.5 text-indigo-600"><ArrowUpRight size={20} /></span>
          <div className="mt-3 text-2xl font-extrabold text-india-night">{baseRate}%</div>
          <div className="text-sm text-india-night/60">Auto-Save Rate</div>
        </div>
      </div>

      {/* Auto-savings slider */}
      <div className="card bg-white p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold">Auto-Savings Router → PPF</h3>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">{inr((rate / 100) * 10000)} / ₹10k profit</span>
        </div>
        <input type="range" min={10} max={20} value={rate} onChange={(e) => setRate(+e.target.value)}
          onMouseUp={() => persistRate(rate)} onTouchEnd={() => persistRate(rate)} className="mt-4 w-full accent-saffron" />
        <div className="mt-1 flex justify-between text-xs text-india-night/50">
          <span>10% (बेसिक)</span><span>15% (संतुलित)</span><span>20% (अधिकतम)</span>
        </div>
        <button onClick={() => persistRate(rate)} className="btn-primary mt-4 w-full">Save {rate}% Auto-Savings</button>
      </div>

      {/* Emergency withdrawal */}
      <div className="card flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-red-50 to-orange-50 p-5">
        <div className="flex items-center gap-3">
          <ShieldAlert size={26} className="text-red-500" />
          <div>
            <h3 className="font-display font-bold text-red-700">Emergency Withdrawal</h3>
            <p className="text-sm text-red-600/70">Off-season ₹5,000 instant payout to your bank, repaid later.</p>
          </div>
        </div>
        <button onClick={emergency} className="btn-primary !bg-red-600 hover:!bg-red-700">Request Payout</button>
      </div>

      {/* Commission tiers */}
      <div className="card bg-white p-5">
        <h3 className="font-display font-bold">Dynamic Sliding Commission</h3>
        <p className="text-sm text-india-night/60">Fees drop as you sell more — reach 1,000 orders for a lifetime 0%.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TIERS.map((t) => {
            const unlocked = orders >= t.min
            return (
              <div key={t.label} className={`rounded-xl border p-3 ${unlocked ? 'border-emerald-300 bg-emerald-50' : 'border-black/10'}`}>
                <div className={`h-1.5 w-10 rounded-full ${t.color}`} />
                <div className="mt-2 text-sm font-bold">{t.label}</div>
                <div className="text-[11px] text-india-night/50">{t.range}</div>
                <div className="mt-1 text-lg font-extrabold text-india-night">{t.fee}%</div>
                {unlocked && <span className="text-[10px] font-bold text-emerald-600">✓ Active</span>}
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm font-bold text-india-night">
          Current orders: {orders}
          <span className="rounded-full bg-saffron px-2 py-0.5 text-xs text-white">
            {orders >= 1000 ? 'Tier 4 — 0% 💎' : `Tier ${orders > 500 ? '3' : orders > 100 ? '2' : '1'}`}
          </span>
        </div>
      </div>
    </div>
  )
}