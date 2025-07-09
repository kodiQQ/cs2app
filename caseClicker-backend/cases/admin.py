from django.contrib import admin
from .models import Wallet, Case, CaseItem, InventoryItem, OpenHistory

admin.site.register(Wallet)
admin.site.register(Case)
admin.site.register(CaseItem)
admin.site.register(InventoryItem)
admin.site.register(OpenHistory)