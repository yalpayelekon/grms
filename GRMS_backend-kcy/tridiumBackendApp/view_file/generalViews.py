from django.http import JsonResponse
import requests 
import json
from django.views.decorators.csrf import csrf_exempt
import http.client
from .helper import logger

lat = 36.86281810
lon = 31.05500930

@csrf_exempt
def getTemperatureData(request):

    global lat, lon

    # OpenWeatherMap API key
    api_key = 'efd4f5bf93258dc063ae4a5a703804dd'

    url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
    
    try:
        response = requests.get(url)
        data = response.json()
    
        if response.status_code == 200:
            temperature = data['main']['temp']
            logger.debug(f"temperature: {temperature}")

            response_data = {
                'temperature': str(int(temperature))
            }
            logger.debug(f"response_data: {response_data}")
            return JsonResponse(response_data)
        else:
            logger.debug(f"Temperature verisi almada bir hata olustu.")
            response_data = {
                'temperature': "25"
            }
            logger.debug(f"response_data: {response_data}")
            return JsonResponse(response_data)
    except Exception as e:
        logger.error(f"An error occurred: {e}")
        return JsonResponse({'error': 'An error occurred while processing your request.'}, status=500)
    

@csrf_exempt
def getSeaTemperatureData(request):
    
    global lat, lon

    try:
        conn = http.client.HTTPSConnection("sea-surface-temperature.p.rapidapi.com")

        headers = {
            'x-rapidapi-key': "feb012aad0mshf17432e0ab736e7p1a94e0jsn3ac3602fcbaf",
            'x-rapidapi-host': "sea-surface-temperature.p.rapidapi.com"
        }
        
        conn.request("GET", f"/current?latlon={lat}%2C{lon}", headers=headers)

        res = conn.getresponse()
        data = res.read()

        data_decoded = data.decode("utf-8")
        logger.debug(f"data_decoded: {data_decoded}")

        try:
            # Parse JSON data
            json_data = json.loads(data_decoded)

            # Extract tempC values
            tempC = json_data[0]["tempC"]
            date = json_data[0]["date"]

            logger.debug(f"date: {date}, sea tempC: {tempC}")

            response_data = {
                'seaTemperature': str(int(tempC))
            }
        except (KeyError, IndexError, json.JSONDecodeError) as e:
            logger.error(f"Error extracting temperature data: {e}")
            response_data = {
                'seaTemperature': "25"
            }

    except Exception as e:
        logger.error(f"Error connecting to API: {e}")
        response_data = {
            'seaTemperature': "25"
        }

    logger.debug(f"response_data: {response_data}")
    return JsonResponse(response_data)