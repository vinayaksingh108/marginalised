import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Mic2, MapPin, ShieldCheck, ArrowRight } from 'lucide-react'
import { Peacock, Mandala, Temple, PaisleyRule } from '../components/IndianMotifs'

const FEATURES = [
  { icon: MapPin, title: 'Geo-Verified Provenance', desc: 'Every product carries GPS origin & GI-tag badge.' },
  { icon: Mic2, title: 'Voice in 28+ Languages', desc: 'Run the whole studio in your native dialect.' },
  { icon: ShieldCheck, title: 'Fair-Wage & Free Stack', desc: 'Transparent pricing, PPF auto-savings, 100% free tech.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-india-night text-white">
      <div className="h-1.5 bg-gradient-to-r from-saffron via-white to-india-green" />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 rangoli opacity-40" />
        <Mandala className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 text-saffron opacity-20" />
        <Temple className="pointer-events-none absolute bottom-0 left-0 w-full text-saffron" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-14 text-center sm:py-24">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-saffron/40 bg-white/10 px-4 py-1.5 text-xs font-semibold text-saffron">
              🇮🇳 भारतीय हस्तशिल्प मंच · Made in India
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl font-display text-5xl font-extrabold leading-tight sm:text-6xl">
            Empower<span className="text-saffron">Craft</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 max-w-xl text-lg text-white/75">
            Digital toolkit that brings rural India's heritage artisans closer to the world — a storefront for
            buyers, a voice-first studio for makers.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/marketplace/home" className="btn-primary !px-7 !py-4 text-base">
              <ShoppingBag size={20} /> Shop Handicrafts <ArrowRight size={18} />
            </Link>
            <Link to="/artisan/auth" className="btn-ghost !border-white/25 !bg-white/10 !px-7 !py-4 text-base !text-white hover:!bg-white/20">
              <Mic2 size={20} /> Artisan Login — Voice Studio
            </Link>
          </motion.div>

          {/* Impact stats from Project Loom */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['6.46M+', 'artisans served'],
              ['71% / 64%', 'women weavers / artisans'],
              ['0%', 'listing commission (ONDC)'],
              ['15–30%', 'middleman margin cut'],
            ].map(([num, label]) => (
              <div key={label} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="font-display text-2xl font-extrabold text-saffron">{num}</div>
                <div className="mt-1 text-[11px] leading-tight text-white/60">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 md:grid-cols-2">
          <PortalCard to="/marketplace/home" accent="from-saffron to-saffron-dark" icon={<ShoppingBag size={18} />}
            title="Buyer Marketplace" tag="E-Commerce"
            points={['GI-tagged authenticity & fair wages', 'Simulated UPI checkout', 'Live delivery tracking']}
            cta="Browse the Bazaar" />
          <PortalCard to="/artisan/auth" accent="from-india-green to-emerald-600" icon={<Mic2 size={18} />}
            title="Artisan Business Studio" tag="Seller Portal"
            points={['AI background removal & geo-verify', 'IVR order confirmations', 'PPF auto-savings & schemes']}
            cta="Enter the Studio" />
        </div>
        <PaisleyRule className="mt-10 text-saffron" />
      </section>

      <LandingFooter />
    </div>
  )
}

/* ---- appended Trailers / Footer ---- */
function LandingFooter() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4">
        <div className="grid gap-5 sm:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <div className="mb-3 inline-flex rounded-xl bg-saffron/15 p-3 text-saffron"><f.icon /></div>
              <h3 className="font-display text-lg font-bold">{f.title}</h3>
              <p className="mt-1 text-sm text-white/60">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-14">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-saffron to-saffron-dark p-8">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <div className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full bg-white/15">
              <Peacock className="h-32 w-32" />
              <span className="absolute -bottom-2 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-saffron-dark">
                Indian Peacock · National Bird
              </span>
            </div>
            <div>
              <h2 className="font-display text-3xl font-extrabold">Heritage, in every thread &amp; touch</h2>
              <p className="mt-2 max-w-xl text-white/85">
                Like the peacock colours our fields and the lotus blooms in our ponds, every artisan paints pride into
                every piece. EmpowerCraft keeps that spirit alive — verified, fairly paid, honestly priced.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-white/50">
        © 2026 EmpowerCraft · 100% free &amp; open-source · Powered by Web Speech, WebGPU &amp; IndexedDB
      </footer>
    </>
  )
}

function PortalCard({ to, accent, icon, title, tag, points, cta }) {
  return (
    <Link to={to} className="group rounded-2xl bg-white text-india-night ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-card">
      <div className={`flex items-center gap-2 rounded-t-2xl bg-gradient-to-r ${accent} px-5 py-3 text-white`}>
        {icon}
        <span className="font-display text-base font-bold">{title}</span>
        <span className="ml-auto rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase">{tag}</span>
      </div>
      <div className="p-6">
        <ul className="space-y-2 text-sm text-india-night/70">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-2"><span className="text-saffron">✦</span> {p}</li>
          ))}
        </ul>
        <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-saffron px-5 py-2.5 font-semibold text-white transition group-hover:bg-saffron-dark">
          {cta} <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  )
}