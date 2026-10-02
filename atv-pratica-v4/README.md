# atv-pratica-v4 — medir a classificação

A API da [v3](../atv-pratica-v3/README.md) permanece: responder, stream, classificar chamado e conversar com histórico. O passo novo é tratar a classificação como algo que se mede, em vez de conferir um curl na mão.

O prompt saiu de dentro do serviço e foi para `src/chamados/classificacao.prompt.ts`. As regras pedem uma única categoria em maiúsculas, ignoram instruções escritas dentro do chamado e mandam `OUTROS` quando não há evidência. O serviço continua recusando categoria fora da lista com `502`.

## O que tem na pasta

| Caminho | Função |
| --- | --- |
| `src/chamados/classificacao.prompt.ts` | Texto da instrução. O chamado vai entre `<chamado>` e `</chamado>`, como dado. |
| `src/chamados/avaliacao/casos-avaliacao.ts` | Casos com categoria esperada e tipo: `normal`, `fronteira`, `ausencia`, `adversarial`. |
| `src/chamados/avaliacao/avaliador-classificacao.service.ts` | Roda os casos, marca acerto, formato válido e duração. |
| `src/chamados/avaliacao/executar-avaliacao.ts` | Script que grava o relatório. |
| `resultado-avaliacao.json` | Um relatório já gerado com `llama3.2:latest`, para ler o formato sem rodar o modelo. |
| `frontend/` | Chat em fluxo, igual ao das pastas anteriores. |

`formatoValido` é verdadeiro quando a API devolve uma categoria da lista. `correto` é verdadeiro quando essa categoria é a esperada do caso. Acurácia e conformidade de formato são as médias desses dois flags.

## Como iniciar

A API sobe como nas atividades anteriores. Detalhe de Ollama e `.env`: [README da raiz](../README.md).

```bash
cp .env.example .env
npm install
npm run start:dev
```

A avaliação **não** usa o servidor HTTP. Ela sobe o contexto do Nest, chama `ChamadosService` e escreve `resultado-avaliacao.json` por cima do arquivo que já está na pasta. O Ollama precisa estar no ar.

```bash
npm run avaliar:chamados
```

O terminal imprime uma tabela dos casos e um resumo:

```json
{ "total": 8, "acuracia": 0.625, "conformidadeFormato": 0.75 }
```

Os números mudam de execução para execução. O JSON versionado é uma amostra, não um gabarito eterno.

A tela, se quiser o stream:

```bash
cd frontend
npm install
npm start
```

## Contratos que continuam valendo

- `POST /ia/responder` e `POST /ia/responder-stream` — [v2](../atv-pratica-v2/README.md)
- `POST /chamados/classificar` — [v1](../atv-pratica-v1/README.md)
- `POST /conversas` e mensagens da sessão — [v3](../atv-pratica-v3/README.md)

## Testes

`npm test` cobre categoria, prompt e serviço sem chamar o modelo. `npm run avaliar:chamados` é o teste que chama.

```bash
npm test
npm run build
```
