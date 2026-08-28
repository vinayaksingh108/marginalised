import React, { useState } from 'react'
import { ExternalLink, Volume2, ChevronDown, ChevronUp } from 'lucide-react'
import { SCHEMES } from '../../data/schemes'
import { useVoice } from '../../context/VoiceContext'
import { useLang } from '../../context/LanguageContext'
import { Mandala } from '../../components/IndianMotifs'

export default function Schemes() {
  const { speak } = useVoice()
  const { t } = useLang()
  const [open, setOpen] = useState(null)
  const [vc, setVc] = useState(null)

  const voiceCheck = (s) => {
    setVc(s.id)
    speak(`${s.name}. क्या आप एक पारंपरिक कारीगर या शिल्पकार हैं? यदि हाँ, तो यह योजना आपके लिए सही है। विवरण सुनने के लिए जारी रखें।`)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white">{t('schemes')} 🏛️</h1>
          <p className="text-sm text-white/60">आधिकारिक सरकारी योजनाएँ · Direct official links</p>
        </div>
        <Mandala className="h-16 w-16 text-saffron opacity-50" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {SCHEMES.map((s) => (
          <div key={s.id} className={`card bg-white p-5 transition ${vc === s.id ? 'ring-2 ring-saffron' : ''}`}>
            <div className="flex items-start gap-3">
              <span className="text-3xl">{s.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-india-night">{s.name}</h3>
                  {s.featured && <span className="rounded-full bg-saffron/15 px-2 py-0.5 text-[10px] font-bold text-saffron-dark">Featured</span>}
                </div>
                <p className="text-xs text-india-night/50">{s.org} · {s.category}</p>
              </div>
            </div>

            <p className="mt-3 text-sm text-india-night/75">{s.summary}</p>

            {/* eligibility */}
            <button onClick={() => setOpen(open === s.id ? null : s.id)} className="mt-3 flex items-center gap-1 text-sm font-semibold text-saffron-dark">
              {open === s.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />} Eligibility
            </button>
            {open === s.id && (
              <ul className="mt-2 space-y-1 rounded-xl bg-india-cream p-3 text-sm">
                {s.eligibility.map((e) => <li key={e} className="flex items-center gap-2 text-india-night/80"><span className="text-emerald-600">✓</span>{e}</li>)}
              </ul>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => voiceCheck(s)} className="btn-primary !py-2 text-sm"><Volume2 size={15} /> Voice Check</button>
              <a href={s.link} target="_blank" rel="noreferrer" className="btn-ghost !py-2 text-sm">
                Official Portal <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-white p-5 text-sm text-india-night/60">
        🇮🇳 EmpowerCraft lists only <b className="text-india-night">official</b> government portals. No real applications are
        submitted — this is a learning &amp; guidance director. Always verify on the official site.
      </div>
    </div>
  )
}