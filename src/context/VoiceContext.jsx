import React, {
  createContext, useCallback, useContext, useMemo, useRef, useState,
} from 'react'
import {
  createRecognizer, speak, cancelSpeech, welcomeFor, transcriptFrom,
} from '../lib/speech'

const VoiceCtx = createContext(null)
export const useVoice = () => useContext(VoiceCtx)

export function VoiceProvider({ children }) {
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const recRef = useRef(null)
  const actionRef = useRef(null)

  // Pages register a high-level intent handler (global voice commands)
  const registerActions = useCallback((fn) => {
    actionRef.current = fn
  }, [])

  const speakOut = useCallback((text, lang = 'hi-IN') => {
    setSpeaking(true)
    speak(text, {
      lang,
      onend: () => setSpeaking(false),
    })
  }, [])

  const stopAll = useCallback(() => {
    cancelSpeech()
    setSpeaking(false)
    if (recRef.current) recRef.current.abort()
    setListening(false)
  }, [])

  const startListen = useCallback(
    (lang = 'hi-IN') => {
      setTranscript('')
      setListening(true)
      const rec = createRecognizer({
        lang,
        onResult: (r) => setTranscript(transcriptFrom(r)),
        onEnd: () => setListening(false),
        onError: () => setListening(false),
      })
      if (!rec) {
        setListening(false)
        return
      }
      recRef.current = rec
      rec.start()
      // When recognition naturally ends, route the finished transcript
      rec.onresult = (e) => {
        let final = ''
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) final += e.results[i][0].transcript
        }
        if (final) {
          setTranscript(final)
          if (actionRef.current) actionRef.current(final)
        }
      }
    },
    []
  )

  const value = useMemo(
    () => ({
      listening, speaking, transcript, panelOpen,
      setPanelOpen, startListen, stopAll, speak: speakOut,
      registerActions, welcome: welcomeFor,
    }),
    [listening, speaking, transcript, panelOpen, startListen, stopAll, speakOut, registerActions]
  )

  return <VoiceCtx.Provider value={value}>{children}</VoiceCtx.Provider>
}

export default VoiceProvider