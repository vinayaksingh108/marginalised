import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useProducts } from '../../data/useStore'
import { ProductCard } from '../../components/ProductCard'
import { EmptyBlock } from '../../components/ProductCard'

const CATS = [
  { key: null, label: 'All' },
  { key: 'pottery', label: 'Pottery' },
  { key: 'handloom', label: 'Handloom' },
  { key: 'woodwork', label: 'Woodwork' },
  { key: 'metalcraft', label: 'Metalcraft' },
]

const STATES = [
  { key: null, label: 'All States' },
  { key: 'Rajasthan', label: 'Rajasthan' },
  { key: 'Telangana', label: 'Telangana' },
  { key: 'Uttar Pradesh', label: 'Uttar Pradesh' },
  { key: 'Andhra Pradesh', label: 'Andhra Pradesh' },
  { key: 'Gujarat', label: 'Gujarat' },
]

export default function Explore() {
  const products = useProducts()
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState('')
  const cat = params.get('cat') || ''
  const [state, setState] = useState('')
  const [giOnly, setGiOnly] = useState(false)
  const [maxPrice, setMaxPrice] = useState(5000)

  const setCat = (key) => {
    const next = new URLSearchParams(params)
    if (!key) next.delete('cat')
    else next.set('cat', key)
    setParams(next)
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (cat && p.category !== cat) return false
      if (state && (!p.artisan || p.artisan.state !== state)) return false
      if (giOnly && !p.gi) return false
      if (p.price > maxPrice) return false
      if (q) {
        const hay = `${p.title} ${p.category} ${(p.tags || []).join(' ')} ${p.cluster}`.toLowerCase()
        if (!hay.includes(q.toLowerCase())) return false
      }
      return true
    })
  }, [products, cat, state, giOnly, maxPrice, q])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="section-title">Explore the Craft Atlas</h1>
        <div className="flex flex-1 items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 sm:max-w-sm">
          <Search size={18} className="text-india-night/50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search pottery, shawl, GI…"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {/* Filter bar */}
      <div className="card bg-white p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-india-night">
          <SlidersHorizontal size={16} className="text-saffron" /> Filters
          {(cat || state || giOnly || maxPrice < 5000) && (
            <button onClick={() => { setCat(null); setState(''); setGiOnly(false); setMaxPrice(5000); setQ('') }}
              className="ml-auto flex items-center gap-1 text-xs font-semibold text-saffron-dark hover:underline">
              <X size={13} /> Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button key={c.key || 'all'} onClick={() => setCat(c.key)}
              className={`chip ${cat === c.key ? 'chip-active' : ''}`}>{c.label}</button>
          ))}
          <span className="w-px bg-black/10 mx-1" />
          {STATES.map((s) => (
            <button key={s.key || 'all'} onClick={() => setState(s.key)}
              className={`chip ${state === s.key ? 'chip-active' : ''}`}>{s.label}</button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-5">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" checked={giOnly} onChange={(e) => setGiOnly(e.target.checked)}
              className="h-4 w-4 accent-saffron" />
            🇮🇳 GI-Tagged only
          </label>
          <label className="flex flex-1 min-w-[180px] items-center gap-3 text-sm">
            <span className="shrink-0 font-medium">₹0 — ₹{maxPrice}</span>
            <input type="range" min={200} max={5000} step={100} value={maxPrice}
              onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-saffron" />
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-india-night/60">
        <span>{filtered.length} works</span>
      </div>

      {filtered.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      ) : (
        <EmptyBlock icon="🪔" title="Nothing found" sub="Try changing the filters or search term." />
      )}
    </div>
  )
}