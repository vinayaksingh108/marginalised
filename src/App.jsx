import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import CartProvider from './context/CartContext'
import ArtisanProvider from './context/ArtisanContext'
import LanguageProvider from './context/LanguageContext'
import VoiceProvider from './context/VoiceContext'

import Landing from './pages/Landing'
import MarketplaceLayout from './components/MarketplaceLayout'
import ArtisanLayout from './components/ArtisanLayout'
import Home from './pages/marketplace/Home'
import Explore from './pages/marketplace/Explore'
import Product from './pages/marketplace/Product'
import Cart from './pages/marketplace/Cart'
import Checkout from './pages/marketplace/Checkout'
import TrackOrder from './pages/marketplace/TrackOrder'

import Auth from './pages/artisan/Auth'
import Dashboard from './pages/artisan/Dashboard'
import AddProduct from './pages/artisan/AddProduct'
import Inventory from './pages/artisan/Inventory'
import Orders from './pages/artisan/Orders'
import AnalyticsStudio from './pages/artisan/AnalyticsStudio'
import SmartWallet from './pages/artisan/SmartWallet'
import Schemes from './pages/artisan/Schemes'
import Milestones from './pages/artisan/Milestones'
import Settings from './pages/artisan/Settings'
import Circles from './pages/artisan/Circles'

export default function App() {
  return (
    <CartProvider>
      <ArtisanProvider>
        <LanguageProvider>
          <VoiceProvider>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Landing />} />

                {/* Buyer Marketplace */}
                <Route path="/marketplace" element={<MarketplaceLayout />}>
                  <Route index element={<Home />} />
                  <Route path="home" element={<Home />} />
                  <Route path="explore" element={<Explore />} />
                  <Route path="product/:id" element={<Product />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="track-order/:id" element={<TrackOrder />} />
                </Route>

                {/* Artisan Studio */}
                <Route path="/artisan" element={<ArtisanLayout />}>
                  <Route index element={<Auth />} />
                  <Route path="auth" element={<Auth />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="studio/add-product" element={<AddProduct />} />
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="analytics-studio" element={<AnalyticsStudio />} />
                  <Route path="smart-wallet" element={<SmartWallet />} />
                  <Route path="schemes" element={<Schemes />} />
                  <Route path="milestones" element={<Milestones />} />
                  <Route path="circles" element={<Circles />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<Landing />} />
              </Routes>
            </ErrorBoundary>
          </VoiceProvider>
        </LanguageProvider>
      </ArtisanProvider>
    </CartProvider>
  )
}