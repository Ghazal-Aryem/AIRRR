from fastapi import HTTPException

async def extract_text_txt(file_content: bytes) -> str:
    try:
        text = file_content.decode('utf-8')  # Decode bytes directly
        if not text.strip():
            raise ValueError("No text extracted from TXT.")
        return text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting TXT text: {e}")