import requests

def get_distance_matrix(origins, destinations, api_key, mode='trafic'):
    base_url = "https://maps.googleapis.com/maps/api/distancematrix/json"
    
    params = {
        'origins': '|'.join(origins),
        'destinations': '|'.join(destinations),
        'key': api_key,
        'mode': mode,
        'units': 'metric',
        'transit_routing_preference': 'fewer_transfers'  # Adicional para transporte público, se necessário
    }
    
    response = requests.get(base_url, params=params)
    
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

# Exemplo de uso
api_key = 'AIzaSyAxTNoH5-2ftR84_qLfWnTb4HWU4VjsMMc'
origins = ["51.5099,-0.0204"]  # New York, NY 
destinations = ["51.5898,-0.0195"]  # Chicago, IL 

try:
    # Usar 'transit' como modo para calcular tarifas de transporte público, ou 'driving' para táxis
    result = get_distance_matrix(origins, destinations, api_key, mode='transit')
    print(result)
except requests.exceptions.RequestException as e:
    print(f"Erro ao realizar a solicitação: {e}")
