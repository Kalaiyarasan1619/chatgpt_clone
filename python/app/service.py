import requests
import os

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
                
                

def get_ai_response(message: str):
    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
           json={
    "model": "llama-3.3-70b-versatile",
    "messages": [
        {"role": "user", "content": message}
    ]
}
        )

        print(response.status_code)
        print(response.text)

        result = response.json()

        return result["choices"][0]["message"]["content"]

    except Exception as e:
        return f"Error: {str(e)}"