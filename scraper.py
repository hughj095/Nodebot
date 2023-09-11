import requests
from bs4 import BeautifulSoup
import re
import time

# Function to scrape text from a URL
def scrape_text(url):
    try:
        # Send a GET request to the URL
        response = requests.get(url)

        # Check if the request was successful
        if response.status_code == 200:
            # Parse the HTML content using BeautifulSoup
            soup = BeautifulSoup(response.text, 'html.parser')

            # Extract text from the <body> and <a> tags
            body_text = soup.find('body').get_text()
            a_tags_text = ' '.join([a.get_text() for a in soup.find_all('a')])

            # Combine the text from both tags
            combined_text = body_text + ' ' + a_tags_text

            # Remove extra whitespaces
            cleaned_text = ' '.join(combined_text.split())
            return cleaned_text
        with open('training_data.txt', 'w') as file:
            # Redirect the print output to the file
            print(cleaned_text, file=file)
        else:
            print(f"Failed to retrieve content from {url}. Status code: {response.status_code}")
            return None
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return None

# Function to recursively scrape text from subpages
def scrape_subpages(base_url, depth=2):
    if depth == 0:
        return

    # Scrape text from the base URL
    text = scrape_text(base_url)
    if text:
        print(text)
    # Find all anchor tags and scrape subpages
    try:
        response = requests.get(base_url)
        url_list = []
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            anchor_tags = soup.find_all('a', href=True)
            for tag in anchor_tags:
                href = tag['href']
                if href.startswith('/') or base_url in href:
                    subpage_url = base_url + href
                    if subpage_url in url_list:
                      continue
                    else: 
                      url_list.append(subpage_url)
                        with open('training_data.txt', 'w') as file:
                            # Redirect the print output to the file
                            print(cleaned_text, file=file)
                      scrape_subpages(subpage_url, depth - 1)
    except Exception as e:
        print(f"An error occurred while scraping subpages: {str(e)}")

if __name__ == "__main__":
    ##### What is the code that takes the inputted URL and assigns it to base_url ??
    base_url = "url goes in here"  # Replace with inputted URL
    scrape_subpages(base_url)
