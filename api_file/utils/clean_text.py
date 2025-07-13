import re
import nltk
nltk.download('punkt_tab')
nltk.download('stopwords')
nltk.download('wordnet')
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

def clean_text(txt):
    if not isinstance(txt, str):
        return ""
    cleantxt = re.sub(r'http\S+', '', txt)
    cleantxt = re.sub(r'[^a-zA-Z\s]', '', cleantxt)
    cleantxt = cleantxt.lower()
    tokens = word_tokenize(cleantxt)
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(word) for word in tokens if word not in stopwords.words('english')]
    return ' '.join(tokens)