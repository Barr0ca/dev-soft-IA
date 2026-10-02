# atv-pratica-v3 — sessão, histórico e contexto

Esta pasta junta o que a [v2](../atv-pratica-v2/README.md) já fazia (classificar chamado, responder de uma vez e responder em fluxo) com conversas que têm dono, memória e um teto do que volta para o modelo.

Três nomes que aqui não são sinônimos:

| Nome | Pergunta que responde |
| --- | --- |
| sessão | De quem é esta conversa? O `sessionId`. |
| histórico | O que a API guardou? O `Map` em memória. |
| contexto | O que o modelo vai ler agora? Instrução de sistema + recorte + mensagem nova. |

O cliente da conversa manda só `{ "mensagem": "..." }`. Papel, histórico e instrução de sistema são decisão do backend.

A tela em `frontend/` continua sendo o chat em fluxo da v2 (`POST /ia/responder-stream`). Ela não cria sessão. As rotas de `/conversas` são exercitadas com cliente HTTP.

## O que tem na pasta

| Caminho | Função |
| --- | --- |
| `src/conversas/conversas.controller.ts` | Criar, enviar, listar e apagar sessão. |
| `src/conversas/conversas.repository.ts` | `Map` em memória. Some quando o processo reinicia. |
| `src/conversas/contexto.policy.ts` | Recorta o que será reenviado ao modelo. |
| `src/conversas/conversas.service.ts` | TTL de 30 minutos, uma geração por sessão e gravação do par pergunta/resposta. |
| `src/ia/` e `src/chamados/` | Contratos da v2. |
| `frontend/` | Mesma tela de streaming. Detalhe em [frontend/README.md](frontend/README.md). |

## Como iniciar

```bash
cp .env.example .env
npm install
npm run start:dev
```

Tela, se quiser o fluxo da v2 de novo:

```bash
cd frontend
npm install
npm start
```

Ollama, Node e portas: [README da raiz](../README.md).

## Contrato das conversas

Criar sessão:

```bash
curl -s -X POST http://localhost:3000/conversas
```

```json
{ "sessionId": "uuid", "expiraEmMinutos": 30 }
```

Enviar mensagem (o histórico entra sozinho; o corpo não leva mensagens antigas):

```bash
curl -s -X POST http://localhost:3000/conversas/COLE_O_SESSION_ID/mensagens \
  -H 'Content-Type: application/json' \
  -d '{"mensagem":"Meu nome nesta conversa é Ana."}'
```

```json
{
  "sessionId": "...",
  "resposta": "...",
  "modelo": "llama3.2:latest",
  "historicoUtilizado": 0
}
```

`historicoUtilizado` é a quantidade de mensagens antigas que foram reenviadas, sem contar a pergunta atual nem a instrução de sistema.

Listar o que ficou guardado:

```bash
curl -s http://localhost:3000/conversas/COLE_O_SESSION_ID/mensagens
```

Apagar:

```bash
curl -s -X DELETE http://localhost:3000/conversas/COLE_O_SESSION_ID
```

Situações que a API devolve de propósito:

| Situação | Status |
| --- | --- |
| `sessionId` inexistente | `404` |
| sessão sem uso por mais de 30 minutos | `410` (a sessão é apagada) |
| segunda geração na mesma sessão enquanto a primeira não terminou | `409` |
| mensagem vazia depois do `trim` | `400` |

O `ValidationPipe` continua rejeitando campo extra. O CORS da API libera `http://localhost:4200` só para `POST`. `GET` e `DELETE` a partir dessa origem são bloqueados pelo navegador; use o `curl` para esses verbos.

## Guardar não é o mesmo que reenviar

A cada turno o repositório grava um par (`user` + `assistant`). Na inferência, `selecionarHistorico` devolve no máximo **8 mensagens** e **6.000 caracteres**. O par mais antigo sai junto, para não sobrar uma resposta sem a pergunta.

| Turno | Guardado | Reenviado | O que acontece |
| ---: | ---: | ---: | --- |
| 1 | 2 | 0 | o modelo só vê a pergunta atual (mais a instrução de sistema) |
| 2 | 4 | 2 | entra o primeiro par |
| 3 | 6 | 4 | o contexto cresce |
| 4 | 8 | 6 | ainda cabe no teto de mensagens |
| 5 | 10 | 8 | teto: 4 turnos recentes |
| 6 | 12 | 8 | o par mais antigo fica no `Map` e não vai ao modelo |

Uma mensagem muito grande pode estourar os 6.000 caracteres antes do 5º turno. Caractere não é token; a atividade de [tokenização](../atv-tokenizacao/README.md) é o lugar para ver essa diferença. Sessão nova começa do turno 1, mesmo que outra sessão já tenha muitas mensagens.

O `Map` serve para estudar a política. Reiniciar `npm run start:dev` apaga as conversas. Outro processo não enxerga o mesmo `sessionId`. Quem tiver o UUID lê a conversa: isso identifica a sessão, não autentica uma pessoa.

## Testes

```bash
npm test
npm run build
```
