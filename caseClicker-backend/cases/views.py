import random
from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Case, Wallet, InventoryItem, OpenHistory
from .serializers import (
    CaseSerializer, WalletSerializer,
    InventoryItemSerializer, OpenHistorySerializer
)

User = get_user_model()


class CaseListView(generics.ListAPIView):
    queryset = Case.objects.all()
    serializer_class = CaseSerializer


class WalletView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wallet = get_object_or_404(Wallet, user=request.user)
        return Response(WalletSerializer(wallet).data)


class OpenCaseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, case_id):
        case = get_object_or_404(Case, id=case_id)
        wallet = get_object_or_404(Wallet, user=request.user)
        if wallet.balance < case.price:
            return Response(
                {'detail': 'Brak wystarczających monet'},
                status=status.HTTP_400_BAD_REQUEST
            )

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
    permission_classes = [IsAuthenticated]
    serializer_class = InventoryItemSerializer

    def get_queryset(self):
        return InventoryItem.objects.filter(user=self.request.user)


class OpenHistoryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OpenHistorySerializer

    def get_queryset(self):
        return OpenHistory.objects.filter(user=self.request.user).order_by('-opened_at')


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):

    data = request.data
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return Response(
            {'detail': 'Email i hasło są wymagane'},
            status=status.HTTP_400_BAD_REQUEST
        )
    if User.objects.filter(username=email).exists():
        return Response(
            {'detail': 'Użytkownik o tym emailu już istnieje'},
            status=status.HTTP_400_BAD_REQUEST
        )
    user = User.objects.create_user(username=email, email=email, password=password)
    token = Token.objects.create(user=user)
    return Response(
        {'token': token.key, 'user': {'email': user.email, 'id': user.id}},
        status=status.HTTP_201_CREATED
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_view(request):

    user = request.user
    return Response({'email': user.email, 'id': user.id})
