# Frontend da atv-pratica-v5-dupla

Chat em fluxo, igual ao das atividades anteriores. Envia `{ "mensagem": "..." }` para `POST http://localhost:3000/ia/responder-stream` e mostra os `delta`. **Cancelar** aborta o `fetch`.

Classificação, avaliação e resumo do chamado ficam na API. Veja o [README da atividade](../README.md).

## Como iniciar

Com a API desta pasta em `http://localhost:3000`:

```bash
npm install
npm start
```

Abra `http://localhost:4200`.
