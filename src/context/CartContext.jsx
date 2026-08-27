import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartCtx = createContext(null)
export const useCart = () => useContext(CartCtx)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ec_cart') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('ec_cart', JSON.stringify(items))
    } catch {}
  }, [items])

  const add = (product, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === product.id)
      if (i >= 0) {
        const next = [...prev]
        next[i] = { ...next[i], qty: next[i].qty + qty }
        return next
      }
      return [...prev, { ...product, qty }]
    })
  }

  const setQty = (id, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((x) => x.id !== id)
        : prev.map((x) => (x.id === id ? { ...x, qty } : x))
    )
  }

  const remove = (id) => setItems((prev) => prev.filter((x) => x.id !== id))
  const clear = () => setItems([])

  const total = items.reduce((s, x) => s + x.price * x.qty, 0)
  const count = items.reduce((s, x) => s + x.qty, 0)

  return (
    <CartCtx.Provider value={{ items, add, setQty, remove, clear, total, count }}>
      {children}
    </CartCtx.Provider>
  )
}

export default CartProvider