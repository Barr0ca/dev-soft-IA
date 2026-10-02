# atv-pratica-v1 — classificar o texto de um chamado

API NestJS que continua com `POST /ia/responder` e acrescenta a classificação de um chamado. O texto livre entra; sai uma categoria de uma lista fechada. Quem escolhe o modelo, escreve a instrução e descarta resposta fora da lista é o backend.

Uma categoria desconhecida vira erro `502`. Ela não é reescrita para `OUTROS`. `OUTROS` só aparece quando o modelo responde essa palavra e ela passa na validação.

## Categorias

| Categoria | Quando faz sentido |
| --- | --- |
| `ACESSO` | senha, autenticação, bloqueio ou dificuldade de login |
| `FINANCEIRO` | cobrança, pagamento, boleto, mensalidade ou reembolso |
| `MATRICULA` | matrícula, cancelamento de disciplina, turma ou período |
| `DOCUMENTOS` | declaração, histórico, certificado ou comprovante |
| `OUTROS` | o texto não sustenta as categorias anteriores |

## O que tem na pasta

| Caminho | Função |
| --- | --- |
| `src/ia/` | O mesmo `POST /ia/responder` da `ollama-web-v2`. |
| `src/chamados/chamados.controller.ts` | `POST /chamados/classificar`. |
| `src/chamados/chamados.service.ts` | Chama o modelo e só aceita categoria da lista. |
| `src/chamados/chamado-categoria.ts` | Lista e type guard. |
| `src/chamados/dto/classificar-chamado.dto.ts` | Valida o campo `texto`. |
| `src/chamados/*.spec.ts` | Testes da lista e do serviço. |

Não há frontend. Não há biblioteca nova em relação à API da v2: Axios até `/api/chat`, Config para o `.env`, `class-validator` no DTO.

## Como iniciar

Node, Ollama e o significado do `.env` estão no [README da raiz](../README.md).

```bash
cp .env.example .env
npm install
npm run start:dev
```

API em `http://localhost:3000`.

## Contrato da classificação

```http
POST /chamados/classificar
Content-Type: application/json
```

```json
{
  "texto": "Não consigo acessar o portal porque minha senha foi bloqueada."
}
```

`200`:

```json
{
  "texto": "Não consigo acessar o portal porque minha senha foi bloqueada.",
  "categoria": "ACESSO",
  "modelo": "llama3.2:latest"
}
```

O campo `texto` é string, com conteúdo depois do `trim`, entre 10 e 2000 caracteres, e é o único campo do corpo. Campo extra cai no `ValidationPipe`.

Se o modelo devolver texto vazio, explicação ou um nome fora da lista, a API responde `502` com a mensagem “O modelo retornou uma categoria inválida”. O cliente recebe a categoria já normalizada, não o `message.content` cru.

```bash
curl -s http://localhost:3000/chamados/classificar \
  -H 'Content-Type: application/json' \
  -d '{"texto":"Não consigo acessar o portal porque minha senha foi bloqueada."}'
```

`POST /ia/responder` segue o contrato descrito em [`ollama-web-v2`](../ollama-web-v2/README.md).

## Testes

```bash
npm test
npm run build
```
