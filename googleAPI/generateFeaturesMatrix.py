import googlemaps
import pandas as pd
import time

API_KEY = 'AIzaSyAxTNoH5-2ftR84_qLfWnTb4HWU4VjsMMc'

gmaps = googlemaps.Client(key=API_KEY)

# Lista de boroughs
boroughs = [
    {"ID": 1, "name": "City of London", "latitude": 51.5155, "longitude": -0.0922},
    {"ID": 2, "name": "Barking and Dagenham", "latitude": 51.5365, "longitude": 0.1272},
    {"ID": 3, "name": "Barnet", "latitude": 51.6252, "longitude": -0.1517},
    {"ID": 4, "name": "Bexley", "latitude": 51.4557, "longitude": 0.1504},
    {"ID": 5, "name": "Brent", "latitude": 51.5588, "longitude": -0.2817},
    {"ID": 6, "name": "Bromley", "latitude": 51.4036, "longitude": 0.0196},
    {"ID": 7, "name": "Camden", "latitude": 51.5450, "longitude": -0.1622},
    {"ID": 8, "name": "Croydon", "latitude": 51.3723, "longitude": -0.1091},
    {"ID": 9, "name": "Ealing", "latitude": 51.5111, "longitude": -0.3084},
    {"ID": 10, "name": "Enfield", "latitude": 51.6523, "longitude": -0.0815},
    {"ID": 11, "name": "Greenwich", "latitude": 51.4821, "longitude": 0.0050},
    {"ID": 12, "name": "Hackney", "latitude": 51.5456, "longitude": -0.0552},
    {"ID": 13, "name": "Hammersmith and Fulham", "latitude": 51.4927, "longitude": -0.2339},
    {"ID": 14, "name": "Haringey", "latitude": 51.5908, "longitude": -0.1117},
    {"ID": 15, "name": "Harrow", "latitude": 51.5788, "longitude": -0.3339},
    {"ID": 16, "name": "Havering", "latitude": 51.5742, "longitude": 0.1831},
    {"ID": 17, "name": "Hillingdon", "latitude": 51.5333, "longitude": -0.4532},
    {"ID": 18, "name": "Hounslow", "latitude": 51.4672, "longitude": -0.3617},
    {"ID": 19, "name": "Islington", "latitude": 51.5380, "longitude": -0.1030},
    {"ID": 20, "name": "Kensington and Chelsea", "latitude": 51.4940, "longitude": -0.1900},
    {"ID": 21, "name": "Kingston upon Thames", "latitude": 51.4123, "longitude": -0.3005},
    {"ID": 22, "name": "Lambeth", "latitude": 51.4576, "longitude": -0.1177},
    {"ID": 23, "name": "Lewisham", "latitude": 51.4452, "longitude": -0.0209},
    {"ID": 24, "name": "Merton", "latitude": 51.4030, "longitude": -0.1947},
    {"ID": 25, "name": "Newham", "latitude": 51.5071, "longitude": 0.0462},
    {"ID": 26, "name": "Redbridge", "latitude": 51.5755, "longitude": 0.0851},
    {"ID": 27, "name": "Richmond upon Thames", "latitude": 51.4515, "longitude": -0.3346},
    {"ID": 28, "name": "Southwark", "latitude": 51.5035, "longitude": -0.0804},
    {"ID": 29, "name": "Sutton", "latitude": 51.3618, "longitude": -0.1945},
    {"ID": 30, "name": "Tower Hamlets", "latitude": 51.5099, "longitude": -0.0204},
    {"ID": 31, "name": "Waltham Forest", "latitude": 51.5898, "longitude": -0.0195},
    {"ID": 32, "name": "Wandsworth", "latitude": 51.4565, "longitude": -0.1910},
    {"ID": 33, "name": "Westminster", "latitude": 51.4975, "longitude": -0.1372}
]

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