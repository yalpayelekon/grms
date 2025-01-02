
import requests
import json
import logging

# Logger'ı ayarla
logger = logging.getLogger(__name__)

internal_host = "127.0.0.1:8000"  #  otel: 172.27.8.10:3500 

def updateRCUComAlarmData(blokNumarasi, katNumarasi, odaNumarasi, alarm, ip):

    alarmType = "RCU"
    # logger.info(f"updateRCUComAlarmData: blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}, deviceName: {deviceName}, ip: {ip}")
    dummy_dict = {"blokNumarasi":blokNumarasi, "katNumarasi":katNumarasi, "odaNumarasi":odaNumarasi, 
                  "alarmStatus": alarm, 
                  "alarmType": alarmType, 
                  "ip": ip}

    # logger.info(f"updateRCUComAlarmData: dummy_dict: {dummy_dict}")
    url = "http://"+internal_host+"/updateAlarmsData/"
    # Veriyi API'ye gönder
    try:
        json_data = json.dumps([dummy_dict])
        response = requests.post(url, data=json_data)
        response.raise_for_status()  # Hata durumunda istisna yükselt

        if response.json()["status"]:
            # Başarılı yanıtı işleyin
            logger.info("updateRCUComAlarmData: Veri başariyla kaydedildi")
            return True

    except requests.exceptions.RequestException as e:
        logger.info(f"updateRCUComAlarmData: Veri gönderilirken hata oluştu: {e}")
        if e.response is not None:
            logger.info(f"updateRCUComAlarmData: Hata yanit kodu: {e.response.status_code}")
            logger.info(f"updateRCUComAlarmData: Hata yanit içeriği: {e.response.text}")
            return False
        
def updateHelvarComAlarmData(blokNumarasi, katNumarasi, odaNumarasi, alarm, ip):

    alarmType = "Helvar"
    # logger.info(f"updateHelvarComAlarmData: blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}, deviceName: {deviceName}, ip: {ip}")
    dummy_dict = {"blokNumarasi":blokNumarasi, "katNumarasi":katNumarasi, "odaNumarasi":odaNumarasi, 
                  "alarmStatus": alarm, 
                  "alarmType": alarmType, 
                  "ip": ip}

    # logger.info(f"updateHelvarComAlarmData: dummy_dict: {dummy_dict}")
    url = "http://"+internal_host+"/updateAlarmsData/"
    # Veriyi API'ye gönder
    try:
        json_data = json.dumps([dummy_dict])
        response = requests.post(url, data=json_data)
        response.raise_for_status()  # Hata durumunda istisna yükselt

        if response.json()["status"]:
            # Başarılı yanıtı işleyin
            logger.info("updateHelvarComAlarmData: Veri başariyla kaydedildi")
            return True

    except requests.exceptions.RequestException as e:
        logger.info(f"updateHelvarComAlarmData: Veri gönderilirken hata oluştu: {e}")
        if e.response is not None:
            logger.info(f"updateHelvarComAlarmData: Hata yanit kodu: {e.response.status_code}")
            logger.info(f"updateHelvarComAlarmData: Hata yanit içeriği: {e.response.text}")
            return False
        
def updateOpenDoorAlarmsData(blokNumarasi, katNumarasi, odaNumarasi, open_door_alarm):

    alarmType = "Emergency"
    logger.info(f"updateOpenDoorAlarmsData: blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}, open_door_alarm: {open_door_alarm}, alarmType: {alarmType}")
    dummy_dict = {"blokNumarasi":blokNumarasi, "katNumarasi":katNumarasi, "odaNumarasi":odaNumarasi, "alarmType": alarmType, "alarmStatus": "-1"}

    if open_door_alarm != None:
        dummy_open_door_alarm = "0"
        if open_door_alarm == "door_open_alarm":
            dummy_open_door_alarm = "1"

        dummy_dict["alarmStatus"] = dummy_open_door_alarm

    logger.info(f"updateOpenDoorAlarmsData: dummy_dict: {dummy_dict}")
    url = "http://"+internal_host+"/updateAlarmsData/"
    # Veriyi API'ye gönder
    try:
        json_data = json.dumps([dummy_dict])
        response = requests.post(url, data=json_data)
        response.raise_for_status()  # Hata durumunda istisna yükselt

        if response.json()["status"]:
            # Başarılı yanıtı işleyin
            logger.info("updateOpenDoorAlarmsData: Veri başariyla kaydedildi")

    except requests.exceptions.RequestException as e:
        logger.info(f"updateOpenDoorAlarmsData: Veri gönderilirken hata oluştu: {e}")
        if e.response is not None:
            logger.info(f"updateOpenDoorAlarmsData: Hata yanit kodu: {e.response.status_code}")
            logger.info(f"updateOpenDoorAlarmsData: Hata yanit içeriği: {e.response.text}")

def updateLightingAlarmsData(blokNumarasi, katNumarasi, odaNumarasi, list_lighting_status):

    logger.info(f"updateLightingAlarmsData: blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}, list_lighting_status: {list_lighting_status}, deviceName: Lighting")
    dummy_dict = {"blokNumarasi":blokNumarasi, "katNumarasi":katNumarasi, "odaNumarasi":odaNumarasi, "alarmType": "Lighting", "alarmStatusLighting": list_lighting_status}

    logger.info(f"updateLightingAlarmsData: dummy_dict: {dummy_dict}")
    url = "http://"+internal_host+"/updateAlarmsData/"
    # Veriyi API'ye gönder
    try:
        json_data = json.dumps([dummy_dict])
        response = requests.post(url, data=json_data)
        response.raise_for_status()  # Hata durumunda istisna yükselt

        if response.json()["status"]:
            # Başarılı yanıtı işleyin
            logger.info("updateLightingAlarmsData: Veri başariyla kaydedildi")

    except requests.exceptions.RequestException as e:
        logger.info(f"updateLightingAlarmsData: Veri gönderilirken hata oluştu: {e}")
        if e.response is not None:
            logger.info(f"updateLightingAlarmsData: Hata yanit kodu: {e.response.status_code}")
            logger.info(f"updateLightingAlarmsData: Hata yanit içeriği: {e.response.text}")