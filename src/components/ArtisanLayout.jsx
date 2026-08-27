import React from 'react'
import { Link, NavLink, Outlet, Navigate } from 'react-router-dom'
import {
  LayoutDashboard, PackagePlus, Boxes, ListOrdered, BarChart3,
  Wallet, Landmark, Trophy, Mic, Languages,
} from 'lucide-react'
import { useArtisan } from '../context/ArtisanContext'
import VoiceAssistant from './VoiceAssistant'
import { Peacock, MeenakariBorder } from './IndianMotifs'

const NAV = [
  { to: '/artisan/dashboard', label: 'डैशबोर्ड', en: 'Dashboard', icon: LayoutDashboard },
  { to: '/artisan/studio/add-product', label: 'उत्पाद जोड़ें', en: 'Add Product', icon: PackagePlus },
  { to: '/artisan/inventory', label: 'इन्वेंट्री', en: 'Inventory', icon: Boxes },
  { to: '/artisan/orders', label: 'ऑर्डर', en: 'Orders', icon: ListOrdered },
  { to: '/artisan/analytics-studio', label: 'एनालिटिक्स', en: 'Analytics', icon: BarChart3 },
  { to: '/artisan/smart-wallet', label: 'स्मार्ट वॉलेट', en: 'Wallet', icon: Wallet },
  { to: '/artisan/schemes', label: 'सरकारी योजनाएँ', en: 'Schemes', icon: Landmark },
  { to: '/artisan/milestones', label: 'माइलस्टोन', en: 'Milestones', icon: Trophy },
  { to: '/artisan/settings', label: 'सेटिंग्स', en: 'Settings', icon: Languages },
]

export default function ArtisanLayout() {
  const { artisan, loaded } = useArtisan()
  if (loaded && !artisan) return <Navigate to="/artisan/auth" replace />

  return (
    <div className="min-h-screen bg-india-night">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-white/5 p-4 text-white backdrop-blur lg:flex">
          <Link to="/artisan/dashboard" className="mb-6 flex items-center gap-2">
            <Peacock className="h-10 w-10" />
            <div>
              <div className="font-display text-lg font-extrabold leading-none">
                Empower<span className="text-saffron">Craft</span>
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-wider text-white/50">Artisan Studio</div>
            </div>
          </Link>

          <nav className="space-y-1">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    isActive
                      ? 'bg-saffron font-semibold text-white'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <n.icon size={18} />
                <span>{n.label}</span>
                <span className="ml-auto text-[10px] uppercase tracking-wide text-white/40">{n.en}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl bg-white/10 p-3">
            <div className="flex items-center gap-2 text-xs">
              <Mic size={14} className="text-saffron" />
              <span className="text-white/80">Voice Assistant सक्रिय</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-white/50">
              <Languages size={12} /> Select any of 28+ languages
            </div>
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-india-night/95 px-4 py-3 text-white backdrop-blur lg:hidden">
          <Link to="/artisan/dashboard" className="flex items-center gap-1.5">
            <Peacock className="h-7 w-7" />
            <span className="font-display font-extrabold">Artisan Studio</span>
          </Link>
          <MobileNav />
        </div>

        {/* Main */}
        <div className="flex-1 lg:pl-64">
          <MobileNav />
          <main className="mx-auto max-w-6xl px-4 pb-28 pt-16 lg:pt-8">
            {artisan && <TopGreeting artisan={artisan} />}
            <Outlet />
          </main>
        </div>
      </div>

      <VoiceAssistant artisan={artisan} />
      <MeenakariBorder className="fixed bottom-0 left-0 right-0 z-30 text-saffron/30" />
    </div>
  )
}

function TopGreeting({ artisan }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-white">
          नमस्ते, {artisan?.name?.split(' ')[0]} 🙏
        </h1>
        <p className="text-sm text-white/60">{artisan?.village} · {artisan?.craft}</p>
      </div>
      <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/80">
        <span className="h-2 w-2 rounded-full bg-emerald-400" /> Studio फ्री · Free
      </div>
    </div>
  )
}

function MobileNav() {
  const items = NAV.slice(0, 5)
  return (
    <div className="flex items-center gap-0.5 lg:hidden">
      {items.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          className={({ isActive }) =>
            `rounded-full p-2 ${isActive ? 'bg-saffron text-white' : 'text-white/70'}`
          }
        >
          <n.icon size={18} />
        </NavLink>
      ))}
    </div>
  )
}