import os
import pandas as pd
import fitz 
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient, models
from qdrant_client.http.models import Distance, VectorParams, PointStruct
from dotenv import load_dotenv
from pathlib import Path
import uuid
from tqdm import tqdm
import time


load_dotenv() 

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
COLLECTION_NAME = "aircraft_maintenance_logs" 
EMBEDDING_MODEL_NAME = 'all-MiniLM-L6-v2' 
CSV_FILE_PATH = "maintenance.csv" 
PDF_FOLDER_PATH = "data/docs"   
BATCH_SIZE = 64 


if not QDRANT_URL or not QDRANT_API_KEY:
    raise ValueError("QDRANT_URL and QDRANT_API_KEY must be set in the .env file")
if not Path(CSV_FILE_PATH).is_file():
     print(f"Warning: CSV file not found at {CSV_FILE_PATH}. Skipping CSV processing.")
     
     
if not Path(PDF_FOLDER_PATH).is_dir():
    print(f"Warning: PDF folder not found at {PDF_FOLDER_PATH}. Skipping PDF processing.")
    
    



def extract_text_from_pdf(pdf_path: Path) -> str:
    """Extracts text from a single PDF file."""
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text += page.get_text("text") 
        doc.close()
        return text.strip()
    except Exception as e:
        print(f"Error processing PDF {pdf_path.name}: {e}")
        return "" 


def process_data():
    """Loads, processes, embeds, and uploads data."""
    processed_data = [] 

    
    if Path(CSV_FILE_PATH).is_file():
        try:
            print(f"Processing CSV file: {CSV_FILE_PATH}")
            df = pd.read_csv(CSV_FILE_PATH)
            
            if 'processed_problem' in df.columns and 'processed_action' in df.columns:
                 
                df['processed_problem'] = df['processed_problem'].fillna('')
                df['processed_action'] = df['processed_action'].fillna('')

                for index, row in tqdm(df.iterrows(), total=df.shape[0], desc="Processing CSV Rows"):
                    
                    text_to_embed = f"Problem: {row['processed_problem']}\nAction: {row['processed_action']}"
                    if text_to_embed.strip(): 
                        metadata = {
                            "source": "csv",
                            "csv_row": index,
                            "problem": row['processed_problem'],
                            "action": row['processed_action'],
                            "original_file": CSV_FILE_PATH
                        }
                        processed_data.append({
                            "id": str(uuid.uuid4()), 
                            "text": text_to_embed,
                            "metadata": metadata
                        })
            else:
                print(f"Warning: CSV file {CSV_FILE_PATH} missing 'processed_problem' or 'processed_solution' columns.")

        except Exception as e:
            print(f"Error reading or processing CSV file {CSV_FILE_PATH}: {e}")

    
    pdf_dir = Path(PDF_FOLDER_PATH)
    if pdf_dir.is_dir():
        print(f"Processing PDF files from: {PDF_FOLDER_PATH}")
        pdf_files = list(pdf_dir.glob("*.pdf"))
        for pdf_path in tqdm(pdf_files, desc="Processing PDFs"):
            pdf_text = extract_text_from_pdf(pdf_path)
            if pdf_text: 
                metadata = {
                    "source": "pdf",
                    "original_file": pdf_path.name
                }
                processed_data.append({
                    "id": str(uuid.uuid4()), 
                    "text": pdf_text,
                    "metadata": metadata
                })

    if not processed_data:
        print("No data processed. Exiting.")
        return

    print(f"\nTotal documents processed: {len(processed_data)}")

    
    print(f"Loading embedding model: {EMBEDDING_MODEL_NAME}")
    
    try:
        model = SentenceTransformer(EMBEDDING_MODEL_NAME)
        embedding_dim = model.get_sentence_embedding_dimension()
        print(f"Embedding model loaded. Vector dimension: {embedding_dim}")
    except Exception as e:
        print(f"Error loading SentenceTransformer model: {e}")
        return 

    
    print(f"Connecting to Qdrant at {QDRANT_URL}...")
    try:
        client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY, timeout=60) 
        client.get_collections()
        print("Qdrant connection successful.")
    except Exception as e:
        print(f"Error connecting to Qdrant: {e}")
        print("Please ensure Qdrant is running and credentials/URL are correct.")
        return

    
    print(f"Setting up Qdrant collection: {COLLECTION_NAME}")
    try:
        client.recreate_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=embedding_dim, distance=Distance.COSINE)
            
            
            
        )
        print(f"Collection '{COLLECTION_NAME}' created/recreated successfully.")
    except Exception as e:
        print(f"Error setting up Qdrant collection: {e}")
        return

    
    print("Generating embeddings and preparing data for Qdrant...")
    points_to_upload = []
    texts_to_embed = [item['text'] for item in processed_data]

    for i in tqdm(range(0, len(texts_to_embed), BATCH_SIZE), desc="Generating Embeddings"):
        batch_texts = texts_to_embed[i:i + BATCH_SIZE]
        batch_ids = [item['id'] for item in processed_data[i:i + BATCH_SIZE]]
        batch_payloads = [item['metadata'] for item in processed_data[i:i + BATCH_SIZE]]

        
        embeddings = model.encode(batch_texts, show_progress_bar=False).tolist() 

        
        points_batch = [
            PointStruct(id=id_val, vector=vector_val, payload=payload_val)
            for id_val, vector_val, payload_val in zip(batch_ids, embeddings, batch_payloads)
        ]
        points_to_upload.extend(points_batch)

    
    print(f"\nUploading {len(points_to_upload)} points to Qdrant collection '{COLLECTION_NAME}'...")
    try:
        
        for i in tqdm(range(0, len(points_to_upload), BATCH_SIZE), desc="Uploading to Qdrant"):
             batch_points = points_to_upload[i:i + BATCH_SIZE]
             if batch_points: 
                client.upsert(
                    collection_name=COLLECTION_NAME,
                    points=batch_points,
                    wait=False 
                )
        print("Waiting briefly for uploads to settle...")
        time.sleep(2) 

        
        count_after = client.count(collection_name=COLLECTION_NAME).count
        print(f"Successfully uploaded points. Collection count: {count_after}")
        if count_after != len(processed_data):
            print(f"Warning: Mismatch between processed items ({len(processed_data)}) and Qdrant count ({count_after}). Check logs.")

    except Exception as e:
        print(f"Error uploading points to Qdrant: {e}")

    print("\nEmbedding and upload process finished.")


if __name__ == "__main__":
    process_data()