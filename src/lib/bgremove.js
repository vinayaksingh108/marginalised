// Client-side AI background removal.
// Primary: @imgly/background-removal (RMBG / isnet) runs fully in-browser
//          via WebGPU/WASM — zero cloud cost.
// Fallback: a canvas "studio spotlight + vignette" enhancement so the
//          feature always works, even fully offline.
let enginePromise = null

export async function loadEngine() {
  if (!enginePromise) {
    enginePromise = (async () => {
      try {
        const mod = await import('@imgly/background-removal')
        const fn = mod.removeBackground || mod.default
        return { fn, real: true }
      } catch (e) {
        console.warn('imgly unavailable, using fallback', e)
        return { fn: null, real: false }
      }
    })()
  }
  return enginePromise
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/** Fallback: brighten subject, cool the edges into a soft studio halo. */
export function studioEnhance(canvas, img) {
  const ctx = canvas.getContext('2d')
  const maxSide = 480
  const scale = Math.min(maxSide / img.width, maxSide / img.height, 1)
  canvas.width = img.width * scale
  canvas.height = img.height * scale
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  // Radial spotlight: bright, warm centre → soft saffron vignette edge
  const g = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, canvas.width * 0.2,
    canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.75
  )
  g.addColorStop(0, 'rgba(255,255,255,0.25)')
  g.addColorStop(0.7, 'rgba(255,153,51,0.12)')
  g.addColorStop(1, 'rgba(26,20,35,0.5)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // crisp contrast pass
  ctx.globalCompositeOperation = 'overlay'
  ctx.fillStyle = 'rgba(0,0,0,0.12)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.globalCompositeOperation = 'source-over'
}

/** Remove background of an image URL/blob. Returns an object URL. */
export async function removeBackground(src) {
  const { fn, real } = await loadEngine()
  if (real && fn) {
    try {
      const blob = await fn(src, { progress: (k) => {} })
      const url = URL.createObjectURL(blob)
      return { url, real: true }
    } catch (e) {
      console.warn('AI removal failed, falling back', e)
    }
  }
  // fallback path
  const img = await loadImage(src)
  const canvas = document.createElement('canvas')
  studioEnhance(canvas, img)
  const url = canvas.toDataURL('image/png')
  return { url, real: false }
}

export async function prepareImageBytes(file) {
  const url = URL.createObjectURL(file)
  const res = await removeBackground(url)
  return res
}