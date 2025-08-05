'use client'

import { useEffect, useState } from 'react'
import { Play, Download, ExternalLink, CheckCircle, Clock, AlertCircle, RefreshCcw } from 'lucide-react'

type Company = {
  name: string
  website: string
  source: string
  summary: string
  status: string
}

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/companies')
      const data = await res.json()
      setCompanies(Array.isArray(data) ? data : [])
      setError(false)
    } catch (err) {
      console.error('Failed to fetch companies:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle className="w-5 h-5 text-green-500" />
    if (status === 'processing') return <Clock className="w-5 h-5 text-blue-500 animate-spin" />
    return <AlertCircle className="w-5 h-5 text-gray-400" />
  }

  const completedCount = companies?.filter(c => c.status === 'completed').length || 0
  const processingCount = companies?.filter(c => c.status === 'processing').length || 0
  const pendingCount = companies?.filter(c => c.status === 'pending').length || 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Company Summarizer</h1>
            <p className="text-gray-600 mt-1">Live AI summaries from Google Sheets</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={fetchCompanies}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Refresh Data
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-700">
            ❌ Error loading data. Check your API route or spreadsheet access.
          </div>
        ) : loading ? (
          <div className="text-gray-500 text-sm mb-8">Loading company data...</div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard label="Total Companies" value={companies.length} icon={<CheckCircle />} />
              <StatCard label="Completed" value={completedCount} icon={<CheckCircle />} />
              <StatCard label="Processing" value={processingCount} icon={<Clock />} />
              <StatCard label="Pending" value={pendingCount} icon={<AlertCircle />} />
            </div>

            {/* Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Company Analysis Results</h3>
                <p className="text-sm text-gray-500 mt-1">Summaries generated via Groq API</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Website</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Summary</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {companies.map((company, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">{getStatusIcon(company.status)}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{company.name}</td>
                        <td className="px-6 py-4">
                          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                            Visit Site <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {company.source}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
                          {company.summary || <span className="text-gray-400 italic">Pending analysis</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500">
          <p>Company Summarizer – Powered by Groq API & Google Sheets</p>
        </div>
      </footer>
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: JSX.Element }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">{icon}</div>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}
