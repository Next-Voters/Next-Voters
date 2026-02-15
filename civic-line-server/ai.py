from openai import OpenAI
from os import getenv

_client = None

def loadPrompt(fileName):
    with open(fileName, "r", encoding="utf-8") as file:
        return file.read()

def initializeClient():
    global _client
    if _client is not None:
        open_ai_key = getenv("OPENAI_KEY")
        _client = OpenAI(api_key=open_ai_key)
    return _client
    
