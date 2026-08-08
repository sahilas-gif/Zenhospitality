import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

BASE_URL = "https://zenhospitality.in"
visited = set()
to_visit = [BASE_URL]
site_data = {}

def get_page(url):
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def extract_content(html):
    soup = BeautifulSoup(html, 'html.parser')
    
    # Get all text
    for script in soup(["script", "style"]):
        script.extract()
    text = soup.get_text(separator=' ', strip=True)
    
    # Get all links
    links = []
    for a in soup.find_all('a', href=True):
        href = a['href']
        if href.startswith(BASE_URL) or href.startswith('/'):
            full_url = urljoin(BASE_URL, href)
            # ignore anchor links, wp-admin, feed
            if '#' not in full_url and 'wp-admin' not in full_url and 'feed' not in full_url:
                links.append(full_url)
                
    # Get buttons/nav items
    nav_items = [a.text.strip() for a in soup.select('nav a') if a.text.strip()]
    buttons = [btn.text.strip() for btn in soup.find_all(['button', 'a']) if 'button' in btn.get('class', []) or 'btn' in btn.get('class', [])]
    
    return {
        "text_sample": text[:500] + "...",
        "links": list(set(links)),
        "nav_items": list(set(nav_items)),
        "buttons": list(set(buttons))
    }

while to_visit:
    url = to_visit.pop(0)
    if url in visited:
        continue
        
    print(f"Visiting: {url}")
    html = get_page(url)
    if html:
        data = extract_content(html)
        site_data[url] = data
        visited.add(url)
        
        for link in data['links']:
            if link not in visited and link not in to_visit:
                to_visit.append(link)

import json
with open('site_analysis.json', 'w') as f:
    json.dump(site_data, f, indent=2)

print(f"Done! Crawled {len(visited)} pages. Saved to site_analysis.json")
