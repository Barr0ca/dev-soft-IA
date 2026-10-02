# ollama-web-v2 — a API passa a falar com o modelo

API NestJS com um único caso de uso: receber uma mensagem e devolver a resposta já separada do JSON do Ollama. O cliente informa só o texto. URL, modelo, timeout e leitura de `message.content` ficam no backend.

Ainda não há tela. O cliente desta etapa é o `curl`, o Insomnia ou outro cliente HTTP.

## O que tem na pasta

| Caminho | Função |
| --- | --- |
| `src/ia/ia.controller.ts` | `POST /ia/responder`. |
| `src/ia/ia.service.ts` | Monta a mensagem e devolve resposta, modelo e contagem de tokens. |
| `src/ia/providers/ollama.provider.ts` | HTTP para `/api/chat` do Ollama. |
| `src/ia/providers/modelo.provider.ts` | Contrato do provider. O controller não importa o Ollama direto. |
| `src/ia/dto/responder.dto.ts` | Valida `mensagem`: string de 1 a 2000 caracteres. |
| `src/ia/ia.service.spec.ts` | Testes do serviço sem subir o modelo. |
| `.env.example` | URL, modelo e timeout. |
| `docker-compose.yml` | Ollama desta etapa. O contêiner se chama `ollama-v2`; a porta continua 11434. |

Dependências de integração, sem SDK do Ollama:

- `@nestjs/axios` e `axios` — `POST` em `/api/chat`.
- `@nestjs/config` — lê o `.env`.
- `class-validator` e `class-transformer` — DTO com `ValidationPipe` (`whitelist` e `forbidNonWhitelisted`).

## Como iniciar

Siga o [README da raiz](../README.md) para Node 22, volume do Docker, modelo e `.env`. Nesta pasta:

```bash
cp .env.example .env
npm install
npm run start:dev
```

A API escuta em `http://localhost:3000`.

Se a v1 ainda estiver com o contêiner `ollama` na porta 11434, pare esse contêiner antes do `docker compose up` daqui. Os dois Compose publicam a mesma porta.

## Contrato

```http
POST /ia/responder
Content-Type: application/json
```

```json
{ "mensagem": "Explique, em um parágrafo, o que é uma API REST." }
```

Resposta `200`:

```json
{
  "resposta": "...",
  "modelo": "llama3.2:latest",
  "uso": {
    "tokensEntrada": 0,
    "tokensSaida": 0
  }
}
```

`uso` reflete os contadores que o Ollama devolve na chamada. Campo extra no corpo, mensagem vazia ou texto acima de 2000 caracteres volta como `400`.

Exemplo:

```bash
curl -s http://localhost:3000/ia/responder \
  -H 'Content-Type: application/json' \
  -d '{"mensagem":"Explique, em um parágrafo, o que é uma API REST."}'
```

## Testes

```bash
npm test
npm run build
```
