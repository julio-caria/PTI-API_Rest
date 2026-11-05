# PTI - Desenvolvimento de API REST

API REST para gerenciamento de um catálogo de produtos de uma loja de tecnologia. O projeto foi desenvolvido por Julio Caria, estudante de Tecnologia em Sistemas da Internet, para a disciplina de Desenvolvimento de API REST da Instituição Senac - Santo Amaro.

## Objetivo

Implementar um CRUD de produtos utilizando uma única tabela, com validação de dados, persistência em PostgreSQL e documentação interativa da API.

## Tecnologias

- [Node.js](https://nodejs.org/pt-br): execução da aplicação
- [Fastify](https://fastify.dev): framework web
- [Sequelize](https://sequelize.org/docs/v6/): ORM e sincronização do modelo
- [PostgreSQL](https://www.postgresql.org): banco de dados
- [Zod](https://zod.dev): validação de entradas e respostas
- [Swagger](https://swagger.io) e [Scalar](https://scalar.com): documentação interativa
- [Docker](https://www.docker.com): execução do PostgreSQL em container

## Requisitos

- Node.js 18 ou superior
- npm
- Docker e Docker Compose

## Como executar

1. Clone o repositório e acesse a pasta do projeto:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd <PASTA_DO_PROJETO>
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie o arquivo `.env` na raiz do projeto, usando `.env.example` como referência:

   ```env
   NODE_ENV=development
   PORT=3000
   HOST=localhost
   DATABASE_NAME=atividade_api
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   ```

   `DATABASE_URL` pode ser mantida para referência, mas a aplicação utiliza as variáveis individuais de conexão.

4. Inicie o PostgreSQL:

   ```bash
   docker compose up -d
   ```

5. Inicie a API em modo de desenvolvimento:

   ```bash
   npm run dev
   ```

   A aplicação ficará disponível em `http://localhost:3000`. Na inicialização, o Sequelize sincroniza o modelo com o banco usando `db.sync({ alter: true })`.

## Documentação interativa

Com `NODE_ENV=development`, acesse:

- Scalar API Reference: `http://localhost:3000/docs`

O Swagger gera a especificação OpenAPI utilizada pelo Scalar. Em ambientes diferentes de `development`, a rota de documentação não é registrada.

## API

URL base:

```text
http://localhost:3000/api/v1
```

### Produtos

| Método | Rota | Descrição | Sucesso |
|---|---|---|---|
| `GET` | `/product` | Lista produtos ativos | `200` |
| `GET` | `/product/:id` | Busca um produto por UUID | `200` |
| `POST` | `/product` | Cadastra um produto | `201` |
| `PUT` | `/product/:id` | Atualiza todos os dados editáveis | `200` |
| `PATCH` | `/product/:id` | Atualiza parcialmente um produto | `200` |
| `DELETE` | `/product/:id` | Desativa um produto | `200` |

O `DELETE` não remove o registro fisicamente: ele altera `isActive` para `false`. Produtos desativados não aparecem na listagem e não podem ser atualizados pelo `PUT`.

No momento, a listagem não implementa filtro por nome; a consulta retorna todos os produtos ativos.

### Cadastro de produto

`POST /api/v1/product`

```json
{
  "name": "Fone de Ouvido Sem Fio",
  "description": "Fone com cancelamento de ruído.",
  "imageUrl": "https://exemplo.com/fone.jpg",
  "stockUnit": 10,
  "price": 90
}
```

Resposta `201`:

```json
{
  "productId": "c0675063-ef39-4e37-a101-766ce2ca9c1d"
}
```

### Atualização parcial

`PATCH /api/v1/product/:id`

```json
{
  "price": 79.9,
  "stockUnit": 8
}
```

### Códigos de resposta

- `200`: operação concluída.
- `201`: produto criado.
- `400`: dados inválidos ou falha ao cadastrar.
- `404`: produto não encontrado ou nenhum produto ativo disponível.
- `500`: erro interno ou falha de comunicação com o banco.

Para exemplos adicionais de requisições, consulte [client.http](./client.http).

## Modelo de dados

### Product

| Campo | Tipo | Regras |
|---|---|---|
| `id` | UUID | Chave primária, gerado automaticamente |
| `name` | STRING | Obrigatório |
| `description` | STRING | Obrigatório |
| `imageUrl` | STRING | URL da imagem |
| `stockUnit` | INTEGER | Padrão `0`, não pode ser negativo |
| `price` | DECIMAL(10, 2) | Obrigatório e maior que zero |
| `isActive` | BOOLEAN | Padrão `true` |
| `createdAt` | DATE | Data de criação |
| `updatedAt` | DATE | Data da última atualização |

## Estrutura do projeto

```text
src/
├── database/     # conexão com o PostgreSQL
├── routes/       # rotas HTTP de produtos
├── schemas/      # modelo Sequelize
└── server.js     # configuração e inicialização do Fastify
client.http       # exemplos para testar as rotas
docker-compose.yml
.env.example
```

## Conclusão

O projeto demonstra, de forma prática, a construção de uma API REST para gerenciamento de produtos, reunindo Fastify, Sequelize, PostgreSQL, Zod e documentação OpenAPI. A implementação contempla as operações principais de criação, consulta, atualização e desativação lógica, além de disponibilizar exemplos para facilitar os testes. 
