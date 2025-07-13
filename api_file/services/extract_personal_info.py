import re
def Extract_personal_info(doc_text):
    personal_info = {"name": None, "email": None, "phone": None, "linkedin": None}
    # Name Extraction (requires "name" label or two capitalized words)
    name_pattern = r'\b(?:name[:\s\-]*)?([A-Z][a-z]+\s[A-Z][a-z]+)\b'
    name_match = re.search(name_pattern, doc_text)
    if name_match:
        personal_info["name"] = name_match.group(1)
    # Email Extraction
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b'
    email_match = re.search(email_pattern, doc_text)
    if email_match:
        personal_info["email"] = email_match.group()
    # Flexible Phone Extraction with Standard Formatting
    phone_pattern = r'\b(?:\+?\d{1,3})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b|\b\d{10}\b'
    phone_match = re.search(phone_pattern, doc_text)
    if phone_match:
        # Normalize the phone number format
        raw_phone = phone_match.group()
        formatted_phone = re.sub(r'[^\d]', '', raw_phone)  # Remove non-digit characters
        if len(formatted_phone) == 10:
            personal_info["phone"] = f"({formatted_phone[:3]}) {formatted_phone[3:6]}-{formatted_phone[6:]}"
        elif len(formatted_phone) == 11 and formatted_phone.startswith('1'):  # Handle country code
            personal_info["phone"] = f"+1 ({formatted_phone[1:4]}) {formatted_phone[4:7]}-{formatted_phone[7:]}"
        else:
            personal_info["phone"] = raw_phone  # Fallback to raw if formatting fails

    # LinkedIn URL Extraction
    linkedin_pattern = r'\b(?:https?://)?(?:www\.)?linkedin\.com/in/([A-Za-z0-9-]+)\b'
    linkedin_match = re.search(linkedin_pattern, doc_text)
    if linkedin_match:
        personal_info["linkedin"] = f"https://www.linkedin.com/in/{linkedin_match.group(1)}"

    return personal_info