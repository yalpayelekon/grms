import requests
import json
import logging

# Logger'ı ayarla
logger = logging.getLogger(__name__)

internal_host = "127.0.0.1:8000"  #  otel: 172.27.8.10:3500 

def setControllerComError(blokNumarasi, katNumarasi, odaNumarasi):

    dummy_data = [{"blokNumarasi": blokNumarasi, "katNumarasi": katNumarasi, "odaNumarasi": odaNumarasi}]
    #logger.info(f"setControllerComError: dummy_data: {dummy_data}")

    # operations
    url = "http://"+internal_host+"/setControllerComError/"
    # Veriyi API'ye gönder
    try:
        json_data = json.dumps(dummy_data)
        headers = {'Content-Type': 'application/json'}  # JSON olduğunu belirten başlık
        response = requests.post(url, data=json_data, headers=headers)
        response.raise_for_status()  # Hata durumunda istisna yükselt

        if response.json()["setControllerComError"]:
            # Başarılı yanıtı işleyin
            logger.info("setControllerComError: Veri başariyla kaydedildi")
            return True

    except requests.exceptions.RequestException as e:
        logger.info(f"setControllerComError: Veri gönderilirken hata oluştu: {e}")
        if e.response is not None:
            logger.info(f"setControllerComError: Hata yanit kodu: {e.response.status_code}")
            logger.info(f"setControllerComError: Hata yanit içeriği: {e.response.text}")
            return False