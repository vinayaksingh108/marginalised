import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin, BadgeCheck, Clock, ShoppingCart, ShieldCheck, Heart,
} from 'lucide-react'
import { useProducts } from '../../data/useStore'
import { useCart } from '../../context/CartContext'
import { GiBadge, Stars } from '../../components/ProductCard'
import { CraftArt, Peacock, PaisleyRule } from '../../components/IndianMotifs'
import { inr } from '../../lib/speech'

export default function Product() {
  const { id } = useParams()
  const { add } = useCart()
  const products = useProducts()
  const p = products.find((x) => x.id === id)
  const [qty, setQty] = React.useState(1)

  if (!p) {
    return <div className="p-10 text-center">लोड हो रहा है… Loading</div>
  }

  const cost = p.cost || {}
  const artisan = p.artisan
  const fare = {
    craft: cost.craft ?? p.price * 0.4,
    material: cost.material ?? p.price * 0.25,
    platformFee: cost.platformFee ?? p.price * 0.05,
    shipping: cost.shipping ?? 0,
  }
  const fairSum = fare.craft + fare.material + fare.platformFee + fare.shipping

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Image + provenance */}
      <div>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="card relative overflow-hidden bg-mandala-pattern">
          <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-saffron/15 via-transparent to-india-green/10 p-10">
            <CraftArt category={p.category} className="h-72 w-72" />
          </div>
          <div className="absolute left-4 top-4"><GiBadge gi={p.gi} /></div>
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-india-night/70">
            <ShieldCheck size={13} className="text-india-green" /> Studio-enhanced image
          </div>
        </motion.div>

        <div className="card mt-4 bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 font-display font-bold">
              <MapPin size={16} className="text-saffron-dark" /> Verified Provenance
            </h3>
            <span className="text-[11px] font-bold text-india-green">● Live GNSS pin</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-india-night">{p.cluster}</p>
          <p className="flex items-center gap-1 text-xs text-india-night/60">
            <Clock size={12} /> Listed {p.listedAt} · GPS &amp; timestamp bonded
          </p>
          <div className="mt-3 overflow-hidden rounded-xl border border-black/5">
            {artisan ? (
              <iframe
                title="provenance map"
                className="h-36 w-full"
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${artisan.lng - 0.05}%2C${artisan.lat - 0.05}%2C${artisan.lng + 0.05}%2C${artisan.lat + 0.05}&layer=mapnik&marker=${artisan.lat}%2C${artisan.lng}`}
              />
            ) : (
              <div className="flex h-36 items-center justify-center rounded-xl bg-india-cream text-sm text-india-night/50">
                🌐 OpenStreetMap embed renders here
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info side */}
      <div>
        <div className="mb-1 flex items-center gap-2 text-sm capitalize text-india-night/60">
          <span>{p.category}</span>
          {artisan && <Stars n={artisan.rating} size={13} />}
        </div>
        <h1 className="font-display text-3xl font-extrabold text-india-night">{p.title}</h1>
        <div className="mt-3 flex items-end gap-3">
          <span className="text-3xl font-extrabold text-india-green">{inr(p.price)}</span>
          <span className="text-sm text-india-night/50">per {p.units}</span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-india-night/75">{p.desc}</p>

        <div className="card mt-5 bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 font-display font-bold">
              <Heart size={16} className="text-saffron" /> Fair-Wage Breakdown
            </h3>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">Standard</span>
          </div>
          <div className="mt-3 space-y-2 text-sm">
            {[
              ['🖐️ Artisan labour', fare.craft, 'goes straight to the maker'],
              ['📦 Material & finish', fare.material, ''],
              ['🚚 Shipping & handling', fare.shipping, ''],
              ['🗹 Platform fee', fare.platformFee, '1–5% only'],
            ].map(([label, val, note]) => (
              <div key={label} className="flex items-center justify-between border-b border-dashed border-black/5 pb-2">
                <span className="text-india-night/70">{label} {note && <span className="text-india-night/40">({note})</span>}</span>
                <span className="font-semibold">{inr(Math.round(val))}</span>
              </div>
            ))}
            <div className="flex items-center justify-between font-bold text-india-night">
              <span>Fair value </span><span>{inr(Math.round(fairSum))}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-xl border border-black/10 bg-white">
            <button onClick={() => setQty((n) => Math.max(1, n - 1))} className="px-4 py-2.5 font-bold">−</button>
            <span className="w-8 text-center font-semibold">{qty}</span>
            <button onClick={() => setQty((n) => Math.min(p.stock, n + 1))} className="px-4 py-2.5 font-bold">+</button>
          </div>
          <button onClick={() => add(p, qty)} className="btn-primary flex-1">
            <ShoppingCart size={18} /> Add to Cart
          </button>
          <Link to="/marketplace/checkout" onClick={() => add(p, qty)} className="btn-ghost shrink-0 !border-saffron !text-saffron-dark">
            Buy Now
          </Link>
        </div>

        {p.stock <= 8 && <p className="mt-2 text-xs font-semibold text-red-600">⚡ Only {p.stock} left in stock — order soon!</p>}

        <div className="card mt-5 bg-saffron/5 p-4">
          <h3 className="flex items-center gap-1.5 font-display font-bold">
            <BadgeCheck size={16} className="text-saffron-dark" /> Provenance Story
          </h3>
          <p className="mt-2 text-sm text-india-night/75">
            Born in {p.cluster}, this piece carries a geo-temporal signature proving exactly when and where it was
            made — bringing you closer to the hands that crafted it.
          </p>
        </div>

        {artisan && (
          <div className="card mt-5 flex items-center gap-4 bg-white p-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-saffron/15">
              <Peacock className="h-12 w-12" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-lg font-bold">{artisan.name}</h3>
                <Stars n={artisan.rating} size={13} />
              </div>
              <p className="text-xs text-india-night/60">{artisan.village}, {artisan.state} · {artisan.experience} yrs exp.</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {(artisan.badge || []).map((b) => (
                  <span key={b} className="rounded-full bg-saffron/10 px-2 py-0.5 text-[10px] font-bold text-saffron-dark">{b}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        <Link to="/marketplace/explore" className="mt-4 inline-block text-sm font-semibold text-saffron-dark hover:underline">
          ← Keep exploring more crafts
        </Link>
      </div>
      <PaisleyRule className="col-span-full text-saffron" />
    </div>
  )
}