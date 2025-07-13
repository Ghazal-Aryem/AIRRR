from numpy.linalg import norm
import nltk
nltk.download('punkt_tab')
from models.model_loader import matching_model
from nltk.tokenize import word_tokenize
import numpy as np

def calculate_similarity(input_CV: str, input_JD: str):
    v1 = matching_model.infer_vector(word_tokenize(input_CV))
    v2 = matching_model.infer_vector(word_tokenize(input_JD))
    similarity = 100 * (np.dot(v1, v2) / (norm(v1) * norm(v2)))
    return similarity