import googlemaps
import pandas as pd
import time

API_KEY = 'AIzaSyAxTNoH5-2ftR84_qLfWnTb4HWU4VjsMMc'

gmaps = googlemaps.Client(key=API_KEY)

# Caminho do arquivo JSON na pasta data
file_path = 'data/boroughs.json'

# Lendo o arquivo JSON usando pandas
boroughs = pd.read_json(file_path)

# Função para obter a distância, duração e tarifa
def get_distance_duration_fare(origin, destination):
    response = gmaps.distance_matrix(origins=origin, destinations=destination, mode='transit')
    element = response['rows'][0]['elements'][0]
    distance = element.get('distance', {}).get('value', 'N/A')
    duration = element.get('duration', {}).get('value', 'N/A')
    fare = element.get('fare', {}).get('value', 'N/A')
    return distance, duration, fare
# Lista para armazenar os resultados
results = []
# Iterando sobre os boroughs para obter informações
for origin_borough in boroughs:
    origin = f"{origin_borough['latitude']},{origin_borough['longitude']}"
    for destination_borough in boroughs:
        if origin_borough['ID'] != destination_borough['ID']:
            destination = f"{destination_borough['latitude']},{destination_borough['longitude']}"
            distance, duration, fare = get_distance_duration_fare(origin, destination)
            results.append({
                'origin_ID': origin_borough['ID'],
                'destination_ID': destination_borough['ID'],
                'distance': distance,
                'duration': duration,
                'fare': fare
            })
            
# Convertendo os resultados para um DataFrame
results_df = pd.DataFrame(results)

# Salvando os resultados em um arquivo JSON
results_df.to_json('data/distance_matrix_results.json', orient='records', lines=True)

# Exibindo o DataFrame
print(results_df)