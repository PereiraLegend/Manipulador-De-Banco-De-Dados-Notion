# Manipulador-De-Banco-De-Dados-Notion
## Uma API REST em nodeJS que possibilita a manipulação de um banco de dados no Notion utilizando a API do próprio Notion

### Sobre a api: 
Como o teste não especificava eu criei a api utilizando a arquitetura em camadas (que se encontra na pasta "src/..."), contudo pela dúvida de caso o teste queira focar em uma abordagem mais direta e simples acabei criando uma versão básica separada (que se encontra na pasta "basic/...");

### Tecnologias utilizadas:
Node.js
Insomnia/Electron (Testes)

### Configuração inicial (.env):
```
NOTION_TOKEN= (Chave da Api)
DATABASE_ID= (ID do Banco de Dados)
```

### Comandos: (Obs.: Os dois projetos rodam sobre comandos diferentes)

Comando para inicializar servidor padrão: "yarn start"

Comando para inicializar servidor padrão (desenvolvimento): "yarn dev"

Comando para inicializar servidor básico (versão básica mencionada antes): "yarn dev:basic"

### Observação Final:
Na pasta "collection/..." está a collection do Insomnia utilizada para testes de rota (Esses testes também são válidos para a versão básica da api);