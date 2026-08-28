import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Phone, ArrowRight, Volume2 } from 'lucide-react'
import { LANGUAGES, LANGUAGE_GROUPS } from '../../data/languages'
import { useVoice } from '../../context/VoiceContext'
import { useLang } from '../../context/LanguageContext'
import { db } from '../../data/db'
import { Peacock, PaisleyRule } from '../../components/IndianMotifs'

export default function Auth() {
  const [sel, setSel] = useState(null)
  const [group, setGroup] = useState('north')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [phone, setPhone] = useState('')
  const navigate = useNavigate()
  const { speak } = useVoice()
  const { setLang } = useLang()

  const langList = LANGUAGES.filter((l) => l.group === group)

  const selectLanguage = (l) => {
    setSel(l)
    setLang(l.code) // apply globally: nav, pages, voice
    speak(`नमस्ते, ${l.latin} में स्वागत है! आपने ${l.name} बोली चुनी है।`, l.tts || 'hi-IN')
  }

  useEffect(() => {
    if (otpSent && otp.length === 6) {
      // save language into the artisan profile so it survives reloads
      if (sel) {
        db.artisan.update('me', { language: sel.code }).catch(() => {})
      }
      const t = setTimeout(() => navigate('/artisan/dashboard'), 500)
      return () => clearTimeout(t)
    }
  }, [otp, otpSent, navigate, sel])

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center">
          <Peacock className="h-20 w-20" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-white">Welcome to your Studio 🙏</h1>
        <p className="mt-1 text-sm text-white/60">
          अपनी भाषा चुनें · Choose 1 of 28+ languages to begin
        </p>
      </div>

      {/* Language groups */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {LANGUAGE_GROUPS.map((g) => (
          <button key={g.key} onClick={() => setGroup(g.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${group === g.key ? 'bg-saffron text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
            {g.flag} {g.label}
          </button>
        ))}
      </div>

      {/* Language grid */}
      <motion.div layout className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {langList.map((l) => (
          <motion.button
            key={l.id}
            whileTap={{ scale: 0.96 }}
            onClick={() => selectLanguage(l)}
            className={`flex flex-col items-center rounded-xl border p-3 transition ${
              sel?.id === l.id ? 'border-saffron bg-saffron/15' : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            <span className="font-display text-lg font-bold text-white">{l.name}</span>
            <span className="text-[10px] text-white/50">{l.latin}</span>
          </motion.button>
        ))}
      </motion.div>
      {sel && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-saffron">
          <Volume2 size={15} /> Selected: {sel.name} ({sel.latin})
        </div>
      )}

      <PaisleyRule className="mt-8 text-saffron" />

      {/* Mobile OTP */}
      <div className="card mt-6 bg-white p-6">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-india-night">
          <Phone size={20} className="text-saffron" /> Mobile Verification
        </h2>
        {!otpSent ? (
          <div className="mt-4 flex gap-3">
            <input className="input flex-1" type="tel" placeholder="Enter mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <button onClick={() => setOtpSent(true)} className="btn-primary shrink-0">Send OTP</button>
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm text-india-night/60">
              OTP sent to <b className="text-india-night">+91 {phone}</b> <ArrowRight size={14} />
            </div>
            <div className="mt-3 flex gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const v = otp[i] || ''
                return (
                  <input
                    key={i}
                    className="input h-14 w-14 text-center text-lg font-bold"
                    maxLength={1}
                    value={v}
                    onChange={(e) => {
                      const d = e.target.value.replace(/\D/, '')
                      setOtp((prev) => prev.slice(0, i) + d + prev.slice(i + 1))
                    }}
                  />
                )
              })}
            </div>
            <p className="mt-2 text-xs text-india-night/50">Enter the 6-digit OTP (any 6 digits) — simulated login</p>
          </div>
        )}
      </div>
    </div>
  )
}