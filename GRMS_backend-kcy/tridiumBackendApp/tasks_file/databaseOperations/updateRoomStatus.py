import requests
import json
import logging

# Logger'ı ayarla
logger = logging.getLogger(__name__)

internal_host = "127.0.0.1:8000"  #  otel: 172.27.8.10:3500 

def setEventsMURLNDDNDRoomOccupiedOpenDoor(blokNumarasi, katNumarasi, odaNumarasi, mur, lnd, dnd, room_occupied, open_door_alarm):
    global responce_data_list
    logger.info(f"setEventsMURLNDDND: blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}, mur: {mur}, lnd: {lnd}, dnd: {dnd}, room_occupied: {room_occupied}, open_door_alarm: {open_door_alarm}")
    dummy_dict = {"blokNumarasi":blokNumarasi, "katNumarasi":katNumarasi, "odaNumarasi":odaNumarasi, "murActive": "-1", "lndActive": "-1", "dndActive": "-1", "hkInRoom":"-1", "roomOccupied":"-1", "doorOpenAlarm": "-1"}

    if mur != None:
        dummy_mur = "0"
        if mur == "mur_requested" or mur == "mur_started":
            dummy_mur = "1"
        dummy_dict["murActive"] = dummy_mur

        dummy_hk_in_room = "0"
        if mur == "mur_started":
            dummy_hk_in_room = "1"
        dummy_dict["hkInRoom"] = dummy_hk_in_room
        
    if lnd != None:
        dummy_lnd = "0"
        if lnd == "lnd_requested":
            dummy_lnd = "1"
        dummy_dict["lndActive"] = dummy_lnd
    
    if dnd != None:
        dummy_dnd = "0"
        if dnd == "dnd_requested":
            dummy_dnd = "1"
        dummy_dict["dndActive"] = dummy_dnd
    
    if room_occupied != None:
        dummy_room_occupied = "0"
        if room_occupied == "room_occupied":
            dummy_room_occupied = "1"
        dummy_dict["roomOccupied"] = dummy_room_occupied

    if open_door_alarm != None:
        dummy_open_door_alarm = "0"
        if open_door_alarm == "door_open_alarm":
            dummy_open_door_alarm = "1"
        dummy_dict["doorOpenAlarm"] = dummy_open_door_alarm

    logger.info(f"setEventsMURLNDDNDRoomOccupiedOpenDoor: dummy_dict: {dummy_dict}")
    dummy_list = [dummy_dict]
    url = "http://"+internal_host+"/setEventsMURLNDDNDRoomOccupiedOpenDoor/"
    # Veriyi API'ye gönder
    try:
        json_data = json.dumps(dummy_list)
        response = requests.post(url, data=json_data)
        response.raise_for_status()  # Hata durumunda istisna yükselt

        if response.json()["setEventsMURLNDDNDRoomOccupiedOpenDoor"]:
            # Başarılı yanıtı işleyin
            logger.info("setEventsMURLNDDNDRoomOccupiedOpenDoor: Veri başariyla kaydedildi")
            responce_data_list = []
            return True
        else: return False
    except requests.exceptions.RequestException as e:
        logger.info(f"setEventsMURLNDDNDRoomOccupiedOpenDoor: Veri gönderilirken hata oluştu: {e}")
        if e.response is not None:
            logger.info(f"setEventsMURLNDDNDRoomOccupiedOpenDoor: Hata yanit kodu: {e.response.status_code}")
            logger.info(f"setEventsMURLNDDNDRoomOccupiedOpenDoor: Hata yanit içeriği: {e.response.text}")
        return False
    
def setEventsDNDAppRoomServiceMUR(blokNumarasi, katNumarasi, odaNumarasi, mur):

    logger.info(f"setEventsDNDAppRoomServiceMUR: blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}, mur: {mur}")
    dummy_dict = {"blokNumarasi":blokNumarasi, "katNumarasi":katNumarasi, "odaNumarasi":odaNumarasi, "eventType": "-1"}

    if mur != None:
        dummy_mur = "1"
        if mur == "mur_requested":
            dummy_mur = "0"
        elif mur == "mur_cancelled":
            dummy_mur = "1"
        elif mur == "mur_started":
            dummy_mur = "2"
        elif mur == "mur_finished":
            dummy_mur = "3"
        dummy_dict["eventType"] = dummy_mur

    url = "http://"+internal_host+"/updateRoomServicesMURData/"
    # Veriyi API'ye gönder
    try:
        json_data = json.dumps(dummy_dict)
        response = requests.post(url, data=json_data)
        response.raise_for_status()  # Hata durumunda istisna yükselt

        if response.json()["updateRoomServicesMURData"]:
            # Başarılı yanıtı işleyin
            logger.info("setEventsDNDAppRoomServiceMUR: Veri başariyla kaydedildi")

    except requests.exceptions.RequestException as e:
        logger.info(f"setEventsDNDAppRoomServiceMUR: Veri gönderilirken hata oluştu: {e}")
        if e.response is not None:
            logger.info(f"setEventsDNDAppRoomServiceMUR: Hata yanit kodu: {e.response.status_code}")
            logger.info(f"setEventsDNDAppRoomServiceMUR: Hata yanit içeriği: {e.response.text}")