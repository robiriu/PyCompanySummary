import { google } from 'googleapis'
import { NextResponse } from 'next/server'

export async function GET() {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    const spreadsheetId = process.env.SPREADSHEET_ID!
    const range = 'data!A2:C' // Skip header

    try {
        const res = await sheets.spreadsheets.values.get({ spreadsheetId, range })
        const rows = res.data.values || []

        const companies = rows.map(row => ({
            name: row[0],
            website: row[1],
            source: row[2],
            summary: row[3],
            status: 'completed',
        }))

        return NextResponse.json(companies)
    } catch (error) {
        console.error('Sheets error:', error)
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
    }
}
