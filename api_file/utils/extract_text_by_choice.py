import io
from fastapi import HTTPException
from utils.extract_from_pdf import extract_text_pdf
from utils.extract_from_docx import extract_text_docx
from utils.extract_from_txt import extract_text_txt
from fastapi import  File, UploadFile

async def extract_text_choice(file: UploadFile) -> str:
    try:
        # Read file content
        content = await file.read()
        # Process based on file type
        if file.filename.endswith('.pdf'):
            return await extract_text_pdf(content)
        elif file.filename.endswith('.docx'):
            return await extract_text_docx(content)
        elif file.filename.endswith('.txt'):
            return await extract_text_txt(content)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file extension.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting text: {e}")