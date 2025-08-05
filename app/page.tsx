'use client'

import { useEffect, useState } from 'react'
import { Play, Download, ExternalLink, CheckCircle, Clock, AlertCircle } from 'lucide-react'

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

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch('/api/companies')
        const data = await res.json()
        setCompanies(data)
      } catch (err) {
        console.error('Failed to fetch companies', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle className="w-5 h-5 text-green-500" />
    if (status === 'processing') return <Clock className="w-5 h-5 text-blue-500 animate-spin" />
    return <AlertCircle className="w-5 h-5 text-gray-400" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Company Summarizer</h1>
            <p className="text-gray-600 mt-1">AI-powered analysis sourced from your Google Sheet</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-blue-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Live Data Mode</h3>
              <p className="mt-1 text-sm text-blue-700">
                This view pulls AI-generated summaries directly from your live Google Sheet.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Companies" value={companies.length} icon={<CheckCircle className="w-5 h-5 text-blue-600" />} />
          <StatCard label="Completed" value={companies.filter(c => c.status === 'completed').length} icon={<CheckCircle className="w-5 h-5 text-green-600" />} />
          <StatCard label="Processing" value={companies.filter(c => c.status === 'processing').length} icon={<Clock className="w-5 h-5 text-yellow-600" />} />
          <StatCard label="Pending" value={companies.filter(c => c.status === 'pending').length} icon={<AlertCircle className="w-5 h-5 text-gray-600" />} />
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Company Analysis Results</h3>
            <p className="text-sm text-gray-500 mt-1">Summaries are generated via Groq API and stored in your Google Sheet</p>
          </div>

          {loading ? (
            <div className="p-6 text-gray-500">Loading companies...</div>
          ) : error ? (
            <div className="p-6 text-red-500">Error loading data. Check server or API route.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Summary</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {companies.map((company, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4">{getStatusIcon(company.status)}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center space-x-1">
                          <span>{company.name}</span>
                          <ExternalLink className="w-4 h-4 text-gray-500" />
                        </a>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{company.source}</td>
                      <td className="px-6 py-4 text-gray-700">{company.summary || 'No summary available yet.'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
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
