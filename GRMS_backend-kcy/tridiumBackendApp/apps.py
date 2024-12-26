from django.apps import AppConfig

class TridiumbackendAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tridiumBackendApp'

    def ready(self):
        # import tridiumBackendApp.signals  # Sinyali burada yükle
        from .signals_file import signalsTermostat, signalsController
    

