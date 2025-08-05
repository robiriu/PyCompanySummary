# Company Summarizer

A Python script that automatically reads company names from a Google Sheet, generates AI-powered summaries of what each company does using OpenAI's GPT API, and outputs the results to a new tab in the same Google Sheet.

## Features

-  **Google Sheets Integration**: Seamlessly reads from and writes to Google Sheets
-  **AI-Powered Summaries**: Uses OpenAI GPT to generate concise company descriptions
-  **Automated Processing**: Processes multiple companies in batch with rate limiting
-  **Comprehensive Logging**: Detailed logging for monitoring and debugging
-  **Error Handling**: Robust error handling and recovery mechanisms
-  **Sample Data**: Automatically creates sample spreadsheets with real company data

## Quick Start

### Prerequisites

1. **Python 3.8+** installed on your system
2. **Google Cloud Project** with Sheets API enabled
3. **OpenAI API key**

### Installation

1. Clone or download this repository:
```bash
git clone <repository-url>
cd PyCompanySummary
```

2. Install required dependencies:
```bash
pip install -r requirements.txt
```

3. Set up Google Sheets API credentials (see detailed setup below)

4. Set your OpenAI API key as an environment variable:
```bash
export OPENAI_API_KEY="your-openai-api-key-here"
```

5. Run the script:
```bash
python company_summarizer.py
```

## Detailed Setup

### Google Sheets API Setup

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Required APIs**:
   - Enable Google Sheets API
   - Enable Google Drive API

3. **Create Service Account**:
   - Go to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Give it a name like "company-summarizer"
   - Grant it "Editor" role (or create custom role with Sheets access)

4. **Download Credentials**:
   - Click on your service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create New Key" > "JSON"
   - Download the JSON file and save it as `credentials.json` in your project directory

5. **Share Your Google Sheet**:
   - Open your Google Sheet
   - Click "Share"
   - Add the service account email (found in credentials.json) with "Editor" permissions

### OpenAI API Setup

1. **Get API Key**:
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Create an account or log in
   - Go to API Keys section
   - Create a new API key

2. **Set Environment Variable**:
```bash
# On Linux/Mac
export OPENAI_API_KEY="your-api-key-here"

# On Windows
set OPENAI_API_KEY=your-api-key-here
```

## Usage

### Option 1: Create Sample Spreadsheet

If you don't have a spreadsheet ready, the script can create one for you:

```bash
python company_summarizer.py
```

This will create a sample Google Sheet with 10 well-known companies and provide you with the URL.

### Option 2: Use Existing Spreadsheet

If you have an existing spreadsheet:

```bash
export SPREADSHEET_URL="https://docs.google.com/spreadsheets/d/your-sheet-id/edit"
python company_summarizer.py
```

### Expected Input Format

Your Google Sheet should have the following columns in the first tab:
- **Company Name** (required): The name of the company
- **Website** (optional): Company website URL
- **Source** (optional): Where you found this company information

Example:
| Company Name | Website | Source |
|-------------|---------|---------|
| Apple Inc. | https://www.apple.com | Fortune 500 |
| Microsoft Corporation | https://www.microsoft.com | Fortune 500 |

### Output

The script creates a new tab called "Company Summaries" with:
- All original company information
- **Summary**: AI-generated company description
- **Processed Date**: When the summary was generated

## Prompt Design and Approach

### Prompt Engineering Strategy

The AI prompt was carefully designed to ensure reliable, consistent, and professional responses:

#### 1. **Structured Instructions**
```
Your response should:
1. Be 2-3 sentences maximum
2. Focus on their primary business activities and services
3. Be factual and based on publicly available information
4. Use professional, business-appropriate language
5. Avoid speculation or unverified claims
```

**Rationale**: Clear, numbered instructions help the AI understand exactly what's expected, reducing variability in responses.

#### 2. **Context Provision**
```
Company: {company_name}
Website: {website}
```

**Rationale**: Providing structured context helps the AI focus on the specific company and use the website as a reference point.

#### 3. **Output Format Control**
```
Format your response as a single paragraph without any prefixes like "Summary:" or bullet points.
```

**Rationale**: Ensures consistent formatting that integrates well with spreadsheet data.

#### 4. **Fallback Handling**
```
If you cannot find reliable information about this company, respond with: "Information about this company's business activities is not readily available in public sources."
```

**Rationale**: Provides a standardized response for edge cases, maintaining data quality.

#### 5. **System Message**
```
You are a business analyst providing accurate, concise company summaries based on publicly available information. Always be factual and professional.
```

**Rationale**: Sets the AI's role and tone, encouraging professional, factual responses.

### Technical Parameters

- **Model**: GPT-3.5-turbo (cost-effective, suitable for this task)
- **Temperature**: 0.3 (lower temperature for more consistent, factual responses)
- **Max Tokens**: 150 (ensures concise responses)
- **Rate Limiting**: 0.5-second delay between requests

### Quality Assurance Measures

1. **Error Handling**: Each API call is wrapped in try-catch blocks
2. **Logging**: Comprehensive logging tracks all operations
3. **Validation**: Input validation ensures required fields are present
4. **Retry Logic**: Built-in delays respect API rate limits
5. **Fallback Responses**: Graceful handling of API failures

## Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `GOOGLE_CREDENTIALS_PATH`: Path to Google credentials JSON (default: "credentials.json")
- `SPREADSHEET_URL`: URL of your Google Spreadsheet (optional for sample creation)

### Customization

You can modify the script behavior by editing these parameters in `company_summarizer.py`:

```python
# Model selection
model="gpt-3.5-turbo"  # or "gpt-4" for higher quality

# Response parameters
max_tokens=150         # Increase for longer summaries
temperature=0.3        # Increase for more creative responses

# Rate limiting
time.sleep(0.5)        # Adjust delay between API calls
```

## File Structure

```
PyCompanySummary/
├── company_summarizer.py    # Main Python script
├── requirements.txt         # Python dependencies
├── setup.py                # Setup verification script
├── example_usage.py        # Usage examples
├── README.md               # This documentation
├── DEPLOYMENT.md           # Demo deployment instructions
├── credentials.json        # Google API credentials (you create this)
├── company_summarizer.log  # Log file (created automatically)
├── .env                    # Environment variables (optional)
│
├── Demo Website (Next.js):
├── app/
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main demo page
├── package.json            # Node.js dependencies for demo
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vercel.json             # Vercel deployment configuration
```

## Troubleshooting

### Common Issues

1. **"Google credentials file not found"**
   - Ensure `credentials.json` is in the project directory
   - Check the file path in the error message

2. **"Failed to authenticate with Google Sheets API"**
   - Verify your service account has the correct permissions
   - Ensure the Google Sheets and Drive APIs are enabled

3. **"OpenAI API key not set"**
   - Set the environment variable: `export OPENAI_API_KEY="your-key"`
   - Check that the key is valid and has sufficient credits

4. **"Permission denied" on Google Sheets**
   - Share your spreadsheet with the service account email
   - Grant "Editor" permissions

5. **Rate limit errors**
   - The script includes automatic rate limiting
   - If you still hit limits, increase the delay in the code

### Logs

Check `company_summarizer.log` for detailed information about script execution, errors, and API calls.

## Cost Considerations

- **OpenAI API**: Approximately $0.002 per company summary (GPT-3.5-turbo)
- **Google Sheets API**: Free for most use cases (100 requests per 100 seconds per user)

For 100 companies: ~$0.20 in OpenAI costs.

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive data
3. **Restrict service account permissions** to minimum required
4. **Regularly rotate API keys**
5. **Monitor API usage** for unexpected charges

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve this tool.

## License

This project is provided as-is for educational and commercial use. Please ensure compliance with OpenAI's and Google's terms of service when using their APIs.

---

**Need Help?** Check the troubleshooting section above or review the logs for detailed error information.
## Demo

To showcase how the Company Summarizer script works, I have built a simple and professional web interface that demonstrates the functionality in action. This demo website simulates the actual script behavior and shows the results in a user-friendly format.

### Live Demo

The demo is deployed on Vercel and connected to this GitHub repository. You can view it at: [Company Summarizer Demo](https://your-vercel-deployment-url.vercel.app)

### Demo Features

- **Interactive Interface**: Shows the company analysis process in real-time
- **Sample Data**: Pre-loaded with real companies (Apple, Microsoft, Amazon, etc.)
- **Processing Simulation**: Demonstrates how the script processes each company
- **Results Display**: Shows AI-generated summaries in a clean, professional table
- **Status Tracking**: Visual indicators for pending, processing, and completed analyses

### How the Demo Works

The demo website is built using Next.js and deployed on Vercel. It simulates the actual Python script functionality:

1. **Input Simulation**: Shows sample company data that would normally be read from Google Sheets
2. **Processing Animation**: Demonstrates the AI analysis process with realistic timing
3. **Results Presentation**: Displays the summaries in a format similar to what appears in Google Sheets
4. **Export Functionality**: Shows how results can be exported (simulated)

### Important Note

This is a **demonstration only**. The actual Company Summarizer script (`company_summarizer.py`) operates differently:

- **Real Google Sheets Integration**: Reads from and writes to actual Google Spreadsheets
- **Live OpenAI API**: Makes real API calls to generate company summaries
- **Persistent Data**: Results are saved to your Google Drive
- **Production Features**: Includes error handling, logging, and rate limiting

The demo serves as a visual representation of what the script accomplishes, making it easier to understand the workflow and results before setting up the full Python environment.

### Running the Demo Locally

If you want to run the demo website locally:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The demo website files are separate from the main Python script and do not interfere with the core functionality.

---