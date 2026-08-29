import { ArrowRight, ShieldCheck } from 'lucide-react'
import { useArtisan } from '../../context/ArtisanContext'
import { useVoice } from '../../context/VoiceContext'
import { useLang } from '../../context/LanguageContext'
import { inr } from '../../lib/speech'

const CIRCLES = [
  {
    id: 'c1',
    name: 'Udaipur Blue Pottery Swahela',
    members: 8,
    cycle: 'Weekly',
    contribution: 500,
    pot: 4000,
    yours: true,
    nextDraw: 'Rekha Kumari',
    region: 'Rajasthan',
  },
  {
    id: 'c2',
    name: 'Mutholi Dokra Sangh',
    members: 5,
    cycle: 'Fortnightly',
    contribution: 700,
    pot: 3500,
    yours: false,
    nextDraw: 'Mohan Kumar',
    region: 'Telangana',
  },
]

export default function Circles() {
  const { artisan } = useArtisan()
  const { speak } = useVoice()
  const { t } = useLang()

  const join = (c) => {
    speak(`आप ${c.name} से जुड़ने के लिए तैयार हैं। सदस्य शुल्क ${inr(c.contribution)} प्रति साइकिल।`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-white">{t('circlesTitle') || 'Cooperative Circles 🤝'}</h1>
        <p className="text-sm text-white/60">
          Rotating savings groups — pool a fixed sum each cycle, one member draws the full pot in turn.
        </p>
      </div>

      <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-bold text-emerald-800">Your balance</h3>
            <p className="text-sm text-emerald-700/80">{inr(artisan?.circleBalance || 0)} pool balance · 1 active circle</p>
          </div>
          <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">Ledger open</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {CIRCLES.map((c) => (
          <div key={c.id} className="card bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-india-night">{c.name}</h3>
              {c.yours && <span className="rounded-full bg-saffron px-2 py-0.5 text-[10px] font-bold text-white">You're in</span>}
            </div>
            <div className="mt-2 space-y-1 text-sm text-india-night/70">
              <p>👥 {c.members} members · {c.region}</p>
              <p>🔄 {c.cycle} cycle · {inr(c.contribution)}/member</p>
              <p>🧺 Full pot {inr(c.pot)} · next draw: <b className="text-india-night">{c.nextDraw}</b></p>
            </div>
            <div className="mt-4 flex gap-2">
              {c.yours ? (
                <span className="flex items-center gap-1 text-sm font-semibold text-emerald-700"><ShieldCheck size={15} /> Transparent ledger · escrow held</span>
              ) : (
                <button onClick={() => join(c)} className="btn-primary flex-1 !py-2 text-sm">Join circle <ArrowRight size={14} /></button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-white p-5 text-sm text-india-night/70">
        <b className="text-india-night">Why circles?</b> Small opt-in groups of 5–10 nearest artisans. PF contributions are held in a
        separate escrow so your savings are never touched by circle defaults. Off-season, members can draw
        emergency payouts.
      </div>
    </div>
  )
}