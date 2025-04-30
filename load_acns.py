import os
import json
import uuid
import re
from pathlib import Path
from dotenv import load_dotenv
from tqdm import tqdm

from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams, PointStruct

# --- CONFIG ---
load_dotenv()

QDRANT_URL      = os.getenv("QDRANT_URL")
QDRANT_API_KEY  = os.getenv("QDRANT_API_KEY")
COLLECTION_NAME = "acn"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
JSON_PATH       = Path("acn.json")
BATCH_SIZE      = 64

# --- VALIDATE ---
if not QDRANT_URL or not QDRANT_API_KEY:
    raise ValueError("Please set QDRANT_URL and QDRANT_API_KEY in your .env")
if not JSON_PATH.is_file():
    raise FileNotFoundError(f"Could not find {JSON_PATH}")

# --- CLEANING FUNCTION ---
def clean_text(text: str) -> str:
    # Remove 'ACN: <digits>' headers
    text = re.sub(r'ACN:\s*\d+', '', text)
    # Drop standalone numeric tokens length >=5
    text = re.sub(r'\b\d{5,}\b', '', text)
    # Collapse whitespace
    return re.sub(r'\s+', ' ', text).strip()

# --- SYNOPSIS EXTRACTOR ---
def extract_synopsis(text: str) -> str:
    """
    Extracts the text under 'Synopsis' (case-insensitive) to the end of the document.
    If no 'Synopsis' header is found, returns an empty string.
    """
    match = re.search(r'(?i)\bSynopsis\b\s*[:\-]?\s*(.*)', text, flags=re.DOTALL)
    if match:
        # grab everything after the header
        return match.group(1).strip()
    return ""

# --- MAIN INGESTION ---
def main():
    # 1. Load ACN JSON
    with open(JSON_PATH, encoding="utf-8") as f:
        sections = json.load(f)

    # 2. Load SBERT
    print("Loading embedding model...")
    embedder = SentenceTransformer(EMBEDDING_MODEL)
    dim = embedder.get_sentence_embedding_dimension()

    # 3. Connect & recreate Qdrant collection
    print(f"Connecting to Qdrant at {QDRANT_URL}...")
    client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY, timeout=60)
    print(f"Recreating collection '{COLLECTION_NAME}'...")
    client.recreate_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=dim, distance=Distance.COSINE),
    )

    # 4. Build PointStructs with full payload
    points = []
    for sec in tqdm(sections, desc="Preparing ACN points"):
        acn     = sec["acn"]
        raw_txt = sec["text"]

        cleaned = clean_text(raw_txt)
        synp    = extract_synopsis(raw_txt)

        # Print so you can verify
        print(f"\n--- ACN {acn} ---")
        print("Cleaned text to embed:")
        print(cleaned[:200] + ("…" if len(cleaned)>200 else ""))
        print("Extracted synp:")
        print(synp[:200] + ("…" if len(synp)>200 else ""))
        print("-------------------\n")

        # Embed the cleaned text
        vec = embedder.encode(cleaned, show_progress_bar=False).tolist()

        # Unique numeric ID
        pid = uuid.uuid4().int >> 64

        # **Full payload including synp**
        payload = {
            "acn": acn,
            "text_chunk": cleaned,
            "synp": synp
        }

        points.append(PointStruct(id=pid, vector=vec, payload=payload))

    # 5. Upsert in batches (overwrite existing IDs)
    print(f"Upserting {len(points)} points into '{COLLECTION_NAME}'...")
    for i in tqdm(range(0, len(points), BATCH_SIZE), desc="Upserting batches"):
        batch = points[i : i + BATCH_SIZE]
        client.upsert(
            collection_name=COLLECTION_NAME,
            points=batch,
            wait=True,         # wait until operation completes
            ordering="strong"  # strongest ordering guarantee
        )

    print("✅ Done. ACN collection updated with text_chunk + synp payload.")

if __name__ == "__main__":
    main()
