# Frontend da atv-pratica-v2

Tela Angular do chat em fluxo. O campo envia `{ "mensagem": "..." }` para `POST http://localhost:3000/ia/responder-stream`. Cada linha `delta` é acrescentada na área de resposta. **Cancelar** aborta o `fetch`; a API, ao ver a conexão fechar, interrompe o Ollama.

A tela mostra um status: `idle`, `loading`, `done`, `error` ou `cancelled`.

Classificação de chamados e a configuração do modelo ficam na API. Veja o [README da atividade](../README.md) e o [README da raiz](../../README.md).

## Como iniciar

A API desta pasta precisa estar em `http://localhost:3000` antes da tela.

```bash
npm install
npm start
```

Abra `http://localhost:4200`. O `ng serve` recarrega quando um arquivo da interface muda.

O CORS da API aceita essa origem. Outra porta no `ng serve` faz o navegador bloquear o `POST`.
