import requests


def check_site_availability(url) -> bool:
    """
    Check if a website is available by sending a GET request.

    Args:
        url (str): The URL of the website to check.
    Returns:
        bool: True if the website is available (status code 200), False otherwise.
    """    
    try:
        response = requests.get(url, timeout=5)
        return response.status_code == 200
    except requests.RequestException:
        return False

if __name__ == "__main__":
    test_url = "https://www.example.com"
    if check_site_availability(test_url):
        print(f"The site {test_url} is available.")
    else:
        print(f"The site {test_url} is not available.")
