import os
import json
import time
import requests
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.http.models import Filter, FieldCondition, MatchValue
from qdrant_client.http.models import VectorParams, Distance
from sentence_transformers import SentenceTransformer
from llama_cpp import Llama
load_dotenv()
QDRANT_URL       = os.getenv("QDRANT_URL")
QDRANT_API_KEY   = os.getenv("QDRANT_API_KEY")
COLLECTION_1     = "my_collection"
COLLECTION_2     = "acn"
EMBED_MODEL_NAME = "all-MiniLM-L6-v2"
EMBED_BATCH      = 16
LLAMA_MODEL_PATH = os.getenv("LLAMA_GGUF_PATH")  
LLAMA_N_CTX      = 2048
LLAMA_N_THREADS  = 4
SERPAPI_KEY      = os.getenv("SERPAPI_API_KEY")
SEARCH_ENGINE    = "google"   
SEARCH_NUM       = 5
SIM_THRESHOLD    = 0.3
for var in ["QDRANT_URL","QDRANT_API_KEY","LLAMA_GGUF_PATH","SERPAPI_API_KEY"]:
    if not os.getenv(var):
        raise RuntimeError(f"Please set {var} in your .env")
print("Initializing clients…")
qdrant = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY, timeout=30)
embedder = SentenceTransformer(EMBED_MODEL_NAME)
llm = Llama(
    model_path=LLAMA_MODEL_PATH,
    n_ctx=LLAMA_N_CTX,
    n_threads=LLAMA_N_THREADS,
)
def retrieve_contexts(query_embedding, top_k=3):
    """
    Search both collections, return merged contexts sorted by score.
    """
    results = []
    for coll in (COLLECTION_1, COLLECTION_2):
        hits = qdrant.search(
            collection_name=coll,
            query_vector=query_embedding,
            limit=top_k,
            with_payload=True
        )
        for h in hits:
            results.append({
                "collection": coll,
                "score": h.score,
                "payload": h.payload,
                "text": h.payload.get("text") or h.payload.get("section_text")
            })
    
    results.sort(key=lambda x: x["score"], reverse=True)
    return results[: top_k*2]
def generate_search_query(user_q):
    """
    Ask llama to produce short, effective search keywords/phrases.
    """
    prompt = f"""
You are a search query generator. Given the user question, extract or rewrite it into 3–5 concise search terms (comma-separated), focusing on the core concepts:
Question: "{user_q}"
Keywords:
"""
    resp = llm(prompt=prompt, max_tokens=64, stop=["\n"])
    return resp.replace("\n","").strip()
def web_search(keywords):
    params = {
        "engine": SEARCH_ENGINE,
        "q": keywords,
        "api_key": SERPAPI_KEY,
        "num": SEARCH_NUM,
    }
    r = requests.get("https://serpapi.com/search.json", params=params, timeout=10)
    data = r.json()
    snippets = []
    for res in data.get("organic_results", [])[:SEARCH_NUM]:
        title = res.get("title")
        snippet = res.get("snippet")
        link = res.get("link")
        snippets.append(f"{title} — {snippet} ({link})")
    return "\n".join(snippets)
def generate_answer(user_q, contexts, web_snippets=None):
    """
    Build a RAG prompt combining user question, retrieved contexts, and optional web snippets.
    """
    ctx_text = "\n\n".join(
        f"[{c['collection']} | score={c['score']:.3f}]\n{c['text']}"
        for c in contexts
    )
    web_section = f"\n\nWeb snippets:\n{web_snippets}" if web_snippets else ""
    prompt = f"""
You are an aircraft maintenance assistant. Use the following context to answer the question as accurately and concisely as possible.
Context:
{ctx_text}{web_section}
Question:
{user_q}
Answer:
"""
    out = llm(prompt=prompt, max_tokens=512, temperature=0.0)
    return out.strip()
def rag_pipeline(user_q):
    q_emb = embedder.encode([user_q], normalize_embeddings=True)[0]
    contexts = retrieve_contexts(q_emb, top_k=3)
    if not contexts or contexts[0]["score"] < SIM_THRESHOLD:
        print("[⚠️] Low similarity, falling back to web search…")
        
        kws = generate_search_query(user_q)
        print(f"Generated search keywords: {kws}")
        
        web_snips = web_search(kws)
        
        return generate_answer(user_q, contexts[:1], web_snips)
    else:
        
        return generate_answer(user_q, contexts)
if __name__ == "__main__":
    print("RAG pipeline ready. Enter your question (CTRL+C to quit).")
    try:
        while True:
            q = input("\n> ").strip()
            if not q:
                continue
            start = time.time()
            answer = rag_pipeline(q)
            print(f"\n— Answer (in {time.time()-start:.2f}s) —\n{answer}\n")
    except KeyboardInterrupt:
        print("\nGoodbye!")
