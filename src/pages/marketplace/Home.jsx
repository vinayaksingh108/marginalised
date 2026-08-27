import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import { useProducts } from '../../data/useStore'
import { ProductCard } from '../../components/ProductCard'
import { MeenakariBorder, Peacock } from '../../components/IndianMotifs'

const CATS = [
  { key: 'pottery', label: 'Pottery', flag: '🏺' },
  { key: 'handloom', label: 'Handloom', flag: '🧵' },
  { key: 'woodwork', label: 'Woodwork', flag: '🪵' },
  { key: 'metalcraft', label: 'Metalcraft', flag: '⚱️' },
]

const STATE_FILTERS = [
  { name: 'All India', filter: null, flag: '🇮🇳' },
  { name: 'Rajasthan', filter: 'Rajasthan', flag: '🏜️' },
  { name: 'Telangana', filter: 'Telangana', flag: '🏺' },
  { name: 'Uttar Pradesh', filter: 'Uttar Pradesh', flag: '🕌' },
  { name: 'Andhra Pradesh', filter: 'Andhra Pradesh', flag: '🏛️' },
  { name: 'Gujarat', filter: 'Gujarat', flag: '🪁' },
]

export default function Home() {
  const products = useProducts()
  const [filter, setFilter] = useState(null)
  const curated = useMemo(() => {
    if (!filter) return products
    return products.filter((p) => p.artisan && p.artisan.state === filter)
  }, [products, filter])

  const giToday = useMemo(() => products.filter((p) => p.gi).slice(0, 4), [products])
  const featured = curated.slice(0, 4)

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-saffron via-saffron-dark to-india-night p-8 text-white sm:p-12">
        <Peacock className="pointer-events-none absolute -right-8 -top-8 h-44 w-44 opacity-20 animate-floaty" />
        <div className="pointer-events-none absolute inset-0 rangoli opacity-20" />
        <div className="relative max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            🏺 Handcrafted · GI-tagged · Fair-wage
          </span>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            Every piece, crafted with <span className="text-emerald-300">pride</span>.
          </h1>
          <p className="mt-3 text-white/85">
            From Jaipur's blue pottery to Kondapalli's wooden toys — shop directly from verified artisans across India.
          </p>
          <Link to="/marketplace/explore" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-saffron-dark transition hover:bg-india-cream">
            Explore All Crafts <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Category pills */}
      <section>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATS.map((c) => (
            <Link key={c.key} to={`/marketplace/explore?cat=${c.key}`} className="chip shrink-0 !px-4 !py-2.5">
              <span>{c.flag}</span> {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* State filter */}
      <section>
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {STATE_FILTERS.map((s) => (
            <button
              key={s.name}
              onClick={() => setFilter(s.filter)}
              className={`chip shrink-0 ${filter === s.filter ? 'chip-active' : ''}`}
            >
              <span>{s.flag}</span> {s.name}
            </button>
          ))}
        </div>
        <p className="text-xs text-india-night/50">
          <MapPin size={12} className="mr-1 inline" />
          {curated.length} verified works from {filter || 'all of India'}
        </p>
      </section>

      {/* GI showcase */}
      <section>
        <SectionHead kicker="GI Tagged · National Heritage" title="Authenticity, Guaranteed 🇮🇳" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {giToday.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Curated */}
      <section>
        <SectionHead kicker="Curated for you from craft clusters" title={filter || 'Handpicked this week'} />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      <MeenakariBorder className="text-saffron/40" />
    </div>
  )
}

function SectionHead({ kicker, title }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-bold uppercase tracking-wider text-saffron-dark">{kicker}</p>
      <h2 className="section-title">{title}</h2>
    </div>
  )
}