from django.urls import path
from .view_file import generalViews, tridiumViews, dashboardViews, roomServiceViews, roomStatusViews, roomDetailsViews, alarmsViews, reportsViews, controllerViews, loginViews

urlpatterns = [

    # Login
    path('login/', loginViews.loginView, name='login'),

    # generalViews
    path('getTemperatureData/', generalViews.getTemperatureData, name="getTemperatureData"),
    path('getSeaTemperatureData/', generalViews.getSeaTemperatureData, name="getSeaTemperatureData"),

    # Tridium (Termostat, PMS ve alarm update)
    path('putPMSDataFromTridiumToDB/', tridiumViews.ModelViewTridium.as_view({'put': 'putPMSDataFromTridiumToDB'}), name="putPMSDataFromTridiumToDB"), 
    path('putDataFromTridiumToDB/<str:blokNumarasi>/<str:katNumarasi>/<str:odaNumarasi>', tridiumViews.ModelViewTridium.as_view({'put': 'putDataFromTridiumToDB'}), name="putDataFromTridiumToDB"), 
    path('getDataFromDBToTridium/<int:odaNumarasi>', tridiumViews.getDataFromDBToTridium, name="getDataFromDBToTridium"), # tridiumdan gelen get request bu fonksiyonu cagiracak
    path('updateAlarmsData/', tridiumViews.updateAlarmsData, name="updateAlarmsData"),

    # Dashboard
    path('getDashboardHVACStatusData/', dashboardViews.getDashboardHVACStatusData, name="getDashboardHVACStatusData"),
    path('getDashboardOccupancyRateData/', dashboardViews.getDashboardOccupancyRateData, name="getDashboardOccupancyRateData"),
    path('getDashboardServiceRequestData/', dashboardViews.getDashboardServiceRequestData, name="getDashboardServiceRequestData"),
    path('getDashboardAlarmStatusData/', dashboardViews.getDashboardAlarmStatusData, name="getDashboardAlarmStatusData"),

    # Room Service
    path('getRoomServicesData/', roomServiceViews.getRoomServicesData, name="getRoomServicesData"),
    path('postRoomServicesAckData/', roomServiceViews.postRoomServicesAckData, name="postRoomServicesAckData"),
    
    # Room Status
    path('getRoomStatusData/<str:blokNumarasi>/<str:katNumarasi>/', roomStatusViews.getRoomStatusData, name="getRoomStatusData"),
    path('getRoomStatusOutputDeviceData/<str:blokNumarasi>/<str:katNumarasi>/<str:odaNumarasi>/', roomStatusViews.getRoomStatusOutputDeviceData, name="getRoomStatusOutputDeviceData"),
    path('getRoomStatusHVACData/<str:blokNumarasi>/<str:katNumarasi>/<str:odaNumarasi>/', roomStatusViews.getRoomStatusHVACData, name="getRoomStatusHVACData"),
   
    # Room Details
    path('getRoomDetailsData/<str:blokNumarasi>/<str:katNumarasi>/<str:odaNumarasi>/', roomDetailsViews.getRoomDetailsData, name="getRoomDetailsData"),
    
    # Alarms
    path('getAlarmsData/', alarmsViews.getAlarmsData, name="getAlarmsData"),
    path('postAlarmsAckData/', alarmsViews.postAlarmsAckData, name="postAlarmsAckData"),

    # Reports
    path('getReportsData/<str:dateRange>/<str:reportName>/', reportsViews.getReportsData, name="getReportsData"),

    # Tasks (RCU - HELVAR)
    path('setControllerInitialInformationToDB/', controllerViews.setControllerInitialInformationToDB, name="setControllerInitialInformationToDB"),
    path('setEventsMURLNDDNDRoomOccupiedOpenDoor/', controllerViews.setEventsMURLNDDNDRoomOccupiedOpenDoor, name="setEventsMURLNDDNDRoomOccupiedOpenDoor"), 
    path('setOutputDeviceActualLevel/', controllerViews.setOutputDeviceActualLevel, name="setOutputDeviceActualLevel"),
    path('setControllerComError/', controllerViews.setControllerComError, name="setControllerComError"),
    path('updateRCUModbusTermostatT9600Data/', controllerViews.updateRCUModbusTermostatT9600Data, name="updateRCUModbusTermostatT9600Data"),
    path('putControllerActualLevelData/<str:blokNumarasi>/<str:katNumarasi>/<str:odaNumarasi>/<str:ip>', controllerViews.putControllerActualLevelData, name="putControllerActualLevelData"),
    path('updateRoomServicesMURData/', controllerViews.updateRoomServicesMURData, name="updateRoomServicesMURData"),
    path('putRoomStatusHVACData/<str:blokNumarasi>/<str:katNumarasi>/<str:odaNumarasi>', controllerViews.putRoomStatusHVACData, name="putRoomStatusHVACData"),


    
]