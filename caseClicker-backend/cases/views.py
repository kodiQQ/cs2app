import random
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Case, Wallet, InventoryItem, OpenHistory
from .serializers import (
    CaseSerializer, WalletSerializer,
    InventoryItemSerializer, OpenHistorySerializer
)


class CaseListView(generics.ListAPIView):
    queryset = Case.objects.all()
    serializer_class = CaseSerializer


class WalletView(APIView):
    def get(self, request):
        wallet = get_object_or_404(Wallet, user=request.user)
        return Response(WalletSerializer(wallet).data)


class OpenCaseView(APIView):
    def post(self, request, case_id):
        case = get_object_or_404(Case, id=case_id)
        wallet = get_object_or_404(Wallet, user=request.user)
        if wallet.balance < case.price:
            return Response({'detail': 'Brak wystarczających monet'}, status=status.HTTP_400_BAD_REQUEST)

        items = list(case.items.all())
        weights = [i.weight for i in items]
        chosen = random.choices(items, weights=weights, k=1)[0]

        wallet.balance -= case.price
        wallet.save()

        InventoryItem.objects.create(user=request.user, item=chosen)
        OpenHistory.objects.create(user=request.user, case=case, item=chosen)

        return Response({
            'item': {'id': chosen.id, 'name': chosen.name, 'rarity': chosen.rarity},
            'balance': wallet.balance
        })


class InventoryView(generics.ListAPIView):
    serializer_class = InventoryItemSerializer

    def get_queryset(self):
        return InventoryItem.objects.filter(user=self.request.user)


class OpenHistoryView(generics.ListAPIView):
    serializer_class = OpenHistorySerializer

    def get_queryset(self):
        return OpenHistory.objects.filter(user=self.request.user).order_by('-opened_at')
