#!/usr/bin/env python3
"""
Setup script for Company Summarizer
Helps users get started quickly with the necessary setup steps.
"""

import os
import sys
import subprocess
import json

def check_python_version():
    """Check if Python version is 3.8 or higher."""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required.")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version.split()[0]}")
    return True

def install_requirements():
    """Install required packages."""
    try:
        print("📦 Installing required packages...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully!")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to install requirements.")
        return False

def check_credentials():
    """Check if Google credentials file exists."""
    if os.path.exists("credentials.json"):
        print("✅ Google credentials file found.")
        return True
    else:
        print("⚠️  Google credentials file (credentials.json) not found.")
        print("Please download your Google Service Account credentials and save as 'credentials.json'")
        return False

def check_env_variables():
    """Check environment variables."""
    openai_key = os.getenv('OPENAI_API_KEY')
    if openai_key:
        print("✅ OPENAI_API_KEY environment variable is set.")
        return True
    else:
        print("⚠️  OPENAI_API_KEY environment variable not set.")
        print("Please set your OpenAI API key:")
        print("export OPENAI_API_KEY='your-api-key-here'")
        return False

def create_env_file():
    """Create .env file from template if it doesn't exist."""
    if not os.path.exists('.env') and os.path.exists('.env.template'):
        try:
            with open('.env.template', 'r') as template:
                content = template.read()
            with open('.env', 'w') as env_file:
                env_file.write(content)
            print("✅ Created .env file from template. Please edit it with your actual values.")
        except Exception as e:
            print(f"⚠️  Could not create .env file: {e}")

def main():
    """Run the setup process."""
    print("🚀 Company Summarizer Setup")
    print("=" * 40)
    
    all_good = True
    
    # Check Python version
    if not check_python_version():
        all_good = False
    
    # Install requirements
    if not install_requirements():
        all_good = False
    
    # Create .env file
    create_env_file()
    
    # Check credentials
    if not check_credentials():
        all_good = False
    
    # Check environment variables
    if not check_env_variables():
        all_good = False
    
    print("\n" + "=" * 40)
    if all_good:
        print("🎉 Setup complete! You're ready to run the company summarizer.")
        print("Run: python company_summarizer.py")
    else:
        print("⚠️  Setup incomplete. Please address the issues above.")
        print("Check the README.md for detailed setup instructions.")

if __name__ == "__main__":
    main()