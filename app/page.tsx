'use client'

import { useState } from 'react'
import { Play, Download, ExternalLink, CheckCircle, Clock, AlertCircle } from 'lucide-react'

// Sample company data that mimics what the Python script would process
const sampleCompanies = [
  {
    name: "Apple Inc.",
    website: "https://www.apple.com",
    source: "Fortune 500",
    summary: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company also sells various related services including digital content and cloud services.",
    status: "completed"
  },
  {
    name: "Microsoft Corporation",
    website: "https://www.microsoft.com",
    source: "Fortune 500",
    summary: "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company operates through three segments: Productivity and Business Processes, Intelligent Cloud, and More Personal Computing.",
    status: "completed"
  },
  {
    name: "Amazon.com Inc.",
    website: "https://www.amazon.com",
    source: "Fortune 500",
    summary: "Amazon.com Inc. operates as an online retailer and cloud computing services provider. The company offers a range of products and services through its websites including merchandise and content from third-party sellers.",
    status: "completed"
  },
  {
    name: "Alphabet Inc. (Google)",
    website: "https://www.google.com",
    source: "Fortune 500",
    summary: "Alphabet Inc. operates as a holding company that provides online advertising services and cloud computing platforms. The company's Google segment includes search, ads, commerce, maps, YouTube, Google Cloud, Android, Chrome, and Google Play.",
    status: "processing"
  },
  {
    name: "Tesla Inc.",
    website: "https://www.tesla.com",
    source: "NASDAQ",
    summary: "",
    status: "pending"
  }
]

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [companies, setCompanies] = useState(sampleCompanies)
  const [currentProcessing, setCurrentProcessing] = useState(-1)

  const simulateProcessing = async () => {
    setIsProcessing(true)
    setCurrentProcessing(0)

    // Simulate processing each company
    for (let i = 0; i < companies.length; i++) {
      setCurrentProcessing(i)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setCompanies(prev => prev.map((company, index) => {
        if (index === i && company.status !== 'completed') {
          return {
            ...company,
            status: 'completed',
            summary: index === 3 ? "Alphabet Inc. operates as a holding company that provides online advertising services and cloud computing platforms. The company's Google segment includes search, ads, commerce, maps, YouTube, Google Cloud, Android, Chrome, and Google Play." :
                    index === 4 ? "Tesla Inc. designs, develops, manufactures, and sells electric vehicles, energy generation and storage systems. The company operates through two segments: Automotive and Energy Generation and Storage." :
                    company.summary
          }
        }
        return company
      }))
    }

    setCurrentProcessing(-1)
    setIsProcessing(false)
  }

  const getStatusIcon = (status: string, index: number) => {
    if (status === 'completed') {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    } else if (status === 'processing' || (isProcessing && index === currentProcessing)) {
      return <Clock className="w-5 h-5 text-blue-500 animate-spin" />
    } else {
      return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Company Summarizer</h1>
              <p className="text-gray-600 mt-1">AI-powered company analysis using OpenAI GPT and Google Sheets</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={simulateProcessing}
                disabled={isProcessing}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="w-4 h-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Run Analysis'}
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Demo Mode</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>This is a demonstration of the Company Summarizer script. In the actual implementation, data is read from and written to Google Sheets, and real AI summaries are generated using OpenAI's GPT API.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Companies</p>
                <p className="text-2xl font-semibold text-gray-900">{companies.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {companies.filter(c => c.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Processing</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {companies.filter(c => c.status === 'processing').length + (isProcessing ? 1 : 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {companies.filter(c => c.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Company Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Company Analysis Results</h3>
            <p className="text-sm text-gray-500 mt-1">AI-generated summaries of company business activities</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AI Summary
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {companies.map((company, index) => (
                  <tr key={index} className={isProcessing && index === currentProcessing ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusIcon(company.status, index)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{company.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        Visit Site
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {company.source}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md">
                        {company.summary ? (
                          company.summary
                        ) : (
                          <span className="text-gray-400 italic">
                            {isProcessing && index === currentProcessing ? 'Generating summary...' : 'Pending analysis'}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-12 bg-white rounded-lg shadow p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">How the Company Summarizer Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Read from Google Sheets</h4>
              <p className="text-gray-600">The script reads company names, websites, and sources from your Google Spreadsheet using the Google Sheets API.</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-green-600">2</span>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">AI Analysis</h4>
              <p className="text-gray-600">OpenAI's GPT analyzes each company using carefully crafted prompts to generate accurate, professional summaries.</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Write Results</h4>
              <p className="text-gray-600">The generated summaries are automatically written back to a new tab in your Google Spreadsheet with timestamps.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>Company Summarizer Demo - Built with Next.js, deployed on Vercel</p>
            <p className="mt-2">The actual script uses Python, OpenAI GPT API, and Google Sheets API</p>
          </div>
        </div>
      </footer>
    </div>
  )
}