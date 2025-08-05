from fastapi import FastAPI
from company_summarizer import CompanySummarizer
import os

app = FastAPI()

@app.post("/run")
def run_summarizer():
    creds_path = os.getenv("GOOGLE_CREDENTIALS_PATH", "credentials.json")
    groq_key = os.getenv("GROQ_API_KEY")
    sheet_url = os.getenv("SPREADSHEET_URL")

    summarizer = CompanySummarizer(creds_path, groq_key)
    summarizer.run_full_analysis(sheet_url)

    return {"status": "completed"}
