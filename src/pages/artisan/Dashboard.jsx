import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  PackagePlus, ListOrdered, Wallet, TrendingUp, ArrowRight, Sparkles,
} from 'lucide-react'
import { useArtisan } from '../../context/ArtisanContext'
import { useVoice } from '../../context/VoiceContext'
import { inr } from '../../lib/speech'
import { Peacock } from '../../components/IndianMotifs'

export default function Dashboard() {
  const { artisan, orders } = useArtisan()
  const { speak, setPanelOpen } = useVoice()

  const newOrders = orders.filter((o) => o.status === 'New').length
  const pending = orders.filter((o) => ['New', 'Confirmed via IVR'].includes(o.status)).length
  const earnings = artisan?.walletBalance || 18250

  const stats = [
    { label: 'आज के ऑर्डर', en: "Today's Orders", value: String(Math.max(newOrders, 1)), icon: TrendingUp, tint: 'bg-saffron/15 text-saffron-dark' },
    { label: 'कुल कमाई', en: 'Total Earnings', value: inr(earnings), icon: Wallet, tint: 'bg-emerald-100 text-emerald-700' },
    { label: 'डिस्पैच बाकी', en: 'Pending Dispatch', value: String(pending || 2), icon: ListOrdered, tint: 'bg-red-100 text-red-600' },
    { label: 'रेटिंग', en: 'Artisan Rating', value: '4.9 ★', icon: Sparkles, tint: 'bg-yellow-100 text-yellow-700' },
  ]

  const quickLinks = [
    { to: '/artisan/studio/add-product', icon: PackagePlus, tint: 'from-saffron to-saffron-dark', title: 'उत्पाद जोड़ें', en: 'Add via Camera + Voice' },
    { to: '/artisan/orders', icon: ListOrdered, tint: 'from-blue-600 to-indigo-600', title: 'ऑर्डर देखें', en: 'Check & confirm orders' },
    { to: '/artisan/smart-wallet', icon: Wallet, tint: 'from-emerald-500 to-green-600', title: 'बचत देखें', en: 'PPF savings & wallet' },
  ]

  return (
    <div className="space-y-6">
      {/* Voice hero strip */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-saffron to-saffron-dark p-6 text-white">
        <Peacock className="pointer-events-none absolute -right-6 -top-8 h-40 w-40 opacity-20" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold"><Sparkles size={22} /> वॉइस सहायक</h2>
            <p className="mt-1 max-w-md text-sm text-white/85">
              बोलकर सब कुछ करें — नया उत्पाद, स्टॉक, ऑर्डर, बचत। माइक दबाएँ और अपनी भाषा में बोलिए।
            </p>
          </div>
          <button onClick={() => { setPanelOpen(true); speak('नमस्ते! नया उत्पाद, स्टॉक, ऑर्डर या बचत — क्या करना है बताइए।') }}
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-saffron-dark">
            माइक दबाएँ <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Pending IVR calls */}
      {newOrders > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
          </span>
          <div className="flex-1 text-sm"><b>{newOrders} new order{newOrders > 1 ? 's' : ''} awaiting IVR confirmation</b></div>
          <Link to="/artisan/orders" className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white">Confirm now</Link>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.en} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="card bg-white p-5">
            <span className={`inline-flex rounded-xl p-2.5 ${s.tint}`}><s.icon size={20} /></span>
            <div className="mt-3 text-2xl font-extrabold text-india-night">{s.value}</div>
            <div className="text-sm font-medium text-india-night/70">{s.label}</div>
            <div className="text-[11px] uppercase tracking-wide text-india-night/40">{s.en}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick launch */}
      <div className="grid gap-4 sm:grid-cols-3">
        {quickLinks.map((q) => (
          <Link key={q.to} to={q.to} className="group card overflow-hidden bg-white">
            <div className={`flex items-center gap-2 bg-gradient-to-r ${q.tint} p-4 text-white`}>
              <q.icon size={18} /><span className="font-display font-bold">{q.title}</span>
            </div>
            <div className="p-4">
              <p className="text-sm text-india-night/60">{q.en}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-saffron-dark group-hover:underline">
                खोलें <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* DASHBOARD_BODY */}
      {/* Recent orders */}
      <div className="card bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">Recent Orders</h3>
          <Link to="/artisan/orders" className="text-sm font-semibold text-saffron-dark hover:underline">View all →</Link>
        </div>
        <div className="divide-y divide-black/5">
          {orders.slice(0, 3).map((o) => (
            <div key={o.id} className="flex items-center gap-3 py-2.5">
              <span className="text-lg">🧺</span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{o.product}</div>
                <div className="text-xs text-india-night/50">{o.id} · {o.time}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{inr(o.amount)}</div>
                <div className="text-[10px] uppercase tracking-wide text-india-night/40">{o.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Savings nudge */}
      <div className="card flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 p-5">
        <div>
          <h3 className="font-display text-lg font-bold text-emerald-800">🪙 Bhavishya Nidhi · PPF Auto-Savings</h3>
          <p className="text-sm text-emerald-700/80">{inr(artisan?.ppfBalance || 48200)} saved so far · {artisan?.savingRate || 15}% of profit auto-routed</p>
        </div>
        <Link to="/artisan/smart-wallet" className="btn-primary !bg-emerald-600 hover:!bg-emerald-700">Open Wallet</Link>
      </div>
    </div>
  )
}