# Requisitos
## Funcionalidades principais:
- Formulário para entrada de dados;
- Processamento dos dados do formulário;
- Processamento de Modelo AHP;
- Geração de mapa com borough referência e boroughs sugeridos;
- Geração de gráficos comparativos de features;
- Geração de texto inteligente baseado em features e informações de banco de dados

# Tecnologias
## Frontend:
- HTML/CSS/JavaScript para a interface do usuário
- Frameworks para interface dinâmica (TBD)

## Backend:
- linguagem de programação: Python
- Frameworks: Flask

## Banco de Dados:
- SQL (MySQL, PostgreSQL) ou NoSQL (MongoDB) para armazenamento de dados

## Modelo AHP:
- linguagem de programação: node.js
- framework: 

## Mapas:
- utilizar API para geração de MAPA (nós estamos utilizando o google maps para buscar informações, poderíamos seguir na mesma linha para gerar o mapa)

## Gráficos:
- entender com andreia quais bibliotecas ela domina para geração dos charts

# Arquitetura do Sistema

## Frontend
- Formulário de Entrada de Dados: Desenvolver um formulário que permita ao usuário inserir os dados de requisitos de moradia.
- Interface de Exibição de Resultados: Criar uma interface para exibir mapa,  gráficos gerados a partir de features e textos inteligente.

## Backend
- API de Dados: Desenvolver uma API para receber os dados do formulário, processá-los, enviar solicitação POST a API do modelo e receber os dados processados de volta ao frontend.
- Processamento de Dados: Implementar lógica para manipular os dados recebidos, gerar coordenadas para o mapa e calcular as features para os gráficos.
- Integração com APIs Externas: Utilizar APIs de mapas para gerar o mapa de localização dos boroughs
- Texto inteligente: definir lógica de captura de informações para geração de texto inteligente baseado em banco de dados.

## Banco de Dados
- Modelagem de Dados: Definir os modelos de dados necessários para armazenar as entradas do formulário e os resultados processados.

# Fluxo de Dados
## Usuário Preenche o Formulário: O usuário entra na interface do frontend e preenche o formulário com os dados necessários.
Envio de Dados ao Backend: Os dados do formulário são enviados para o backend via uma API REST.

## Processamento dos Dados:
- O backend processa os dados recebidos.
- Faz chamadas a API do modelo AHP.
- O modelo AHP retorna as 3 sugestões de boroughs 
- A API processa o banco atrás do identificadores dos boroughs para obter coordenadas e informações de localização para gerar o mapa.
- A API também calcula as features necessárias para os gráficos comparativos.
Armazenamento dos Dados: Os dados processados são armazenados no banco de dados para gerar insight futuros sobre utilização do sistema;

## Geração de Resultados:
- O backend gera um mapa utilizando a API de mapas.
- O beckend gera gráficos comparativos utilizando uma biblioteca de gráficos.
- O beckend gera gera texto inteligente sobre recomendações realizada
- Retorno dos Resultados ao Frontend: Os resultados são enviados de volta ao frontend.
- Exibição dos Resultados: A interface do frontend exibe o mapa de localização dos boroughs sugeridos utilizando um heatmap de acordo com o rankeamento do modelo, os gráficos comparativos e o texto inteligente sobre cada borough sugerido.

# Implementação

## Frontend
- Criar componentes para o formulário e para exibição dos resultados (mapa e gráficos).

## Backend
- Implementar endpoints na API para receber dados do formulário e retornar os resultados.
- Utilizar bibliotecas como pandas para processamento de dados e requests para integração com APIs de mapas.
- Utilizar ORM para interagir com o banco de dados.

