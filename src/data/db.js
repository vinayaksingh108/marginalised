import Dexie from 'dexie'
import { PRODUCTS, ARTISANS } from './seed'

// Consistent product schema throughout the app
function normalizeProducts() {
  return PRODUCTS.map((p) => {
    const artisan = ARTISANS.find((a) => a.id === p.artisanId) || null
    return {
      id: p.id,
      title: p.title,
      artisanId: p.artisanId || null,
      artisan,
      category: p.category,
      price: p.price,
      gi: !!p.gi,
      stock: p.stock,
      desc: p.desc,
      cluster: p.cluster,
      listedAt: p.listedAt || p.listed,
      tags: p.tags,
      units: p.units || 'pc',
      cost: {
        craft: p.progressWage ?? p.progress ?? Math.round(p.price * 0.4),
        material: p.material,
        platformFee: p.platformFee,
        shipping: p.shipping,
      },
    }
  })
}

export const db = new Dexie('EmpowerCraftDB')

db.version(1).stores({
  products: 'id, category, gi, stock',
  orders: 'id, status',
  artisan: 'id',
  settings: 'key',
})

// helper accessors
export const getProducts = () => db.products.toArray()

export async function seedIfEmpty() {
  const count = await db.products.count()
  const artisanCount = await db.artisan.count()
  if (count === 0) {
    await db.products.bulkPut(normalizeProducts())
  }
  if (artisanCount === 0) {
    const primaryArtisan = {
      id: 'me',
      name: 'Sunita Devi',
      village: 'Basoli near Udaipur, Rajasthan',
      craft: 'Blue Pottery',
      experience: 18,
      totalOrders: 847,
      language: 'hi',
      rating: 4.9,
      badges: ['Master Artisan', 'GI Certified'],
      bank: { last4: '4821', upi: 'sunitadevi@okhdfc' },
      savingRate: 15,
      ppfBalance: 48200,
      walletBalance: 18250,
    }
    await db.artisan.put(primaryArtisan)
  }
}

// Persist module-level demo data into Dexie-backed live state
export async function updateProduct(id, patch) {
  await db.products.update(id, patch)
  return db.products.get(id)
}

export default db