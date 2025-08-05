#!/usr/bin/env python3
"""
Company Summarizer Script

This script reads company names from a Google Sheet, uses OpenAI's GPT API to generate
summaries of what each company does, and outputs the results to a new tab in the same sheet.

Author: Robi Dany Riupassa (Assisted by forge code assistant)
Date: 2025-08-05
"""

import os
import time
import logging
from typing import List, Dict, Optional
import pandas as pd
import gspread
from google.oauth2.service_account import Credentials
from openai import OpenAI
from groq import Groq
import json
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('company_summarizer.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class CompanySummarizer:
    """
    A class to handle company data processing from Google Sheets using OpenAI API.
    """
    
    def __init__(self, credentials_path: str, groq_api_key: str):
        """
        Initialize the CompanySummarizer with necessary credentials.
        
        Args:
            credentials_path (str): Path to Google Service Account credentials JSON file
            openai_api_key (str): OpenAI API key
        """
        self.credentials_path = credentials_path
        self.groq_client = Groq(api_key=groq_api_key)
        self.gc = None
        self.spreadsheet = None
        
        # Define the scope for Google Sheets and Drive APIs
        self.scope = [
            'https://spreadsheets.google.com/feeds',
            'https://www.googleapis.com/auth/drive'
        ]
        
        self._authenticate_google_sheets()
    
    def _authenticate_google_sheets(self):
        """Authenticate with Google Sheets API using service account credentials."""
        try:
            creds = Credentials.from_service_account_file(
                self.credentials_path, 
                scopes=self.scope
            )
            self.gc = gspread.authorize(creds)
            logger.info("Successfully authenticated with Google Sheets API")
        except Exception as e:
            logger.error(f"Failed to authenticate with Google Sheets API: {e}")
            raise
    
    def create_sample_sheet(self, sheet_name: str = "Company Analysis") -> str:
        """
        Create a sample Google Sheet with company names.
        
        Args:
            sheet_name (str): Name for the new spreadsheet
            
        Returns:
            str: URL of the created spreadsheet
        """
        try:
            # Sample company data with actual companies
            sample_companies = [
                ["Company Name", "Website", "Source"],
                ["Apple Inc.", "https://www.apple.com", "Fortune 500"],
                ["Microsoft Corporation", "https://www.microsoft.com", "Fortune 500"],
                ["Amazon.com Inc.", "https://www.amazon.com", "Fortune 500"],
                ["Alphabet Inc. (Google)", "https://www.google.com", "Fortune 500"],
                ["Tesla Inc.", "https://www.tesla.com", "NASDAQ"],
                ["Meta Platforms Inc. (Facebook)", "https://www.meta.com", "Fortune 500"],
                ["Netflix Inc.", "https://www.netflix.com", "NASDAQ"],
                ["Salesforce Inc.", "https://www.salesforce.com", "Fortune 500"],
                ["Adobe Inc.", "https://www.adobe.com", "NASDAQ"],
                ["Zoom Video Communications", "https://zoom.us", "NASDAQ"]
            ]
            
            # Create new spreadsheet
            spreadsheet = self.gc.create(sheet_name)
            
            # Get the first worksheet and populate it
            worksheet = spreadsheet.data
            worksheet.update('A1', sample_companies)
            
            # Format the header row
            worksheet.format('A1:C1', {
                "backgroundColor": {"red": 0.8, "green": 0.8, "blue": 0.8},
                "textFormat": {"bold": True}
            })
            
            logger.info(f"Created sample spreadsheet: {spreadsheet.url}")
            return spreadsheet.url
            
        except Exception as e:
            logger.error(f"Failed to create sample sheet: {e}")
            raise
    
    def open_spreadsheet(self, spreadsheet_url: str):
        """
        Open an existing Google Spreadsheet.
        
        Args:
            spreadsheet_url (str): URL of the Google Spreadsheet
        """
        try:
            self.spreadsheet = self.gc.open_by_url(spreadsheet_url)
            logger.info(f"Opened spreadsheet: {self.spreadsheet.title}")
        except Exception as e:
            logger.error(f"Failed to open spreadsheet: {e}")
            raise
    
    def read_companies(self, worksheet_name: str = "data") -> List[Dict]:
        """
        Read company data from the specified worksheet.
        
        Args:
            worksheet_name (str): Name of the worksheet to read from
            
        Returns:
            List[Dict]: List of company data dictionaries
        """
        try:
            worksheet = self.spreadsheet.worksheet(worksheet_name)
            data = worksheet.get_all_records()
            
            logger.info(f"Read {len(data)} companies from {worksheet_name}")
            return data
            
        except Exception as e:
            logger.error(f"Failed to read companies from {worksheet_name}: {e}")
            raise
    
    def generate_company_summary(self, company_data: Dict) -> str:
        """
        Generate a summary for a company using OpenAI GPT API.
        
        Args:
            company_data (Dict): Dictionary containing company information
            
        Returns:
            str: Generated company summary
        """
        company_name = company_data.get('Company Name', 'Unknown Company')
        website = company_data.get('Website', '')
        
        # Carefully designed prompt for reliable and consistent responses
        prompt = f"""
        Please provide a concise, professional summary of what {company_name} does as a business. 
        
        Company: {company_name}
        Website: {website}
        
        Your response should:
        1. Be 2-3 sentences maximum
        2. Focus on their primary business activities and services
        3. Be factual and based on publicly available information
        4. Use professional, business-appropriate language
        5. Avoid speculation or unverified claims
        
        Format your response as a single paragraph without any prefixes like "Summary:" or bullet points.
        
        If you cannot find reliable information about this company, respond with: "Information about this company's business activities is not readily available in public sources."
        """
        
        try:
            response = self.groq_client.chat.completions.create(
                model="llama3-8b-8192",
                messages=[
                    {
                        "role": "system", 
                        "content": "You are a business analyst providing accurate, concise company summaries based on publicly available information. Always be factual and professional."
                    },
                    {"role": "user", "content": prompt}
                ],
                max_tokens=150,
                temperature=0.3  # Lower temperature for more consistent, factual responses
            )
            
            summary = response.choices[0].message.content.strip()
            logger.info(f"Generated summary for {company_name}")
            
            # Add a small delay to respect API rate limits
            time.sleep(0.5)
            
            return summary
            
        except Exception as e:
            logger.error(f"Failed to generate summary for {company_name}: {e}")
            return f"Error generating summary: {str(e)}"
    
    def process_companies(self, input_worksheet: str = "data") -> List[Dict]:
        """
        Process all companies and generate summaries.
        
        Args:
            input_worksheet (str): Name of the input worksheet
            
        Returns:
            List[Dict]: List of companies with their summaries
        """
        companies = self.read_companies(input_worksheet)
        results = []
        
        logger.info(f"Starting to process {len(companies)} companies...")
        
        for i, company in enumerate(companies, 1):
            logger.info(f"Processing company {i}/{len(companies)}: {company.get('Company Name', 'Unknown')}")
            
            summary = self.generate_company_summary(company)
            
            result = {
                'Company Name': company.get('Company Name', ''),
                'Website': company.get('Website', ''),
                'Source': company.get('Source', ''),
                'Summary': summary,
                'Processed Date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            
            results.append(result)
        
        logger.info("Completed processing all companies")
        return results
    
    def write_summaries_to_sheet(self, summaries: List[Dict], output_worksheet: str = "Company Summaries"):
        """
        Write the company summaries to a new worksheet.
        
        Args:
            summaries (List[Dict]): List of company summaries
            output_worksheet (str): Name of the output worksheet
        """
        try:
            # Try to get existing worksheet, create if it doesn't exist
            try:
                worksheet = self.spreadsheet.worksheet(output_worksheet)
                worksheet.clear()  # Clear existing data
            except gspread.WorksheetNotFound:
                worksheet = self.spreadsheet.add_worksheet(
                    title=output_worksheet, 
                    rows=len(summaries) + 10, 
                    cols=6
                )
            
            # Prepare data for writing
            headers = ['Company Name', 'Website', 'Source', 'Summary', 'Processed Date']
            data = [headers]
            
            for summary in summaries:
                row = [
                    summary.get('Company Name', ''),
                    summary.get('Website', ''),
                    summary.get('Source', ''),
                    summary.get('Summary', ''),
                    summary.get('Processed Date', '')
                ]
                data.append(row)
            
            # Write data to worksheet
            worksheet.update('A1', data)
            
            # Format the header row
            worksheet.format('A1:E1', {
                "backgroundColor": {"red": 0.2, "green": 0.6, "blue": 0.8},
                "textFormat": {"bold": True, "foregroundColor": {"red": 1, "green": 1, "blue": 1}}
            })
            
            # Auto-resize columns
            worksheet.columns_auto_resize(0, len(headers))
            
            logger.info(f"Successfully wrote {len(summaries)} summaries to {output_worksheet}")
            
        except Exception as e:
            logger.error(f"Failed to write summaries to sheet: {e}")
            raise
    
    def run_full_analysis(self, spreadsheet_url: str, input_sheet: str = "data", output_sheet: str = "Company Summaries"):
        """
        Run the complete analysis pipeline.
        
        Args:
            spreadsheet_url (str): URL of the Google Spreadsheet
            input_sheet (str): Name of the input worksheet
            output_sheet (str): Name of the output worksheet
        """
        try:
            logger.info("Starting full company analysis pipeline...")
            
            # Open spreadsheet
            self.open_spreadsheet(spreadsheet_url)
            
            # Process companies
            summaries = self.process_companies(input_sheet)
            
            # Write results
            self.write_summaries_to_sheet(summaries, output_sheet)
            
            logger.info("Company analysis pipeline completed successfully!")
            print(f"\nAnalysis complete! Check the '{output_sheet}' tab in your Google Sheet.")
            print(f"Processed {len(summaries)} companies.")
            
        except Exception as e:
            logger.error(f"Analysis pipeline failed: {e}")
            raise


def main():
    """
    Main function to run the company summarizer.
    """
    # Configuration - these should be set as environment variables
    CREDENTIALS_PATH = os.getenv('GOOGLE_CREDENTIALS_PATH', 'credentials.json')
    GROQ_API_KEY = os.getenv('GROQ_API_KEY')
    SPREADSHEET_URL = os.getenv('SPREADSHEET_URL')
    
    if not GROQ_API_KEY:
        print("Error: GROQ_API_KEY environment variable not set")
        print("Please set your Groq API key: export GROQ_API_KEY='your-api-key-here'")
        return
    
    if not os.path.exists(CREDENTIALS_PATH):
        print(f"Error: Google credentials file not found at {CREDENTIALS_PATH}")
        print("Please download your Google Service Account credentials and save as 'credentials.json'")
        return
    
    try:
        # Initialize the summarizer
        summarizer = CompanySummarizer(CREDENTIALS_PATH, GROQ_API_KEY)
        
        # If no spreadsheet URL provided, create a sample one
        if not SPREADSHEET_URL:
            print("No spreadsheet URL provided. Creating a sample spreadsheet...")
            url = summarizer.create_sample_sheet("Company Analysis Sample")
            print(f"Sample spreadsheet created: {url}")
            print("You can now set SPREADSHEET_URL environment variable and run the analysis.")
            return
        
        # Run the full analysis
        summarizer.run_full_analysis(SPREADSHEET_URL)
        
    except Exception as e:
        logger.error(f"Application failed: {e}")
        print(f"Error: {e}")


if __name__ == "__main__":
    main()