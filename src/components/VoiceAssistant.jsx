import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Mic, MicOff, X, Volume2, Sparkles } from 'lucide-react'
import { useVoice } from '../context/VoiceContext'

const HINTS = [
  { label: 'नया उत्पाद जोड़ो', action: 'add' },
  { label: 'स्टॉक देखो', action: 'inventory' },
  { label: 'ऑर्डर बताओ', action: 'orders' },
  { label: 'कमाई कितनी', action: 'analytics' },
  { label: 'बचत कितनी', action: 'wallet' },
]

/** Persistent floating Voice Assistant for the Artisan Studio. */
export default function VoiceAssistant({ artisan, onIntent }) {
  const {
    listening, speaking, transcript, panelOpen,
    setPanelOpen, startListen, stopAll, speak, registerActions,
  } = useVoice()
  const navigate = useNavigate()
  const [lastReply, setLastReply] = useState('')

  const routeCommand = (raw) => {
    const t = (raw || '').toLowerCase()
    const has = (...w) => w.some((x) => t.includes(x))
    // 1. Let the active page try first (stock update / price set)
    if (onIntent && onIntent(raw)) {
      setLastReply('✔ अद्यतन हो गया।')
      speak('अद्यतन हो गया है।')
      return
    }
    // 2. Global navigation intents
    if (has('नया', 'जोड़', 'add', 'product')) {
      setLastReply('नया उत्पाद स्टूडियो खोल रहा हूँ।')
      speak('नया उत्पाद स्टूडियो खोल रहा हूँ।')
      return navigate('/artisan/studio/add-product')
    }
    if (has('स्टॉक', 'इन्वेंटरी', 'inventory', 'stock')) {
      setLastReply('इन्वेंट्री खोल रहा हूँ।')
      speak('इन्वेंट्री खोल रहा हूँ।')
      return navigate('/artisan/inventory')
    }
    if (has('ऑर्डर', 'order')) {
      setLastReply('ऑर्डर पेज खोल रहा हूँ।')
      speak('ऑर्डर पेज खोल रहा हूँ।')
      return navigate('/artisan/orders')
    }
    if (has('कमाई', 'analytics', 'रिपोर्ट')) {
      setLastReply('एनालिटिक्स स्टूडियो खोल रहा हूँ।')
      speak('एनालिटिक्स स्टूडियो खोल रहा हूँ।')
      return navigate('/artisan/analytics-studio')
    }
    if (has('बचत', 'wallet', 'पैसा', 'पैसे')) {
      setLastReply('स्मार्ट वॉलेट खोल रहा हूँ।')
      speak('स्मार्ट वॉलेट खोल रहा हूँ।')
      return navigate('/artisan/smart-wallet')
    }
    if (has('योजना', 'स्कीम', 'scheme')) {
      setLastReply('सरकारी योजनाएँ खोल रहा हूँ।')
      speak('सरकारी योजनाएँ खोल रहा हूँ।')
      return navigate('/artisan/schemes')
    }
    if (has('माइलस्टोन', 'बैज', 'milestone', 'badge')) {
      setLastReply('माइलस्टोन खोल रहा हूँ।')
      speak('माइलस्टोन खोल रहा हूँ।')
      return navigate('/artisan/milestones')
    }
    setLastReply('माफ़ कीजिए, समझ नहीं आया। फिर से बोलिए।')
    speak('माफ़ कीजिए, समझ नहीं आया।')
  }

  useEffect(() => {
    registerActions(routeCommand)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onIntent])

  const toggle = () => {
    if (listening) {
      stopAll()
      return
    }
    setPanelOpen(true)
    startListen('hi-IN')
  }

  return (
    <>
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-4 z-40 w-[min(92vw,360px)] overflow-hidden rounded-2xl bg-white shadow-float ring-1 ring-saffron/40"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-saffron to-saffron-dark px-4 py-3 text-white">
              <div className="flex items-center gap-2 font-bold">
                <Sparkles size={18} /> वॉइस सहायक
              </div>
              <button onClick={() => setPanelOpen(false)} className="rounded-full p-1 hover:bg-black/10">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 p-4">
              <div className="min-h-[56px] rounded-xl bg-india-cream p-3 text-sm">
                {listening && (
                  <span className="mb-1 flex items-center gap-2 text-xs font-semibold text-red-600">
                    <span className="h-2.5 w-2.5 animate-ping rounded-full bg-red-500" /> सुन रहा हूँ…
                  </span>
                )}
                <p className="text-india-night">
                  {transcript || lastReply || (speaking ? 'बोल रहा हूँ…' : 'बोलना शुरू करने के लिए माइक दबाएँ।')}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {HINTS.map((h) => (
                  <button
                    key={h.label}
                    onClick={() => routeCommand(h.action)}
                    className="rounded-full bg-saffron/10 px-2.5 py-1 text-[11px] text-saffron-dark hover:bg-saffron/20"
                  >
                    {h.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => speak('आप क्या करना चाहेंगे? नया उत्पाद, स्टॉक, ऑर्डर या बचत।')}
                  className="chip"
                >
                  <Volume2 size={14} /> सुनाओ
                </button>
                <span className="text-[11px] text-india-night/50">Web Speech · निःशुल्क</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggle}
        className={`fixed bottom-6 right-4 z-40 flex h-16 w-16 items-center justify-center rounded-full text-white shadow-float transition ${
          listening ? 'animate-bounce bg-red-600' : 'bg-gradient-to-br from-saffron to-saffron-dark'
        }`}
        aria-label="Voice Assistant"
      >
        {listening ? <MicOff size={26} /> : speaking ? <Volume2 size={26} /> : <Mic size={26} />}
      </motion.button>
    </>
  )
}