import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, X } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { CraftArt } from '../../components/IndianMotifs'
import { EmptyBlock, GiBadge } from '../../components/ProductCard'
import { inr } from '../../lib/speech'

export default function Cart() {
  const { items, setQty, remove, total, count } = useCart()

  if (!items.length) {
    return (
      <div className="mx-auto max-w-lg pt-16">
        <EmptyBlock icon="🧺" title="Your cart is empty" sub="Add some beautiful handmade crafts to get started." />
        <Link to="/marketplace/explore" className="btn-primary mt-6 w-full">Explore crafts <Arrow size={16} /></Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        {items.map((it) => (
          <div key={it.id} className="card flex items-center gap-4 bg-white p-3">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-mandala-pattern">
              <CraftArt category={it.category} className="h-20 w-20 p-2" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <GiBadge gi={it.gi} />
              </div>
              <h3 className="truncate font-semibold text-india-night">{it.title}</h3>
              <div className="text-sm font-extrabold text-india-green">{inr(it.price)}</div>
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-black/10 px-1">
              <button onClick={() => setQty(it.id, it.qty - 1)} className="px-2 py-1 font-bold">−</button>
              <span className="w-6 text-center text-sm font-semibold">{it.qty}</span>
              <button onClick={() => setQty(it.id, it.qty + 1)} className="px-2 py-1 font-bold">+</button>
            </div>
            <div className="w-20 text-right font-bold text-india-night">{inr(it.price * it.qty)}</div>
            <button onClick={() => remove(it.id)} className="p-2 text-india-night/40 hover:text-red-600">
              <X size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="card h-fit bg-white p-5 lg:sticky lg:top-24">
        <h2 className="font-display text-xl font-bold">Price Breakdown</h2>
        <div className="mt-3 space-y-2 text-sm">
          <Row label={`Subtotal (${count} items)`} val={total} />
          <Row label="Shipping" val={total >= 999 ? 0 : 49} />
          <Row label="Packaging" val={10} />
          <div className="border-t border-dashed border-black/10 pt-2 font-bold">
            <div className="flex justify-between text-india-night">
              <span>Total</span><span>{inr(total + (total >= 999 ? 10 : 59))}</span>
            </div>
          </div>
        </div>
        <Link to="/marketplace/checkout" className="btn-primary mt-4 w-full">
          Proceed to Checkout <ArrowRight size={16} />
        </Link>
        <p className="mt-2 text-center text-[11px] text-india-night/50">UPI · Card · Free over ₹999</p>
      </div>
    </div>
  )
}

function Row({ label, val }) {
  return (
    <div className="flex justify-between text-india-night/75">
      <span>{label}</span><span className="font-semibold">{val === 0 ? 'FREE' : inr(val)}</span>
    </div>
  )
}

function Arrow(props) { return <ArrowRight {...props} /> }