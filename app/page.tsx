'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://botpro-2p7g.onrender.com'

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)
  
  // Mantener el backend activo con polling cada 30 segundos
  const { data: health, error: healthError } = useSWR(
    `${API_BASE}/`,
    fetcher,
    { 
      refreshInterval: 30000, // Cada 30 segundos
      revalidateOnFocus: false,
      onSuccess: (data) => {
        console.log('Health check success:', data)
      },
      onError: (error) => {
        console.log('Health check error:', error.message)
      }
    }
  )

  // Obtener estado del bot
  const { data: botStatus, error: botError } = useSWR(
    `${API_BASE}/api/bot/status`,
    fetcher,
    { refreshInterval: 10000 } // Cada 10 segundos
  )
  
  // Obtener señales del bot
  const { data: botSignals, error: signalsError } = useSWR(
    `${API_BASE}/api/bot/signals`,
    fetcher,
    { refreshInterval: 30000 } // Cada 30 segundos
  )

  useEffect(() => {
    setMounted(true)
    // Log inicial para debug
    console.log('Dashboard mounted. API_BASE:', API_BASE)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">BotPro Trading Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm ${
                health && health.status === 'online' ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {health && health.status === 'online' ? 'Connected' : 'Disconnected'}
              </span>
              <span className="text-sm text-gray-400">
                Last update: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm">Bot Status</h3>
            <p className={`text-2xl font-bold mt-2 ${botStatus?.running ? 'text-green-400' : 'text-red-400'}`}>
              {botStatus?.running ? '🟢 Running' : '🔴 Stopped'}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm">Signals Generated</h3>
            <p className="text-3xl font-bold mt-2">
              {botStatus?.signals_count || '0'}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm">Active Signals</h3>
            <p className="text-3xl font-bold mt-2">
              {botSignals?.total || '0'}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm">Uptime</h3>
            <p className="text-lg font-bold mt-2">
              {botStatus?.uptime ? botStatus.uptime.split('.')[0] : 'N/A'}
            </p>
          </div>
        </div>

        {/* Bot Control Buttons */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Bot Control</h2>
            <div className="flex gap-4">
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(`${API_BASE}/api/bot/start`, { method: 'POST' })
                    const data = await res.json()
                    alert(data.message)
                  } catch (err) {
                    alert('Error starting bot')
                  }
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-medium"
              >
                Start Bot
              </button>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(`${API_BASE}/api/bot/stop`, { method: 'POST' })
                    const data = await res.json()
                    alert(data.message)
                  } catch (err) {
                    alert('Error stopping bot')
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-medium"
              >
                Stop Bot
              </button>
            </div>
          </div>
        </div>

        {/* Signals Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold">Live Trading Signals (Real-Time)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Entry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Stop Loss
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Take Profit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Confidence
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {botSignals?.signals?.map((signal: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium">{signal.symbol}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs ${
                        signal.signal_type === 'BUY' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {signal.signal_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      ${parseFloat(signal.entry_price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      ${parseFloat(signal.stop_loss).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      ${parseFloat(signal.take_profit_1).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${
                          signal.confidence >= 80
                            ? 'text-green-400'
                            : signal.confidence >= 70
                            ? 'text-yellow-400'
                            : 'text-gray-400'
                        }`}>
                          {signal.confidence}%
                        </span>
                        <span className="text-xs text-gray-500">
                          RSI: {signal.rsi?.toFixed(1)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!botSignals?.signals || botSignals.signals.length === 0) && (
              <div className="text-center py-8 text-gray-400">
                {botStatus?.running 
                  ? "Waiting for trading signals... (checks every 5 minutes)"
                  : "Bot is stopped. Click 'Start Bot' to begin generating signals"}
              </div>
            )}
          </div>
        </div>

        {/* Status Message */}
        {health && !healthError && (
          <div className="mt-6 bg-green-900 bg-opacity-50 border border-green-500 rounded-lg p-4">
            <p className="text-green-300">
              ✅ Keep-Alive funcionando: El backend se mantiene activo con polling cada 30 segundos.
            </p>
            <p className="text-green-300 text-sm mt-2">
              Estado del backend: {health?.status || 'Conectando...'} | Bot: {health?.bot_status || 'N/A'} | Versión: {health?.version || 'N/A'}
            </p>
          </div>
        )}
        
        {/* Error Message - Solo si hay error real de conexión */}
        {healthError && (
          <div className="mt-6 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-4">
            <p className="text-red-300">
              Error conectando al backend. Reintentando...
            </p>
          </div>
        )}
      </main>
    </div>
  )
}