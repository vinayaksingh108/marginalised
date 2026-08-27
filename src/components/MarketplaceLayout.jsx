import React from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Search, Home as HomeIcon, Compass, MapPin, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { Peacock, MeenakariBorder } from './IndianMotifs'

const NAV = [
  { to: '/marketplace/home', label: 'Home', icon: HomeIcon },
  { to: '/marketplace/explore', label: 'Explore', icon: Compass },
]

export default function MarketplaceLayout() {
  const { count } = useCart()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-india-cream">
      {/* Top announcement strip */}
      <div className="bg-india-green text-center text-xs font-semibold text-white">
        🇮🇳 भारतीय हस्तशिल्प बाज़ार · Every purchase supports a GI-tagged Indian artisan · Free shipping over ₹999
      </div>

      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <Link to="/marketplace/home" className="flex items-center gap-2">
            <Peacock className="h-9 w-9" />
            <span className="font-display text-lg font-extrabold text-india-night">
              Empower<span className="text-saffron">Craft</span>
            </span>
          </Link>

          <div className="ml-2 hidden flex-1 md:block">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                navigate('/marketplace/explore')
              }}
              className="flex items-center gap-2 rounded-full border border-black/10 bg-india-cream px-4 py-2"
            >
              <Search size={18} className="text-india-night/50" />
              <input className="w-full bg-transparent text-sm outline-none" placeholder="Search pottery, handloom, woodwork…" />
            </form>
          </div>

          <div className="ml-auto flex items-center gap-1">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-saffron text-white' : 'text-india-night/70 hover:bg-india-cream'
                  }`
                }
              >
                <n.icon size={17} />
                <span className="hidden lg:inline">{n.label}</span>
              </NavLink>
            ))}
            <Link
              to="/marketplace/cart"
              className="relative ml-1 flex items-center gap-1.5 rounded-full bg-india-night px-3.5 py-2 text-sm font-semibold text-white"
            >
              <ShoppingCartIcon />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </nav>
        <MiniNakari />
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>

      <footer className="mt-12 border-t border-black/5 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-extrabold">
              <Peacock className="h-8 w-8" /> EmpowerCraft
            </div>
            <p className="mt-2 text-india-night/60">
              A digital toolkit bringing rural Indian artisans straight to your doorstep — verified, GI-tagged, fairly paid.
            </p>
          </div>
          <div>
            <h4 className="mb-2 font-bold">Shop</h4>
            <ul className="space-y-1 text-india-night/60">
              <li>Pottery · Handloom · Woodwork · Metalcraft</li>
              <li>GI-Tagged Authenticity</li>
              <li>Fair-Wage Pricing</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-bold">For Artisans</h4>
            <Link to="/artisan/auth" className="text-saffron-dark hover:underline">Artisan Business Studio →</Link>
            <p className="mt-2 flex items-center gap-1 text-india-night/60"><MapPin size={14} /> Proudly Made in India 🇮🇳</p>
          </div>
        </div>
        <div className="border-t border-black/5 bg-india-cream py-3 text-center text-xs text-india-night/50">
          © 2026 EmpowerCraft · 100% free, open-source, zero-cost tech stack
        </div>
      </footer>
    </div>
  )
}

function ShoppingCartIcon() {
  return <ShoppingBag size={18} />
}
function MiniNakari() {
  return <div className="h-px bg-gradient-to-r from-transparent via-saffron/40 to-transparent" />
}