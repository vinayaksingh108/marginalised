import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, CreditCard, QrCode, MapPin, Lock } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { EmptyBlock } from '../../components/ProductCard'
import { inr } from '../../lib/speech'

const METHODS = [
  { key: 'upi', label: 'UPI / UPI Lite', icon: QrCode },
  { key: 'card', label: 'Debit / Credit Card', icon: CreditCard },
  { key: 'cod', label: 'Cash on Delivery', icon: MapPin },
]

export default function Checkout() {
  const { items, total, clear } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [method, setMethod] = useState('upi')
  const [paying, setPaying] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', pincode: '' })

  if (!items.length && !done) {
    return (
      <div className="mx-auto max-w-lg pt-16">
        <EmptyBlock icon="🛒" title="Nothing to checkout yet" sub="Add some handmade crafts to your cart first." />
      </div>
    )
  }

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }))
  const shipping = total >= 999 ? 0 : 49
  const totalBill = total + shipping + 10

  const pay = () => {
    setPaying(true)
    setTimeout(() => { setPaying(false); setDone(true); clear() }, 1600)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="section-title">Checkout</h1>
      <StepBar step={step} />

      {!done && step === 1 && (
        <div className="card mt-5 bg-white p-5 sm:p-8">
          <h2 className="font-display text-xl font-bold">1 · Delivery Address</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Name" v={form.name} set={set} k="name" ph="Rahul Verma" />
            <Field label="Mobile" v={form.phone} set={set} k="phone" ph="98765 43210" />
            <div className="sm:col-span-2"><Field label="Address" v={form.address} set={set} k="address" ph="House / landmark" /></div>
            <Field label="City" v={form.city} set={set} k="city" ph="City" />
            <Field label="PIN Code" v={form.pincode} set={set} k="pincode" ph="110001" />
          </div>
          <button onClick={() => setStep(2)} className="btn-primary mt-6 w-full">Continue to Payment</button>
        </div>
      )}

      {!done && step === 2 && (
        <div className="mt-5 grid gap-5 md:grid-cols-5">
          <div className="card space-y-2 bg-white p-5 md:col-span-3">
            <h2 className="font-display text-xl font-bold">2 · Payment Method</h2>
            {METHODS.map((m) => (
              <button key={m.key} onClick={() => setMethod(m.key)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition ${method === m.key ? 'border-saffron bg-saffron/5' : 'border-black/10'}`}>
                <m.icon size={20} className={method === m.key ? 'text-saffron-dark' : 'text-india-night/50'} />
                <span className="flex-1 font-semibold">{m.label}</span>
                {method === m.key && <Check size={18} className="text-india-green" />}
              </button>
            ))}
            {method === 'upi' && (
              <div className="mt-2 flex items-center gap-4 rounded-xl bg-india-cream p-3">
                <img alt="UPI QR" className="h-24 w-24 rounded-lg"
                  src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=sunitadevi%40okhdfcbank&pn=EmpowerCraft&am=" />
                <div className="text-xs text-india-night/70">
                  <p className="font-semibold text-india-night">Scan with any UPI app</p>
                  <p className="mt-1">sunitadevi@okhdfcbank<br />Amount {inr(totalBill)}</p>
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="card bg-white p-5">
              <h3 className="font-display font-bold">Order Summary</h3>
              {items.map((it) => (
                <div key={it.id} className="mt-2 flex justify-between text-sm">
                  <span>{it.qty}× {it.title}</span><span className="font-semibold">{inr(it.price * it.qty)}</span>
                </div>
              ))}
              <div className="mt-3 space-y-1 border-t border-dashed pt-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><b>{inr(total)}</b></div>
                <div className="flex justify-between"><span>Shipping</span><b>{shipping ? inr(shipping) : 'FREE'}</b></div>
                <div className="flex justify-between pt-1 font-bold text-india-night"><span>Total</span><span>{inr(totalBill)}</span></div>
              </div>
            </div>
            <button onClick={pay} disabled={paying} className="btn-primary mt-4 w-full">
              {paying ? 'Processing…' : `Pay ${inr(totalBill)}`}
            </button>
            <p className="mt-2 text-center text-[11px] text-india-night/50"><Lock size={11} className="mr-1 inline" /> Simulated payment · No real charge</p>
          </div>
        </div>
      )}

      {done && <DoneCard navigate={navigate} />}
    </div>
  )
}

/* ---- Part B: helpers ---- */
function Field({ label, v, set, k, ph }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input value={v} placeholder={ph} onChange={(e) => set(k, e.target.value)} className="input" />
    </label>
  )
}

function StepBar({ step }) {
  const steps = ['Address', 'Payment', 'Done']
  return (
    <div className="mt-3 flex items-center gap-2 text-xs font-semibold">
      {steps.map((t, i) => {
        const n = i + 1
        return (
          <React.Fragment key={t}>
            {i > 0 && <span className="h-px w-8 bg-black/15" />}
            <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 ${step >= n ? 'bg-saffron text-white' : 'bg-black/10 text-india-night/50'}`}>
              <span className="grid h-4 w-4 place-items-center rounded-full bg-white/30 text-[10px]">
                {step > n ? <Check size={10} /> : n}
              </span>
              {t}
            </span>
          </React.Fragment>
        )
      })}
    </div>
  )
}

function DoneCard({ navigate }) {
  return (
    <div className="card mt-6 p-10 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
        <Check size={28} />
      </div>
      <h2 className="mt-4 font-display text-2xl font-extrabold">Order Confirmed! 🎉</h2>
      <p className="mt-2 text-sm text-india-night/60">
        Your fair-wage craft is booked. Redirecting to live delivery tracking…
      </p>
      <button onClick={() => navigate('/marketplace/explore')} className="btn-ghost mt-5">Back to store</button>
    </div>
  )
}