// Voice intelligence layer — browser-native Web Speech API.
// Zero-cost STT/TTS. Groq whisper fallback is a documented seam.

export const inr = (n) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n ?? 0)

export const toSpeech = (voices) => voices.filter((v) => v.lang.startsWith('hi'))

let speechSupported = false
try {
  speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window
} catch {}

let voiceMap = {}
export function loadVoices() {
  if (!speechSupported || !window.speechSynthesis) return
  const list = window.speechSynthesis.getVoices()
  voiceMap = list.reduce((acc, v) => {
    acc[v.lang] = v
    return acc
  }, {})
  return list
}
if (speechSupported && window.speechSynthesis) {
  loadVoices()
  window.speechSynthesis.onvoiceschanged = loadVoices
}

/** Cross-platform TTS — prioritises an Indian Hindi voice. */
export function speak(text, { lang = 'hi-IN', rate = 1, onend } = {}) {
  if (!speechSupported || !window.speechSynthesis) {
    console.warn('TTS unavailable')
    onend && onend()
    return null
  }
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang
  u.rate = rate
  const preferred = voiceMap[lang] || voiceMap['hi-IN']
  if (preferred) u.voice = preferred
  if (onend) u.onend = onend
  window.speechSynthesis.speak(u)
  return u
}

export function cancelSpeech() {
  if (speechSupported && window.speechSynthesis) window.speechSynthesis.cancel()
}

/** Browser STT recogniser factory. */
export function createRecognizer({ lang = 'hi-IN', onResult, onEnd, onError }) {
  const SR =
    window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) {
    onError && onError(new Error('Speech Not Supported'))
    return null
  }
  const rec = new SR()
  rec.lang = lang
  rec.continuous = false
  rec.interimResults = true
  rec.onresult = (e) => {
    let interim = ''
    let final = ''
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i]
      if (r.isFinal) final += r[0].transcript
      else interim += r[0].transcript
    }
    onResult({ interim, final })
  }
  rec.onend = onEnd
  rec.onerror = (e) => onError && onError(e.error)
  return rec
}

/* ------------------------------------------------------------------ *
 * Intent parsing for native-language artisan voice commands.
 * Examples:
 *   "मेरे पास 15 ब्लू पॉटरी कप और आ गए हैं"  -> UPDATE_STOCK 15
 *   "इस शॉल का दाम 1200 कर दो"               -> SET_PRICE 1200
 * ------------------------------------------------------------------ */

const STOCK_WORDS = ['आ', 'आते', 'आये', 'हैं', 'और', 'आ गए', 'मेरे पास', 'स्टॉक']
const PRICE_WORDS = ['दाम', 'कीमत', 'प्राइस', 'कर दो', 'करो', 'करें']

export function extractNumber(text) {
  const digits = (text.match(/\d+/g) || []).map(Number)
  // handle Indian numeral words roughly
  if (digits.length) return digits[0]
  const words = {
    'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पांच': 5, 'पाँच': 5,
    'छह': 6, 'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10, 'बारह': 12,
    'पंद्रह': 15, 'बीस': 20, 'पच्चीस': 25, 'तीस': 30, 'पचास': 50,
    'सौ': 100, 'हजार': 1000,
  }
  for (const [w, n] of Object.entries(words)) {
    if (text.includes(w)) return n
  }
  return null
}

const RUPEES = /(?:₹|rs\.?|रुपए|रुपये|रु)/i

export function parseVoiceIntent(raw, productTitle = '') {
  const text = (raw || '').toLowerCase()
  const hasStock = /(रह|stock|स्टॉक|आ गए|पास|और आ गए)/i.test(text)
  const hasPrice = /(दाम|कमतत|प्राइस|price|कर दो|करो)/i.test(text)
  const num = extractNumber(text)

  if (hasPrice && num !== null && RUPE.test(text)) {
    return { type: 'SET_PRICE', value: num }
  }
  if (hasStock && num !== null) {
    return { type: 'UPDATE_STOCK', value: num }
  }
  return { type: null, value: null }
}

export const WELCOME_VOICE = {
  hi: 'नमस्ते! स्वागत है एम्पॉवरक्राफ्ट में। मैं आपकी कुशल साथी हूँ।',
  'hi-IN': 'नमस्ते! स्वागत है एम्पॉवरक्राफ्ट में। मैं आपकी कुशल साथी हूँ।',
  en: 'Welcome to EmpowerCraft, your digital workshop companion.',
  'en-IN': 'Welcome to EmpowerCraft, your digital workshop companion.',
  default: 'Welcome to EmpowerCraft, your digital workshop companion.',
}

export function welcomeFor(code) {
  return WELCOME_VOICE[code] || WELCOME_VOICE.default
}

export function transcriptFrom(result) {
  return result.final || result.interim
}