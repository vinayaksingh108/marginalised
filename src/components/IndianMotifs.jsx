import React from 'react'

/* ------------------------------------------------------------------ *
 * EmpowerCraft Indian Cultural Motifs & Illustrations
 * Hand-crafted inline SVGs so the platform feels rooted in Indian
 * heritage. Used as heroes, backdrops and product art (no external
 * image network required = 100% offline / zero cost).
 * ------------------------------------------------------------------ */

/** The Indian Peacock — National Bird */
export function Peacock({ className = 'w-24 h-24', colored = true }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <g>
        {/* Tail feathers */}
        <g stroke="#138808" strokeWidth="5" fill="none" opacity="0.9">
          <path d="M60 52 C 20 30, 8 58, 18 78" />
          <path d="M60 52 C 28 26, 14 46, 20 68" />
          <path d="M60 52 C 34 22, 22 34, 26 54" />
          <path d="M60 52 C 100 30, 112 58, 102 78" />
          <path d="M60 52 C 92 26, 106 46, 100 68" />
          <path d="M60 52 C 86 22, 98 34, 94 54" />
        </g>
        {/* eye-spots */}
        {[
          [22, 72], [26, 58], [98, 72], [94, 58], [34, 44], [86, 44],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="5.5" fill={colored ? '#00308F' : '#2b2b2b'} />
            <circle cx={cx} cy={cy} r="2.6" fill="#C99700" />
          </g>
        ))}
        {/* body */}
        <ellipse cx="60" cy="70" rx="13" ry="24" fill={colored ? '#138808' : '#555'} />
        <rect x="54" y="86" width="4" height="16" rx="2" fill="#138808" />
        <rect x="62" y="86" width="4" height="16" rx="2" fill="#138808" />
        {/* neck + head */}
        <path d="M64 50 C 76 44, 76 30, 70 22" stroke={colored ? '#0B6E10' : '#444'} strokeWidth="9" fill="none" strokeLinecap="round" />
        <circle cx="70" cy="20" r="8" fill={colored ? '#C99700' : '#666'} />
        <circle cx="74" cy="18" r="2.4" fill="#1A1423" />
        {/* crown */}
        <path d="M64 12 l2 7 3 -6 3 7 3 -6" stroke="#1A1423" strokeWidth="2" fill={colored ? '#C99700' : '#999'} strokeLinecap="round" />
        {/* crest */}
        <path d="M82 30 q 8 -4 4 -10" stroke="#1A1423" strokeWidth="2" fill="none" />
        <circle cx="86" cy="18" r="3" fill="#1A1423" />
      </g>
    </svg>
  )
}

/** The Indian Lotus — national flower */
export function Lotus({ className = 'w-16 h-16', color = '#F79BB4' }) {
  return (
    <svg viewBox="0 0 100 80" className={className} fill="none" aria-hidden="true">
      <path d="M50 62 C 30 52 6 40 6 18 C 26 18 46 40 50 62Z" fill={color} opacity="0.9" />
      <path d="M50 62 C 70 52 94 40 94 18 C 74 18 54 40 50 62Z" fill={color} opacity="0.85" />
      <path d="M50 66 C 40 44 26 32 14 32 C 18 50 32 66 50 66Z" fill={color} opacity="0.75" />
      <path d="M50 66 C 60 44 74 32 86 32 C 82 50 68 66 50 66Z" fill={color} opacity="0.7" />
      <path d="M50 52 C45 34 40 26 34 20" stroke="#E08CB0" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 52 C55 34 60 26 66 20" stroke="#E08CB0" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="58" r="4" fill="#E0A53A" />
    </svg>
  )
}

/** Paisley / mango motif divider */
export function PaisleyRule({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-saffron/60" />
      <svg viewBox="0 0 40 22" className="h-4 w-10 text-saffron" fill="currentColor" aria-hidden="true">
        <path d="M20 2c6 4 9 9 7 15 -4-6-9-8-15-8 3-3 8-4 8-7z" />
        <circle cx="27" cy="17" r="1.6" />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-saffron/60" />
    </div>
  )
}

/** Decorative mandala circle */
export function Mandala({ className = 'w-24 h-24' }) {
  const dots = []
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2
    dots.push([Math.cos(a) * 34, Math.sin(a) * 34])
  }
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.2" />
      {dots.map(([x, y], i) => (
        <circle key={i} cx={50 + x} cy={50 + y} r="2.6" fill="currentColor" fillOpacity="0.8" />
      ))}
      <circle cx="50" cy="50" r="16" fill="none" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1" strokeDasharray="4 4" />
      {[0, 45, 90, 135].map((d, i) => (
        <path key={i} d="M50 50 L50 18" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" transform={`rotate(${d} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="4" fill="currentColor" opacity="0.9" />
    </svg>
  )
}

/** Temple silhouette used as scenic backdrop */
export function Temple({ className = '' }) {
  return (
    <svg viewBox="0 0 400 160" className={className} aria-hidden="true">
      <g transform="translate(40 8)" fill="none" stroke="currentColor" strokeOpacity="0.35">
        <path d="M0 120 L160 40 L320 120 Z" strokeWidth="2" />
        <path d="M20 140 L300 140" strokeWidth="1.5" />
        <rect x="70" y="80" width="20" height="40" strokeWidth="1.5" />
        <rect x="130" y="80" width="20" height="40" strokeWidth="1.5" />
        <rect x="20" y="80" width="150" height="30" strokeWidth="1.5" />
        <circle cx="85" cy="74" r="5" strokeWidth="1.5" />
      </g>
    </svg>
  )
}

/** Ornamental arch / meenakari border */
export function MeenakariBorder({ className = '' }) {
  const petals = []
  for (let i = 0; i < 20; i++) {
    petals.push(
      <path
        key={i}
        d={`M${i * 2 + 1} 2 q 1 -1.6 2 0`}
        stroke="currentColor"
        strokeWidth="0.7"
        fill="none"
      />
    )
  }
  return (
    <svg viewBox="0 0 42 4" className={`h-2 w-full ${className}`} aria-hidden="true">
      {petals}
      <line x1="0" y1="3.4" x2="42" y2="3.4" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.5" />
    </svg>
  )
}
/* ------------------------------------------------------------------
   Product illustrations per craft category (substitute for photos).
   Fully vector, tinted with vibrant Indian palette.
 * ------------------------------------------------------------------ */

export function CraftArt({ category, className = 'w-full h-44' }) {
  const shapes = {
    pottery: (
      <g>
        <circle cx="54" cy="30" r="6" fill="#C99700" />
        <path d="M42 36 C 42 60 66 60 66 36 L 70 66 L 38 66 Z" fill="#B74B2A" />
        <path d="M44 40 q0 -5 24 0" stroke="#C99700" strokeWidth="1.4" fill="none" />
        <circle cx="40" cy="78" r="3" fill="#F4A127" />
        <circle cx="68" cy="78" r="3" fill="#F4A127" />
      </g>
    ),
    handloom: (
      <g>
        <path d="M22 30 L18 88 L82 92 L78 30 Z" fill="#D9534F" />
        <path d="M23 30 L77 30 L75 44 L25 44 Z" fill="#C99700" />
        <path d="M25 44 L75 44 L73 58 L27 58 Z" fill="#003886" />
        <path d="M27 58 L73 58 L71 72 L29 72 Z" fill="#138808" />
        <path d="M29 72 L71 72 L69 84 L31 84 Z" fill="#F4A127" />
        <path d="M74 24 l14 -8 m0 0 l6 20 m-6-20 l-26 10" stroke="#D9534F" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>
    ),
    woodwork: (
      <g>
        <path d="M40 30 c10 -14 22 -14 26 0 l4 44 l-32 0Z" fill="#8B5A2B" />
        <path d="M42 40 l24 0" stroke="#5B3A1E" strokeWidth="1.6" />
        <path d="M40 52 l28 0" stroke="#5B3A1E" strokeWidth="1.6" />
        <path d="M42 64 l24 0" stroke="#5B3A1E" strokeWidth="1.6" />
        <rect x="36" y="74" width="6" height="12" rx="2" fill="#5B3A1E" />
        <rect x="66" y="74" width="6" height="12" rx="2" fill="#5B3A1E" />
      </g>
    ),
    metalcraft: (
      <g>
        <ellipse cx="54" cy="40" rx="20" ry="26" fill="#C99700" />
        <ellipse cx="54" cy="40" rx="14" ry="19" fill="none" stroke="#7a5700" strokeWidth="1.4" />
        <circle cx="54" cy="40" r="5" fill="#7a5700" />
        <path d="M54 14 l8 12 h-16Z" fill="#A67C00" />
        <path d="M54 66 l7 16 h-14Z" fill="#A67C00" />
      </g>
    ),
    default: (
      <g>
        <circle cx="54" cy="46" r="22" fill="#C99700" />
        <path d="M34 80 h40 v -14 H34Z" fill="#B74B2A" />
      </g>
    ),
  }
  return (
    <svg viewBox="0 0 108 100" className={className} role="img" aria-label={category || 'handicraft'}>
      {shapes[category] || shapes.default}
    </svg>
  )
}

export const CATEGORY_META = {
  pottery: { label: 'Pottery', color: '#B74B2A', tint: 'bg-terracotta/10' },
  handloom: { label: 'Handloom', color: '#D9534F', tint: 'bg-red-100' },
  woodwork: { label: 'Woodwork', color: '#8B5A2B', tint: 'bg-amber-100' },
  metalcraft: { label: 'Metalcraft', color: '#C99700', tint: 'bg-yellow-100' },
}