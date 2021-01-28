from django.urls import path, include
from .views import index

app_name = 'frontend'

urlpatterns = [
    path('', index, name = 'index'),
    path('create', index, name = 'create-room'),
    path('join', index, name = 'join-room'),
    path('room/<str:roomCode>', index, name = 'room'),
]