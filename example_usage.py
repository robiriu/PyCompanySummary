#!/usr/bin/env python3
"""
Example usage of the CompanySummarizer class
This script demonstrates how to use the company summarizer programmatically.
"""

import os
from company_summarizer import CompanySummarizer

def example_create_and_analyze():
    """Example: Create a sample sheet and analyze companies."""
    
    # Configuration
    CREDENTIALS_PATH = "credentials.json"
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    
    if not OPENAI_API_KEY:
        print("Please set OPENAI_API_KEY environment variable")
        return
    
    if not os.path.exists(CREDENTIALS_PATH):
        print(f"Please ensure {CREDENTIALS_PATH} exists")
        return
    
    try:
        # Initialize the summarizer
        summarizer = CompanySummarizer(CREDENTIALS_PATH, OPENAI_API_KEY)
        
        # Create a sample spreadsheet
        print("Creating sample spreadsheet...")
        spreadsheet_url = summarizer.create_sample_sheet("My Company Analysis")
        print(f"Sample spreadsheet created: {spreadsheet_url}")
        
        # Analyze the companies
        print("Starting analysis...")
        summarizer.run_full_analysis(spreadsheet_url)
        
        print("Analysis complete! Check your Google Sheet for results.")
        
    except Exception as e:
        print(f"Error: {e}")

def example_analyze_existing_sheet():
    """Example: Analyze an existing Google Sheet."""
    
    # Configuration
    CREDENTIALS_PATH = "credentials.json"
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    SPREADSHEET_URL = os.getenv('SPREADSHEET_URL')
    
    if not all([OPENAI_API_KEY, SPREADSHEET_URL]):
        print("Please set OPENAI_API_KEY and SPREADSHEET_URL environment variables")
        return
    
    if not os.path.exists(CREDENTIALS_PATH):
        print(f"Please ensure {CREDENTIALS_PATH} exists")
        return
    
    try:
        # Initialize the summarizer
        summarizer = CompanySummarizer(CREDENTIALS_PATH, OPENAI_API_KEY)
        
        # Analyze the existing spreadsheet
        print("Analyzing existing spreadsheet...")
        summarizer.run_full_analysis(SPREADSHEET_URL)
        
        print("Analysis complete!")
        
    except Exception as e:
        print(f"Error: {e}")

def example_custom_processing():
    """Example: Custom processing with more control."""
    
    # Configuration
    CREDENTIALS_PATH = "credentials.json"
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    SPREADSHEET_URL = os.getenv('SPREADSHEET_URL')
    
    if not all([OPENAI_API_KEY, SPREADSHEET_URL]):
        print("Please set OPENAI_API_KEY and SPREADSHEET_URL environment variables")
        return
    
    try:
        # Initialize the summarizer
        summarizer = CompanySummarizer(CREDENTIALS_PATH, OPENAI_API_KEY)
        
        # Open the spreadsheet
        summarizer.open_spreadsheet(SPREADSHEET_URL)
        
        # Read companies
        companies = summarizer.read_companies("Sheet1")
        print(f"Found {len(companies)} companies")
        
        # Process only the first 3 companies (for testing)
        limited_companies = companies[:3]
        summaries = []
        
        for company in limited_companies:
            summary = summarizer.generate_company_summary(company)
            result = {
                'Company Name': company.get('Company Name', ''),
                'Website': company.get('Website', ''),
                'Source': company.get('Source', ''),
                'Summary': summary,
                'Processed Date': '2024-01-01'  # Custom date
            }
            summaries.append(result)
        
        # Write results to a custom sheet name
        summarizer.write_summaries_to_sheet(summaries, "Test Results")
        
        print("Custom processing complete!")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("Company Summarizer Examples")
    print("=" * 30)
    print("1. Create sample sheet and analyze")
    print("2. Analyze existing sheet")
    print("3. Custom processing example")
    
    choice = input("\nEnter your choice (1-3): ").strip()
    
    if choice == "1":
        example_create_and_analyze()
    elif choice == "2":
        example_analyze_existing_sheet()
    elif choice == "3":
        example_custom_processing()
    else:
        print("Invalid choice. Please run again and select 1, 2, or 3.")