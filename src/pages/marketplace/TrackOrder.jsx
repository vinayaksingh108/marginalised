import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Package, Truck, Home as HomeIcon, Check } from 'lucide-react'
import { Peacock } from '../../components/IndianMotifs'
import { inr } from '../../lib/speech'

const MILESTONES = [
  { label: 'Order packed by artisan', place: 'Craft Cluster, India', when: 'Picked up', done: true },
  { label: 'Reached regional hub', place: 'Jaipur Sort Centre', when: 'Yesterday', done: true },
  { label: 'In transit to your city', place: 'On the way', when: 'In transit', done: false },
  { label: 'Out for delivery', place: '---', when: 'Upcoming', done: false },
  { label: 'Delivered', place: 'Your doorstep', when: 'Upcoming', done: false },
]

export default function TrackOrder() {
  const { id } = useParams()
  const [progress, setProgress] = useState(2)
  const [ampm, setAmpm] = useState('en route')

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => (p < MILESTONES.length ? p + 0.2 : p))
    }, 1400)
    return () => clearInterval(t)
  }, [])

  const activeCount = Math.floor(progress)

  return (
    <div className="mx-auto max-w-2xl">
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-r from-saffron to-saffron-dark p-6 text-white">
          <div className="flex items-center gap-3">
            <Peacock className="h-12 w-12" />
            <div>
              <div className="text-xs uppercase tracking-wide text-white/70">Live Order Tracking</div>
              <h1 className="font-display text-2xl font-extrabold">Order {id || 'TRK-748291'}</h1>
            </div>
            <span className="ml-auto rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold">{ampm}</span>
          </div>
        </div>

        <div className="p-6">
          <div className="rounded-xl bg-india-cream p-4 text-sm">
            <div className="flex justify-between"><span className="text-india-night/60">Product</span><b>Hand-Painted Blue Pottery Vase ×1</b></div>
            <div className="mt-1 flex justify-between"><span className="text-india-night/60">Amount</span><b>{inr(499)}</b></div>
            <div className="mt-1 flex justify-between"><span className="text-india-night/60">Delivery by</span><b>Today, 7 PM</b></div>
          </div>

          {/* Timeline */}
          <div className="mt-6">
            {MILESTONES.map((m, i) => {
              const done = i < activeCount
              const current = Math.abs(progress - i) < 1
              return (
                <div key={m.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-white transition ${done ? 'bg-india-green' : 'bg-black/15 text-india-night/40'}`}>
                      {done ? <Check size={16} /> : i === 2 ? <Truck size={15} /> : <IconFor i={i} />}
                    </span>
                    {i < MILESTONES.length - 1 && (
                      <span className={`h-10 w-0.5 ${done ? 'bg-india-green' : 'bg-black/15'}`} />
                    )}
                  </div>
                  <div className={`pb-6 ${current ? '' : ''}`}>
                    <div className={`font-semibold ${done ? 'text-india-night' : 'text-india-night/40'}`}>{m.label}</div>
                    <div className="flex items-center gap-1 text-xs text-india-night/60">
                      {done ? <Check size={11} className="text-india-green" /> : <MapPin size={11} />} {done ? m.when : m.place}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <Link to="/marketplace/explore" className="btn-ghost w-full">Browse more crafts</Link>
        </div>
      </div>
    </div>
  )
}

function IconFor({ i }) {
  if (i === 0) return <Package size={15} />
  if (i === 1) return <MapPin size={15} />
  if (i === 3) return <Truck size={15} />
  return <HomeIcon size={15} />
}