import requests
import json
import itertools

def get_distance_matrix(origins, destinations, api_key, mode='transit'):
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

# Função para ler o arquivo JSON
def read_locations_from_json(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

# Exemplo de uso
api_key = 'AIzaSyAxTNoH5-2ftR84_qLfWnTb4HWU4VjsMMc'
file_path = 'data/boroughs.json'

# Ler locais do arquivo JSON
locations = read_locations_from_json(file_path)

# Gerar todas as combinações possíveis de origens e destinos
all_combinations = list(itertools.product(locations, repeat=2))

all_results = []

try:
    for combo in all_combinations:
        origin = f"{combo[0]['latitude']},{combo[0]['longitude']}"
        destination = f"{combo[1]['latitude']},{combo[1]['longitude']}"
        origins = [origin]
        destinations = [destination]
        result = get_distance_matrix(origins, destinations, api_key, mode='transit')
        all_results.append(result)
        print(result)
except requests.exceptions.RequestException as e:
    print(f"Erro ao realizar a solicitação: {e}")

# Processar e imprimir resultados
for result in all_results:
    print(result)