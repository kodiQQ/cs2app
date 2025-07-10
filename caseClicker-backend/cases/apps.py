from django.apps import AppConfig


class CasesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'cases'


class CasesConfig(AppConfig):
    name = 'cases'

    def ready(self):
        import cases.signals
