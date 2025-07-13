import tempfile
import os
import io
from anyio.to_thread import run_sync
import docx2txt
from fastapi import HTTPException

base_temp_dir = os.path.join(os.path.expanduser("~"), "my_temp_dir")
os.makedirs(base_temp_dir, exist_ok=True)
async def extract_text_docx(file_content: bytes) -> str:
    try:

        with tempfile.TemporaryDirectory(dir=base_temp_dir) as temp_directory:
            temp_file_path = os.path.join(temp_directory, "temp.docx")

            with open(temp_file_path, "wb") as temp_file:
                temp_file.write(file_content)
            text = await run_sync(docx2txt.process, temp_file_path)
        if not text.strip():
            raise ValueError("No text extracted from DOCX.")
        return text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting DOCX text: {e}")