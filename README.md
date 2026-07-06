# Aerocode - Gestão de Produção Aeronáutica (AV3)

## 📌 Descrição
O **Aerocode (AV3)** é a evolução web do sistema de gestão da produção de aeronaves, projetado como um sistema crítico para atender as principais fabricantes do setor (Boeing, Airbus, Embraer, Comac e Bombardier). O projeto migrou de uma interface CLI para uma aplicação web completa com interface gráfica (GUI), utilizando **Node.js**, **TypeScript**, **Prisma ORM** e **PostgreSQL**.

## ⚙️ Funcionalidades
- Gerenciamento completo de aeronaves, estoque de peças, funcionários, etapas de produção e testes.
- Persistência estruturada em banco de dados relacional **PostgreSQL**.
- Camada de persistência moderna e tipada com **Prisma ORM**.
- Monitoramento de qualidade via métricas de **Latência**, **Tempo de Processamento** e **Tempo de Resposta**.
- Suporte a testes de carga simulando 1, 5 e 10 usuários simultâneos.

## 🛠️ Tecnologias Utilizadas
- Node.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Express
- Axios (para simulação de carga)

## ▶️ Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Configure a conexão do banco de dados PostgreSQL no arquivo `.env`:
```env
DATABASE_URL="mysql://root:sua_senha@localhost:3306/aerocode"
```

3. Execute as migrations do Prisma para estruturar o banco:
```bash
npx prisma migrate dev
```

4. Inicie o servidor da aplicação:
```bash
npm run dev
```
A GUI e a API estarão disponíveis em `http://localhost:3001`.

## 📊 Testes de Carga e Métricas
Para executar o teste de carga que simula requisições simultâneas de 1, 5 e 10 usuários e gera as métricas de latência, processamento e tempo de resposta em milissegundos:
```bash
npm run load-test
```
