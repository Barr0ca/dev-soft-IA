# atv-pratica-v2 — resposta em fluxo e cancelamento

A classificação de chamados da [v1](../atv-pratica-v1/README.md) continua aqui. O acréscimo é a resposta aos poucos: a API repassa os trechos do Ollama em NDJSON e a tela Angular mostra o texto enquanto ele chega. Se a pessoa fecha a requisição, o backend aborta a geração.

O cliente ainda não escolhe o modelo e ainda não recebe o JSON cru do Ollama.

## O que tem na pasta

| Caminho | Função |
| --- | --- |
| `src/ia/ia.controller.ts` | `POST /ia/responder` (resposta inteira) e `POST /ia/responder-stream` (fluxo). |
| `src/chamados/` | `POST /chamados/classificar`, igual à v1. |
| `frontend/` | Tela Angular do chat em fluxo. O README de lá explica só a interface. |
| `frontend/Dockerfile` | Sobe o `ng serve` escutando em `0.0.0.0:4200`, se você quiser o front no Docker. O caminho esperado em aula é `npm start` na pasta `frontend`. |

No stream, cada linha é um JSON:

| `type` | Quando |
| --- | --- |
| `delta` | Mais um pedaço de texto em `content`. |
| `done` | A geração terminou. |
| `error` | A geração quebrou depois que os headers já tinham sido enviados. |

O controller usa `AbortController`. No evento `close` da resposta HTTP, se o corpo ainda não foi encerrado, ele chama `abort()`. Esse sinal segue até o Ollama. Cancelar no navegador para a geração; não deixa o modelo preenchendo o log até o fim.

## Como iniciar

Node, Ollama, porta 3000 e o `.env` estão no [README da raiz](../README.md).

```bash
cp .env.example .env
npm install
npm run start:dev
```

Em outro terminal, a tela:

```bash
cd frontend
npm install
npm start
```

Abra `http://localhost:4200`. A API só aceita CORS de `http://localhost:4200` em `POST`.

## Contrato do fluxo

```http
POST /ia/responder-stream
Content-Type: application/json
```

```json
{ "mensagem": "Explique APIs REST em várias seções curtas." }
```

A resposta é `application/x-ndjson`: uma linha JSON por evento, nesta forma:

```json
{"type":"delta","content":"Uma API "}
{"type":"delta","content":"REST ..."}
{"type":"done"}
```

`mensagem` tem de 1 a 2000 caracteres e é o único campo. A classificação segue o contrato da v1 (`POST /chamados/classificar`, texto de 10 a 2000 caracteres).

## O que observar ao cancelar

1. Peça uma resposta longa. O status da tela vai para `loading` e o texto cresce em trechos.
2. Clique em **Cancelar** ainda em `loading`.
3. O status passa a `cancelled`. A área de resposta fica com o que já tinha chegado.
4. Na aba Network, `POST /ia/responder-stream` aparece cancelada, sem um `done` final.
5. Em `docker compose logs --follow ollama`, a geração para depois do abort.

## Testes

```bash
npm test
npm run build
```

Na pasta `frontend`, `npm test` roda o teste gerado pelo Angular CLI para o componente raiz.
