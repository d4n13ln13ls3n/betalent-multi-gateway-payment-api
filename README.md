# 💳 Multi-Gateway Payment API

> **🎯 Target do Desafio: Nível 2 (Pleno)**
> *Todas as regras de negócio, integrações, transações em centavos e cálculos de carrinho do Nível 2 foram implementadas com sucesso. Além disso, a aplicação conta com TDD, Padrões de Projeto (Design Patterns) e Resiliência avançada.*

Esta é uma API RESTful de pagamentos multi-gateway desenvolvida como solução para desafio técnico. O sistema é capaz de processar compras, realizar estornos (refunds) e possui um mecanismo de resiliência (Fallback) que alterna automaticamente entre gateways em caso de falhas de rede ou recusa de pagamento.

## 🚀 Tecnologias e Padrões Utilizados

- **Framework:** AdonisJS v6 (Node.js)
- **Linguagem:** TypeScript
- **Banco de Dados:** MySQL (via ORM Lucid)
- **Testes Automatizados (TDD):** Japa (Testes Funcionais/E2E)
- **Validação de Dados:** VineJS
- **Arquitetura & Design Patterns:**
  - **Strategy Pattern (`IGateway`):** Permite a adição de novos gateways no futuro de forma modular, sem alterar a regra de negócio central, garantindo o princípio Open/Closed (SOLID).
  - **Mecanismo de Fallback:** Se o Gateway de prioridade 1 falhar ou estiver desativado no banco, o `GatewayManager` assume o controle e tenta o Gateway 2 de forma transparente para o cliente.
  - **Logger Nativo:** Rastreabilidade completa de ações de mutação (POST/PUT/PATCH/DELETE) e erros críticos para auditoria.

---

## 📋 Pré-requisitos

Para rodar o projeto localmente, você precisará ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (v20 ou superior recomendado)
- [Docker](https://www.docker.com/) e Docker Compose

---

## 🔧 Como instalar e rodar o projeto

**1. Clone o repositório e instale as dependências:**
```bash
npm install
```

**2. Configure as variáveis de ambiente:**
Crie um arquivo `.env` na raiz do projeto (você pode copiar o conteúdo de `.env.example`) e garanta que as credenciais do banco de dados MySQL estejam corretas.

**3. Suba a infraestrutura (MySQL e Mocks dos Gateways):**
```bash
docker-compose up -d
```
*(Nota: O Gateway 1 rodará na porta 3001 e o Gateway 2 na porta 3002. O banco MySQL rodará na porta 3306).*

**4. Rode as Migrations e os Seeders:**
Este comando criará as tabelas e populará os Gateways necessários para a API funcionar:
```bash
node ace migration:run
node ace db:seed
```

**5. Inicie o Servidor de Desenvolvimento:**
```bash
npm run dev
```
A API estará rodando em `http://127.0.0.1:3333`.

---

## 🧪 Como rodar os Testes (TDD)

O projeto possui uma suíte de testes funcionais (E2E) cobrindo os fluxos críticos da aplicação, incluindo isolamento de estado de banco de dados e testes de falha/fallback.

Para executar os testes via Japa, com a infraestrutura do Docker rodando, utilize o comando:
```bash
node ace test
```

---

## 🛣️ Detalhamento de Rotas

Todas as rotas da API (exceto a autenticação pública) exigem o envio do cabeçalho `Authorization: Bearer <token>`.

### 🔐 Autenticação (Pública)
- `POST /api/v1/auth/login` - Realiza o login, valida credenciais e devolve o Access Token.

### 💰 Pagamentos e Transações (Privadas)
- `POST /api/v1/purchase` - Processa uma nova compra (calcula valor dinâmico dos produtos em centavos e aciona a fila de gateways).
- `GET /api/v1/transactions` - Lista o histórico geral de transações.
- `GET /api/v1/transactions/:id` - Exibe os detalhes de uma transação específica com seus relacionamentos.
- `POST /api/v1/transactions/:id/refund` - Solicita o estorno (chargeback) da transação junto ao gateway responsável e atualiza o status.

### ⚙️ Gerenciamento de Gateways (Privadas)
- `GET /api/v1/gateways` - Lista os gateways cadastrados e suas configurações atuais.
- `PATCH /api/v1/gateways/:id/status` - Ativa ou desativa um gateway (Payload: `{ "is_active": boolean }`).
- `PATCH /api/v1/gateways/:id/priority` - Altera a prioridade na fila de fallback (Payload: `{ "priority": number }`).

### 📦 Cadastros / CRUDS (Privadas)
- **Clientes:** `GET`, `POST`, `PUT`, `DELETE` em `/api/v1/clients`
  *(Nota: O endpoint `GET /api/v1/clients/:id` traz um relatório completo do cliente com o histórico embutido de todas as suas compras).*
- **Produtos:** `GET`, `POST`, `PUT`, `DELETE` em `/api/v1/products`
- **Usuários:** `GET`, `POST`, `PUT`, `DELETE` em `/api/v1/users`