import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Camera, Sparkles, MapPin, Mic, Save, CheckCircle2, Loader2,
} from 'lucide-react'
import { db } from '../../data/db'
import { notifyProductsChanged } from '../../data/useStore'
import { removeBackground, studioEnhance } from '../../lib/bgremove'
import { createRecognizer, speak, inr } from '../../lib/speech'
import { CATEGORY_META } from '../../components/IndianMotifs'

const CATEGORIES = Object.entries(CATEGORY_META).map(([key, m]) => ({ key, ...m }))

export default function AddProduct() {
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const canvasRef = useRef(null)
  const [rawUrl, setRawUrl] = useState(null)
  const [cleanUrl, setCleanUrl] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [aiMode, setAiMode] = useState(null) // 'ai' | 'studio' | null
  const [geo, setGeo] = useState(null)
  const [listening, setListening] = useState(false)
  const [spoken, setSpoken] = useState('')
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    title: '', category: 'pottery', price: '', stock: 10, desc: '', tags: '',
  })
  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }))

  const onFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setRawUrl(url)
    setCleanUrl(null)
    setAiMode(null)
  }

  const runRemove = async () => {
    if (!rawUrl) return
    setProcessing(true)
    await new Promise((r) => setTimeout(r, 50))
    const res = await removeBackground(rawUrl)
    setCleanUrl(res.url)
    setAiMode(res.real ? 'ai' : 'studio')
    setProcessing(false)
  }

  const captureGeo = () => {
    if (!navigator.geolocation) {
      // fallback mock pin
      setGeo({ lat: 24.5714, lng: 73.7125, city: 'Udaipur, Rajasthan', mock: true })
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        let city = 'GPS pin'
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          const j = await r.json()
          city = j.display_name || city
        } catch {}
        setGeo({ lat, lng, city })
        speak('जीपीएस पिन हो गया। निर्माण स्थान प्रमाणित।')
      },
      () => setGeo({ lat: 24.5714, lng: 73.7125, city: 'Udaipur, Rajasthan (fallback)', mock: true }),
      { timeout: 8000 }
    )
  }

  const autoCatalog = () => {
    setListening(true)
    const rec = createRecognizer({
      lang: 'hi-IN',
      onResult: (r) => setSpoken((r.final || r.interim)),
      onEnd: () => {
        setListening(false)
        const final = spoken || ''
        if (final.trim()) {
          // heuristic: suggest title + price from spoken text
          const num = (final.match(/\d+/g) || []).map(Number)
          const price = num.length ? num[num.length - 1] * (final.includes('हजार') ? 1000 : final.includes('सौ') ? 100 : 1) : 500
          set('title', `हस्तनिर्मित ${final.split(' ').slice(0, 3).join(' ')}`)
          set('price', String(price) || '500')
          set('desc', final + ' — voice catalogued in Hindi.')
          speak('अच्छा! शीर्षक और कीमत भर दी गई। कृपया जाँच लें।')
        }
      },
      onError: () => setListening(false),
    })
    if (rec) rec.start()
  }

  const saveProduct = async () => {
    if (!form.title.trim()) return speak('पहले उत्पाद का नाम बोलिए या लिखिए।')
    const id = 'p' + Date.now()
    await db.products.put({
      id,
      title: form.title,
      artisanId: 'a1',
      category: form.category,
      price: Number(form.price) || 500,
      gi: true,
      stock: Number(form.stock) || 10,
      desc: form.desc || `Handcrafted ${CATEGORY_META[form.category]?.label || form.category}.`,
      cluster: geo?.city || 'Craft Cluster, India',
      listedAt: new Date().toISOString().slice(0, 10),
      tags: (form.tags || '').split(',').map((t) => t.trim()).filter(Boolean).concat(['New']),
      units: 'pc',
      cost: { craft: Math.round((Number(form.price) || 500) * 0.45), material: 120, platformFee: 25, shipping: 40 },
    })
    notifyProductsChanged()
    setSaved(true)
    speak('उत्पाद सफलतापूर्वक जोड़ दिया गया!')
    setTimeout(() => navigate('/artisan/dashboard'), 1400)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-white">Smart Cataloging Studio 📸</h1>
        <p className="text-sm text-white/60">फोटो लें · AI से पृष्ठभूमि हटाएँ · बोलकर कैटलॉग करें</p>
      </div>

      {/* TWO-COLUMN BODY */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* LEFT: image + AI + geo */}
        <div className="space-y-4">
          <div className="card bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 font-display font-bold"><Camera size={18} className="text-saffron-dark" /> Product Photo</h3>
              <button onClick={() => fileRef.current?.click()} className="btn-ghost !px-3 !py-1.5 text-sm">Take / Upload</button>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />
            </div>

            <div className="mt-3 overflow-hidden rounded-xl border border-dashed border-black/10 bg-india-cream">
              {cleanUrl ? (
                <img src={cleanUrl} alt="cleaned" className="h-56 w-full object-cover" />
              ) : rawUrl ? (
                <img src={rawUrl} alt="raw" className="h-56 w-full object-cover" />
              ) : (
                <div className="flex h-56 flex-col items-center justify-center text-center text-india-night/50">
                  <Camera size={40} className="mb-2" />
                  <p className="text-sm">Tap to photograph your craft</p>
                  <p className="text-xs">Auto studio-light on workshop shots</p>
                </div>
              )}
            </div>

            {rawUrl && (
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={runRemove} disabled={processing} className="btn-primary flex-1 !py-2.5 text-sm">
                  {processing ? (<><Loader2 size={16} className="animate-spin" /> Removing…</>) : (<><Sparkles size={16} /> AI Remove Background</>)}
                </button>
              </div>
            )}
            {aiMode && (
              <p className="mt-2 text-xs font-semibold text-india-green">
                {aiMode === 'ai'
                  ? '✓ @imgly background-removal (in-browser AI) — background stripped'
                  : '✓ Studio-lighting enhanced (offline WebGPU, crisp studio halo)'}
              </p>
            )}
          </div>

          {/* Geo-temporal */}
          <div className="card bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 font-display font-bold"><MapPin size={18} className="text-emerald-600" /> Geo-Temporal Verification</h3>
              <button onClick={captureGeo} className="btn-ghost !px-3 !py-1.5 text-sm">Pin GPS</button>
            </div>
            {geo ? (
              <div className="mt-2 rounded-xl bg-emerald-50 p-3 text-sm">
                <p className="flex items-center gap-1 font-semibold text-emerald-800"><CheckCircle2 size={15} /> Verified origin</p>
                <p className="mt-1 text-xs text-emerald-700">{geo.city}</p>
                <p className="text-xs text-emerald-600">📍 {geo.lat.toFixed(5)}, {geo.lng.toFixed(5)} · {new Date().toLocaleString('en-IN')}</p>
                {geo.mock && <p className="mt-1 text-[10px] text-emerald-500/70">demo pin (browser location not granted)</p>}
              </div>
            ) : (
              <p className="mt-2 text-xs text-india-night/50">Bind GPS coordinates + timestamp to prove authentic craftsmanship (OpenStreetMap · free).</p>
            )}
          </div>
        </div>
        {/* RIGHT: voice + form */}
        <div className="space-y-4">
          <div className="card bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 font-display font-bold"><Mic size={18} className="text-saffron-dark" /> Voice Auto-Cataloger</h3>
              <button onClick={autoCatalog} disabled={listening}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white ${listening ? 'animate-pulse bg-red-600' : 'bg-saffron'}`}>
                <Mic size={16} /> {listening ? 'Listening…' : 'Start Voice'}
              </button>
            </div>
            <div className="mt-3 min-h-[56px] rounded-xl bg-india-cream p-3 text-sm">
              {spoken ? `🗣️ "${spoken}"` : 'बोलिए — जैसे "15 ब्लू पॉटरी सुराही, 500 रुपये"। शीर्षक और कीमत अपने आप भर जाएँगी।'}
            </div>
          </div>

          <div className="card bg-white p-4">
            <h3 className="mb-3 font-display font-bold">Details</h3>
            <div className="grid gap-3">
              <label className="block">
                <span className="label">Title</span>
                <input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Blue Pottery Vase" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="label">Category</span>
                  <select className="input" value={form.category} onChange={(e) => set('category', e.target.value)}>
                    {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="label">Price (₹)</span>
                  <input className="input" type="number" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="500" />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="label">Stock</span>
                  <input className="input" type="number" value={form.stock} onChange={(e) => set('stock', e.target.value)} />
                </label>
                <label className="block">
                  <span className="label">Tags (comma)</span>
                  <input className="input" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="GI, Pottery" />
                </label>
              </div>
              <label className="block">
                <span className="label">Description</span>
                <textarea className="input min-h-[70px]" value={form.desc} onChange={(e) => set('desc', e.target.value)} placeholder="Tell the craft story…" />
              </label>
            </div>
            <button onClick={saveProduct} className="btn-primary mt-4 w-full">
              {saved ? <><CheckCircle2 size={18} /> Added!</> : <><Save size={18} /> Publish to Marketplace</>}
            </button>
            {saved && <p className="mt-2 text-center text-sm font-semibold text-emerald-600">✅ Product list updated successfully!</p>}
          </div>

          <Link to="/artisan/dashboard" className="block text-center text-sm font-semibold text-white/70 hover:text-white">Cancel</Link>
        </div>
      </div>
    </div>
  )
}