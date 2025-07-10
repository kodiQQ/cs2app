from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import (
    CaseListView, WalletView, OpenCaseView,
    InventoryView, OpenHistoryView
)

urlpatterns = [
    path('auth/login/', obtain_auth_token, name='api_token_auth'),

    path('cases/', CaseListView.as_view(), name='case-list'),

    path('cases/<int:case_id>/open/', OpenCaseView.as_view(), name='open-case'),

    path('wallet/', WalletView.as_view(), name='wallet'),

    path('inventory/', InventoryView.as_view(), name='inventory'),

    path('history/', OpenHistoryView.as_view(), name='history'),
]