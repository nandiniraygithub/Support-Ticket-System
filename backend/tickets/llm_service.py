import os
import json
from openai import OpenAI
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def classify_description(description):
    """
    Calls LLM (Gemini or OpenAI) to auto-suggest category and priority.
    """
    prompt = f"""
    You are a support ticket classification assistant. 
    Analyze the following support ticket description and suggest the most appropriate category and priority level.
    
    Available Categories: billing, technical, account, general
    Available Priorities: low, medium, high, critical
    
    Response must be ONLY a valid JSON object with keys: "suggested_category" and "suggested_priority".
    
    Description: {description}
    """

    # Get keys from .env file
    gemini_key = os.getenv("GOOGLE_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")

    # Anti-confusion logic: If user pasted a Google key (starts with AIza) 
    # into the OpenAI field, use it as Gemini.
    if not gemini_key and openai_key and openai_key.startswith("AIza"):
        gemini_key = openai_key

    if gemini_key:
        try:
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt)
            # Find the JSON part in case Gemini adds markdown backticks
            text = response.text
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            elif "```" in text:
                text = text.split("```")[1].split("```")[0]
            return json.loads(text.strip())
        except Exception as e:
            print(f"Gemini Error: {e}")

    # Fallback to OpenAI if key is available
    if openai_key:
        try:
            client = OpenAI(api_key=openai_key)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                response_format={ "type": "json_object" }
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"OpenAI Error: {e}")

    # Final fallback to keyword-based logic if both LLMs fail
    return fallback_classification(description)

def fallback_classification(description):
    desc_lower = description.lower()
    category = "general"
    priority = "low"
    
    if "bill" in desc_lower or "payment" in desc_lower or "refund" in desc_lower:
        category = "billing"
    elif "password" in desc_lower or "login" in desc_lower or "access" in desc_lower:
        category = "account"
    elif "crash" in desc_lower or "error" in desc_lower or "bug" in desc_lower or "not working" in desc_lower:
        category = "technical"
        priority = "medium"
    
    if "urgent" in desc_lower or "critical" in desc_lower or "blocking" in desc_lower:
        priority = "critical"
    elif "important" in desc_lower:
        priority = "high"
        
    return {
        "suggested_category": category,
        "suggested_priority": priority
    }
