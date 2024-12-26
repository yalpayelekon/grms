from django.http import JsonResponse
from rest_framework import status
from ..models import MekanikData, RCUHelvarRouterData, RoomServiceMURData
from ..serializers import RCUHelvarRouterDataSerializer
from django.shortcuts import get_object_or_404
import json

from django.views.decorators.csrf import csrf_exempt
from ..tasks import setControllerActualLevel, setRCUModbus
from django.utils import timezone
from .helper import logger

def find_actual_level(data, desired_address):
    for item in data['list_address_actual_level']:
        if item['address'] == desired_address:
            return item['actualLevel']
    return None  # Adres bulunamazsa None döndürür

@csrf_exempt
def updateRoomServicesMURData(request):

    try:
        data = json.loads(request.body)
        logger.debug(f"data: {data}")

        blokNumarasi = data.get("blokNumarasi")
        katNumarasi = data.get("katNumarasi")
        odaNumarasi = data.get("odaNumarasi")
        eventType = data.get("eventType") # 0 -> musteri mur talebi, 1 -> musteri mur iptal, 2 -> HK oda temizligi basladi, 3 -> HK oda temizligi bitti
        logger.debug(f"blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}, eventType: {eventType}")

        now = timezone.now()
        logger.debug(f"Current time: {now}")

        mur_data_instance = RoomServiceMURData.objects.filter(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi)
        logger.debug(f"mur_data_instance: {mur_data_instance}")

        if mur_data_instance.exists():
            all_status_cleaned_or_cancelled = all(item.status in ["3", "4"] for item in mur_data_instance) 
            logger.debug(f"all_status_cleaned_or_cancelled: {all_status_cleaned_or_cancelled}")
            if all_status_cleaned_or_cancelled: # Eğer tüm status değerleri "3" cleaned veya "4" cancelled ise yeni veri ekle
                if eventType == "0": # 0 -> musteri mur talebi
                    new_mur_data = RoomServiceMURData.objects.create(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi, status="0", customerRequest="1", customerRequestTime=now, ackStatus = "0", isDelayed = "0")
                    logger.debug(f"New room service data created: {new_mur_data}")
            else:
                logger.debug("Not all statuses are '3'. No new data created.")
                if eventType == "1": # 1 -> musteri mur iptal
                    RoomServiceMURData.objects.filter(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi, status__in=["0"]).update(status="4", customerRequest="0")
                    logger.debug(f"Customer mur iptal etti. eventType: {eventType}")
                elif eventType == "2": # 2 -> HK oda temizligi basladi
                    RoomServiceMURData.objects.filter(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi, status__in=["0"]).update(status="2", serviceStartTime=now)
                    logger.debug(f"HK oda temizligi basladi eventType: {eventType}")
                elif eventType == "3": # 3 -> HK oda temizligi bitti
                    dummy_serviceStartTime = get_object_or_404(RoomServiceMURData, blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi, status__in=["0", "2"]).serviceStartTime
                    logger.debug(f"dummy_serviceStartTime: {dummy_serviceStartTime}")

                    if dummy_serviceStartTime is not None: # serviceResponceTime hesapla
                        serviceResponceTime = now - dummy_serviceStartTime
                    else: 
                        logger.debug("Temizlik başlamadan (hk temizlik basladi event i gelmeden) temizlik tamamlandı.")
                        serviceResponceTime = now - now
                    logger.debug(f"serviceResponceTime: {serviceResponceTime}")

                    dummy_customerRequestTime = get_object_or_404(RoomServiceMURData, blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi, status__in=["0", "2"]).customerRequestTime
                    logger.debug(f"dummy_customerRequestTime: {dummy_customerRequestTime}")
                    if dummy_customerRequestTime is not None: # requestResponceTime hesapla
                        requestResponceTime = now - dummy_customerRequestTime
                    else: 
                        logger.debug("Temizlik başlamadan (hk temizlik basladi event i gelmeden) temizlik tamamlandı.")
                        requestResponceTime = now - now
                    logger.debug(f"requestResponceTime: {requestResponceTime}")
                    RoomServiceMURData.objects.filter(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi, status__in=["0", "2"]).update(status="3", serviceEndTime=now, customerRequest="0", serviceResponceTime=str(serviceResponceTime), requestResponceTime=str(requestResponceTime))
                    logger.debug(f"HK oda temizligi bitti eventType: {eventType}")
        else:
            if eventType == "0": # 0 -> musteri mur talebi
                new_mur_data = RoomServiceMURData.objects.create(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi, status="0", customerRequest="1", customerRequestTime=now, ackStatus = "0", isDelayed = "0")
                logger.debug(f"New mur data created: {new_mur_data}")

        return JsonResponse({"updateRoomServicesMURData": True})

    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {e}")
        return JsonResponse({"error": "Invalid JSON format"}, status=400)

    except RoomServiceMURData.DoesNotExist as e:
        logger.error(f"RoomServiceMURData does not exist: {e}")
        return JsonResponse({"error": "Room service data not found"}, status=404)

    except Exception as e:
        logger.error(f"An error occurred: {e}")
        return JsonResponse({"error": "An unexpected error occurred"}, status=500)

@csrf_exempt
def setEventsMURLNDDNDRoomOccupiedOpenDoor(request):
    # logger.debug(f"request.method: {request.method}")
    if request.method == 'POST':
        try:
            data = json.loads(request.body)[0]
            logger.debug(f"data: {data}")

            blokNumarasi = data.get("blokNumarasi")
            katNumarasi = data.get("katNumarasi")
            odaNumarasi = data.get("odaNumarasi")
            mur = data.get("murActive")
            lnd = data.get("lndActive")
            dnd = data.get("dndActive")
            hkInRoom = data.get("hkInRoom")
            roomOccupied = data.get("roomOccupied")
            doorOpen = data.get("doorOpen")

            record = RCUHelvarRouterData.objects.get(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi)

            if record:
                if mur != "-1":
                    record.murActive = mur
                if lnd != "-1":
                    record.lndActive = lnd
                if dnd != "-1":
                    record.dndActive = dnd
                if hkInRoom != "-1":
                    record.hkInRoom = hkInRoom
                if roomOccupied != "-1":
                    record.roomOccupied = roomOccupied
                if doorOpen != "-1":
                    record.doorOpen = doorOpen
                # Kaydet
                record.save()
                
                logger.info("Veriler başarıyla güncellendi")
                return JsonResponse({'setEventsMURLNDDNDRoomOccupiedOpenDoor': True}, status=200)
            else:
                logger.warning("setEventsMURLNDDNDRoomOccupiedOpenDoor: Kayıt bulunamadı")
                return JsonResponse({'error': 'No records found to update'}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)
    else:
        # Geçersiz metod durumu (örneğin GET isteği)
        return JsonResponse({'error': 'Unsupported method'}, status=405)

@csrf_exempt
def updateRCUModbusTermostatT9600Data(request):
    logger.debug(f"request.method: {request.method}")
    if request.method == 'POST':
        try:
            data = json.loads(request.body)[0]
            logger.debug(f"data: {data}")

            blokNumarasi = data.get("blokNumarasi")
            katNumarasi = data.get("katNumarasi")
            odaNumarasi = data.get("odaNumarasi")
            fanMode = data.get("fanMode")
            mode = data.get("mode")
            onOf = data.get("onOf")
            runningstatus = data.get("runningstatus")
            setPoint = data.get("setPoint")
            roomTemperature = data.get("roomTemperature")  
            keylockFunction = data.get("keylockFunction")  
            occupancyInput = data.get("occupancyInput")  
            lowerSetpoint = data.get("lowerSetpoint")  
            upperSetpoint = data.get("upperSetpoint")  
            confortTemperature = data.get("confortTemperature")  

            record = MekanikData.objects.get(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi)

            if record:
                if fanMode != "-1":
                    record.fanMode = fanMode
                if mode != "-1":
                    record.mode = mode
                if onOf != "-1":
                    record.onOf = onOf
                if runningstatus != "-1":
                    record.runningstatus = runningstatus
                if setPoint != "-1":
                    record.setPoint = setPoint
                if roomTemperature != "-1":
                    record.roomTemperature = roomTemperature
                if keylockFunction != "-1":
                    record.keylockFunction = keylockFunction
                if occupancyInput != "-1":
                    record.occupancyInput = occupancyInput
                if lowerSetpoint != "-1":
                    record.lowerSetpoint = lowerSetpoint
                if upperSetpoint != "-1":
                    record.upperSetpoint = upperSetpoint
                if confortTemperature != "-1":
                    record.confortTemperature = confortTemperature
                    
                # Kaydet
                record.save()
                
                logger.info("Veriler başarıyla güncellendi")
                return JsonResponse({'updateRCUModbusTermostatT9600Data': True}, status=200)
            else:
                logger.warning("updateRCUModbusTermostatT9600Data: Kayıt bulunamadı")
                return JsonResponse({'error': 'No records found to update'}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)
    else:
        # Geçersiz metod durumu (örneğin GET isteği)
        return JsonResponse({'error': 'Unsupported method'}, status=405)
    
@csrf_exempt
def setControllerInitialInformationToDB(request):
    # logger.debug(f"request.method: {request.method}")
    if request.method == 'POST':
        try:
            data = json.loads(request.body)[0]
            logger.debug(f"data: {data}")

            blokNumarasi = data["blokNumarasi"]
            katNumarasi = data["katNumarasi"]
            odaNumarasi = data["odaNumarasi"]

            deviceType = data["deviceType"]
            ip = data["ip"]
            comError = data["comError"]
            roomOccupied = data["roomOccupied"]
            dndActive = data["dndActive"]
            lndActive = data["lndActive"]
            murActive = data["murActive"]
            hkInRoom = data["hkInRoom"]
            doorOpen = data["doorOpen"]
            # RCUHelvarRouterData modelinden veriyi çek
            try:
                instance = RCUHelvarRouterData.objects.get(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi)
                instance.deviceType = deviceType
                instance.comError = comError
                instance.ip = ip
                instance.roomOccupied = roomOccupied
                instance.dndActive = dndActive
                instance.lndActive = lndActive
                instance.murActive = murActive
                instance.hkInRoom = hkInRoom
                instance.doorOpen = doorOpen
                instance.outputDevices = data.get("list_controller_initial_information", [])
                instance.save()
                logger.info("Output devices saved to database.")
                return JsonResponse({'setControllerInitialInformationToDB': True}, status=200)

            except RCUHelvarRouterData.DoesNotExist:
                return JsonResponse({'error': 'Instance not found for the given IP'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)
    else:
        # Geçersiz metod durumu (örneğin GET isteği)
        return JsonResponse({'error': 'Unsupported method'}, status=405)

@csrf_exempt
def setControllerComError(request):
    # logger.debug(f"request.method: {request.method}")
    if request.method == 'POST':
        try:
            data = json.loads(request.body)[0]
            logger.debug(f"data: {data}")

            blokNumarasi = data["blokNumarasi"]
            katNumarasi = data["katNumarasi"]
            odaNumarasi = data["odaNumarasi"]

            # RCUHelvarRouterData modelinden veriyi çek
            try:
                instance = RCUHelvarRouterData.objects.get(blokNumarasi = blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi)
                instance.comError = "1"
                instance.save()
                logger.debug(f"blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi,} comError: 1")
                return JsonResponse({'setControllerComError': True}, status=200)

            except RCUHelvarRouterData.DoesNotExist:
                return JsonResponse({'error': 'Instance not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)
    else:
        # Geçersiz metod durumu (örneğin GET isteği)
        return JsonResponse({'error': 'Unsupported method'}, status=405)
    
@csrf_exempt
def setOutputDeviceActualLevel(request):
    logger.debug(f"request.method: {request.method}")
    if request.method == 'POST':
        try:
            data = json.loads(request.body)[0]
            logger.debug(f"data: {data}")

            ip = data["ip"]
            # RCUHelvarRouterData modelinden veriyi çek
            try:
                instance = RCUHelvarRouterData.objects.get(ip=ip)
                logger.debug(f"instance: {instance}")
                outputDevices = instance.outputDevices
                logger.debug(f"outputDevices: {outputDevices}")
                
                if len(outputDevices) == 0: # eger bossa
                    logger.debug("Output devices are empty")
                    instance.outputDevices = data.get("list_address_actual_level", [])
                    instance.save()
                    logger.info("Output devices saved to database.")
                    return JsonResponse({'setOutputDeviceActualLevel': True}, status=200)

                else:
                    list_new_device = []
                    for device in outputDevices:
                        logger.debug(f"device: {device}")
                        desired_address = device["address"]
                        changed_actual_level = find_actual_level(data, desired_address)

                        if changed_actual_level is not None:
                            logger.debug(f"Address {desired_address} için actual Level değeri: {changed_actual_level}")
                            device["actualLevel"] = changed_actual_level
                        else:
                            logger.debug(f"Adres {desired_address} bulunamadi.")

                        list_new_device.append(device)

                    logger.debug(f"list_new_device: {list_new_device}")

                    # Güncellenecek veriyi hazırla
                    updated_data = {"outputDevices": list_new_device}
                    serializer = RCUHelvarRouterDataSerializer(instance, data=updated_data, partial=True)
                    
                    if serializer.is_valid():
                        serializer.save()
                        print("setOutputDeviceActualLevel Veri alani başariyla güncellendi.")
                        # JSON formatında serialize edilmiş veriyi al
                        # serialized_data = JSONRenderer().render(serializer.data)
                        # print(serialized_data)
                        return JsonResponse({'setOutputDeviceActualLevel': True}, status=200)
                    else:
                        print("setOutputDeviceActualLevel Veri doğrulamasi başarisiz:", serializer.errors)
                        return JsonResponse(serializer.errors, status=400)              
            except RCUHelvarRouterData.DoesNotExist:
                return JsonResponse({'error': 'Instance not found for the given IP'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)
    else:
        # Geçersiz metod durumu (örneğin GET isteği)
        return JsonResponse({'error': 'Unsupported method'}, status=405)    

@csrf_exempt
def putControllerActualLevelData(request, blokNumarasi, katNumarasi, odaNumarasi, ip):
    
    logger.info(f"blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}, ip: {ip}")
        
    try:
        data = json.loads(request.body)
        logger.info(f"data: {data}")
        # Burada JSON verisini işleyip gerekli işlemleri yapabilirsiniz
        # İşlem başarılıysa:
        address = data["address"]
        actualLevel = data["actualLevel"]
        setControllerActualLevelResult = setControllerActualLevel.delay(ip, address, actualLevel).get(timeout=100)
        logger.info(f"setControllerActualLevelResult: {setControllerActualLevelResult}")

        if setControllerActualLevelResult:
            logger.info(f"ip: {ip } address: {address}, actualLevel: {actualLevel} verisi cihaza gonderildi.")
            instance = RCUHelvarRouterData.objects.get( blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi)
                
            # outputDevices'ı güncelle
            output_devices = instance.outputDevices
            updated = False
            for device in output_devices:
                if device.get("address") == str(address):
                    device["actualLevel"] = str(actualLevel)
                    updated = True
                    break

            if updated:
                # Güncellenmiş outputDevices'ı kaydet
                instance.outputDevices = output_devices
                instance.save()
                return JsonResponse({"message": "Data processed successfully"}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({"error": "Address not found in outputDevices"}, status=404)
        else:
            return JsonResponse({"error": "Address not found in outputDevices"}, status=404)
        
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def putRoomStatusHVACData(request, blokNumarasi, katNumarasi, odaNumarasi):
    """
        modbus eklentisi icin yapildi
    """
    logger.debug(f"putRoomStatusHVACData blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}")
    
    # Mevcut instance'ı al veya 404 döndür
    try:
        instance = MekanikData.objects.get(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi)
    except MekanikData.DoesNotExist:
        return JsonResponse({"error": "Instance not found"}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        request_data = json.loads(request.body)
        logger.debug(f"putRoomStatusHVACData: request_data: {request_data}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Gelen veri ile veritabanındaki veriyi karşılaştırarak yalnızca değişiklikleri sakla
    updated_data = {}
    for field, new_value in request_data.items():
        current_value = getattr(instance, field, None)
        if str(current_value) != str(new_value):  # Karakter string karşılaştırması yapılır
            updated_data[field] = new_value  # Değişiklik varsa updated_data'ya ekle
    
    # updated_data'yi ekrana bastır
    logger.debug(f"putRoomStatusHVACData: Updated fields (only changes): {updated_data}")
    
    # Eğer güncellenecek alan yoksa
    if not updated_data:
        return JsonResponse({"message": "No changes detected"}, status=status.HTTP_200_OK)
    
    else:
        # Yalnızca değişen alanları güncelle
        for field, value in updated_data.items():
            setattr(instance, field, value)
        
        if setRCUModbus.delay(blokNumarasi, katNumarasi, odaNumarasi, updated_data):
            logger.debug(f"putRoomStatusHVACData: rcu ya modbus verisi gonderildi")
        # Güncellemeyi kaydet
        instance.save()
        
        # Güncellenmiş veriyi döndür
        return JsonResponse({"message": "Data updated successfully", "updated_fields": updated_data}, status=status.HTTP_200_OK)
