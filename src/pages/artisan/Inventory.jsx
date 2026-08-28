import React, { useState } from 'react'
import { Mic, Minus, Plus, Volume2 } from 'lucide-react'
import { useArtisan } from '../../context/ArtisanContext'
import { useLang } from '../../context/LanguageContext'
import { updateProduct } from '../../data/db'
import { notifyProductsChanged } from '../../data/useStore'
import { CraftArt, CATEGORY_META } from '../../components/IndianMotifs'
import { inr, parseVoiceIntent, createRecognizer, speak } from '../../lib/speech'

export default function Inventory() {
  const { products, refreshProducts } = useArtisan()
  const { t } = useLang()
  const [selected, setSelected] = useState(null)
  const [listening, setListening] = useState(false)
  const [log, setLog] = useState('')

  const changeStock = async (id, delta) => {
    const p = products.find((x) => x.id === id)
    await updateProduct(id, { stock: Math.max(0, p.stock + delta) })
    notifyProductsChanged(); await refreshProducts()
  }
  const setPrice = async (id, price) => {
    await updateProduct(id, { price })
    notifyProductsChanged(); await refreshProducts()
  }

  const startVoiceUpdate = () => {
    if (!selected) {
      setLog('पहले एक उत्पाद चुनें (card पर टैप करें)।'); speak('पहले एक उत्पाद चुनें।'); return
    }
    setListening(true); setLog('बोलिए — "दाम 1200 कर दो" या "स्टॉक 15 कर दो"')
    speak('बोलिए — दाम या स्टॉक बदलना है।')
    const rec = createRecognizer({
      lang: 'hi-IN',
      onResult: () => {},
      onEnd: () => setListening(false),
      onError: () => setListening(false),
    })
    if (!rec) return
    rec.onresult = (e) => {
      let out = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) out += e.results[i][0].transcript
      }
      if (out) {
        const intent = parseVoiceIntent(out, selected.title)
        if (intent.type === 'SET_PRICE') {
          setPrice(selected.id, intent.value)
          setLog(`✅ "${selected.title}" — कीमत ${inr(intent.value)} कर दी गई।`)
          speak(`कीमत ${inr(intent.value)} कर दी गई।`)
        } else if (intent.type === 'UPDATE_STOCK') {
          changeStock(selected.id, intent.value >= 0 ? intent.value - selected.stock : 0)
          setLog(`✅ "${selected.title}" — स्टॉक ${intent.value} कर दिया गया।`)
          speak(`स्टॉक ${intent.value} कर दिया गया।`)
        } else {
          setLog('समझ नहीं आया। उदाहरण: "स्टॉक 15" या "दाम 1200"।')
          speak('समझ नहीं आया, कृपया फिर बोलिए।')
        }
      }
    }
    rec.start()
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white">{t('inventory')} 🏺</h1>
          <p className="text-sm text-white/60">स्टॉक व कीमत — बोलकर या बटन से अपडेट करें</p>
        </div>
        {selected && (
          <button onClick={startVoiceUpdate} disabled={listening}
            className={`flex items-center gap-2 rounded-xl px-5 py-3 font-bold text-white ${listening ? 'animate-pulse bg-red-600' : 'bg-saffron'}`}>
            <Mic size={18} /> {listening ? 'Listening…' : `Update ${selected.title}`}
          </button>
        )}
      </div>

      {(log || listening) && (
        <div className="card bg-white p-4 text-sm">
          <span className="flex items-center gap-1.5 font-semibold text-india-night">
            <Volume2 size={15} className="text-saffron-dark" /> {listening ? '🗣️ सुन रहा हूँ…' : 'Voice result'}
          </span>
          <p className="mt-1 text-india-night/70">{log}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => {
          const isSel = selected?.id === p.id
          const meta = CATEGORY_META[p.category] || CATEGORY_META.pottery
          return (
            <div key={p.id} onClick={() => setSelected(p)}
              className={`card cursor-pointer bg-white p-3 transition ${isSel ? 'ring-2 ring-saffron' : ''}`}>
              <div className={`flex items-center justify-center rounded-xl ${meta.tint} p-3`}>
                <CraftArt category={p.category} className="h-20 w-20" />
              </div>
              <h3 className="mt-2 line-clamp-1 text-sm font-bold text-india-night">{p.title}</h3>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <div className="text-xs text-india-night/50">Price</div>
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-india-green">{inr(p.price)}</span>
                    <button onClick={(e) => { e.stopPropagation(); const v = prompt('New price (₹)'); if (v) setPrice(p.id, Number(v)); }}
                      className="rounded bg-india-cream px-1.5 text-xs">✎</button>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-india-night/50">Stock</div>
                  <div className="flex items-center gap-1">
                    <button onClick={(e) => { e.stopPropagation(); changeStock(p.id, -1); }} className="rounded-lg bg-black/5 px-2 py-0.5 font-bold"><Minus size={13} /></button>
                    <span className={`w-8 text-center font-bold ${p.stock <= 8 ? 'text-red-600' : 'text-india-night'}`}>{p.stock}</span>
                    <button onClick={(e) => { e.stopPropagation(); changeStock(p.id, 1); }} className="rounded-lg bg-black/5 px-2 py-0.5 font-bold"><Plus size={13} /></button>
                  </div>
                </div>
              </div>
              {isSel && <p className="mt-2 text-center text-[10px] font-semibold text-saffron-dark">✓ Selected — tap mic to voice-update</p>}
            </div>
          )
        })}
      </div>
      <p className="text-xs text-white/40">💡 Speak: "इस शॉल का दाम 1200 कर दो" or "स्टॉक 15 कर दो" after selecting a product.</p>
    </div>
  )
}