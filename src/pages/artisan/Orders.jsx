import React, { useState, useEffect, useRef } from 'react'
import { Phone, PhoneOff, Volume2, CheckCircle2, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useArtisan } from '../../context/ArtisanContext'
import { speak, cancelSpeech, inr } from '../../lib/speech'

const TABS = ['New', 'Confirmed via IVR', 'Packed', 'Shipped']
const STATUS_STYLE = {
  New: 'bg-red-100 text-red-700',
  'Confirmed via IVR': 'bg-amber-100 text-amber-700',
  Packed: 'bg-sky-100 text-sky-700',
  Shipped: 'bg-emerald-100 text-emerald-700',
}

export default function Orders() {
  const { orders, setOrders } = useArtisan()
  const [tab, setTab] = useState('New')
  const [call, setCall] = useState(null)
  const audioRef = useRef(null)

  // Advance status by one step
  const advance = (id) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== id) return o
      const orderIdx = ['New', 'Confirmed via IVR', 'Packed', 'Shipped'].indexOf(o.status)
      const next = ['New', 'Confirmed via IVR', 'Packed', 'Shipped'][Math.min(orderIdx + 1, 3)]
      return { ...o, status: next }
    }))
  }

  const triggerIVR = (order) => {
    setCall(order)
    // Web Audio simulated ringtone + native TTS
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const play = () => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = 880
      gain.gain.value = 0.06
      osc.connect(gain); gain.connect(ctx.destination)
      osc.start(); setTimeout(() => { osc.stop() }, 500)
    }
    play(); setTimeout(play, 800); setTimeout(play, 1600)
    audioRef.current = ctx
  }

  const answer = (accept) => {
    cancelSpeech()
    if (audioRef.current) audioRef.current.close().catch(() => {})
    const order = call
    setCall(null)
    if (accept) {
      speak(`आपका ऑर्डर स्वीकार हो गया। आर्डर नंबर ${order.id}. कुल राशि ${inr(order.amount)}। शुक्रिया!`)
      advance(order.id)
    } else {
      speak('ऑर्डर अस्वीकार कर दिया गया।')
    }
  }

  const visible = orders.filter((o) => tab === 'All' || o.status === tab)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-white">Orders 📦</h1>
        <p className="text-sm text-white/60">पुष्टि IVR कॉल से करें · देशभर के खरीदारों के ऑर्डर</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <TabBtn active={tab === 'All'} onClick={() => setTab('All')} label={`All (${orders.length})`} />
        {TABS.map((t) => {
          const n = orders.filter((o) => o.status === t).length
          return <TabBtn key={t} active={tab === t} onClick={() => setTab(t)} label={`${t} (${n})`} />
        })}
      </div>

      {/* Order list */}
      <div className="space-y-3">
        {visible.length === 0 && (
          <div className="card bg-white p-10 text-center text-india-night/50">No orders in this tab.</div>
        )}
        {visible.map((o) => (
          <div key={o.id} className="card flex flex-wrap items-center gap-4 bg-white p-4">
            <span className="text-3xl">🧺</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-india-night">{o.product}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_STYLE[o.status] || STATUS_STYLE.New}`}>{o.status}</span>
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-india-night/50">
                <span>{o.id}</span><span>{o.qty} ×</span><span>{inr(o.amount)}</span>
                <span>{o.buyer} · {o.city}</span><span><Clock size={11} className="mr-0.5 inline" />{o.time}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {o.status === 'New' && (
                <button onClick={() => triggerIVR(o)} className="btn-primary !py-2 text-sm">
                  <Phone size={15} /> IVR Confirm
                </button>
              )}
              {o.status !== 'Shipped' && (
                <button onClick={() => advance(o.id)} className="btn-ghost !py-2 text-sm">Move →</button>
              )}
              {o.status === 'Confirmed via IVR' && (
                <a className="btn-ghost !py-2 text-sm">🏷️ ONDC Label</a>
              )}
            </div>
          </div>
        ))}
      </div>

      <IVRModal call={call} onChoose={answer} />
    </div>
  )
}

function TabBtn({ active, onClick, label }) {
  return (
    <button onClick={onClick} className={`chip shrink-0 ${active ? 'chip-active' : ''}`}>{label}</button>
  )
}

/* ---- IVR call simulator modal ---- */
function IVRModal({ call, onChoose }) {
  const [playing, setPlaying] = useState(false)

  // Read the order aloud when the call pops up
  useEffect(() => {
    if (!call) return
    setPlaying(true)
    const t = setTimeout(() => {
      speak(`आपके पास नया आर्डर है। आर्डर नंबर ${call.id}, ${call.qty} ${call.product}, कुल राशि ${inr(call.amount)}। स्वीकार करने के लिए 1 दबाइए, अस्वीकार के लिए 2।`)
      setPlaying(false)
    }, 900)
    return () => { clearTimeout(t); cancelSpeech() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call])

  if (!call) return null

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
        <motion.div initial={{ y: 40, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 40 }}
          className="w-full max-w-sm overflow-hidden rounded-3xl bg-india-night text-white shadow-2xl">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/20 animate-ring">
                <Phone size={24} />
              </span>
              <div>
                <div className="text-xs uppercase tracking-wide text-white/70">EmpowerCraft IVR</div>
                <div className="font-display text-lg font-bold">Incoming Call</div>
              </div>
              <span className="ml-auto text-xs text-white/70">{call.id}</span>
            </div>
          </div>
          <div className="p-6">
            <p className="flex items-center gap-2 text-sm text-white/80">
              <Volume2 size={16} className={playing ? 'animate-pulse text-emerald-400' : 'text-white/50'} />
              {playing ? 'Speaking order details…' : 'Order details read aloud'}
            </p>
            <div className="mt-3 space-y-1 rounded-xl bg-white/5 p-3 text-sm">
              <Row k="Product" v={`${call.qty} × ${call.product}`} />
              <Row k="Amount" v={inr(call.amount)} />
              <Row k="Buyer" v={`${call.buyer}, ${call.city}`} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button onClick={() => onChoose(true)} className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-bold text-white">
                <CheckCircle2 size={18} /> 1 · Accept
              </button>
              <button onClick={() => onChoose(false)} className="flex items-center justify-center gap-2 rounded-xl bg-red-500 py-3 font-bold text-white">
                <PhoneOff size={18} /> 2 · Decline
              </button>
            </div>
            <p className="mt-3 text-center text-[11px] text-white/40">Simulated IVR — native TTS reads in your dialect</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/50">{k}</span><span className="font-semibold">{v}</span>
    </div>
  )
}