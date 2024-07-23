import json
import statistics

# Função para processar os dados
def process_json(data):
    # Lista para armazenar as entradas válidas (onde duration e fare são números)
    valid_entries = [entry for entry in data if entry['duration'] != 'N/A' and entry['fare'] != 'N/A']
    
    # Lista para armazenar as entradas que precisam de preenchimento
    entries_to_fill = [entry for entry in data if entry['duration'] == 'N/A' or entry['fare'] == 'N/A']
    
    # Função para encontrar as distâncias mais próximas
    def find_closest_entries(distance, entries, n=3):
        entries = sorted(entries, key=lambda e: abs(e['distance'] - distance))
        return entries[:n]
    
    # Processar entradas que precisam de preenchimento
    for entry in entries_to_fill:
        if entry['duration'] == 'N/A' or entry['fare'] == 'N/A':
            closest_entries = find_closest_entries(entry['distance'], valid_entries)
            
            # Calcular a média da duração e fare das entradas mais próximas
            durations = [e['duration'] for e in closest_entries]
            fares = [e['fare'] for e in closest_entries]
            
            # Usar a média para preencher
            if durations:
                entry['duration'] = statistics.mean(durations)
            if fares:
                entry['fare'] = statistics.mean(fares)
    
    return data

# Caminho dos arquivos
input_json_file = 'data/distance_matrix_results_km_atualizado.json'
output_json_file = 'data/distance_matrix_results_km_atualizado_processed.json'

# Ler o arquivo JSON de entrada
with open(input_json_file, 'r') as file:
    data = json.load(file)

# Processar os dados
processed_data = process_json(data)

# Salvar o resultado em um novo arquivo JSON
with open(output_json_file, 'w') as file:
    json.dump(processed_data, file, indent=4)

print(f'Processamento concluído. Dados salvos em {output_json_file}')
