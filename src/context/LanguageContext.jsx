import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react'
import { STRINGS, LANG_FALLBACK } from '../i18n/strings'
import { LANGUAGES } from '../data/languages'

const LangCtx = createContext(null)
export const useLang = () => useContext(LangCtx)

const PREF_KEY = 'ec_lang'
const TTS_OF = (code) => LANGUAGES.find((l) => l.code === code)?.tts || 'hi-IN'

/** Resolve a language/dialect code to a dictionary we actually ship. */
function resolveLang(code) {
  if (!code) return 'hi'
  if (STRINGS[code]) return code
  const fb = LANG_FALLBACK[code]
  if (fb && STRINGS[fb]) return fb
  return 'hi' // final fallback
}

export function LanguageProvider({ children }) {
  const [lang, setLangRaw] = useState(null)
  const [ready, setReady] = useState(false)

  // Load persisted preference on mount (localStorage → DOM lang)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PREF_KEY)
      if (saved) setLangRaw(saved)
    } catch {}
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready && lang) {
      try { localStorage.setItem(PREF_KEY, lang) } catch {}
      document.documentElement.lang = STRINGS[resolveLang(lang)] ? lang : 'hi'
    }
  }, [lang, ready])

  const setLang = useCallback((code) => setLangRaw(code), [])
  const active = lang || 'hi'
  const resolved = resolveLang(active)
  const dict = STRINGS[resolved]

  // lookup fn: t('orders') with optional params
  const t = useCallback(
    (key, params) => {
      let s = dict?.[key] ?? STRINGS.en[key] ?? key
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          s = s.split(`{${k}}`).join(String(v))
        })
      }
      return s
    },
    [dict]
  )

  const value = useMemo(
    () => ({
      lang: active,
      resolved,
      dict,
      setLang,
      t,
      tts: TTS_OF(active),
    }),
    [active, resolved, dict, setLang, t]
  )

  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>
}

export default LanguageProvider