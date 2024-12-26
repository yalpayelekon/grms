from rest_framework import serializers
from .models import MekanikData, RCUHelvarRouterData, RoomServiceMURData, AlarmsData, PMSData 

class MekanikDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = MekanikData
        # fields = '__all__'
        exclude = ['id']

class RoomServiceMURDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomServiceMURData
        # fields = '__all__'
        exclude = ['id']

class AlarmsDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlarmsData
        # fields = '__all__'
        exclude = ['id']

class PMSDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = PMSData
        # fields = '__all__'
        exclude = ['id']

class OutputDeviceSerializer(serializers.Serializer):
    address = serializers.CharField(max_length=200, required=False, allow_blank=True)
    name = serializers.CharField(max_length=200, required=False, allow_blank=True)
    vairety = serializers.CharField(max_length=200, required=False, allow_blank=True)
    phyMinLevel = serializers.CharField(max_length=200, required=False, allow_blank=True)
    targetLevel = serializers.CharField(max_length=200, required=False, allow_blank=True)
    actualLevel = serializers.CharField(max_length=200, required=False, allow_blank=True)
    lastActiveLevel = serializers.CharField(max_length=200, required=False, allow_blank=True)
    status = serializers.CharField(max_length=200, required=False, allow_blank=True)
    deviceType = serializers.CharField(max_length=200, required=False, allow_blank=True)
    situation = serializers.CharField(max_length=200, required=False, allow_blank=True)
    feature = serializers.CharField(max_length=200, required=False, allow_blank=True)
    maxLevel = serializers.CharField(max_length=200, required=False, allow_blank=True)
    minLevel = serializers.CharField(max_length=200, required=False, allow_blank=True)
    powerOnLevel = serializers.CharField(max_length=200, required=False, allow_blank=True)
    failureLevel = serializers.CharField(max_length=200, required=False, allow_blank=True)
    fadeTime = serializers.CharField(max_length=200, required=False, allow_blank=True)
    scenes = serializers.CharField(max_length=200, required=False, allow_blank=True)
    groupSettings = serializers.ListField(child=serializers.CharField(max_length=200), required=False)

class RCUHelvarRouterDataSerializer(serializers.ModelSerializer):
    outputDevices = OutputDeviceSerializer(many=True)
    class Meta:
        model = RCUHelvarRouterData
        # fields = '__all__'
        exclude = ['id']
        