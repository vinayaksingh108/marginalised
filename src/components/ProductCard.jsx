import React from 'react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { CraftArt, MeenakariBorder } from './IndianMotifs'
import { inr } from '../lib/speech'

export function Stars({ n = 0, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-500">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(n) ? 'fill-current' : 'text-black/15'}
        />
      ))}
    </span>
  )
}

export function GiBadge({ gi = false }) {
  if (!gi) return null
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 ring-1 ring-amber-300">
      🇮🇳 GI Tagged
    </span>
  )
}

export function ProductCard({ p }) {
  return (
    <Link
      to={`/marketplace/product/${p.id}`}
      className="card group overflow-hidden bg-white transition hover:-translate-y-1 hover:shadow-card"
    >
      <div className="relative overflow-hidden bg-mandala-pattern">
        <div className="flex aspect-[4/3] items-center justify-center p-6 bg-gradient-to-br from-saffron/10 via-transparent to-india-green/5">
          <CraftArt category={p.category} className="h-36 w-36 transition group-hover:scale-105" />
        </div>
        <div className="absolute left-3 top-3">
          <GiBadge gi={p.gi} />
        </div>
        {p.stock <= 8 && (
          <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
            Only {p.stock} left
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between text-xs font-medium capitalize text-india-night/60">
          <span>{p.category}</span>
          {p.artisan && (
            <span className="truncate max-w-[50%]">👩‍🎨 {p.artisan.name}</span>
          )}
        </div>
        <h3 className="line-clamp-2 min-h-[40px] font-display text-base font-bold leading-tight text-india-night">
          {p.title}
        </h3>
        <MeenakariBorder className="mt-2 text-saffron/50" />
        <div className="mt-2 flex items-end justify-between">
          <div>
            <div className="text-lg font-extrabold text-india-green">{inr(p.price)}</div>
            {p.artisan && <Stars n={p.artisan.rating} size={12} />}
          </div>
          <span className="rounded-lg bg-saffron px-3 py-1.5 text-xs font-bold text-white transition group-hover:bg-saffron-dark">
            View
          </span>
        </div>
      </div>
    </Link>
  )
}

export function EmptyBlock({ icon = '🪷', title, sub }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-2 bg-white p-10 text-center">
      <div className="text-5xl">{icon}</div>
      <h3 className="font-display text-lg font-bold text-india-night">{title}</h3>
      {sub && <p className="text-sm text-india-night/60">{sub}</p>}
    </div>
  )
}