from bson import ObjectId
from datetime import datetime
from bson import Timestamp
def serialize_document(doc):
    if isinstance(doc, dict):
        return {k: serialize_document(v) for k, v in doc.items()}
    elif isinstance(doc, list):
        return [serialize_document(item) for item in doc]
    elif isinstance(doc, ObjectId):
        return str(doc)
    elif isinstance(doc, Timestamp):
        return doc.as_datetime()
    elif isinstance(doc, datetime):
        return doc.isoformat()
    elif isinstance(doc, bytes):
        return doc.decode(errors='ignore')
    else:
        return doc