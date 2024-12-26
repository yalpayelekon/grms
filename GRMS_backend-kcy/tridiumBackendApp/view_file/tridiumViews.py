from django.http import JsonResponse
from ..serializers import MekanikDataSerializer
from rest_framework import viewsets, status
from ..models import MekanikData, AlarmsData, PMSData
from rest_framework.response import Response
import json
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .helper import logger

class ModelViewTridium(viewsets.ViewSet):
    
    def putDataFromTridiumToDB(self, request, blokNumarasi, katNumarasi, odaNumarasi):
        logger.info(f"putDataFromTridiumToDB: blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}")
        instance = MekanikData.objects.filter(blokNumarasi=blokNumarasi, katNumarasi=katNumarasi, odaNumarasi=odaNumarasi).first()
        # print("instance: ", instance)
        if not instance:
            return Response(status=status.HTTP_404_NOT_FOUND)
        logger.info(f"request.data: {request.data}")

        # com error
        com_error = request.data.get("comError", None)
        if com_error == "1": # com Error var
            logger.info("hvac comError")
            if instance.comError == "0":
                logger.info("hvac comError 0 di")
                # Create a mock request for updateAlarmsData
                data = json.dumps([{
                    'blokNumarasi': blokNumarasi,
                    'katNumarasi': katNumarasi,
                    'odaNumarasi': odaNumarasi,
                    'alarmType': 'HVAC',
                    'alarmStatus': '1'
                }])
                # Call updateAlarmsData with a mock request object
                class MockRequest:
                    def __init__(self, body):
                        self.body = body
                        self.method = 'POST'
                        self.content_type = 'application/json'
                
                mock_request = MockRequest(data)
                response = updateAlarmsData(mock_request)
        elif com_error == "0": # com Error yok
            logger.info("hvac comError yok")
            if instance.comError == "1":
                logger.info("hvac comError 1 di")
                # Create a mock request for updateAlarmsData
                data = json.dumps([{
                    'blokNumarasi': blokNumarasi,
                    'katNumarasi': katNumarasi,
                    'odaNumarasi': odaNumarasi,
                    'alarmType': 'HVAC',
                    'alarmStatus': '0'
                }])
                # Call updateAlarmsData with a mock request object
                class MockRequest:
                    def __init__(self, body):
                        self.body = body
                        self.method = 'POST'
                        self.content_type = 'application/json'
                
                mock_request = MockRequest(data)
                response = updateAlarmsData(mock_request)


        # Only update fields that are not empty
        for field, value in request.data.items():
            logger.info(f"request.data: field: {field}, value {value}")
            if value != "" and field != "blokNumarasi":
                setattr(instance, field, str(int(float(value))))
            elif value != "" and field == "blokNumarasi":
                setattr(instance, field, str(value))

        instance.save()

        return Response(status=status.HTTP_200_OK)
    
    def putPMSDataFromTridiumToDB(self, request):

        instance = PMSData.objects.first()
        if not instance:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        logger.info(f"request.data: {request.data}")

        # com error
        pms_error = request.data.get("pmsError", None)
        if pms_error == "1": # com Error var
            if instance.pmsError == "0":
                # Create a mock request for updateAlarmsData
                data = json.dumps([{
                    'blokNumarasi': "-",
                    'katNumarasi': "-",
                    'odaNumarasi': " ",
                    'alarmType': 'PMS',
                    'alarmStatus': '1'
                }])
                # Call updateAlarmsData with a mock request object
                class MockRequest:
                    def __init__(self, body):
                        self.body = body
                        self.method = 'POST'
                        self.content_type = 'application/json'
                
                mock_request = MockRequest(data)
                response = updateAlarmsData(mock_request)
        elif pms_error == "0": # pms_error yok
            if instance.pmsError == "1":

                # Create a mock request for updateAlarmsData
                data = json.dumps([{
                    'blokNumarasi': "-",
                    'katNumarasi': "-",
                    'odaNumarasi': " ",
                    'alarmType': 'PMS',
                    'alarmStatus': '0'
                }])
                # Call updateAlarmsData with a mock request object
                class MockRequest:
                    def __init__(self, body):
                        self.body = body
                        self.method = 'POST'
                        self.content_type = 'application/json'
                
                mock_request = MockRequest(data)
                response = updateAlarmsData(mock_request)

        # Only update fields that are not empty
        for field, value in request.data.items():
            logger.info(f"request.data: field: {field}, value {value}")
            if value != "":
                setattr(instance, field, str(int(float(value))))

        instance.save()

        return Response(status=status.HTTP_200_OK)

@csrf_exempt   
def getDataFromDBToTridium(request, odaNumarasi):
    """
        tridium serverdan get ediyor
    """
    logger.info(f"getDataFromDBToTridium: odaNumarasi: {odaNumarasi}")
    if odaNumarasi is not None:
        queryset = MekanikData.objects.filter(odaNumarasi=odaNumarasi)

    serializer = MekanikDataSerializer(queryset, many=True)
    logger.info(f"getDataFromDBToTridium data: {serializer.data[0]}")
    return JsonResponse(serializer.data[0])

@csrf_exempt
def updateAlarmsData(request):
    try:
        data = json.loads(request.body)
        data = data[0]
        logger.debug(f"input data: {data}")

        blokNumarasi = data.get("blokNumarasi")
        katNumarasi = data.get("katNumarasi")
        odaNumarasi = data.get("odaNumarasi")
        alarmType = data.get("alarmType") # "Lighting", "RCU", "HVAC", "Helvar", "Emergency" (Open Door)
        
        logger.debug(f"blokNumarasi: {blokNumarasi}, katNumarasi: {katNumarasi}, odaNumarasi: {odaNumarasi}, alarmType: {alarmType}")

        now = timezone.now()
        # logger.debug(f"Current time: {now}")

        if alarmType == "RCU" or alarmType == "Helvar":

            alarmStatus = data.get("alarmStatus")

            rcuAlarmDetails = {'ip': data.get("ip")}  # rcuAlarmDetails'e ip ekle
            if alarmStatus == "1": # gelen veride alarm varsa
                # Veritabanında eşleşen veri olup olmadığını kontrol et
                exists = AlarmsData.objects.filter(
                    blokNumarasi=blokNumarasi,
                    katNumarasi=katNumarasi,
                    odaNumarasi=odaNumarasi,
                    alarmType=alarmType,
                    alarmStatus=alarmStatus
                ).exists()

                if not exists: # Eğer eşleşen veri yoksa yeni bir veri oluştur
                    AlarmsData.objects.create(
                        blokNumarasi=blokNumarasi,
                        katNumarasi=katNumarasi,
                        odaNumarasi=odaNumarasi,
                        alarmType=alarmType,
                        alarmStatus=alarmStatus,
                        rcuAlarmDetails=rcuAlarmDetails, 
                        alarmStartTime=now,
                    )
                    logger.debug(f"New alarm is added. {data}")
                    return JsonResponse({'status': 'success', 'new data created': True})
                else: # eger eslesen bir veri varsa
                    logger.debug(f"This alarm was already created. {data}")
                    return JsonResponse({'status': 'success', 'new data created.': False})
            elif alarmStatus == "0": # gelen veride alarm yoksa yani alarm duzeltildiyse
                try:
                    alarm = AlarmsData.objects.get( # Veritabanında eşleşen veri olup olmadığını kontrol et
                        blokNumarasi=blokNumarasi,
                        katNumarasi=katNumarasi,
                        odaNumarasi=odaNumarasi,
                        alarmType=alarmType,
                        alarmStatus="1" # onceden verilen bir alarm var mi
                    )
                    if alarm: # eger alarmStatus = 0 geldiyse ve onceden alarmStatus degeri 1 olan bir veri varsa, veriyi fixed olarak guncelle
                        alarm.alarmStatus = "0"
                        alarm.alarmEndTime = now
                        alarm.save()
                        logger.debug(f"Existing alarm fixed. {data}")
                        return JsonResponse({'status': 'success', 'Existing alarm fixed.': True})
                except AlarmsData.DoesNotExist:
                    logger.debug(f"Boyle bir alarm yok. {data}")
                    return JsonResponse({'status': 'success', 'message': "Boyle bir alarm yok."})
            else: logger.debug(f"Alarm kodu yanlis. {data}")
        
        elif alarmType == "Emergency" or alarmType == "HVAC" or alarmType == "PMS" :
            
            alarmStatus = data.get("alarmStatus")

            if alarmStatus == "1": # gelen veride alarm varsa
                # Veritabanında eşleşen veri olup olmadığını kontrol et
                exists = AlarmsData.objects.filter(
                    blokNumarasi=blokNumarasi,
                    katNumarasi=katNumarasi,
                    odaNumarasi=odaNumarasi,
                    alarmType=alarmType,
                    alarmStatus=alarmStatus
                ).exists()

                if not exists: # Eğer eşleşen veri yoksa yeni bir veri oluştur
                    AlarmsData.objects.create(
                        blokNumarasi=blokNumarasi,
                        katNumarasi=katNumarasi,
                        odaNumarasi=odaNumarasi,
                        alarmType=alarmType,
                        alarmStatus=alarmStatus,
                        alarmStartTime=now,
                    )
                    logger.debug(f"New alarm is added. {data}")
                    return JsonResponse({'status': 'success', 'new data created': True})
                else: # eger eslesen bir veri varsa
                    logger.debug(f"This alarm was already created. {data}")
                    return JsonResponse({'status': 'success', 'new data created.': False})
            elif alarmStatus == "0": # gelen veride alarm yoksa yani alarm duzeltildiyse
                try:
                    alarm = AlarmsData.objects.get( # Veritabanında eşleşen veri olup olmadığını kontrol et
                        blokNumarasi=blokNumarasi,
                        katNumarasi=katNumarasi,
                        odaNumarasi=odaNumarasi,
                        alarmType=alarmType,
                        alarmStatus="1" # onceden verilen bir alarm var mi
                    )
                    if alarm: # eger alarmStatus = 0 geldiyse ve onceden alarmStatus degeri 1 olan bir veri varsa, veriyi fixed olarak guncelle
                        alarm.alarmStatus = "0"
                        alarm.alarmEndTime = now
                        alarm.save()
                        logger.debug(f"Existing alarm fixed. {data}")
                        return JsonResponse({'status': 'success', 'Existing alarm fixed.': True})
                except AlarmsData.DoesNotExist:
                    logger.debug(f"Boyle bir alarm yok. {data}")
                    return JsonResponse({'status': 'success', 'message': "Boyle bir alarm yok."})
            else: logger.debug(f"Alarm kodu yanlis. {data}")
        elif alarmType == "Lighting":
            
            list_alarmStatusLighting = data.get("alarmStatusLighting")
            logger.debug(f"list_alarmStatusLighting: {list_alarmStatusLighting}")

            for i in list_alarmStatusLighting:
                address = i["address"]
                alarmStatus = i["status"]
                lightingName = i["name"]
                lightingDeviceType = i["deviceType"]
                controllerType = i["controllerType"]

                logger.debug(f"address: {address}, alarmStatus: {alarmStatus}") 
                if alarmStatus == "1": # gelen veride alarm varsa
                    # Veritabanında eşleşen veri olup olmadığını kontrol et
                    exists = AlarmsData.objects.filter(
                        blokNumarasi=blokNumarasi,
                        katNumarasi=katNumarasi,
                        odaNumarasi=odaNumarasi,
                        address=address,
                        alarmType=alarmType,
                        alarmStatus=alarmStatus
                    ).exists()

                    if not exists: # Eğer eşleşen veri yoksa yeni bir veri oluştur
                        AlarmsData.objects.create(
                            blokNumarasi=blokNumarasi,
                            katNumarasi=katNumarasi,
                            odaNumarasi=odaNumarasi,
                            address=address,
                            alarmType=alarmType,
                            alarmStatus=alarmStatus,
                            alarmStartTime=now,
                            lightingAlarmDetails={"address":address, "name":lightingName, "deviceType": lightingDeviceType, "controllerType":controllerType}
                        )
                        logger.debug(f"New alarm is added. {data}")
                    else: # eger eslesen bir veri varsa
                        logger.debug(f"This alarm was already created. {data}")
                elif alarmStatus == "0": # gelen veride alarm yoksa yani alarm duzeltildiyse
                    try:
                        alarm = AlarmsData.objects.get( # Veritabanında eşleşen veri olup olmadığını kontrol et
                            blokNumarasi=blokNumarasi,
                            katNumarasi=katNumarasi,
                            odaNumarasi=odaNumarasi,
                            address=address,
                            alarmType=alarmType,
                            alarmStatus="1" # onceden verilen bir alarm var mi
                        )
                        if alarm: # eger alarmStatus = 0 geldiyse ve onceden alarmStatus degeri 1 olan bir veri varsa, veriyi fixed olarak guncelle
                            alarm.alarmStatus = "0"
                            alarm.alarmEndTime = now
                            alarm.save()
                            logger.debug(f"Existing alarm fixed. {data}")
                    except AlarmsData.DoesNotExist:
                        logger.debug(f"Boyle bir alarm yok. {data}")
                else: logger.debug(f"Alarm kodu yanlis. {data}")
            return JsonResponse({'status': 'success'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid alarm type'}, status=400)
        
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        return JsonResponse({'status': 'error', 'message': 'An internal error occurred'}, status=500)