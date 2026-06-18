# ⚖️ Jornada Jedi: Domine o Poder da IA 🚀

Uma plataforma corporativa inovadora projetada para treinar colaboradores e líderes na utilização segura, ética e eficiente de Inteligência Artificial Generativa. Inspirado nos preceitos de prudência e sabedoria da Ordem Jedi, o projeto foca em levar profissionais da maturidade técnica básica (*Padawan*) até a governança estratégica de segurança e alto ceticismo analítico (*Yoda*).

---

## 🏗️ Arquitetura do Sistema

O projeto é constituído por uma arquitetura full-stack de alta disponibilidade:
- **Frontend (SPA):** Single Page Application desenvolvida em **React 19** e **Vite**, estilizada com **Tailwind CSS** e animada de forma fluida através do framework **Motion**.
- **Backend (Express):** Servidor seguro rodando nativamente no Node.js corporativo, modularizado de acordo com as melhores práticas de Clean Architecture. Ele gerencia as chamadas de API, controle de cotas, rate limits distribuídos e segurança de chaves.
- **Banco de Dados & Autenticação:** Baseado em **Firebase Firestore** e **Firebase Authentication** com regras de controle de acesso rigorosas no nível do banco de dados (RBAC).

---

## 📂 Estrutura do Projeto

```
/
├── server/                    # Backend Modularizado
│   ├── ai/                    # Clientes de IA (Gemini & OpenAI) e Auditoria de Tokens
│   ├── auth/                  # Middleware de Autenticação JWT do Firebase
│   ├── controllers/           # Handlers de Recomendações de Missões, Quizzes e Pareceres Estágios
│   ├── middleware/            # Rate Limiters, XSS Sanitization, Correlation ID e Headers de Segurança
│   ├── monitoring/            # Telemetria e Rastreadores de Falhas em Modelos de Linguagem
│   ├── routes/                # Definição e Mapeamento dos Endpoints REST
│   ├── validators/            # Validações estritas de Schemas por Zod
│   └── app.ts                 # Configuração centralizada do Express e Servidor Vite
├── src/                       # Frontend React
│   ├── components/            # Visualizadores e Formulários de Usuário e Admin
│   ├── lib/                   # Inicializadores Firebase e manipuladores de erros na nuvem
│   ├── utils/                 # Coleção de utilitários e tradutores de códigos HTTP/Firebase
│   ├── App.tsx                # Gerenciador Geral de Telas e Estado de Jogo/Maturidade
│   └── main.tsx               # Ponto de entrada SPA
├── tests/                     # Suíte de Testes Automatizados (Vitest)
│   ├── security.test.ts       # Testes de sanitização de segurança XSS
│   └── schemas_and_errors.test.ts # Testes de Zod e tratamento de falhas
├── Dockerfile                 # Dockerfile multi-stage enrijecido e otimizado
├── docker-compose.yml         # Gerenciamento de containers localizados
├── firestore.rules            # Regras estritas Zero-Trust de acesso à base de dados
└── server.ts                  # Ponto de inicialização do backend (< 20 linhas)
```

---

## 🛠️ Tecnologias Utilizadas

- **Core:** React 19, TypeScript, Express, Vite
- **AI Integration:** `@google/genai` (Gemini SDK oficial), `openai`
- **Security & Validation:** `zod` para validação de payload, sanitização manual de loops de tags HTML e XSS, `Helmet`-style headers (Strict-Transport-Security, Content-Type-Options, Frame-Options, Referrer-Policy).
- **Styles & Animations:** Tailwind CSS, Lucide Icons, Motion (React animations)
- **Database & Auth:** Firebase Web SDK, Firestore REST API (no backend)
- **Testing:** `vitest`

---

## 🔐 Blindagem de Segurança (Hardening)

1. **Camada Zero Trust no Firestore:** Regras estritas que garantem que usuários nunca consigam realizar alterações em seus privilégios administrativos (`isAdmin`, `role`, `permissions`) ou de organização (`companyId`). Modificações são restritas a administradores globais certificados ou validadas de forma imutável.
2. **Prevenção de Injeção de Código (XSS):** Filtro de desinfecção ativo recursivo que remove todas as tags `<script>` e HTML injetadas em strings enviadas à API REST.
3. **CORS e Headers Estritos:** O backend apenas aceita acessos das origens oficiais de desenvolvimento e homologação, prevenindo ataques de desvio ou clickjacking com `X-Frame-Options: SAMEORIGIN`.
4. **Controle Estrito de Custas (Cota Diária de IA):** Middleware centralizado restringe cada usuário a no máximo **50 consultas diárias** aos LLMs, mitigando loops indesejados no front e protegendo os créditos de faturamento.
5. **Rate Limiting por Janela de Tempo:** Cada IP ou UID de usuário autenticado possui restrições extras de **20 requisições por minuto**, prevenindo brute-force e ataques DDoS.
6. **Auditoria de IA e Telemetria de Falhas:** Todas as chamadas de linguagem são catalogadas com custo estimado de tokens, prompt, latência e identificador de rastreamento (`correlationId`) unificado na base. Falhas em modelos de IA alimentam o dashboard administrativo para intervenção ágil.

---

## 🕹️ Guia de Instalação e Execução Local

### Pré-requisitos
- Node.js (v18 ou v20 recomendado)
- Uma conta ativa Firebase com Database provisionado

### Execução Padrão

1. **Instalar Dependências:**
   ```bash
   npm install
   ```

2. **Configuração de Variáveis:**
   Crie um arquivo `.env` na raiz do seu projeto e informe as chaves de API necessárias:
   ```env
   GEMINI_API_KEY=sua-chave-gemini-aqui
   OPENAI_API_KEY=sua-chave-openai-opcional
   ```

3. **Executar em Modo Desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Executar Testes de Segurança:**
   ```bash
   npm test
   ```

5. **Compilar para Produção (Build):**
   ```bash
   npm run build
   ```

---

## 🐳 Executando com Docker

### 1. Construir e Iniciar com Docker Compose:
```bash
docker compose up --build
```
A aplicação iniciará na porta `3000` de forma isolada, leve e extremamente segura, operando como usuário sem privilégios root.

---

## 📈 Fluxo das Missões e IA

1. **Autenticação:** O usuário faz login ou cadastra-se na plataforma, sendo colocado automaticamente dentro das regras de seu Tenant/Organização base.
2. **Onboarding:** Avaliação inicial das competências (*Skills Survey*).
3. **As Missões de IA:** O usuário enfrenta situações corporativas críticas (privacidade de dados, vazamentos na nuvem, automação cooperativa, etc.). Ele seleciona habilidades/competências "Jedi" em forma de cartas e escreve uma explicação estratégica fundamentada de sua solução.
4. **Parecer do Grande Conselho (IA):** O backend consome de forma segura a chave do Gemini para avaliar o plano estratégico do usuário, emitindo uma crítica detalhada (checklist corporativo, dicas de correção e nota conceitual de 0 a 10).
5. **Relatório Executivo:** No final da jornada, o usuário gera um diagnóstico gerencial rico e estruturado que define sua maturidade ética e operacional na empresa, permitindo download e visualizações gerenciais.

---

## 🛡️ Termos Gerais & Declarações
Este software segue os padrões de segurança baseados no **OWASP Top 10** e assegura pleno cumprimento à Lei Geral de Proteção de Dados (LGPD).
