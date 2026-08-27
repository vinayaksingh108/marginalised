import React, {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react'
import { db, seedIfEmpty } from '../data/db'
import { ANALYTICS_SEED } from '../data/schemes'

const ArtCtx = createContext(null)
export const useArtisan = () => useContext(ArtCtx)

export function ArtisanProvider({ children }) {
  const [artisan, setArtisan] = useState(null)
  const [products, setProducts] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [orders, setOrders] = useState([
    { id: 'ORD-7842', product: 'Hand-Painted Blue Pottery Vase', qty: 2, amount: 998, status: 'New', time: '10:42', buyer: 'Priya Nair', city: 'Mumbai' },
    { id: 'ORD-7841', product: 'Mirrorwork Kutch Wall Hanging', qty: 1, amount: 265, status: 'Packed', time: '09:12', buyer: 'Arjun Mehta', city: 'Delhi' },
    { id: 'ORD-7840', product: 'Tribal Dokra Elephant Figurine', qty: 1, amount: 899, status: 'Shipped', time: 'Yesterday', buyer: 'S. Raman', city: 'Bengaluru' },
    { id: 'ORD-7839', product: 'Blue Pottery Pendant Set', qty: 3, amount: 1047, status: 'Confirmed via IVR', time: '2d ago', buyer: 'Kaveri Iyer', city: 'Chennai' },
    { id: 'ORD-7838', product: 'Chikankari Kurta', qty: 2, amount: 2598, status: 'Shipped', time: '3d ago', buyer: 'Nitin Gupta', city: 'Pune' },
  ])

  useEffect(() => {
    ;(async () => {
      await seedIfEmpty()
      const [art, prods] = await Promise.all([db.artisan.get('me'), db.products.toArray()])
      setArtisan(art || null)
      setProducts(prods || [])
      setLoaded(true)
    })()
  }, [])

  // Live re-derive inventory after any mutation
  const refreshProducts = async () => {
    const prods = await db.products.toArray()
    setProducts(prods || [])
  }

  const value = useMemo(
    () => ({
      artisan,
      products,
      orders,
      setOrders,
      loaded,
      setArtisan,
      refreshProducts,
      analytics: ANALYTICS_SEED,
    }),
    [artisan, products, orders, loaded]
  )

  return <ArtCtx.Provider value={value}>{children}</ArtCtx.Provider>
}

export default ArtisanProvider