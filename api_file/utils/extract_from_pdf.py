import io
import fitz
from fastapi import HTTPException

async def extract_text_pdf(file_content: bytes) -> str:
    try:
        pdf_file = io.BytesIO(file_content)  # Use BytesIO for PDF content
        text = ""
        with fitz.open(stream=pdf_file, filetype="pdf") as doc:
            for page in doc:
                text += page.get_text()
        if not text.strip():
            raise ValueError("No text extracted from PDF.")
        return text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting PDF text: {e}")