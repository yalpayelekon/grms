from django.http import JsonResponse
from ..models import MekanikData, RCUHelvarRouterData, BlokKatOdaData, RoomServiceMURData, BlokKatOda
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from .helper import logger

@csrf_exempt
def getRoomStatusData(request, blokNumarasi, katNumarasi):
        
    logger.debug(f"blokNumarasi={blokNumarasi}, katNumarasi={katNumarasi}")

    blokkatodaInstance = BlokKatOda.objects.filter(blokNumarasi=blokNumarasi).first()

    # Eğer sonuç varsa, isGenelMahal değerini al
    if blokkatodaInstance:
        isGenelMahal = blokkatodaInstance.isGenelMahal
    else:
        isGenelMahal = None  # Veya varsayılan bir değer döndürebilirsiniz

    # Filtreleme işlemi
    blokKatOdaDataInstance = BlokKatOdaData.objects.filter(
        blokKatOda__blokNumarasi=blokNumarasi,  # blokKatOda'dan blokNumarasi'ni kullanıyoruz
        katNumarasi=katNumarasi                 # ve katNumarasi'ne göre filtreliyoruz
    )

    # logger.debug(f"blokKatOdaDataInstance: {blokKatOdaDataInstance}, BlokKatOdaData_instance_len: {len(blokKatOdaDataInstance)}")

    room_status_data = []
    rented_occupied_number, rented_hk_number, rented_vacant_number, unrented_hk_number, unrented_vacant_number, malfunction_number = 0,0,0,0,0,0
    try:
        for instance in blokKatOdaDataInstance.iterator():
            odaNumarasi = instance.odaNumarasi
            logger.debug(f"odaNumarasi: {odaNumarasi}")

            MekanikData_instance = MekanikData.objects.get(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi)
            logger.debug(f"MekanikData_instance: {MekanikData_instance}")

            isHvacActive = "0"
            # print(f"getRoomStatusData hvac onOf: {MekanikData_instance.onOf}")
            if MekanikData_instance.onOf == "1": # hvac on
                if MekanikData_instance.mode == "0": # tridiumdan gelen veri heat ise 
                    isHvacActive = "2" # hvac heating 
                elif MekanikData_instance.mode == "1": # tridiumdan gelen veri cool ise
                    isHvacActive = "1" # hvac cooling
                elif MekanikData_instance.mode == "2": # tridiumdan gelen veri Fan Only ise
                    isHvacActive = "1" # hvac cooling
                elif MekanikData_instance.mode == "3": # tridiumdan gelen veri Auto ise
                    isHvacActive = "1" # hvac cooling
                else: pass
            elif MekanikData_instance.onOf == "0": # hvac of 
                isHvacActive = "0" # hvac kapali
            else: logger.debug("Error MekanikData_instance.onOf")
            # print(f"getRoomStatusData isHvacActive: {isHvacActive}")

            RCUData_instance = RCUHelvarRouterData.objects.get(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi)
            # print(f"getRoomStatusData RCUData_instance: {RCUData_instance}")

            anyLightingActive = "0" # oda icerisinde herhangi bir armatur aktif degil
            for oDevice in RCUData_instance.outputDevices:
                if oDevice["name"] != "":
                    if int(oDevice["actualLevel"]) != 0:
                        anyLightingActive = "1"
                        break

            dndActive = "0" # oda icerisinde DND aktif degil
            if RCUData_instance.dndActive == "0":
                dndActive = "0" 
            elif RCUData_instance.dndActive == "1":
                dndActive = "1" # oda icerisinde herhangi bir DND aktif degil
            else: logger.debug("Error RCUData_instance.dndActive")
            # print(f"getRoomStatusData dndActive: {dndActive}")
            
            lndActive = "0" # oda icerisinde Lnd aktif degil
            if RCUData_instance.lndActive == "0":
                lndActive = "0" 
            elif RCUData_instance.lndActive == "1":
                lndActive = "1" # oda icerisinde herhangi bir Lnd aktif degil
            else: logger.debug("Error RCUData_instance.lndActive")
            # print(f"getRoomStatusData lndActive: {lndActive}")

            murActive = "0" # oda icerisinde Lnd aktif degil
            isMurDelayed = "0"
            if RCUData_instance.murActive == "0":
                murActive = "0" 
            elif RCUData_instance.murActive == "1":
                murActive = "1" # oda icerisinde herhangi bir Lnd aktif degil
                room_service_mur_data_instance = RoomServiceMURData.objects.get(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi, status__in = ["0", "2"])
                isMurDelayed = room_service_mur_data_instance.isDelayed
            else: logger.debug("Error RCUData_instance.murActive")
            # print(f"getRoomStatusData murActive: {murActive}")
            
            # room status: roomState
            roomStateErrorList = []
            roomState = "0"

            statusError = "0"
            # outputDevices listesinde dolaşarak status kontrolü yapma
            for device in RCUData_instance.outputDevices:
                if device["status"] != "No":
                    statusError = "1"
                    break  # "1" ayarlandığında döngüden çık

            if MekanikData_instance.fidelio == "0" and RCUData_instance.roomOccupied == "0" and RCUData_instance.hkInRoom == "0": # unrented and vacant
                roomState = "0"
                c = 0
                if MekanikData_instance.comError == "1":
                    roomState = "7"
                    roomStateErrorList.append("HVAC Error")
                    c += 1
                if RCUData_instance.comError == "1":
                    roomState = "7"
                    roomStateErrorList.append("Controller Error")
                    c += 1
                if RCUData_instance.doorOpenAlarm == "1":
                    roomState = "7"
                    roomStateErrorList.append("Emergency: Door Open")
                    c += 1
                if statusError == "1":
                    roomState = "7"
                    roomStateErrorList.append("Lighting Error")
                    c += 1
                if c == 0:
                    unrented_vacant_number += 1 
            if MekanikData_instance.fidelio == "0" and RCUData_instance.hkInRoom == "1": # unrented and hk
                roomState = "1"
                c = 0
                if MekanikData_instance.comError == "1":
                    roomState = "8"
                    roomStateErrorList.append("HVAC Error")
                    c += 1
                if RCUData_instance.comError == "1":
                    roomState = "8"
                    roomStateErrorList.append("Controller Error")
                    c += 1
                if RCUData_instance.doorOpenAlarm == "1":
                    roomState = "8"
                    roomStateErrorList.append("Emergency: Door Open")
                    c += 1
                if statusError == "1":
                    roomState = "8"
                    roomStateErrorList.append("Lighting Error")
                    c += 1
                if c == 0:
                    unrented_hk_number += 1 
            if MekanikData_instance.fidelio == "1" and RCUData_instance.roomOccupied == "0" and RCUData_instance.hkInRoom == "0": # rented and vacant
                roomState = "2"
                c = 0
                if MekanikData_instance.comError == "1":
                    roomState = "5"
                    roomStateErrorList.append("HVAC Error")
                    c += 1
                if RCUData_instance.comError == "1":
                    roomState = "5"
                    roomStateErrorList.append("Controller Error")
                    c += 1
                if RCUData_instance.doorOpenAlarm == "1":
                    roomState = "5"
                    roomStateErrorList.append("Emergency: Door Open")
                    c += 1
                if statusError == "1":
                    roomState = "5"
                    roomStateErrorList.append("Lighting Error")
                    c += 1
                if c == 0:
                    rented_vacant_number += 1 
            if MekanikData_instance.fidelio == "1" and RCUData_instance.roomOccupied == "1" and RCUData_instance.hkInRoom == "0": # rented and musteri
                roomState = "3"
                c = 0
                if MekanikData_instance.comError == "1":
                    roomState = "6"
                    roomStateErrorList.append("HVAC Error")
                    c += 1
                if RCUData_instance.comError == "1":
                    roomState = "6"
                    roomStateErrorList.append("Controller Error")
                    c += 1
                if RCUData_instance.doorOpenAlarm == "1":
                    roomState = "6"
                    roomStateErrorList.append("Emergency: Door Open")
                    c += 1
                if statusError == "1":
                    roomState = "6"
                    roomStateErrorList.append("Lighting Error")
                    c += 1
                if c == 0:
                    rented_occupied_number += 1 
            if MekanikData_instance.fidelio == "1" and RCUData_instance.hkInRoom == "1": # rented and hk
                roomState = "4"
                c = 0
                if MekanikData_instance.comError == "1":
                    roomState = "8"
                    roomStateErrorList.append("HVAC Error")
                    c += 1
                if RCUData_instance.comError == "1":
                    roomState = "8"
                    roomStateErrorList.append("RCU Hatası")
                    c += 1
                if RCUData_instance.doorOpenAlarm == "1":
                    roomState = "8"
                    roomStateErrorList.append("Emergency: Door Open")
                    c += 1
                if statusError == "1":
                    roomState = "8"
                    roomStateErrorList.append("Lighting Error")
                    c += 1
                if c == 0:
                    rented_hk_number += 1 

            dummy_dict = {
                "odaNumarasi": odaNumarasi,
                "roomStateErrorList": roomStateErrorList,
                "roomStatus": {
                    "isAnyLightingActive": anyLightingActive,
                    "isHvacActive": isHvacActive,
                    "isDndActive": dndActive,
                    "isLndActive": lndActive,
                    "isMurActive": murActive,
                    "isLndDelayed": "0",
                    "isMurDelayed": isMurDelayed,
                    "roomState": roomState,
                    "isHVACConnected": instance.isHVACConnected, # HVAC fiziksel olarak var mi, yoksa frontend de gosterilmeyecek
                    "isLightingConnedted": "1" if instance.isRCUConnected == "1" or instance.isHelvarConnected == "1" else "0", # rcu yada helvar fiziksel olarak var mi, yoksa frontend de gosterilmeyecek
                    "isHKServiceConnected": instance.isHKServiceConnected, # hk servisi saglaniyor mu, yoksa frontendede gosterilmeyecek
                }
            }
            # logger.debug(f"dummy_dict: {dummy_dict}")
            room_status_data.append(dummy_dict) # blok ve kat icin room status data
        # logger.debug(f"room_status_data: {room_status_data}")

        malfunction_number = len(blokKatOdaDataInstance) - (rented_occupied_number + rented_hk_number + rented_vacant_number + unrented_hk_number + unrented_vacant_number) 
        list_roomStateNumber = [str(rented_occupied_number), str(rented_hk_number), str(rented_vacant_number), str(unrented_hk_number), str(unrented_vacant_number), str(malfunction_number)]
    except MekanikData.DoesNotExist or RCUHelvarRouterData.DoesNotExist:
        logger.debug(f"not found for blokNumarasi={blokNumarasi}, katNumarasi={katNumarasi}")
    
    return JsonResponse({ "roomStatusData": room_status_data, "roomStateNumber": list_roomStateNumber, "isGenelMahal":isGenelMahal})


@csrf_exempt
def getRoomStatusOutputDeviceData(request, blokNumarasi, katNumarasi, odaNumarasi):
    logger.info(f"blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}")
    
    # Veritabanından veri alma
    room_data = get_object_or_404(RCUHelvarRouterData, blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi)

    try:
        # Verileri al
        output_devices = room_data.outputDevices

        # Filtreleme işlemi
        filtered_devices = [
            device for device in output_devices
            if device["actualLevel"] != "" and device["name"] != ""
        ]

        response_data = {
            "blokNumarasi": room_data.blokNumarasi,
            "katNumarasi": room_data.katNumarasi,
            "odaNumarasi": room_data.odaNumarasi,
            "deviceType": room_data.deviceType,
            "ip": room_data.ip,
            "outputDevices": filtered_devices
        }
            
        logger.debug(f"getRoomStatusOutputDeviceData: {response_data}")
        return JsonResponse(response_data)
    
    except Exception as e:
        logger.error(f"An error occurred: {e}")
        return JsonResponse({'error': 'An error occurred while processing your request.'}, status=500)
    

def getRoomStatusHVACData(request, blokNumarasi, katNumarasi, odaNumarasi):
        print(f"getRoomStatusHVACData: blokNumarasi={blokNumarasi}, katNumarasi={katNumarasi}, odaNumarasi={odaNumarasi}")

        # Initialize an empty dictionary to store results
        room_data = {}

        try:
            # Query MekanikData objects based on blokNumarasi, katNumarasi, and odaNumarasi
            mekanik_data = MekanikData.objects.get(
                blokNumarasi=blokNumarasi,
                katNumarasi=katNumarasi,
                odaNumarasi=odaNumarasi
            )

            # Populate the dictionary with other fields
            room_data = {
                'onOf': mekanik_data.onOf,
                'roomTemperature': mekanik_data.roomTemperature,
                'setPoint': mekanik_data.setPoint,
                'mode': mekanik_data.mode,
                'fanMode': mekanik_data.fanMode,
                'confortTemperature': mekanik_data.confortTemperature,
                'lowerSetpoint': mekanik_data.lowerSetpoint,
                'upperSetpoint': mekanik_data.upperSetpoint,
                'keylockFunction': mekanik_data.keylockFunction,
                'occupancyInput': mekanik_data.occupancyInput,
                'runningstatus': mekanik_data.runningstatus,
                'comError': mekanik_data.comError
            }

        except MekanikData.DoesNotExist:
            print(f"getRoomStatusHVACData not found for blokNumarasi={blokNumarasi}, katNumarasi={katNumarasi}, odaNumarasi={odaNumarasi}")
            # Handle the case where no data is found, e.g., return None or raise an exception

        # Print or return the dictionary
        print("HVAC Modal Data:", room_data)
        
        return JsonResponse({"odaNumarasi": odaNumarasi, "roomStatusHVACData": room_data})
