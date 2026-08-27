import { useEffect, useState } from 'react'
import { db, seedIfEmpty } from '../data/db'

// Lightweight reactive reader over the Dexie product table.
let cache = []
const listeners = new Set()
let loadedOnce = false

async function load() {
  await seedIfEmpty()
  const rows = await db.products.toArray()
  cache = rows
  loadedOnce = true
  listeners.forEach((l) => l(cache))
}

export function notifyProductsChanged() {
  db.products.toArray().then((rows) => {
    cache = rows
    listeners.forEach((l) => l(cache))
  })
}

export function useProducts() {
  const [data, setData] = useState(cache)
  useEffect(() => {
    listeners.add(setData)
    if (!loadedOnce) load()
    return () => listeners.delete(setData)
  }, [])
  return data
}