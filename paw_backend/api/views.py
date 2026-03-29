"""
    Paw Rescue - Views (Semaine 1)
    Logique de traitement des requêtes API.
    - TerritoireViewSet : CRUD pour les données territoriales (Scores, INSEE, OSM).
    - ProfilAdoptantViewSet : Gestion des profils adoptants (Habitat + Quiz).
    - RefugeViewSet : CRUD pour les refuges (Localisation, Capacité).
    - AnimalViewSet : Gestion des profils animaux (Comportement, Santé).
"""

from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Territoire, Animal, Refuge, ProfilAdoptant
from .serializers import TerritoireSerializer, AnimalSerializer, RefugeSerializer, ProfilAdoptantSerializer
from .matching_utils import predict_match

class TerritoireViewSet(viewsets.ModelViewSet):
    queryset = Territoire.objects.all()
    serializer_class = TerritoireSerializer

class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer

class RefugeViewSet(viewsets.ModelViewSet):
    queryset = Refuge.objects.all()
    serializer_class = RefugeSerializer

class ProfilAdoptantViewSet(viewsets.ModelViewSet):
    queryset = ProfilAdoptant.objects.all()
    serializer_class = ProfilAdoptantSerializer

@api_view(['POST'])
def predict_matching(request):
    try:
        adoptant_id = request.data.get('adoptant_id')
        animal_id = request.data.get('animal_id')
        
        if not adoptant_id or not animal_id:
            return Response({'error': 'adoptant_id et animal_id requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        result = predict_match(adoptant_id, animal_id)
        return Response(result, status=status.HTTP_200_OK)
        
    except ProfilAdoptant.DoesNotExist:
        return Response({'error': 'Adoptant non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    except Animal.DoesNotExist:
        return Response({'error': 'Animal non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)