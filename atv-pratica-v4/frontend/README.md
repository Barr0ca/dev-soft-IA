# Frontend da atv-pratica-v4

Chat em fluxo. Envia `{ "mensagem": "..." }` para `POST http://localhost:3000/ia/responder-stream` e acrescenta cada `delta` na tela. **Cancelar** aborta o `fetch`.

A avaliação dos chamados (`npm run avaliar:chamados`) roda no backend e não tem botão nesta interface. O relatório e os casos estão no [README da atividade](../README.md).

## Como iniciar

Com a API desta pasta em `http://localhost:3000`:

```bash
npm install
npm start
```

Abra `http://localhost:4200`.
