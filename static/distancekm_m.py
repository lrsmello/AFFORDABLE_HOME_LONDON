import json

# Caminhos dos arquivos
input_file_path = 'data/distance_matrix_results.json'
output_file_path = 'data/distance_matrix_results_km.json'

# Função para converter m para km
def m_to_km(data):
    for item in data:
        try:
            # Converte a string para número se necessário
            item['distance'] = float(item['distance'])
            # Converte metros para quilômetros
            item['distance'] = item['distance'] / 1000
        except (ValueError, TypeError):
            print(f"Erro ao converter a distância: {item['distance']}")
    return data

# Ler o JSON de entrada
with open(input_file_path, 'r') as input_file:
    json_data = json.load(input_file)

# Converte as distâncias
converted_data = m_to_km(json_data)

# Salvar o JSON convertido
with open(output_file_path, 'w') as output_file:
    json.dump(converted_data, output_file, indent=4)

print(f"Dados convertidos e salvos em {output_file_path}")