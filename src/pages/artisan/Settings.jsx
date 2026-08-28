import React, { useState } from 'react'
import { Save, Building2, Languages, Sparkles } from 'lucide-react'
import { db } from '../../data/db'
import { useArtisan } from '../../context/ArtisanContext'
import { useVoice } from '../../context/VoiceContext'
import { useLang } from '../../context/LanguageContext'
import { LANGUAGES } from '../../data/languages'

export default function Settings() {
  const { artisan, setArtisan } = useArtisan()
  const { speak } = useVoice()
  const { setLang, tts, t } = useLang()
  const [bank, setBank] = useState({
    name: artisan?.bank?.name || '',
    last4: artisan?.bank?.last4 || '4821',
    upi: artisan?.bank?.upi || '',
  })
  const [lang, setLangSel] = useState(artisan?.language || 'hi')

  const applyLanguage = async (code) => {
    setLangSel(code)
    setLang(code) // apply globally immediately
    await db.artisan.update('me', { language: code }).catch(() => {})
    setArtisan((p) => ({ ...p, language: code }))
    speak('भाषा बदल दी गई है।', LANGUAGES.find((l) => l.code === code)?.tts || 'hi-IN')
  }

  const save = async () => {
    const patch = { bank: { ...artisan.bank, name: bank.name, upi: bank.upi } }
    await db.artisan.update('me', patch)
    setArtisan((p) => ({ ...p, ...patch }))
    speak('सेटिंग्स सहेज ली गईं।', tts)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-white">{t('settings')} ⚙️</h1>
        <p className="text-sm text-white/60">बैंक विवरण · भाषा · क्लस्टर प्रोफ़ाइल</p>
      </div>

      {/* Language switch */}
      <div className="card bg-white p-5">
        <h3 className="flex items-center gap-2 font-display font-bold"><Languages size={18} className="text-saffron-dark" /> Regional Language</h3>
        <p className="mt-1 text-xs text-india-night/50">Voice &amp; interface follow your language (28+ dialects supported).</p>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {LANGUAGES.filter((l) => ['hi', 'ta', 'te', 'bn', 'gu', 'pa', 'mr', 'kn', 'ml', 'or', 'as', 'bho', 'raj', 'cg'].includes(l.code)).map((l) => (
            <button key={l.code} onClick={() => applyLanguage(l.code)}
              className={`rounded-xl border p-2 text-center transition ${lang === l.code ? 'border-saffron bg-saffron/10' : 'border-black/10 bg-white'}`}>
              <div className="text-sm font-bold text-india-night">{l.name}</div>
              <div className="text-[9px] text-india-night/50">{l.latin}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Bank details */}
      <div className="card bg-white p-5">
        <h3 className="flex items-center gap-2 font-display font-bold"><Building2 size={18} className="text-saffron-dark" /> Bank &amp; Payout</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="label">Account Holder</span>
            <input className="input" value={bank.name} onChange={(e) => setBank({ ...bank, name: e.target.value })} placeholder="Sunita Devi" />
          </label>
          <label className="block">
            <span className="label">Account ending in</span>
            <input className="input" value={bank.last4} onChange={(e) => setBank({ ...bank, last4: e.target.value })} />
          </label>
          <div className="sm:col-span-2">
            <label className="block">
              <span className="label">UPI ID</span>
              <input className="input" value={bank.upi} onChange={(e) => setBank({ ...bank, upi: e.target.value })} placeholder="sunitadevi@okhdfcbank" />
            </label>
          </div>
        </div>
      </div>

      {/* Cluster profile */}
      <div className="card bg-white p-5">
        <h3 className="flex items-center gap-2 font-display font-bold"><Sparkles size={18} className="text-saffron-dark" /> Craft Cluster Profile</h3>
        <div className="mt-3 rounded-xl bg-india-cream p-3 text-sm">
          <div className="flex justify-between"><span className="text-india-night/60">Artisan</span><b>{artisan?.name}</b></div>
          <div className="mt-1 flex justify-between"><span className="text-india-night/60">Craft &amp; Village</span><b>{artisan?.craft} · {artisan?.village}</b></div>
          <div className="mt-1 flex justify-between"><span className="text-india-night/60">Experience</span><b>{artisan?.experience} years</b></div>
        </div>
      </div>

      <button onClick={save} className="btn-primary w-full text-base"><Save size={18} /> Save Settings</button>
    </div>
  )
}