import json

# Caminhos dos arquivos
json1_file_path = 'data/distance_matrix_results_km.json'
json2_file_path = 'data/distance.json'

# Função para ler JSON de um arquivo
def ler_json_do_arquivo(caminho_arquivo):
    with open(caminho_arquivo, 'r') as file:
        return json.load(file)

# Função para escrever JSON em um arquivo
def escrever_json_em_arquivo(caminho_arquivo, dados_json):
    with open(caminho_arquivo, 'w') as file:
        json.dump(dados_json, file, indent=4)

# Função para comparar e substituir distâncias
def substituir_distancias(json1, json2):
    for item1 in json1:
        if item1['distance'] == "N/A":
            origin_id = item1['origin_ID']
            destination_id = item1['destination_ID']
            
            for item2 in json2:
                if item2['Origin'] == str(origin_id) and item2['Target'] == str(destination_id):
                    item1['distance'] = item2['Distance']
                    break
    return json1

# Ler os arquivos JSON
json_data_1 = ler_json_do_arquivo(json1_file_path)
json_data_2 = ler_json_do_arquivo(json2_file_path)

# Substituir as distâncias
json_data_1_atualizado = substituir_distancias(json_data_1, json_data_2)

# Escrever o resultado atualizado em um novo arquivo
resultado_file_path = 'data/distance_matrix_results_km_atualizado.json'
escrever_json_em_arquivo(resultado_file_path, json_data_1_atualizado)

print(f"Dados atualizados foram gravados em {resultado_file_path}")
