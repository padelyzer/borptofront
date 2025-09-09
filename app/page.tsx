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
      revalidateOnFocus: false 
    }
  )

  // Obtener señales - temporalmente deshabilitado mientras se actualiza el backend
  const signals = null
  const signalsError = null

  // Obtener estadísticas - temporalmente deshabilitado mientras se actualiza el backend
  const stats = null
  const statsError = null

  useEffect(() => {
    setMounted(true)
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
                health?.status === 'online' ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {health?.status === 'online' ? 'Connected' : 'Disconnected'}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm">Win Rate</h3>
            <p className="text-3xl font-bold mt-2">
              {stats?.performance?.win_rate || '0'}%
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm">Total Trades</h3>
            <p className="text-3xl font-bold mt-2">
              {stats?.performance?.total_trades || '0'}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm">Active Signals</h3>
            <p className="text-3xl font-bold mt-2">
              {signals?.signals?.length || '0'}
            </p>
          </div>
        </div>

        {/* Signals Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold">Live Trading Signals</h2>
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
                {signals?.signals?.map((signal: any, idx: number) => (
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
                      ${signal.entry_price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      ${signal.stop_loss}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      ${signal.take_profit_1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        signal.confidence === 'HIGH' 
                          ? 'text-green-400'
                          : signal.confidence === 'MEDIUM'
                          ? 'text-yellow-400'
                          : 'text-gray-400'
                      }`}>
                        {signal.confidence}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!signals?.signals || signals.signals.length === 0) && (
              <div className="text-center py-8 text-gray-400">
                No active signals at the moment
              </div>
            )}
          </div>
        </div>

        {/* Status Message */}
        <div className="mt-6 bg-blue-900 bg-opacity-50 border border-blue-500 rounded-lg p-4">
          <p className="text-blue-300">
            ✅ Keep-Alive activo: El backend se mantiene activo con polling cada 30 segundos.
          </p>
          <p className="text-blue-300 text-sm mt-2">
            Estado del backend: {health?.status || 'Conectando...'} | Bot: {health?.bot_status || 'N/A'}
          </p>
        </div>
      </main>
    </div>
  )
}