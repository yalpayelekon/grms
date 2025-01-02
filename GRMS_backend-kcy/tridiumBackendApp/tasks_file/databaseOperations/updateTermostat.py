import requests
import json
import logging

# Logger'ı ayarla
logger = logging.getLogger(__name__)

internal_host = "127.0.0.1:8000"  #  otel: 172.27.8.10:3500 

def updateRCUModbusTermostatT9600(blokNumarasi, katNumarasi, odaNumarasi, termostat_data):

    logger.info(f"updateRCUModbusTermostatT9600: blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}, termostat_data: {termostat_data}")

    termostat_data["blokNumarasi"] = blokNumarasi
    termostat_data["katNumarasi"] = katNumarasi
    termostat_data["odaNumarasi"] = odaNumarasi

    logger.info(f"updateRCUModbusTermostatT9600: termostat_data: {termostat_data}")
    url = "http://"+internal_host+"/updateRCUModbusTermostatT9600Data/"
    # Veriyi API'ye gönder
    try:
        json_data = json.dumps([termostat_data])
        response = requests.post(url, data=json_data)
        response.raise_for_status()  # Hata durumunda istisna yükselt

        if response.json()["status"]:
            # Başarılı yanıtı işleyin
            logger.info("updateRCUModbusTermostatT9600: Veri başariyla kaydedildi")

    except requests.exceptions.RequestException as e:
        logger.info(f"updateRCUModbusTermostatT9600: Veri gönderilirken hata oluştu: {e}")
        if e.response is not None:
            logger.info(f"updateRCUModbusTermostatT9600: Hata yanit kodu: {e.response.status_code}")
            logger.info(f"updateRCUModbusTermostatT9600: Hata yanit içeriği: {e.response.text}")
