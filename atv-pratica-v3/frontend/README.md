# Frontend da atv-pratica-v3

A mesma tela de chat em fluxo da v2: envia `{ "mensagem": "..." }` para `POST http://localhost:3000/ia/responder-stream` e monta a resposta com os eventos `delta`. **Cancelar** aborta o `fetch`.

As rotas de sessão (`/conversas`) não passam por esta tela. Elas estão descritas no [README da atividade](../README.md). Ollama e portas estão no [README da raiz](../../README.md).

## Como iniciar

Com a API desta pasta em `http://localhost:3000`:

```bash
npm install
npm start
```

Abra `http://localhost:4200`.
