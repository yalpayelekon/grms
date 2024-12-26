from django.contrib import admin
from .models import MekanikData, RCUHelvarRouterData, BlokKatOdaData, AppSettings, RoomServiceMURData, AlarmsData, PMSData, BlokKatOda
from django.contrib.auth.models import User
from .models import Account
from django.contrib.auth.admin import UserAdmin
from django import forms

# Admin formunu oluşturuyoruz
class AccountAdminForm(forms.ModelForm):
    class Meta:
        model = Account
        fields = '__all__'

    # Zorunlu alanlar için 'required' parametresini set ediyoruz
    dashboard = forms.ChoiceField(choices=Account._meta.get_field('dashboard').choices, required=True)
    roomStatus = forms.ChoiceField(choices=Account._meta.get_field('roomStatus').choices, required=True)
    roomServices = forms.ChoiceField(choices=Account._meta.get_field('roomServices').choices, required=True)
    alarms = forms.ChoiceField(choices=Account._meta.get_field('alarms').choices, required=True)
    reports = forms.ChoiceField(choices=Account._meta.get_field('reports').choices, required=True)

# Profilin Admin Panelinde User'a Entegre Edilmesi
class AccountInline(admin.StackedInline):
    model = Account
    can_delete = False
    verbose_name_plural = 'Accounts'
    form = AccountAdminForm

# User Admin Paneline Profile Inline'ı Eklemek
class CustomizedUserAdmin(UserAdmin):
    inlines = (AccountInline,)

# BlokKatOda için özelleştirilmiş admin paneli
class BlokKatOdaAdmin(admin.ModelAdmin):
    # Görüntülenmesini istediğiniz alanlar
    list_display = ('blokNumarasi', 'isGenelMahal')

    # Arama yapılabilecek alanlar
    search_fields = ('blokNumarasi',)

    # Sıralama ayarları
    ordering = ('blokNumarasi',)

    # Filtreleme
    list_filter = ('isGenelMahal',)

# BlokKatOdaData için de benzer bir admin ayarı yapabilirsiniz.
class BlokKatOdaDataAdmin(admin.ModelAdmin):
    list_display = ('blokKatOda', 'katNumarasi', 'odaNumarasi', 'isRCUConnected', 'isHelvarConnected', "ip", "port","isHVACConnected", "isHKServiceConnected")
    search_fields = ('blokKatOda__blokNumarasi', 'katNumarasi', 'odaNumarasi')
    ordering = ('blokKatOda', 'katNumarasi', 'odaNumarasi')
    list_filter = ('isRCUConnected', 'isHelvarConnected', 'isHVACConnected', "isHKServiceConnected", "isHKServiceConnected")

# Admin'e UserAdmin'i Kaydetmek
admin.site.unregister(User)
admin.site.register(User, CustomizedUserAdmin)

admin.site.register(MekanikData)
admin.site.register(RCUHelvarRouterData)
admin.site.register(AppSettings)
admin.site.register(RoomServiceMURData)
admin.site.register(AlarmsData)
admin.site.register(PMSData)

# Modelleri admin paneline kaydetme
admin.site.register(BlokKatOda, BlokKatOdaAdmin)
admin.site.register(BlokKatOdaData, BlokKatOdaDataAdmin)

