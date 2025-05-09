from duckduckgo_search import DDGS

def web_search(keywords, num_results=5):
    """
    Use DuckDuckGo to search for relevant web content.
    This is completely free and doesn't require an API key.
    
    Args:
        keywords: Search terms
        num_results: Number of results to return
        
    Returns:
        String of search results formatted for the RAG pipeline
    """
    try:
        # Initialize the DuckDuckGo search engine
        search = DDGS()
        
        print(f"Searching DuckDuckGo for: {keywords}")
        
        # Perform the search
        results = search.text(keywords, max_results=num_results)
        
        # Format the results
        snippets = []
        for res in results:
            title = res.get("title", "")
            body = res.get("body", "")
            href = res.get("href", "")
            snippets.append(f"{title} — {body} ({href})")
        
        if not snippets:
            return "No search results found."
        
        return "\n\n".join(snippets)
    except Exception as e:
        print(f"Error in web search: {e}")
        return f"Error performing web search: {str(e)}"