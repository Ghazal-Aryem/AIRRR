from aiobotocore.session import get_session
import docx2txt
import fitz
from fastapi import  HTTPException
import  io
import os
from anyio.to_thread import run_sync
import tempfile

async def extract_text_from_s3(file_key: str) -> str:
    if not file_key:
        raise HTTPException(status_code=400, detail="S3 file key is missing or invalid.")
    try:
        # Create an async session
        session = get_session()

        # Fetch the file from S3 using the session
        async with session.create_client('s3') as client:
            bucket_name = "jd-cv"
            print(f"Fetching file from S3 with key: {file_key}")

            # Fetch the file from S3
            file_obj = await client.get_object(Bucket=bucket_name, Key=file_key)
            file_content = await file_obj['Body'].read()

            # Convert the file content into a BytesIO object
            file_like_object = io.BytesIO(file_content)

            # Determine the file type based on file extension and extract text accordingly
            if file_key.endswith('.pdf'):
                try:
                    # PDF extraction using PyMuPDF (fitz)
                    pdf_file = fitz.open(stream=file_content, filetype="pdf")  # Open the PDF stream
                    text = ""
                    for page_num in range(pdf_file.page_count):
                        page = pdf_file.load_page(page_num)  # Load each page
                        text += page.get_text()  # Extract text from each page

                    if not text.strip():
                        raise ValueError("No text extracted from PDF")
                    return text
                except Exception as e:
                    raise HTTPException(status_code=500, detail=f"Error extracting PDF text from AWS S3: {e}")

            elif file_key.endswith('.docx'):
                try:
                    # Create a secure temporary directory
                    with tempfile.TemporaryDirectory() as temp_dir:
                        temp_file_path = os.path.join(temp_dir, "temp.docx")
                        # Write content to the temporary file
                        with open(temp_file_path, "wb") as temp_file:
                            temp_file.write(file_like_object.getvalue())
                        # Use docx2txt to extract text from the file
                        text = await run_sync(docx2txt.process, temp_file_path)
                    if not text.strip():
                        raise ValueError("No text extracted from DOCX .")
                    return text
                except Exception as e:
                    raise HTTPException(status_code=500, detail=f"Error extracting DOCX text from AWS S3 : {e}")

            elif file_key.endswith('.txt'):
                try:
                    # Text files are read synchronously
                    text = file_like_object.read().decode('utf-8')  # Read and decode file content
                    return text
                except Exception as e:
                    raise HTTPException(status_code=500, detail=f"Error extracting TXT text from AWS S3: {e}")

            else:
                raise HTTPException(status_code=400,
                                     detail="Unsupported file type. Please upload a PDF, DOCX, or TXT file.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting S3 file: {e}")
