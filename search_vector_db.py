import os
import requests
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

# --- CONFIG ---
load_dotenv()
QDRANT_URL      = os.getenv("QDRANT_URL").rstrip("/")  
QDRANT_API_KEY  = os.getenv("QDRANT_API_KEY")
EMBED_MODEL     = "all-MiniLM-L6-v2"
COLLS           = ["acn", "aircraft_maintenance_logs"]
TOP_K           = 2

HEADERS = {
    "Content-Type": "application/json",
    "api-key": QDRANT_API_KEY
}

# --- INIT EMBEDDER ---
embedder = SentenceTransformer(EMBED_MODEL)

# --- SAMPLE TECHNICIAN QUERY ---
query = (
    "During a high-altitude cruie at FL350, the #2 engine’s N1 spool dropped by 8% "
    "within 30 seconds, accompanied by a low-oil-pressure EICAS advisory and faint "
    "metallic vibration—what step-by-step troubleshooting should be applied?"
)
qvec = embedder.encode([query], normalize_embeddings=True)[0].tolist()

def search_collection(collection_name: str, vector: list, top_k: int):
    url = f"{QDRANT_URL}/collections/{collection_name}/points/search"
    body = {
        "vector": vector,
        "limit": top_k,
        "with_payload": True
    }
    resp = requests.post(url, headers=HEADERS, json=body, timeout=10)
    resp.raise_for_status()
    return resp.json().get("result", [])

# --- RUN & PRINT RESULTS ---
for coll in COLLS:
    print(f"\n=== Top {TOP_K} from '{coll}' ===")
    results = search_collection(coll, qvec, TOP_K)

    for idx, hit in enumerate(results, start=1):
        payload = hit.get("payload", {})
        score   = hit.get("score", 0)
        identifier = payload.get("acn") or hit.get("id")
        
        print(f"{idx}. ID: {identifier}  |  Score: {score:.3f}")
        print("----")
        
        if coll == "acn":
            text_chunk = payload.get("text_chunk", "<no text stored>")
            synp       = payload.get("synp", "")
            print("Text chunk:")
            print(text_chunk)
            if synp:
                print("\nSynopsis:")
                print(synp)
        else:  # aircraft_maintenance_logs
            problem = payload.get("problem", "<no problem stored>")
            action  = payload.get("action", "<no action stored>")
            print("Problem:")
            print(problem)
            print("\nAction:")
            print(action)
        
        print("----")
