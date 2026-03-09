import requests

def get_geo_info(ip):
    """
    Fetches geolocation data from ip-api.com.
    Returns a dict with country, countryCode, and city.
    """
    if not ip or ip in ['127.0.0.1', '::1']:
        return {
            "country": "Localhost",
            "countryCode": "LH",
            "city": "Developer Town"
        }
    
    try:
        # Using the free non-SSL endpoint for brevity, or http://ip-api.com/json/{ip}
        response = requests.get(f"http://ip-api.com/json/{ip}", timeout=5)
        data = response.json()
        
        if data.get('status') == 'success':
            return {
                "country": data.get('country', 'Unknown'),
                "countryCode": data.get('countryCode', '??'),
                "city": data.get('city', 'Unknown')
            }
    except Exception as e:
        print(f"Error fetching geo info for {ip}: {e}")
        
    return {
        "country": "Unknown",
        "countryCode": "??",
        "city": "Unknown"
    }
