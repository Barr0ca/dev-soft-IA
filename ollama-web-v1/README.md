# ollama-web-v1 — cliente web direto no Ollama

Página HTML, CSS e JavaScript, sem framework e sem backend nosso. O formulário envia o prompt para `POST http://localhost:11434/api/chat` e mostra `message.content`.

Esta é a versão em que o navegador conhece a URL do modelo, o nome do modelo e o formato cru da resposta. As pastas seguintes existem para tirar essas três decisões da página.

## O que tem na pasta

| Arquivo | Função |
| --- | --- |
| `index.html` | Formulário, contador de caracteres (máximo 2000) e área da resposta. |
| `app.js` | `fetch` para `/api/chat` com `stream: false`. |
| `style.css` | Layout da página. |
| `docker-compose.yml` | Sobe o Ollama e libera a origem `http://localhost:5500` (e `127.0.0.1:5500`) em `OLLAMA_ORIGINS`. |

O modelo usado pela página está fixo em `app.js`:

```js
const OLLAMA_MODEL = 'llama3.2:latest';
```

Esse nome precisa existir em `ollama list`. Se você baixou outra tag, altere a constante.

## Como iniciar

O Ollama comum a este repositório está no [README da raiz](../README.md) (volume, `docker compose up` e `ollama pull`). Nesta pasta o serviço do Compose se chama `ollama` e o contêiner também.

A página precisa ser servida por HTTP na porta **5500**. Abrir o `index.html` com `file://` faz o navegador bloquear a chamada: o Ollama só aceita as origens declaradas no Compose.

Com a extensão Live Server do VS Code / Cursor, abra `index.html` e suba o servidor. Confira se a barra de endereço é `http://127.0.0.1:5500` ou `http://localhost:5500`. Outra porta exige incluir essa origem em `OLLAMA_ORIGINS` e recriar o contêiner.

## Como experimentar

1. Escreva um prompt e envie.
2. O status passa a “Gerando resposta...” e o botão fica desabilitado até o JSON completo chegar.
3. A resposta aparece de uma vez. Nesta versão não há streaming nem botão de cancelar.

Se o modelo não estiver baixado, ou se o nome em `app.js` não bater com `ollama list`, o status mostra o erro HTTP. Se a origem da página não for a da porta 5500, o navegador registra falha de CORS no console.
