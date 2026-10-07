# Frontend da atv-pratica-v5-dupla

Chat para resumir um chamado. Envia `{ "texto": "..." }` para `POST http://localhost:3000/chamados/resumir` e mostra título, resumo, até três pontos importantes e se a resposta pede revisão humana. **Cancelar** aborta o `fetch`.

O contrato, os limites do JSON e o Docker estão no [README da atividade](../README.md).

## Como iniciar

Com a API desta pasta em `http://localhost:3000`:

```bash
npm install
npm start
```

Abra `http://localhost:4200`.
