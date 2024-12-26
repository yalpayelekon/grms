
import socket
from celery import shared_task
import requests
import json
import datetime
import logging
import numpy as np
import time
# Logger'ı ayarla
logger = logging.getLogger(__name__)

internal_host = "127.0.0.1:8000"  #  otel: 172.27.8.10:3500 

# Soketleri tutmak için bir dictionary
sockets = {}
controllerInfo = {   
    "10.11.10.114":   
    {
        "name": "rcu",
        "port": 5556,
        "ipBlokKatOda":("A", "1", "1100"),
        "periyodicTaskVariables": [0, 5],
        "responceDataList": [],
        "murPrevState": "temizlik_baslamadi",
        "comErrorPrevState": "0"
    }
} 


timeout = 3 # saniye
responce_data_list = []

onboard_output_devices_queried_address_hex = [0x4d, 0x4e, 0x4f, 0x50, 0x51, 0x52, 
                                            0x53, 0x54, 0x55, 0x56, 0x57, 0x58]

# Adres aralığı
helvar_start_address = 1
helvar_end_address = 64

onboardOutputFeaturesStatus = {
    80: "power cycle seen", 
    40: "short address mask",
    20: "reset state",
    10: "fade running",
    8: "limit error", # hata
    4: "lamp on",
    2: "lamp failure", # hata
    1: "control gear failure", # hata
    0: "No"
}

mastHedDeviceTypeNumber = {
    0: "Idle",
    1: "Digdim_Buton135",
    2: "Digdim_MiniInputUnit",
    3: "Digdim_320_sensor",
    4: "Elekon_MiniInputUnit_8",
    5: "Onboard_Inputs",
    6: "Onboard_RelayOutput",
    7: "Onboard_TriacDimmer",
    8: "Onboard_TriacSSRelay"
}

""" mastHedDeviceTypeNumber = {
    0: "OObj_Masthed_DeviceTypeNumber_Idle",
    1: "OObj_Masthed_DeviceTypeNumber_Digdim_Buton135",
    2: "OObj_Masthed_DeviceTypeNumber_Digdim_MiniInputUnit",
    3: "OObj_Masthed_DeviceTypeNumber_Digdim_320_sensor",
    4: "OObj_Masthed_DeviceTypeNumber_Elekon_MiniInputUnit_8",
    5: "OObj_Masthed_DeviceTypeNumber_Onboard_Inputs",
    6: "OObj_Masthed_DeviceTypeNumber_Onboard_RelayOutput",
    7: "OObj_Masthed_DeviceTypeNumber_Onboard_TriacDimmer",
    8: "OObj_Masthed_DeviceTypeNumber_Onboard_TriacSSRelay"
} """

IOObj_Masthed_VarietyE = {
    0: "Idle",
    1: "Dali Controller",
    2: "Dali Gear",
    3: "Digidim Controller",
    4: "Digidim Gear",
    5: "Elekon Controller",
    6: "Elekon Gear",
    7: "OnBoard Controller",
    8: "OnBoard Gear",
    9: "Rs485",
    10: "Unknown",
    0xFF: "Mask",
}

IOObj_Masthed_DeviceTypeNumberE = {
    0: "Idle",
    1: "Digdim_Buton135",
    2: "Digdim_MiniInputUnit",
    3: "Digdim_320_sensor",
    4: "Digidim_Buton_ex_13X",
    5: "Elekon_MiniInputUnit_8",
    6: "Onboard_Inputs",
    7: "Onboard_RelayOutput",
    8: "Onboard_TriacDimmer",
    9: "Onboard_TriacSSRelay",
    10: "Dali_Gear",
    11: "Elekon_MiniInputUnit_4",
    12: "Elekon_TinyIO",
    13: "Elekon_DNDPanel",
    14: "Unknown",
    0xFF: "Mask",
}
    
RCU_Output_Status = {
    0: "IDLE",
	1: "CONTROL_GEAR_FAILURE",
	2: "LAMP_FAILURE",
	4: "LAMP_ON",
	8: "LIMIT_ERROR",
	10: "FADE_RUNNING",
	20: "RESET_STATE",
	40: "SHORT_ADDRESS_MASK",
	80: "POWER_CYCLE_SEEN",
}

helvarDeviceType = {
    "1025": "Triyak",
    "1537": "Dali Armatür",
    "4818434": "Röle", 
}

@shared_task
def setControllerActualLevel(ip, address, actual_level):

    logger.info(f"setControllerActualLevel: ip: {ip} address: {address}, actual_level: {actual_level}")

    start = datetime.datetime.now()

    global sockets, responce_data_list, controllerInfo

    splitted_ip = ip.split(".")
    post_fix = splitted_ip[-2]+"."+splitted_ip[-1]

    controllerName = controllerInfo[ip]["name"]
    port = controllerInfo[ip]["port"]
    logger.info(f"setControllerActualLevel: ip: {ip} port: {port} sockets: {sockets}")
    try:
        if controllerName == "rcu":
            address_hex = int(hex(int(address)), 16)
            actual_level_hex = int(hex(int(actual_level)), 16)
            logger.info(f"setControllerActualLevel: rcu: ip: {ip} address: {address}, address_hex = {address_hex}, actual_level: {actual_level}, actual_level_hex: {actual_level_hex},")
            try:
                if (ip, port) in sockets:    
                    sock = sockets[(ip, port)]
                    logger.info(f"setControllerActualLevel: {ip} {port} sockets listesinde bulundu.")
                else:
                    logger.info(f"setControllerActualLevel: {ip} {port} sockets listesinde bulunamadi.")
                    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    sock.settimeout(1)  # 10 saniyelik zaman aşımı
                    sock.connect((ip, port))
                    sockets[(ip, port)] = sock
                    logger.info(f"setControllerActualLevel: TCP bağlantısı {ip}:{port} başariyla sağlandi.")
                
                hex_data = [0x3E, 0x05, 0x00, 0x03, 0x02, 0x00, address_hex, actual_level_hex]  
                byte_data = bytearray(hex_data)
                sock.sendall(byte_data)
                logger.info(f"setControllerActualLevel Gönderilen veri: {byte_data.hex()}")
                
                data = sock.recv(1024)
                data_hex = data.hex()
                responce_data_list.append(data_hex)
                logger.info(f"setControllerActualLevel responce: {data_hex}, ack: {data_hex[-4:-2]}, ack_type: {type(data_hex[-4:-2])}")

                stop = datetime.datetime.now()
                elapsed = stop - start
                logger.info(f"setControllerActualLevel Geçen süre (saniye): {elapsed.total_seconds()}")

                if str(data_hex[-4:-2]) == "00":
                    logger.info(f"setControllerActualLevel ack ok")
                    return True
                else: return False
                
            except socket.error as e:
                logger.error(f"setControllerActualLevel: TCP bağlantısı {ip}:{port} sirasinda hata oluştu: {e}")
                return False
        elif controllerName == "helvar":
            name_raw = helvarRouterSend(ip, port, f'>V:1,C:14,L:{actual_level},F:9,@{post_fix}.1.{address}##')
            return True
    except ValueError as e:
        logger.error(f"setControllerActualLevel: address veya actual_level'de geçersiz değer: {e}")
        return False

@shared_task
def setRCUModbus(blokNumarasi, katNumarasi, odaNumarasi, updated_data):

    start = datetime.datetime.now()
    global sockets, controllerInfo

    logger.info(f"setRCUModbus: blokNumarasi: {blokNumarasi} katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}, updated_data: {updated_data}")
    
    # Tersine arama: ipBlokKatOda'ya göre IP adresini bulma
    searched_ipBlokKatOda = (blokNumarasi, katNumarasi, odaNumarasi)
    matching_ip = None
    for ip, info in controllerInfo.items():
        if info.get("ipBlokKatOda") == searched_ipBlokKatOda:
            matching_ip = ip
            break

    if matching_ip:
        logger.info(f"setRCUModbus: Aranan ipBlokKatOda bilgisine karşılık gelen IP adresi: {matching_ip}")

        port = controllerInfo[matching_ip]["port"]
        logger.info(f"setRCUModbus: ip: {ip} port: {port} sockets: {sockets}")
        
        try:
            if (ip, port) in sockets:    
                sock = sockets[(ip, port)]
                logger.info(f"setRCUModbus: {ip} {port} sockets listesinde bulundu.")
            else:
                logger.info(f"setRCUModbus: {ip} {port} sockets listesinde bulunamadi.")
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(1)  # 10 saniyelik zaman aşımı
                sock.connect((ip, port))
                sockets[(ip, port)] = sock
                logger.info(f"setRCUModbus: TCP bağlantısı {ip}:{port} başariyla sağlandi.")
            
            for key, value in updated_data.items():
                logger.info(f"setRCUModbus: Key: {key}, Value: {value}")
                if key == "mode": # 0x28
                    hex_data = [0x3E, 0x0A, 0x00, 0x03, 0x07, 0x01, 0x01, 0x00, 0x28, 0x00, 0x01, 0x00]  
                    hex_data.append(int(value, 16))
                    byte_data = bytearray(hex_data)
                    sock.sendall(byte_data)
                    logger.info(f"setRCUModbus: mode: Gönderilen veri: {byte_data.hex()}")
                elif key == "fanMode": # 0x29
                    hex_data = [0x3E, 0x0A, 0x00, 0x03, 0x07, 0x01, 0x01, 0x00, 0x29, 0x00, 0x01, 0x00]  
                    hex_data.append(int(value, 16))
                    byte_data = bytearray(hex_data)
                    sock.sendall(byte_data)
                    logger.info(f"setRCUModbus: fanMode: Gönderilen veri: {byte_data.hex()}")
                elif key == "onOf": # 0x34
                    hex_data = [0x3E, 0x0A, 0x00, 0x03, 0x07, 0x01, 0x01, 0x00, 0x34, 0x00, 0x01, 0x00]  
                    hex_data.append(int(value, 16))
                    byte_data = bytearray(hex_data)
                    sock.sendall(byte_data)
                    logger.info(f"setRCUModbus: onOf: Gönderilen veri: {byte_data.hex()}")
                elif key == "setPoint" or key == "confortTemperature": # 0x0f
                    hex_data = [0x3E, 0x0A, 0x00, 0x03, 0x07, 0x01, 0x01, 0x00, 0x0f, 0x00, 0x01]
                    value_float = float(value) * 10 # Adım 1: Float'a çevirme ve Adım 2: 10 ile çarpma
                    value_int = int(value_float) # Adım 3: Integer'a çevirme
                    high_byte = (value_int >> 8) & 0xFF # İlk byte (en soldaki 8 bit)
                    low_byte = value_int & 0xFF # İkinci byte (en sağdaki 8 bit)
                    hex_data.append(high_byte)
                    hex_data.append(low_byte)
                    byte_data = bytearray(hex_data)
                    sock.sendall(byte_data)
                    logger.info(f"setRCUModbus: setPoint: Gönderilen veri: {byte_data.hex()}")
                elif key == "lowerSetpoint": # 0x10
                    hex_data = [0x3E, 0x0A, 0x00, 0x03, 0x07, 0x01, 0x01, 0x00, 0x10, 0x00, 0x01]
                    value_float = float(value) * 10 # Adım 1: Float'a çevirme ve Adım 2: 10 ile çarpma
                    value_int = int(value_float) # Adım 3: Integer'a çevirme
                    high_byte = (value_int >> 8) & 0xFF # İlk byte (en soldaki 8 bit)
                    low_byte = value_int & 0xFF # İkinci byte (en sağdaki 8 bit)
                    hex_data.append(high_byte)
                    hex_data.append(low_byte)
                    byte_data = bytearray(hex_data)
                    sock.sendall(byte_data)
                    logger.info(f"setRCUModbus: lowerSetpoint: Gönderilen veri: {byte_data.hex()}")
                elif key == "upperSetpoint": # 0x11
                    hex_data = [0x3E, 0x0A, 0x00, 0x03, 0x07, 0x01, 0x01, 0x00, 0x11, 0x00, 0x01]
                    value_float = float(value) * 10 # Adım 1: Float'a çevirme ve Adım 2: 10 ile çarpma
                    value_int = int(value_float) # Adım 3: Integer'a çevirme
                    high_byte = (value_int >> 8) & 0xFF # İlk byte (en soldaki 8 bit)
                    low_byte = value_int & 0xFF # İkinci byte (en sağdaki 8 bit)
                    hex_data.append(high_byte)
                    hex_data.append(low_byte)
                    byte_data = bytearray(hex_data)
                    sock.sendall(byte_data)
                    logger.info(f"setRCUModbus: upperSetpoint: Gönderilen veri: {byte_data.hex()}")
                elif key == "keylockFunction": # 0x3A
                    hex_data = [0x3E, 0x0A, 0x00, 0x03, 0x07, 0x01, 0x01, 0x00, 0x3a, 0x00, 0x01, 0x00]  
                    hex_data.append(int(value, 16))
                    byte_data = bytearray(hex_data)
                    sock.sendall(byte_data)
                    logger.info(f"setRCUModbus: keylockFunction: Gönderilen veri: {byte_data.hex()}")
                elif key == "occupancyInput": # 0x2b
                    hex_data = [0x3E, 0x0A, 0x00, 0x03, 0x07, 0x01, 0x01, 0x00, 0x2b, 0x00, 0x01, 0x00]  
                    hex_data.append(int(value, 16))
                    byte_data = bytearray(hex_data)
                    sock.sendall(byte_data)
                    logger.info(f"setRCUModbus: occupancyInput: Gönderilen veri: {byte_data.hex()}")
            stop = datetime.datetime.now()
            elapsed = stop - start
            logger.info(f"setRCUModbus Geçen süre (saniye): {elapsed.total_seconds()}")
            
        except socket.error as e:
            logger.error(f"setRCUModbus: TCP bağlantısı {ip}:{port} sirasinda hata oluştu: {e}")
            return False   
    else:
        logger.info("setRCUModbus: Aranan ipBlokKatOda bilgisine karşılık gelen IP adresi bulunamadı.")    

def parse_string(ip, s):
    global controllerInfo
    pattern1 = "3e0500040200" # event_onboard_input_events 3e05040200
    pattern2 = "3e0500030000" # control_general_ack 3e05030000

    pattern3 = "3e0300040600" # Event_dndapp_mur_requested 3e03040600 
    pattern4 = "3e0300040601" # Event_dndapp_mur_request_canceled 3e03040601

    pattern5 = "3e0300040602" # Event_dndapp_loundry_requested 3e03040602
    pattern6 = "3e0300040603" # Event_dndapp_loundry_request_canceled 3e03040603

    pattern7 = "3e0300040604" # Event_dndapp_dnd_active 3e03040604
    pattern8 = "3e0300040605" # Event_dndapp_dnd_passive 3e03040605

    pattern9 = "3e0700040606" # Event_dndapp_mur_started 3e07040606
    pattern10 = "3e0700040607" # Event_dndapp_mur_finished 3e07040607

    pattern11 = "3e0300040504" # Event_occapp_room_empty 3e03040504
    pattern12 = "3e0300040505" # Event_occapp_room_occupied 3e03040505

    pattern13 = "3e0300040502" # Event_occapp_open_door_alarm 3e03040502
    pattern14 = "3e0300040503" # Event_occapp_open_door_alarm_deleted 3e03040503

    pattern_rcu_modbus_termostat_T9600 = "3e0800040702"
    rcu_modbus_termostat_t9600_to_db = { "blokNumarasi":"-1",
                                        "katNumarasi":"-1",
                                        "odaNumarasi":"-1",
                                        "onOf" :"-1",
                                        "roomTemperature" :"-1",
                                        "setPoint":"-1",
                                        "mode" :"-1",
                                        "fanMode" :"-1",
                                        "confortTemperature" :"-1",
                                        "lowerSetpoint" :"-1",
                                        "upperSetpoint":"-1",
                                        "keylockFunction":"-1",
                                        "occupancyInput" :"-1",
                                        "runningstatus" :"-1",
                                        "comError":"-1"}

    t9600_datasheet = {"0029":{"desc":"fanMode",
                                        "0001":"1",
                                        "0002":"2",
                                        "0003":"3",
                                        "0004":"4"},
                                "0028":{"desc":"mode",
                                        "0000":"0",
                                        "0001":"1",
                                        "0002":"2",
                                        "0003":"3"},
                                "0034":{"desc":"onOf",
                                        "0000":"0",
                                        "0001":"1"},
                                "0033":{"desc":"runningstatus",
                                        "0000":"0",
                                        "0001":"1",
                                        "0002":"2",
                                        "0003":"3",
                                        "0004":"4",
                                        "0005":"5",
                                        "0006":"6"},
                                "003a":{"desc":"keylockFunction",
                                        "0000":"0",
                                        "0001":"1",
                                        "0002":"2",
                                        "0003":"3",
                                        "0004":"4"},
                                "002b":{"desc":"occupancyInput",
                                        "0000":"0",
                                        "0002":"2"},     
                            }
    
    
    result1 = []
    result2 = []
    result34 = []
    result56 = []
    result78 = []
    result11_12 = []
    result13_14 = []
    result_pattern_rcu_modbus_termostat_T9600 = []

    i = 0
    while i < len(s):
        if s[i:i+len(pattern1)] == pattern1:
            result1.append(s[i:i+14])
            i += 16
        elif s[i:i+len(pattern2)] == pattern2 :
            result2.append(s[i:i+14])
            i += 16
        elif s[i:i+len(pattern3)] == pattern3:
            result34.append("mur_requested")
            i += len(pattern3)
        elif s[i:i+len(pattern4)] == pattern4:
            result34.append("mur_cancelled")
            i += len(pattern4)
        elif s[i:i+len(pattern5)] == pattern5:
            result56.append("lnd_requested")
            i += len(pattern5)
        elif s[i:i+len(pattern6)] == pattern6:
            result56.append("lnd_cancelled")
            i += len(pattern6)
        elif s[i:i+len(pattern7)] == pattern7:
            result78.append("dnd_requested")
            i += len(pattern7)
        elif s[i:i+len(pattern8)] == pattern8:
            result78.append("dnd_cancelled")
            i += len(pattern8)
        elif s[i:i+len(pattern9)] == pattern9:
            result34.append("mur_started")
            controllerInfo[ip]["murPrevState"] = "temizlik_basladi"
            i += 20
        elif s[i:i+len(pattern10)] == pattern10:
            result34.append("mur_finished")
            i += 20
        elif s[i:i+len(pattern11)] == pattern11:
            result11_12.append("room_empty")
            i += len(pattern11)
        elif s[i:i+len(pattern12)] == pattern12:
            result11_12.append("room_occupied")
            i += len(pattern12)
        elif s[i:i+len(pattern13)] == pattern13:
            result11_12.append("door_open")
            i += len(pattern13)
        elif s[i:i+len(pattern14)] == pattern14:
            result11_12.append("door_closed")
            i += len(pattern13)
        elif s[i:i+len(pattern_rcu_modbus_termostat_T9600)] == pattern_rcu_modbus_termostat_T9600:

            msg = s[i:i+len(pattern_rcu_modbus_termostat_T9600) + 10]

            device_address_hex = msg[-10:-8]
            t9600_datasheet_address_hex = msg[-8:-4]
            t9600_datasheet_point_description_hex = msg[-4:]

            logger.info(f"parse string rcu modbus termostat t9600: {msg}, msg_type: {type(msg)}")
            logger.info(f"parse string rcu modbus termostat t9600 device_address_hex: {device_address_hex}")
            logger.info(f"parse string rcu modbus termostat t9600 t9600_datasheet_address_hex: {t9600_datasheet_address_hex}")
            logger.info(f"parse string rcu modbus termostat t9600 t9600_datasheet_point_description_hex: {t9600_datasheet_point_description_hex}")
            
            try:
                if t9600_datasheet_address_hex == "000f": # set point 
                    logger.info(f"parse string rcu modbus termostat Set Point value hex: {t9600_datasheet_point_description_hex}")
                    set_point_str_float = str(int(t9600_datasheet_point_description_hex, 16)/10)
                    rcu_modbus_termostat_t9600_to_db["setPoint"] = set_point_str_float
                    logger.info(f"parse string rcu modbus termostat Set Point value str/float: {set_point_str_float}")
                elif t9600_datasheet_address_hex == "000e": # room temp 
                    logger.info(f"parse string rcu modbus termostat room temp value hex: {t9600_datasheet_point_description_hex}")
                    room_temp_str_float = str(int(t9600_datasheet_point_description_hex, 16)/10)
                    rcu_modbus_termostat_t9600_to_db["roomTemperature"] = room_temp_str_float
                    logger.info(f"parse string rcu modbus termostat room temp value str/float: {room_temp_str_float}")
                elif t9600_datasheet_address_hex == "0010": # lowerSetpoint
                    logger.info(f"parse string rcu modbus termostat lowerSetpoint value hex: {t9600_datasheet_point_description_hex}")
                    lowerSetpoint_str_float = str(int(t9600_datasheet_point_description_hex, 16)/10)
                    rcu_modbus_termostat_t9600_to_db["lowerSetpoint"] = lowerSetpoint_str_float
                    logger.info(f"parse string rcu modbus termostat lowerSetpoint value str/float: {lowerSetpoint_str_float}")
                elif t9600_datasheet_address_hex == "0011": # upperSetpoint
                    logger.info(f"parse string rcu modbus termostat upperSetpoint value hex: {t9600_datasheet_point_description_hex}")
                    upperSetpoint_str_float = str(int(t9600_datasheet_point_description_hex, 16)/10)
                    rcu_modbus_termostat_t9600_to_db["upperSetpoint"] = upperSetpoint_str_float
                    logger.info(f"parse string rcu modbus termostat upperSetpoint value str/float: {upperSetpoint_str_float}")
                else:
                    rcu_modbus_termostat_t9600_to_db[t9600_datasheet[t9600_datasheet_address_hex]["desc"]] = t9600_datasheet[t9600_datasheet_address_hex][t9600_datasheet_point_description_hex]
                    logger.info(f"parse string rcu modbus termostat rcu_modbus_termostat_t9600_to_db: {rcu_modbus_termostat_t9600_to_db}")

                result_pattern_rcu_modbus_termostat_T9600.append(rcu_modbus_termostat_t9600_to_db) 
            except: print("gonderilen komut bulunamadi")
            i += len(pattern_rcu_modbus_termostat_T9600) + 10
        else:
            i += 1

    return result1, result2, result34, result56, result78, result11_12, result13_14, result_pattern_rcu_modbus_termostat_T9600

def parse_string_helvar(input_string, ip):
    global controllerInfo
    # logger.info(f"parse_string_helvar: {input_string}")

    # 1. String'i "#" karakterine göre böler
    split_strings = input_string.split("#")
    if split_strings[-1] == '':
        split_strings = split_strings[:-1]
    # logger.info(f"parse_string_helvar: split_strings: {split_strings}")

    # Boş listeler tanımla
    list_button_clicked = []
    list_mur = []
    list_dnd = []
    list_lnd = []
    list_room_occupied = []
    list_open_door_alarm = []

    # 2. Her bir parçayı işleme
    for part in split_strings:
        
        # Parçayı ">" karakterine göre ayırarak veriyi ve komutu ayır
        part = part[1:]

        # 3. Veriyi ve komutu ayır
        data_parts = part.split(',')

        # Veri elemanlarını bir sözlükte topla
        data_dict = {}
        for item in data_parts:
            try:
                key, value = item.split(':')
                data_dict[key] = int(value)
            except ValueError as e:
                logger.info(f"Error parsing item '{item}': {e}")
                continue
        logger.info(f"Data dictionary: {data_dict}")

        if data_dict['G'] == 1001:
            if data_dict['S'] == 1:
                list_mur.append("mur_requested")
            elif data_dict['S'] == 2 and controllerInfo[ip]["murPrevState"] == "temizlik_baslamadi":
                list_mur.append("mur_cancelled")
            elif data_dict['S'] == 3:
                list_mur.append("mur_started")
                controllerInfo[ip]["murPrevState"] = "temizlik_basladi"
            elif data_dict['S'] == 2 and controllerInfo[ip]["murPrevState"] == "temizlik_basladi":
                list_mur.append("mur_finished")
        elif data_dict['G'] == 1002:
            if data_dict['S'] == 1:
                list_dnd.append("dnd_requested")
            elif data_dict['S'] == 15:
                list_dnd.append("dnd_cancelled")
        elif data_dict['G'] == 1003:
            if data_dict['S'] == 1:
                list_lnd.append("lnd_requested")
            elif data_dict['S'] == 15:
                list_lnd.append("lnd_cancelled")
        elif data_dict['G'] == 1000:
            if data_dict['S'] == 1:
                list_room_occupied.append("room_occupied")
            elif data_dict['S'] == 15:
                list_room_occupied.append("room_empty")
        elif data_dict['G'] == 1006:
            if data_dict['S'] == 1:
                list_open_door_alarm.append("door_closed")
            elif data_dict['S'] == 15:
                list_open_door_alarm.append("door_open")
                
        if data_dict['C'] == 11 and (data_dict['G'] not in  [1000, 1001, 1002, 1003, 1006]): # lnd, mur, dnd ve room occupieda basilirsa tarama
            list_button_clicked.append("button_clicked")


    """ # Güncel listeleri logla
    logger.info(f"parse_string_helvar: list_button_clicked: {list_button_clicked}")
    logger.info(f"parse_string_helvar: list_mur: {list_mur}")
    logger.info(f"parse_string_helvar: list_dnd: {list_dnd}")
    logger.info(f"parse_string_helvar: list_lnd: {list_lnd}")
    logger.info(f"parse_string_helvar: list_room_occupied: {list_room_occupied}")
    logger.info(f"parse_string_helvar: list_open_door_alarm: {list_open_door_alarm}") """

    return list_button_clicked, list_mur, list_lnd, list_dnd, list_room_occupied, list_open_door_alarm

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

def updateOpenDoorAlarmsData(blokNumarasi, katNumarasi, odaNumarasi, open_door_alarm, deviceName):

    logger.info(f"updateOpenDoorAlarmsData: blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}, open_door_alarm: {open_door_alarm}, deviceName: {deviceName}")
    dummy_dict = {"blokNumarasi":blokNumarasi, "katNumarasi":katNumarasi, "odaNumarasi":odaNumarasi, "alarmType": deviceName, "alarmStatus": "-1"}

    if open_door_alarm != None:
        dummy_open_door_alarm = "0"
        if open_door_alarm == "door_open":
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

def updateRCUModbusTermostatT9600(blokNumarasi, katNumarasi, odaNumarasi, termostat_data):

    logger.info(f"updateOpenDoorAlarmsData: blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}, termostat_data: {termostat_data}")

    termostat_data["blokNumarasi"] = blokNumarasi
    termostat_data["katNumarasi"] = katNumarasi
    termostat_data["odaNumarasi"] = odaNumarasi

    logger.info(f"updateOpenDoorAlarmsData: termostat_data: {termostat_data}")
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

def setEventsMURLNDDNDRoomOccupiedOpenDoor(blokNumarasi, katNumarasi, odaNumarasi, mur, lnd, dnd, room_occupied, open_door_alarm):
    global responce_data_list
    logger.info(f"setEventsMURLNDDND: blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}, mur: {mur}, lnd: {lnd}, dnd: {dnd}, room_occupied: {room_occupied}, open_door_alarm: {open_door_alarm}")
    dummy_dict = {"blokNumarasi":blokNumarasi, "katNumarasi":katNumarasi, "odaNumarasi":odaNumarasi, "murActive": "-1", "lndActive": "-1", "dndActive": "-1", "hkInRoom":"-1", "roomOccupied":"-1", "doorOpen": "-1"}

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
        if open_door_alarm == "door_open":
            dummy_open_door_alarm = "1"
        dummy_dict["doorOpen"] = dummy_open_door_alarm

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

def setControllerInitialInformationToDB(dict_controller_initial_information):

    # operations
    logger.info(f"setControllerInitialInformationToDB: dict_controller_initial_information: {dict_controller_initial_information}")
    url = "http://"+internal_host+"/setControllerInitialInformationToDB/"
    dummy_data = [dict_controller_initial_information]
    # Veriyi API'ye gönder
    try:
        json_data = json.dumps(dummy_data)
        headers = {'Content-Type': 'application/json'}  # JSON olduğunu belirten başlık
        response = requests.post(url, data=json_data, headers=headers)
        response.raise_for_status()  # Hata durumunda istisna yükselt

        if response.json()["setControllerInitialInformationToDB"]:
            # Başarılı yanıtı işleyin
            logger.info("setControllerInitialInformationToDB: Veri başariyla kaydedildi")
            return response

    except requests.exceptions.RequestException as e:
        logger.info(f"setControllerInitialInformationToDB: Veri gönderilirken hata oluştu: {e}")
        if e.response is not None:
            logger.info(f"setControllerInitialInformationToDB: Hata yanit kodu: {e.response.status_code}")
            logger.info(f"setControllerInitialInformationToDB: Hata yanit içeriği: {e.response.text}")

def setControllerComError(blokNumarasi, katNumarasi, odaNumarasi):

    dummy_data = [{"blokNumarasi": blokNumarasi, "katNumarasi": katNumarasi, "odaNumarasi": odaNumarasi}]

    # operations
    logger.info(f"setControllerComError: dummy_data: {dummy_data}")
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

def updateControllerComErrorData(blokNumarasi, katNumarasi, odaNumarasi, alarm, deviceName, ip):

    # logger.info(f"updateControllerComErrorData: blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}, deviceName: {deviceName}, ip: {ip}")
    dummy_dict = {"blokNumarasi":blokNumarasi, 
                  "katNumarasi":katNumarasi, 
                  "odaNumarasi":odaNumarasi, 
                  "alarmStatus": alarm, 
                  "alarmType": deviceName, 
                  "ip": ip}

    logger.info(f"updateControllerComErrorData: dummy_dict: {dummy_dict}")
    url = "http://"+internal_host+"/updateAlarmsData/"
    # Veriyi API'ye gönder
    try:
        json_data = json.dumps([dummy_dict])
        response = requests.post(url, data=json_data)
        response.raise_for_status()  # Hata durumunda istisna yükselt

        if response.json()["status"]:
            # Başarılı yanıtı işleyin
            logger.info("updateControllerComErrorData: Veri başariyla kaydedildi")
            return True

    except requests.exceptions.RequestException as e:
        logger.info(f"updateControllerComErrorData: Veri gönderilirken hata oluştu: {e}")
        if e.response is not None:
            logger.info(f"updateControllerComErrorData: Hata yanit kodu: {e.response.status_code}")
            logger.info(f"updateControllerComErrorData: Hata yanit içeriği: {e.response.text}")
            return False

def getRCUOnboardOutputDeviceType(s):
    list_onboard_device_masthead_device_type_number = []
    list_onboard_device_masthead_short_address = []

    try:
        # Q Onboard Device Masthead: vairety, 
        # logger.info("Q Onboard Device Masthead")
        hex_data = [0x3E, 0x03, 0x00, 0x02, 0x02, 0x02] 
        byte_data = bytearray(hex_data)
        s.sendall(byte_data)
        # logger.info(f"Gönderilen veri: {byte_data.hex()}")
        
        # Sunucudan yanıt alma
        all_data = s.recv(1024)
        # logger.info(f"Q Onboard Device Masthead Sunucudan gelen data: \n{data}")
        
        all_data_hex = all_data.hex()
        data_hex = all_data_hex[12:]  # cmd type no, cmd type brief, cmd no ve cmd brief cikart 10
        
        block_size = 10
        if len(data_hex) == 240:
            for i in range(0, len(data_hex), block_size):
                data_block = data_hex[i:i + block_size]
                
                if len(data_block) == 10:
                    list_onboard_device_masthead_device_type_number.append(
                        mastHedDeviceTypeNumber.get(int(data_block[2:4]), "Masthed Device Type Number Error")
                    )  # obj device type number OObj_Masthed_DeviceTypeNumber_Onboard_Inputs=5
                    list_onboard_device_masthead_short_address.append(data_block[4:6])  # obj short address = 41
                else:
                    logger.info("Q Onboard Device Masthead gelen data_block (len = 10) verinin boyutu farkli.")
        else:
            logger.info("Q Onboard Device Masthead gelen data_hex (len = 240) verinin boyutu farkli.")
    
    except (socket.error, ValueError, IndexError) as e:
        # Bu kısım, socket hataları, değer hataları veya indeks hatalarını yakalar.
        logger.error(f"Bir hata oluştu: {e}")
    
    return list_onboard_device_masthead_short_address, list_onboard_device_masthead_device_type_number

def getRCUOnboardOutputDeviceName(i, s):
    # Onboard Output DEVICE NAME
    name = ""

    try:
        hex_data = [0x3E, 0x04, 0x00, 0x02, 0x02, 0x10, i]
        # Veriyi byte dizisine çevirme
        byte_data = bytearray(hex_data)
        # Hexadecimal veriyi gönderme
        s.sendall(byte_data)
        # logger.info(f"Gönderilen veri: {byte_data.hex()}")
        
        # Sunucudan yanıt alma
        data = s.recv(1024)
        # logger.info(f"Sunucudan gelen data: \n{data}")
        
        # ASCII veriyi çözme ve temizleme
        ascii_data = data.decode("ascii", errors="ignore")
        name = ascii_data.replace("\x00", "").replace(">#\x02\x02\x11", "")
        # logger.info(f"name: \n{name}")

    except (socket.error, UnicodeDecodeError, ValueError) as e:
        # Bu kısım, socket hataları, Unicode hata çözme hataları ve değer hatalarını yakalar.
        logger.error(f"Bir hata oluştu: {e}")
    
    return name

def getDoorOpen(s):

    try:
        hex_data = [0x3E, 0x03, 0x00, 0x02, 0x05, 0x04] # Q_occupancy_door_position
        # Veriyi byte dizisine çevirme
        byte_data = bytearray(hex_data)
        # Hexadecimal veriyi gönderme
        s.sendall(byte_data)
        # logger.info(f"Gönderilen veri: {byte_data.hex()}")
        
        # Sunucudan yanıt alma
        data = s.recv(1024)
        data_hex = data.hex()
    except (socket.error, UnicodeDecodeError, ValueError) as e:
        # Bu kısım, socket hataları, Unicode hata çözme hataları ve değer hatalarını yakalar.
        logger.error(f"Bir hata oluştu: {e}")
    
    return data_hex

def getRoomOccupied(s):

    try:
        hex_data = [0x3E, 0x03, 0x00, 0x02, 0x05, 0x02] # Q_occupancy_room_situation
        # Veriyi byte dizisine çevirme
        byte_data = bytearray(hex_data)
        # Hexadecimal veriyi gönderme
        s.sendall(byte_data)
        # logger.info(f"Gönderilen veri: {byte_data.hex()}")
        
        # Sunucudan yanıt alma
        data = s.recv(1024)
        data_hex = data.hex()
    except (socket.error, UnicodeDecodeError, ValueError) as e:
        # Bu kısım, socket hataları, Unicode hata çözme hataları ve değer hatalarını yakalar.
        logger.error(f"Bir hata oluştu: {e}")
    
    return data_hex

def getRCUDNDMURLND(s):

    try:
        hex_data = [0x3E, 0x03, 0x00, 0x02, 0x06, 0x00]
        # Veriyi byte dizisine çevirme
        byte_data = bytearray(hex_data)
        # Hexadecimal veriyi gönderme
        s.sendall(byte_data)
        # logger.info(f"Gönderilen veri: {byte_data.hex()}")
        
        # Sunucudan yanıt alma
        data = s.recv(1024)
        data_hex = data.hex()
    except (socket.error, UnicodeDecodeError, ValueError) as e:
        # Bu kısım, socket hataları, Unicode hata çözme hataları ve değer hatalarını yakalar.
        logger.error(f"Bir hata oluştu: {e}")
    
    return data_hex

def getRCUOnboardOutputStatus(i, s):
    # Onboard Output STATUS
    status = ""

    try:
        hex_data = [0x3E, 0x04, 0x00, 0x02, 0x02, 0x0C, i]
        # Veriyi byte dizisine çevirme
        byte_data = bytearray(hex_data)
        # Hexadecimal veriyi gönderme
        s.sendall(byte_data)
        # logger.info(f"Gönderilen veri: {byte_data.hex()}")
        
        # Sunucudan yanıt alma
        all_data = s.recv(1024)
        all_data_hex = all_data.hex()
        # logger.info(f"Q Onboard Output Features Sunucudan gelen data: \n{all_data}")

        data_hex = all_data_hex[12:] # 10
        status = onboardOutputFeaturesStatus.get(int(data_hex[20:22]), "Onboard Output Features Status Error")

    except (socket.error, ValueError, IndexError) as e:
        # Bu kısım, socket hataları, değer hataları veya indeks hatalarını yakalar.
        logger.error(f"Bir hata oluştu: {e}")

    return status

def getRCUOnboardOutputActualLevel(i, s):
    # Onboard Output ACTUAL LEVEL
    actualLevel = "0"

    try:
        hex_data = [0x3E, 0x04, 0x00, 0x02, 0x02, 0x0C, i]
        byte_data = bytearray(hex_data)
        # Hexadecimal veriyi gönderme
        s.sendall(byte_data)
        
        # Sunucudan yanıt alma
        all_data = s.recv(1024)
        all_data_hex = all_data.hex()
        data_hex = all_data_hex[12:] # 10
        
        # Gerçek seviyeyi dönüştürme
        actualLevel = int(data_hex[16:18], 16)

    except (socket.error, ValueError, IndexError) as e:
        # Hataları yakalar ve günlüğe kaydeder
        logger.error(f"Bir hata oluştu: {e}")
    
    return actualLevel

def getRCUDaliInputOutputAddress(s):
    # Q discovered dali device number and short addresses
    list_dali_input_output_address = []

    try:
        hex_data = [0x3E, 0x03, 0x00, 0x02, 0x04, 0x00]
        byte_data = bytearray(hex_data)
        # Hexadecimal veriyi gönderme
        s.sendall(byte_data)
        
        # Sunucudan yanıt alma
        data = s.recv(1024)
        data_hex = data.hex()
        
        # Adres verisini ayıklama
        address = data_hex[14:] #12
        list_dali_input_output_address = [address[i:i+2] for i in range(0, len(address), 2)]
        
        logger.info(f"list_dali_input_output_address: {list_dali_input_output_address}")

    except (socket.error, IndexError) as e:
        # Hataları yakalar ve günlüğe kaydeder
        logger.info(f"Bir hata oluştu: {e}")

    return list_dali_input_output_address

def getRCUDaliOutputAddress(list_dali_input_output_address, s):
    list_rcu_dali_output_address = []

    try:
        for i in list_dali_input_output_address:
            hex_data = [0x3E, 0x04, 0x00, 0x02, 0x04, 0x02]  # uzunluk unutma 
            hex_data.append(int(i, 16))
            byte_data = bytearray(hex_data)
            # Hexadecimal veriyi gönderme
            s.sendall(byte_data)
            
            # Sunucudan yanıt alma
            all_data = s.recv(1024)
            all_data_hex = all_data.hex()
            
            # Object varieties ayıklama
            object_varieties = all_data_hex[12:14] # all_data_hex[10:12]
            object_varieties_str = IOObj_Masthed_VarietyE.get(int(object_varieties, 16), "RCU Dali Object Varieties Error")
            
            # kcy outputlar icin bir liste yapalim mesela IOObj_Masthed_VarietyE icinde [0,1,2,] gibi bunlardan biri ise output
            if "gear" in object_varieties_str.lower():  # gear = output demek
                list_rcu_dali_output_address.append(i)
                
    except (socket.error, ValueError, IndexError) as e:
        # Hataları yakalar ve günlüğe kaydeder
        logger.info(f"Bir hata oluştu: {e}")
    
    logger.info(f"list_rcu_dali_output_address: {list_rcu_dali_output_address}")
    return list_rcu_dali_output_address

def getRCUDaliOutputDeviceType(i, s):
    deviceType = ""

    try:
        # Hexadecimal veri hazırlama
        hex_data = [0x3E, 0x04, 0x00, 0x02, 0x04, 0x02]  # uzunluk unutma 
        hex_data.append(int(i, 16))
        byte_data = bytearray(hex_data)
        
        # Hexadecimal veriyi gönderme
        s.sendall(byte_data)
        
        # Sunucudan yanıt alma
        all_data = s.recv(1024)
        all_data_hex = all_data.hex()
        
        # Device type number ayıklama
        device_type_number = all_data_hex[14:16] # [12:14]
        deviceType = IOObj_Masthed_DeviceTypeNumberE.get(int(device_type_number, 16), "RCU Dali Object Device Type Error")
        
        # Loglama
        logger.info(f"Address: {i}, object device type: {device_type_number}, {deviceType}, {all_data_hex}")
    except (socket.error, ValueError, IndexError) as e:
        # Hataları yakalar ve günlüğe kaydeder
        logger.error(f"Bir hata oluştu: {e}")

    return deviceType

def getRCUDaliOutputDeviceName(i, s):
    name = ""

    try:
        # Hexadecimal veri hazırlama
        hex_data = [0x3E, 0x04, 0x00, 0x02, 0x04, 0x0A]  # uzunluk unutma
        hex_data.append(int(i, 16))
        byte_data = bytearray(hex_data)
        
        # Hexadecimal veriyi gönderme
        s.sendall(byte_data)
        
        # Sunucudan yanıt alma
        all_data = s.recv(1024)
        
        # Veriyi ASCII formatına dönüştürme
        name = all_data.decode("ascii", errors="ignore")[5:].replace("\x00", "")
        
        # Loglama
        logger.info(f"Address: {i}, name: {name}")
    
    except (socket.error, UnicodeDecodeError, IndexError) as e:
        # Hataları yakalar ve günlüğe kaydeder
        logger.error(f"Bir hata oluştu: {e}")

    return name

def getRCUDaliOutputStatusActualLevel(i, s):
    status = ""
    actualLevel = 0

    try:
        # Q_dali_gear_ram_content
        hex_data = [0x3E, 0x04, 0x00, 0x02, 0x04, 0x06]  # uzunluk unutma 
        hex_data.append(int(i,16))
        byte_data = bytearray(hex_data)
        
        # Hexadecimal veriyi gönderme
        s.sendall(byte_data)
        
        # Sunucudan yanıt alma
        data = s.recv(1024)
        all_data_hex = data.hex()
        
        # actualLevel ve status_dummy ayıklama
        actualLevel = int(all_data_hex[12:14], 16) # int(all_data_hex[10:12], 16)
        status_dummy = all_data_hex[-2:]
        status = RCU_Output_Status.get(int(status_dummy), "RCU Dali Object Status Error")
        
        # Loglama
        logger.info(f"Address: {i}, actualLevel: {actualLevel}, status: {status_dummy}, {status}, all_data_hex: {all_data_hex}")
    
    except (socket.error, ValueError, IndexError) as e:
        # Hataları yakalar ve günlüğe kaydeder
        logger.error(f"Bir hata oluştu: {e}")

    return status, actualLevel

def getRCUOutputDeviceInformation(blokNumarasi, katNumarasi, odaNumarasi, ip_address, s):
    """
        rcu (Onboard ve dali) ve helvar dan output cihazlara ait address, device name, status, actual level ve device type bilgilerini alir
    """
    logger.info("getRCUOutputDeviceInformation")
    global onboard_output_devices_queried_address_hex

    list_onboard_device_masthead_short_address, list_onboard_device_masthead_device_type_number = getRCUOnboardOutputDeviceType(s)
    
    dbDeviceType = "RCU"
    comError = "0"
    roomOccupied = "0"
    dndActive = "0"
    lndActive = "0"
    murActive = "0"
    hkInRoom = "0"
    doorOpen = "0"

    list_rcu_initial_information = []
    list_lighting_status = []
    for i in onboard_output_devices_queried_address_hex: # rcu Onboard Output

        name = getRCUOnboardOutputDeviceName(i, s)
        status = getRCUOnboardOutputStatus(i, s)
        actualLevel = getRCUOnboardOutputActualLevel(i, s)

        # Onboard Output Device Type
        deviceType = ""
        try:
            idx = list_onboard_device_masthead_short_address.index(str(hex(i))[2:])
            deviceType = list_onboard_device_masthead_device_type_number[idx]

        except ValueError: pass
        
        # logger.info(f"getRCUOutputDeviceInformation: address: {i}, device name: {name}, status: {status}, actual level: {actualLevel}, deviceType: {deviceType}")
        list_rcu_initial_information.append({   "address": str(i),
                                                "name": name,
                                                "status": status,
                                                "actualLevel": str(actualLevel),
                                                "deviceType": deviceType})
        if "error" in status.lower() or "fail" in status.lower(): # hata varsa 
            list_lighting_status.append({ "address": str(i),
                                            "name": name,
                                            "deviceType": deviceType,
                                            "status": "1",
                                            "controllerType":"RCU"}) 
        else: # hata yoksa
            list_lighting_status.append({ "address": str(i),
                                            "name": name,
                                            "deviceType": deviceType,
                                            "status": "0",
                                            "controllerType":"RCU"}) # status = 1 error demek
    
    # RCU DALI Output
    list_dali_input_output_address = getRCUDaliInputOutputAddress(s) # rcu ya takili dali cihazlarin adreslerini al
    list_rcu_dali_output_address  = getRCUDaliOutputAddress(list_dali_input_output_address, s) # rcu ya takili cihazlardan hangilerinin output oldugunu bul

    for i in list_rcu_dali_output_address: 
        
        deviceType = getRCUDaliOutputDeviceType(i, s)
        name = getRCUDaliOutputDeviceName(i, s)
        status, actualLevel = getRCUDaliOutputStatusActualLevel(i, s)
        list_rcu_initial_information.append({ "address": str(i),
                                                "name": name,
                                                "status": status,
                                                "actualLevel": str(actualLevel),
                                                "deviceType": deviceType})
        
        if "error" in status.lower() or "fail" in status.lower(): # hata varsa 
            list_lighting_status.append({ "address": str(i),
                                            "name": name,
                                            "deviceType": deviceType,
                                            "status": "1",
                                            "controllerType":"RCU"}) 
        else: # hata yoksa
            list_lighting_status.append({ "address": str(i),
                                            "name": name,
                                            "deviceType": deviceType,
                                            "status": "0",
                                            "controllerType":"RCU"}) # status = 1 error demek
    
    logger.info(f"getRCUOutputDeviceInformation list_lighting_status: {list_lighting_status}")
    updateLightingAlarmsData(blokNumarasi, katNumarasi, odaNumarasi, list_lighting_status)
 
    dnd_mur_lnd_Responce_raw = getRCUDNDMURLND(s)
    logger.info(f"getRCUOutputDeviceInformation: dnd_mur_lnd_Responce_raw: {dnd_mur_lnd_Responce_raw}")
    dndActive = str(int(dnd_mur_lnd_Responce_raw[-6:-4]))
    murActive = str(int(dnd_mur_lnd_Responce_raw[-4:-2]))
    lndActive = str(int(dnd_mur_lnd_Responce_raw[-2:]))
    logger.info(f"getRCUOutputDeviceInformation: dndActive: {dndActive}, murActive: {murActive}, lndActive: {lndActive}")

    mur = ""
    if murActive == "2": 
        hkInRoom = "1"
        murActive = "1"
        mur = "mur_started" 
    elif murActive == "1":
        murActive = "1"
        mur = "mur_requested" 
    elif murActive == "0" and controllerInfo[ip_address]["murPrevState"] == "temizlik_baslamadi":
        murActive = "0"
        mur = "mur_cancelled" 
    elif murActive == "0" and controllerInfo[ip_address]["murPrevState"] == "temizlik_basladi":
        murActive = "0"
        mur = "mur_finished" 
    else: 
        murActive = "0"
    logger.info(f"getRCUOutputDeviceInformation: murActive: {murActive}")
    logger.info(f"getRCUOutputDeviceInformation: hkInRoom: {hkInRoom}")

    setEventsDNDAppRoomServiceMUR(blokNumarasi, katNumarasi, odaNumarasi, mur)

    room_occupied_responce_raw = getRoomOccupied(s)
    logger.info(f"getRCUOutputDeviceInformation: room_occupied_responce_raw: {room_occupied_responce_raw}")
    roomOccupied = str(int(room_occupied_responce_raw[-2:]))

    door_open_responce_raw = getDoorOpen(s)
    logger.info(f"getRCUOutputDeviceInformation: door_open_responce_raw: {door_open_responce_raw}")
    doorOpen = str(int(door_open_responce_raw[-2:]))
    open_door_alarm = "door_closed"
    if doorOpen == "1":
        open_door_alarm = "door_open"
    
    updateOpenDoorAlarmsData(blokNumarasi, katNumarasi, odaNumarasi, open_door_alarm, "Emergency")

    dict_rcu_initial_information = {    "blokNumarasi": blokNumarasi,
                                        "katNumarasi": katNumarasi,
                                        "odaNumarasi": odaNumarasi, 
                                        "deviceType": dbDeviceType,
                                        "ip": ip_address,
                                        "comError": comError,
                                        "roomOccupied": roomOccupied,
                                        "dndActive": dndActive,
                                        "lndActive": lndActive,
                                        "murActive": murActive,
                                        "hkInRoom": hkInRoom,
                                        "doorOpen": doorOpen,
                                        "list_controller_initial_information": list_rcu_initial_information}

    logger.info(f"getRCUOutputDeviceInformation: dict_rcu_initial_information: {dict_rcu_initial_information}")
    response = setControllerInitialInformationToDB(dict_rcu_initial_information)
    if response:
        logger.info("getRCUOutputDeviceInformation: RCU ilklendirme verisi basarili bir sekilde db'ye kaydedildi.")

def setOutputDeviceActualLevel(ip, list_address_actual_level, devType = "RCU"):
    global responce_data_list
    # operations
    logger.info(f"list_address_actual_level: {list_address_actual_level}")
    url = "http://"+internal_host+"/setOutputDeviceActualLevel/"
    dummy_data = [{"ip":ip, "list_address_actual_level":list_address_actual_level}]
    # Veriyi API'ye gönder
    try:
        json_data = json.dumps(dummy_data)
        response = requests.post(url, data=json_data)
        response.raise_for_status()  # Hata durumunda istisna yükselt

        if response.json()["setOutputDeviceActualLevel"]:
            # Başarılı yanıtı işleyin
            logger.info("Veri başariyla kaydedildi")
            responce_data_list = []
            return True
        else: return False

    except requests.exceptions.RequestException as e:
        logger.info(f"Veri gönderilirken hata oluştu: {e}")
        if e.response is not None:
            logger.info(f"Hata yanit kodu: {e.response.status_code}")
            logger.info(f"Hata yanit içeriği: {e.response.text}")
        return False 

def helvarRouterSendAndReceive(ip_address, port, request):
    """
    Belirtilen IP adresi ve port ile bir socket bağlantısı kurar, istenen sorguyu gönderir ve yanıtı alır.
    """
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(2)
        s.connect((ip_address, port))
        s.sendall(request.encode('ascii'))
        response = s.recv(1024).decode('ascii')
    return response

def helvarRouterSend(ip_address, port, request):
    """
    Belirtilen IP adresi ve port ile bir socket bağlantısı kurar, istenen sorguyu gönderir ve yanıtı alır.
    """
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(2)
        s.connect((ip_address, port))
        s.sendall(request.encode('ascii'))

def getHelvarRouterInitialInformation(blokNumarasi, katNumarasi, odaNumarasi, ip_address, port):
    """
        Helvar dan output cihazlara ait address, device name, status, actual level ve device type bilgilerini alir
    """
    
    logger.info("getHelvarRouterInitialInformation")
    
    global helvar_start_address, helvar_end_address

    splitted_ip = ip_address.split(".")
    post_fix = splitted_ip[-2]+"."+splitted_ip[-1]

    dbDeviceType = "Helvar Router"
    comError = "0"
    roomOccupied = "0"
    dndActive = "0"
    lndActive = "0"
    murActive = "0"
    hkInRoom = "0"
    doorOpen = "0"
    list_helvar_router_initial_information = []
    list_lighting_status = []
    # Tüm sorguları gerçekleştiren tek bir döngü
    for address in range(helvar_start_address, helvar_end_address + 1):
        deviceType = ""
        name = ""
        status = ""
        actualLevel = "0"
        try:
            # Cihaz türü sorgusu
            deviceType_raw = helvarRouterSendAndReceive(ip_address, port, f'>V:2,C:104,@{post_fix}.1.{address}##')
            deviceType = helvarDeviceType.get(deviceType_raw.split("=")[-1].replace("#", ""), "Masthed Device Type Number Error")

            # İsim sorgusu
            name_raw = helvarRouterSendAndReceive(ip_address, port, f'>V:2,C:106,@{post_fix}.1.{address}##')
            name = name_raw.split("=")[-1].replace("#", "")

            # Cihaz durumu sorgusu
            status_raw = helvarRouterSendAndReceive(ip_address, port, f'>V:2,C:110,@{post_fix}.1.{address}##')
            status = status_raw.split("=")[-1].replace("#", "")
            status = "No" if status == "0" else status

            # Cihaz doğrudan seviye sorgusu
            actualLevel_raw = helvarRouterSendAndReceive(ip_address, port, f'>V:1,C:152,@{post_fix}.1.{address}##')
            actualLevel = actualLevel_raw.split("=")[-1].replace("#", "")

        except socket.timeout:
            print(f'Adres {address} için zaman aşımı.')
            break 
        except socket.error as e:
            print(f'Adres {address} için bağlantı hatası: {e}')
        
        # logger.info(f"getHelvarRouterInitialInformation: address: {address}, device name: {name}, status: {status}, actual level: {actualLevel}, deviceType: {deviceType}")
        if status != "11" and (deviceType in list(helvarDeviceType.values())):
            list_helvar_router_initial_information.append({ "address": str(address),
                                                            "name": name,
                                                            "status": status,
                                                            "actualLevel": actualLevel,
                                                            "deviceType": deviceType})
            if status == "No": # hata yoksa 
                list_lighting_status.append({ "address": str(address),
                                              "name": name,
                                              "deviceType": deviceType,
                                              "status": "0",
                                              "controllerType":"Helvar"}) 
            else: # hata varsa
                list_lighting_status.append({ "address": str(address),
                                             "name": name,
                                              "deviceType": deviceType,
                                              "status": "1",
                                              "controllerType":"Helvar"}) # status = 1 error demek
        else: 
            list_helvar_router_initial_information.append({ "address": str(address),
                                                            "name": "",
                                                            "status": "",
                                                            "actualLevel": "",
                                                            "deviceType": ""})
    
    logger.info(f"getHelvarRouterInitialInformation list_lighting_status: {list_lighting_status}")
    updateLightingAlarmsData(blokNumarasi, katNumarasi, odaNumarasi, list_lighting_status)

    roomOccupiedResponce_raw = helvarRouterSendAndReceive(ip_address, port, f'>V:2,C:109,G:1000##')
    roomOccupied = roomOccupiedResponce_raw.split("=")[-1].split("#")[0]
    if roomOccupied == "1": roomOccupied = "1"
    elif roomOccupied == "15": roomOccupied = "0"
    logger.info(f"getHelvarRouterInitialInformation: dndResponceroomOccupiedResponce_raw_raw: {roomOccupiedResponce_raw}, roomOccupied: {roomOccupied}")

    murResponce_raw = helvarRouterSendAndReceive(ip_address, port, f'>V:2,C:109,G:1001##')
    murActive = murResponce_raw.split("=")[-1].split("#")[0]
    mur = ""
    if murActive == "3": 
        hkInRoom = "1"
        murActive = "1"
        mur = "mur_started" 
    elif murActive == "1":
        murActive = "1"
        mur = "mur_requested" 
    elif murActive == "2" and controllerInfo[ip_address]["murPrevState"] == "temizlik_baslamadi":
        murActive = "0"
        mur = "mur_cancelled" 
    elif murActive == "2" and controllerInfo[ip_address]["murPrevState"] == "temizlik_basladi":
        murActive = "0"
        mur = "mur_finished" 
    else: 
        murActive = "0"
    logger.info(f"getHelvarRouterInitialInformation: murResponce_raw: {murResponce_raw}, murActive: {murActive}")
    logger.info(f"getHelvarRouterInitialInformation: hkInRoom: {hkInRoom}")
    
    setEventsDNDAppRoomServiceMUR(blokNumarasi, katNumarasi, odaNumarasi, mur)

    dndResponce_raw = helvarRouterSendAndReceive(ip_address, port, f'>V:2,C:109,G:1002##')
    dndActive = dndResponce_raw.split("=")[-1].split("#")[0]
    if dndActive == "1": dndActive = "1"
    elif dndActive == "15": dndActive = "0"
    logger.info(f"getHelvarRouterInitialInformation: dndResponce_raw: {dndResponce_raw}, dndActive: {dndActive}")

    lndResponce_raw = helvarRouterSendAndReceive(ip_address, port, f'>V:2,C:109,G:1003##')
    lndActive = lndResponce_raw.split("=")[-1].split("#")[0]
    if lndActive == "1": lndActive = "1"
    elif lndActive == "15": lndActive = "0"
    logger.info(f"getHelvarRouterInitialInformation: lndResponce_raw: {lndResponce_raw}, lndActive: {lndActive}")

    doorOpenResponce_raw = helvarRouterSendAndReceive(ip_address, port, f'>V:2,C:109,G:1006##')
    doorOpen = doorOpenResponce_raw.split("=")[-1].split("#")[0]
    open_door_alarm = "door_closed"
    if doorOpen == "1": doorOpen = "0"
    elif doorOpen == "15": 
        doorOpen = "1"
        open_door_alarm = "door_open"
    logger.info(f"getHelvarRouterInitialInformation: doorOpenResponce_raw: {doorOpenResponce_raw}, doorOpen: {doorOpen}, open_door_alarm: {open_door_alarm}")

    updateOpenDoorAlarmsData(blokNumarasi, katNumarasi, odaNumarasi, open_door_alarm, "Emergency")

    dict_helvar_router_initial_information = {  "blokNumarasi": blokNumarasi,
                                                "katNumarasi": katNumarasi,
                                                "odaNumarasi": odaNumarasi,
                                                "deviceType": dbDeviceType,
                                                "ip": ip_address,
                                                "comError": comError,
                                                "roomOccupied": roomOccupied,
                                                "dndActive": dndActive,
                                                "lndActive": lndActive,
                                                "murActive": murActive,
                                                "hkInRoom": hkInRoom,
                                                "doorOpen": doorOpen,
                                                "list_controller_initial_information": list_helvar_router_initial_information}
    
    logger.info(f"listen_tcp_connection_helvar: dict_helvar_router_initial_information: {dict_helvar_router_initial_information}")

    if setControllerInitialInformationToDB(dict_helvar_router_initial_information):
        logger.info("listen_tcp_connection_helvar: Helvar router ilklendirme verisi basarili bir sekilde db'ye kaydedildi.")
    
def helvar_heartbeat_check(ip, port):
    """
        helvar_heartbeat_check fonksiyonu, verilen IP ve port'a 2 saniye içinde bağlanarak heartbeat sinyali almayı dener. 
        Eğer bu süre zarfında cevap alınamazsa, fonksiyon False döndürerek bağlantının başarısız olduğunu belirtir.
    """
    splitted_ip = ip.split(".")
    post_fix = splitted_ip[-2]+"."+splitted_ip[-1]
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(2)
            s.connect((ip, port))
            pcp_request_name = f'>V:2,C:106,@{post_fix}.1.{1}##'
            s.sendall(pcp_request_name.encode('ascii'))
            response_name = s.recv(1024)
            name = response_name.decode('ascii')
            logger.info(f"ip: {ip} port: {port} Heartbeat: {name}")
            return True
    except (socket.timeout, socket.error) as e:
        logger.info(f'Heartbeat failed for {ip}:{port} - {e}')
        return False

def rcu_heartbeat_check(s, ip, port):
    """
        rcu_heartbeat_check fonksiyonu, verilen IP ve port'a 2 saniye içinde bağlanarak heartbeat sinyali almayı dener. 
        Eğer bu süre zarfında cevap alınamazsa, fonksiyon False döndürerek bağlantının başarısız olduğunu belirtir.
    """
    try:
        hex_data = [0x3E, 0x03, 0x00, 0x02, 0x00, 0x10] # Q Device Name [0x3E, 0x03, 0x02, 0x00, 0x10] 
        # Veriyi byte dizisine çevirme
        byte_data = bytearray(hex_data)
        # Hexadecimal veriyi gönderme
        s.sendall(byte_data)
        # logger.info(f"Gönderilen veri: {byte_data.hex()}")
        
        # Sunucudan yanıt alma
        data = s.recv(1024)
        # logger.info(f"Sunucudan gelen data: \n{data}")
        data_hex = data.hex()
        responce_data_list.append(data_hex)
        # ASCII veriyi çözme ve temizleme
        ascii_data = data.decode("ascii", errors="ignore")
        logger.info(f"ip: {ip} port: {port} Heartbeat: {ascii_data} - {data}")
        return True
    except (socket.timeout, socket.error) as e:
        logger.info(f'Heartbeat failed for {ip}:{port} - {e}')
        return False
    
@shared_task
def listen_tcp_connection_v2(ip, port):

    global sockets, responce_data_list, controllerInfo, onboard_output_devices_queried_address_hex

    blokNumarasi, katNumarasi, odaNumarasi =  controllerInfo[ip]["ipBlokKatOda"]    

    isSocketConnectionEstablished = False
    sock = sockets.get((ip, port))
    logger.info(f"listen_tcp_connection_v2: {ip} {port} socket baglantisi: {sock}")

    if sock:
        logger.info(f"listen_tcp_connection_v2: {ip} {port} sockets listesinde bulundu.")
        if rcu_heartbeat_check(sock, ip, port): # eger heart beat varsa, soket baglantisi var demektir   
            isSocketConnectionEstablished = True
            logger.info(f"listen_tcp_connection_v2: rcu_heartbeat_check ok")
            
            # rcu bilgileri periyodik olarak yeniden taraniyor 
            current_time = int(time.time())
            time_diff = current_time - controllerInfo[ip]["periyodicTaskVariables"][0]
            logger.info(f"listen_tcp_connection_v2: gecen sure: {time_diff}, periodic task interval: {controllerInfo[ip]["periyodicTaskVariables"][1]}")
            if int(time_diff/60) >= controllerInfo[ip]["periyodicTaskVariables"][1]:
                sock.close()
                del sockets[(ip, port)]
        else:
            del sockets[(ip, port)]
            isSocketConnectionEstablished = False
            if controllerInfo[ip]["comErrorPrevState"] == "0":
                    responce_controller_alarm_save = updateControllerComErrorData(blokNumarasi, katNumarasi, odaNumarasi, "1", "RCU", ip)
                    responce_comError_save = setControllerComError(blokNumarasi, katNumarasi, odaNumarasi)
                    if responce_controller_alarm_save and responce_comError_save: 
                        controllerInfo[ip]["comErrorPrevState"] = "1"


    else:
        logger.info(f"listen_tcp_connection_v2: {ip} {port} sockets listesinde bulunamadi.") 
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)  # 1 saniyelik zaman aşımı
            sock.connect((ip, port))
            sockets[(ip, port)] = sock
            isSocketConnectionEstablished = True
            updateControllerComErrorData(blokNumarasi, katNumarasi, odaNumarasi, "0", "RCU", ip)
            controllerInfo[ip]["comErrorPrevState"] = "0"
            logger.info(f"listen_tcp_connection_v2: TCP bağlantisi {ip}:{port} başariyla sağlandi.")

            controllerInfo[ip]["periyodicTaskVariables"][0] = int(time.time()) # suanki zamani ilgili ip icin kaydet, 

            # initialize 
            getRCUOutputDeviceInformation(blokNumarasi, katNumarasi, odaNumarasi, ip, sock)
            
        except socket.error as e:
            logger.info(f"listen_tcp_connection_v2: TCP bağlantisi {ip}:{port} saglanamadi. {e}")
            if (ip, port) in sockets: del sockets[(ip, port)]
            isSocketConnectionEstablished = False
            if controllerInfo[ip]["comErrorPrevState"] == "0":
                responce_controller_alarm_save = updateControllerComErrorData(blokNumarasi, katNumarasi, odaNumarasi, "1", "RCU", ip)
                responce_comError_save = setControllerComError(blokNumarasi, katNumarasi, odaNumarasi)
                if responce_controller_alarm_save and responce_comError_save: 
                    controllerInfo[ip]["comErrorPrevState"] = "1"
            return 
    if isSocketConnectionEstablished:

        try:
            # listen socket
            logger.info(f"listen_tcp_connection_v2: listening {ip} started.")
            sock.settimeout(3)  
            response = sock.recv(1024)
            response = response.hex()
            if response:
                responce_data_list.append(response)

            logger.info(f"listen_tcp_connection_v2: responce_data_list: {responce_data_list}")

            final_list_event_onboard_input_events = []
            final_list_control_general_ack = []
            final_list_event_dnd_app_mur_request = []
            final_list_event_dnd_app_laundry_request = []
            final_list_event_dnd_app_dnd_request = []
            final_list_event_occupancy_room_occupied = []
            final_list_event_open_door_alarm = []
            final_list_event_rcu_modbus_termostat_Y9600 = []
            for responce_data in responce_data_list: # responce_data icerisindeki islemleri gerceklestir eger gerceklesirse temizle gerceklesmezse bir sonraki turda gerceklesir

                # list_event_onboard_input_events: butona basilma sonucu gelen mesaj
                list_event_onboard_input_events, list_control_general_ack, list_event_dnd_app_mur_request, list_event_dnd_app_laundry_request, list_event_dnd_app_dnd_request, list_event_occupancy_room_occupied, list_event_open_door_alarm, list_event_rcu_modbus_termostat_Y9600 = parse_string(ip, responce_data) 

                final_list_event_onboard_input_events.extend(list_event_onboard_input_events)
                final_list_event_dnd_app_mur_request.extend(list_event_dnd_app_mur_request)
                final_list_event_dnd_app_laundry_request.extend(list_event_dnd_app_laundry_request)
                final_list_event_dnd_app_dnd_request.extend(list_event_dnd_app_dnd_request)
                final_list_event_occupancy_room_occupied.extend(list_event_occupancy_room_occupied)
                final_list_control_general_ack.extend(list_control_general_ack)
                final_list_event_open_door_alarm.extend(list_event_open_door_alarm)
                final_list_event_rcu_modbus_termostat_Y9600.extend(list_event_rcu_modbus_termostat_Y9600)

            logger.info(f"final_list_event_onboard_input_events: {final_list_event_onboard_input_events}")
            logger.info(f"final_list_event_dnd_app_mur_request: {final_list_event_dnd_app_mur_request}")
            logger.info(f"final_list_event_dnd_app_laundry_request: {final_list_event_dnd_app_laundry_request}")
            logger.info(f"final_list_event_dnd_app_dnd_request: {final_list_event_dnd_app_dnd_request}")
            logger.info(f"final_list_event_occupancy_room_occupied: {final_list_event_occupancy_room_occupied}")
            logger.info(f"final_list_control_general_ack: {final_list_control_general_ack}")
            logger.info(f"final_list_event_open_door_alarm: {final_list_event_open_door_alarm}")
            logger.info(f"final_list_event_rcu_modbus_termostat_Y9600: {final_list_event_rcu_modbus_termostat_Y9600}")
            
            if len(final_list_event_dnd_app_mur_request) == 0:
                dummy_mur = None
            else:
                dummy_mur = final_list_event_dnd_app_mur_request[-1]

            if len(final_list_event_dnd_app_laundry_request) == 0:
                dummy_lnd = None
            else:
                dummy_lnd = final_list_event_dnd_app_laundry_request[-1]

            if len(final_list_event_dnd_app_dnd_request) == 0:
                dummy_dnd = None
            else:
                dummy_dnd = final_list_event_dnd_app_dnd_request[-1]
            
            if len(final_list_event_occupancy_room_occupied) == 0:
                dummy_room_occupied = None
            else:
                dummy_room_occupied = final_list_event_occupancy_room_occupied[-1]
            
            if len(final_list_event_open_door_alarm) == 0:
                dummy_open_door_alarm = None
            else:
                dummy_open_door_alarm = final_list_event_open_door_alarm[-1]

            blokNumarasi, katNumarasi, odaNumarasi = controllerInfo[ip]["ipBlokKatOda"]                              
            if dummy_mur != None or dummy_lnd != None or dummy_dnd != None or dummy_room_occupied != None:
                setEventsMURLNDDNDRoomOccupiedOpenDoor(blokNumarasi, katNumarasi, odaNumarasi, dummy_mur, dummy_lnd, dummy_dnd, dummy_room_occupied, dummy_open_door_alarm)
            if dummy_mur != None:
                setEventsDNDAppRoomServiceMUR(blokNumarasi, katNumarasi, odaNumarasi, dummy_mur)
                
            # open door alarm
            if dummy_open_door_alarm != None:
                updateOpenDoorAlarmsData(blokNumarasi, katNumarasi, odaNumarasi, dummy_open_door_alarm, "Emergency")

            # rcu modbus termostat 
            if len(final_list_event_rcu_modbus_termostat_Y9600) > 0: 
                updateRCUModbusTermostatT9600(blokNumarasi, katNumarasi, odaNumarasi, final_list_event_rcu_modbus_termostat_Y9600[-1])

            if len(final_list_event_onboard_input_events) > 0: # Her bir onboard event icin actual level sorgusu yapiliyor.

                logger.info("Her bir output un actual level sorgusu yapiliyor.")
                list_address_actual_level = []
                for i in onboard_output_devices_queried_address_hex: # kcy burada bulunan liste ilklendirme sirasinda olusturulmali

                    actualLevel = getRCUOnboardOutputActualLevel(i, sock)
                    list_address_actual_level.append({"address": str(i),
                                                      "actualLevel": str(actualLevel)})
                    
                # RCU DALI Output
                list_dali_input_output_address = getRCUDaliInputOutputAddress(sock) # rcu ya takili dali cihazlarin adreslerini al
                list_rcu_dali_output_address  = getRCUDaliOutputAddress(list_dali_input_output_address, sock) # rcu ya takili cihazlardan hangilerinin output oldugunu bul

                for i in list_rcu_dali_output_address: 
                    
                    _, actualLevel = getRCUDaliOutputStatusActualLevel(i, sock)
                    list_address_actual_level.append({"address": str(i),
                                                      "actualLevel": str(actualLevel)})
        
                setOutputDeviceActualLevel(ip, list_address_actual_level) # gelen veriyi db ye kaydet
        
        except socket.timeout:
            logger.info(f"RCU Timeout occurred while listening to {ip}:{port}")
        except Exception as e:
            logger.info(f"RCU An error occurred while listening to {ip}:{port} - {e}")
        
@shared_task
def listen_tcp_connection_helvar(ip, port):

    global sockets, controllerInfo

    global helvar_start_address, helvar_end_address 
    
    blokNumarasi, katNumarasi, odaNumarasi =  controllerInfo[ip]["ipBlokKatOda"]    

    splitted_ip = ip.split(".")
    post_fix = splitted_ip[-2]+"."+splitted_ip[-1]

    isSocketConnectionEstablished = False
    sock = sockets.get((ip, port))
    logger.info(f"listen_tcp_connection_helvar: {ip} {port} socket baglantisi: {sock}")

    if sock:    
        logger.info(f"listen_tcp_connection_helvar: {ip} {port} sockets listesinde bulundu.")
        if helvar_heartbeat_check(ip, port): # eger heart beat varsa, soket baglantisi var demektir
            isSocketConnectionEstablished = True
            controllerInfo[ip]["comErrorPrevState"] = "0"

            # helvar router bilgileri periyodik olarak yeniden taraniyor 
            current_time = int(time.time())
            time_diff = current_time - controllerInfo[ip]["periyodicTaskVariables"][0]
            logger.info(f"listen_tcp_connection_helvar: gecen sure: {time_diff}, periodic task interval: {controllerInfo[ip]["periyodicTaskVariables"][1]}")
            if int(time_diff/60) >= controllerInfo[ip]["periyodicTaskVariables"][1]:
                sock.close()
                del sockets[(ip, port)]

        else: # eger heart beat yoksa, soket baglantisi yok demektir, soket listeden silinir, alarm db icin comError olusturulur, helvarrcu db icin comError kaydi yapilir
            del sockets[(ip, port)]
            isSocketConnectionEstablished = False
            if controllerInfo[ip]["comErrorPrevState"] == "0":
                    responce_controller_alarm_save = updateControllerComErrorData(blokNumarasi, katNumarasi, odaNumarasi, "1", "Helvar", ip)
                    responce_comError_save = setControllerComError(blokNumarasi, katNumarasi, odaNumarasi)
                    if responce_controller_alarm_save and responce_comError_save: 
                        controllerInfo[ip]["comErrorPrevState"] = "1"
    else:
        # Bağlantı yoksa yeni bağlantı kur
        logger.info(f"listen_tcp_connection_helvar: {ip} {port} sockets listesinde bulunamadi.")
        if helvar_heartbeat_check(ip, port):
            try:
                # Cihazın başlangıç bilgilerini al ve veritabanına kaydet
                getHelvarRouterInitialInformation(blokNumarasi, katNumarasi, odaNumarasi, ip, port)

                # Yeni bir TCP bağlantısı kur
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(1)  # 1 saniyelik zaman aşımı
                sock.connect((ip, port))
                sockets[(ip, port)] = sock
                isSocketConnectionEstablished = True
                updateControllerComErrorData(blokNumarasi, katNumarasi, odaNumarasi, "0", "Helvar", ip)
                controllerInfo[ip]["comErrorPrevState"] = "0"
                logger.info(f"listen_tcp_connection_helvar: TCP bağlantisi {ip}:{port} başariyla sağlandi. comErrorPrevState: {controllerInfo[ip]["comErrorPrevState"]}")

                controllerInfo[ip]["periyodicTaskVariables"][0] = int(time.time()) # suanki zamani ilgili ip icin kaydet, 

            except (socket.timeout, socket.error) as e:
                if isinstance(e, socket.timeout):
                    logger.info("listen_tcp_connection_helvar: TCP bağlantısı iki kez zaman aşımına uğradı. İşlem sonlandırılıyor.")
                else:
                    logger.info(f"listen_tcp_connection_helvar: TCP bağlantısı {ip}:{port} sağlanamadı. {e}")

                if (ip, port) in sockets: del sockets[(ip, port)]
                isSocketConnectionEstablished = False
                if controllerInfo[ip]["comErrorPrevState"] == "0":
                    responce_controller_alarm_save = updateControllerComErrorData(blokNumarasi, katNumarasi, odaNumarasi, "1", "Helvar", ip)
                    responce_comError_save = setControllerComError(blokNumarasi, katNumarasi, odaNumarasi)
                    if responce_controller_alarm_save and responce_comError_save: 
                        controllerInfo[ip]["comErrorPrevState"] = "1"
                return 
        else: 
            logger.info(f'listen_tcp_connection_helvar: Heartbeat alinamadi. comErrorPrevState: {controllerInfo[ip]["comErrorPrevState"]}')
            if (ip, port) in sockets: del sockets[(ip, port)]
            isSocketConnectionEstablished = False  
            if controllerInfo[ip]["comErrorPrevState"] == "0":
                responce_controller_alarm_save =  updateControllerComErrorData(blokNumarasi, katNumarasi, odaNumarasi, "1", "Helvar", ip)
                responce_comError_save = setControllerComError(blokNumarasi, katNumarasi, odaNumarasi)
                if responce_controller_alarm_save and responce_comError_save: 
                    controllerInfo[ip]["comErrorPrevState"] = "1"
            
    if isSocketConnectionEstablished: 

        try:
            # listen socket
            logger.info(f"listen_tcp_connection_helvar: listening {ip} started.")
            sock.settimeout(3)  
            response = sock.recv(1024)
            response_ascii = response.decode('ascii')
            if response_ascii:
                controllerInfo[ip]["responceDataList"].append(response_ascii)

            logger.info(f"listen_tcp_connection_helvar: responceDataList {ip} {controllerInfo[ip]["responceDataList"]}")

            final_list_event_onboard_input_events = []
            final_list_event_dnd_app_mur_request = []
            final_list_event_dnd_app_laundry_request = []
            final_list_event_dnd_app_dnd_request = []
            final_list_event_occupancy_room_occupied = []
            final_list_event_open_door_alarm = []
            for responce_data in controllerInfo[ip]["responceDataList"]: # responce_data icerisindeki islemleri gerceklestir eger gerceklesirse temizle gerceklesmezse bir sonraki turda gerceklesir

                list_event_onboard_input_events, list_event_dnd_app_mur_request, list_event_dnd_app_laundry_request, list_event_dnd_app_dnd_request, list_event_occupancy_room_occupied, list_event_open_door_alarm = parse_string_helvar(responce_data, ip) 

                final_list_event_onboard_input_events.extend(list_event_onboard_input_events)
                final_list_event_dnd_app_mur_request.extend(list_event_dnd_app_mur_request)
                final_list_event_dnd_app_laundry_request.extend(list_event_dnd_app_laundry_request)
                final_list_event_dnd_app_dnd_request.extend(list_event_dnd_app_dnd_request)
                final_list_event_occupancy_room_occupied.extend(list_event_occupancy_room_occupied)
                final_list_event_open_door_alarm.extend(list_event_open_door_alarm)

            logger.info(f"final_list_event_onboard_input_events: {final_list_event_onboard_input_events}")
            logger.info(f"final_list_event_dnd_app_mur_request: {final_list_event_dnd_app_mur_request}")
            logger.info(f"final_list_event_dnd_app_laundry_request: {final_list_event_dnd_app_laundry_request}")
            logger.info(f"final_list_event_dnd_app_dnd_request: {final_list_event_dnd_app_dnd_request}")
            logger.info(f"final_list_event_occupancy_room_occupied: {final_list_event_occupancy_room_occupied}")
            logger.info(f"final_list_event_open_door_alarm: {final_list_event_open_door_alarm}")
            
            if len(final_list_event_dnd_app_mur_request) == 0: dummy_mur = None
            else: dummy_mur = final_list_event_dnd_app_mur_request[-1]

            if len(final_list_event_dnd_app_laundry_request) == 0: dummy_lnd = None
            else: dummy_lnd = final_list_event_dnd_app_laundry_request[-1]

            if len(final_list_event_dnd_app_dnd_request) == 0: dummy_dnd = None
            else: dummy_dnd = final_list_event_dnd_app_dnd_request[-1]
            
            if len(final_list_event_occupancy_room_occupied) == 0: dummy_room_occupied = None
            else: dummy_room_occupied = final_list_event_occupancy_room_occupied[-1]

            if len(final_list_event_open_door_alarm) == 0: dummy_open_door_alarm = None
            else: dummy_open_door_alarm = final_list_event_open_door_alarm[-1]
                                  
            if dummy_mur != None or dummy_lnd != None or dummy_dnd != None or dummy_room_occupied != None or dummy_open_door_alarm != None:
                if setEventsMURLNDDNDRoomOccupiedOpenDoor(blokNumarasi, katNumarasi, odaNumarasi, dummy_mur, dummy_lnd, dummy_dnd, dummy_room_occupied, dummy_open_door_alarm): 
                    controllerInfo[ip]["responceDataList"] = []
            
            # mur alarm
            if dummy_mur != None:
                setEventsDNDAppRoomServiceMUR(blokNumarasi, katNumarasi, odaNumarasi, dummy_mur)

            # open door alarm
            if dummy_open_door_alarm != None:
                updateOpenDoorAlarmsData(blokNumarasi, katNumarasi, odaNumarasi, dummy_open_door_alarm, "Emergency")

            if len(final_list_event_onboard_input_events) > 0: # br butona basildi Her bir output un actual level sorgusu yapiliyor.

                logger.info("listen_tcp_connection_helvar: Her bir output un actual level sorgusu yapiliyor.")

                sock.close()
                del sockets[(ip, port)]

                list_address_actual_level = []
                for address in range(helvar_start_address, helvar_end_address + 1):

                    actualLevel = "0"
                    try:

                        actualLevel_raw = helvarRouterSendAndReceive(ip, port, f'>V:1,C:152,@{post_fix}.1.{address}##')
                        actualLevel = actualLevel_raw.split("=")[-1].replace("#", "")

                    except socket.timeout:
                        print(f'Adres {address} için zaman aşımı.')
                        break
                    except socket.error as e:
                        print(f'Adres {address} için bağlantı hatası: {e}')

                    list_address_actual_level.append({"address": str(address),
                                                      "actualLevel": actualLevel})
                    
                if setOutputDeviceActualLevel(ip, list_address_actual_level, "Helvar"): 
                    controllerInfo[ip]["responceDataList"] = [] 

                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(1)  # 1 saniyelik zaman aşımı
                sock.connect((ip, port))
                sockets[(ip, port)] = sock
                logger.info(f"listen_tcp_connection_helvar: TCP bağlantisi {ip}:{port} başariyla yeniden sağlandi.")
        except socket.timeout:
            logger.info(f"Helvar Timeout occurred while listening to {ip}:{port}")
        except Exception as e:
            logger.info(f"Helvar An error occurred while listening to {ip}:{port} - {e}")