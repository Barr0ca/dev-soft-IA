# Desenvolvimento Web com Integração de Inteligência Artificial

Exemplos e atividades da disciplina **Desenvolvimento Web com Integração de Inteligência Artificial (Tópicos Avançados)**, do curso **Sistemas para Internet** do **IFRN — Campus Currais Novos**, ofertada pelo professor [Luciano Alexandre](https://github.com/luciano-alexandre/topicos-avancados/tree/main).

O material da disciplina está no repositório do professor. Aqui está a sequência que a gente implementou em sala e em casa: cada pasta é um passo que dá para clonar, ler e executar. A ideia é ver a decisão de projeto, o contrato HTTP e o que muda quando o modelo deixa de ser uma chamada solta no navegador e passa a ser uma dependência do backend.

## Ordem de leitura

| Pasta | O que essa etapa resolve |
| --- | --- |
| [`ollama-web-v1`](ollama-web-v1/) | Página estática que chama o Ollama direto do navegador. |
| [`ollama-web-v2`](ollama-web-v2/) | A mesma pergunta, agora atrás de uma API NestJS. O cliente deixa de escolher modelo e URL. |
| [`atv-tokenizacao`](atv-tokenizacao/) | Comparar como dois tokenizadores quebram o mesmo texto e quanto o template de chat acrescenta. |
| [`atv-pratica-v1`](atv-pratica-v1/) | Classificar um chamado em uma lista fechada de categorias. |
| [`atv-pratica-v2`](atv-pratica-v2/) | Resposta em fluxo (streaming) e cancelamento, com interface Angular. |
| [`atv-pratica-v3`](atv-pratica-v3/) | Sessão, histórico e limite do que o modelo relê a cada turno. |
| [`atv-pratica-v4`](atv-pratica-v4/) | Medir a classificação com casos fixos: acurácia e formato. |
| [`atv-pratica-v5-dupla`](atv-pratica-v5-dupla/) | Resumo estruturado do chamado, com validação da saída do modelo. |

Leia o README de cada pasta antes de subir o processo. O que vale para todos está nesta página. Porta, script e contrato de uma atividade ficam no README dela.

## O que instalar uma vez

Quase todas as pastas são Node.js + Ollama. A exceção é [`atv-tokenizacao`](atv-tokenizacao/), que usa Python e não sobe servidor.

- **Node.js 22** ou superior e **npm** (o frontend Angular das atividades práticas também usa essa versão).
- **Docker** com o plugin Compose, para o contêiner do Ollama.
- **Git**, para clonar este repositório.

Confira as versões:

```bash
node --version
npm --version
docker compose version
```

## Ollama local

O modelo roda na sua máquina, na porta **11434**. Os projetos NestJS leem a URL e o nome do modelo do arquivo `.env`. O navegador, a partir da v2, fala só com a API.

Os `docker-compose.yml` deste repositório usam um volume externo com o mesmo nome. Crie o volume uma vez:

```bash
docker volume create docker-ollama_ollama-data
```

Suba o Ollama a partir de **uma** pasta que tenha Compose. Qualquer uma serve; o serviço escuta a mesma porta. Com o contêiner já no ar, não suba outro: a porta 11434 só aceita um processo.

```bash
cd ollama-web-v2
docker compose up -d
docker compose exec ollama ollama pull llama3.2
docker compose exec ollama ollama list
```

O nome que aparecer em `ollama list` (por exemplo `llama3.2:latest`) é o valor de `OLLAMA_MODEL`.

## Variáveis de ambiente das APIs NestJS

Em cada pasta de API (`ollama-web-v2` e `atv-pratica-v1` em diante):

```bash
cp .env.example .env
```

| Variável | Função |
| --- | --- |
| `OLLAMA_BASE_URL` | Onde a API acha o Ollama. No Compose deste repositório, `http://localhost:11434`. |
| `OLLAMA_MODEL` | Modelo já baixado. Tem que ser igual a uma linha de `ollama list`. |
| `OLLAMA_TIMEOUT_MS` | Tempo máximo, em milissegundos, da chamada de inferência. |

O `.env` fica na sua máquina e está no `.gitignore`. O `.env.example` é o modelo versionado. Não coloque URL interna, chave ou nome de modelo “secreto” num commit: neste desenho o modelo é configuração local.

## Como subir uma API e, quando existir, a tela

Na pasta da atividade (a raiz do Nest, onde está o `package.json` do backend):

```bash
npm install
npm run start:dev
```

A API sobe em `http://localhost:3000`. Um único processo pode ocupar essa porta. Pare o `start:dev` anterior antes de abrir a próxima atividade.

Nas pastas que têm `frontend/` (`atv-pratica-v2` em diante), em outro terminal:

```bash
cd frontend
npm install
npm start
```

A tela abre em `http://localhost:4200`. A API dessas atividades libera CORS só para essa origem e só para `POST`.

## Portas usadas aqui

| Porta | Processo |
| --- | --- |
| 11434 | Ollama |
| 3000 | API NestJS |
| 4200 | Angular (`ng serve`) |
| 5500 | Live Server da página estática em `ollama-web-v1` |

## Testes das APIs

Na pasta do backend:

```bash
npm test
npm run build
```

Os testes de unidade não chamam o Ollama. O script de avaliação da v4 e da v5 chama: o contêiner e o modelo precisam estar no ar.

## O que este repositório versiona

Entra o código, os `.env.example`, os testes e os READMEs. Ficam de fora `node_modules`, `dist`, cache do Angular, ambiente virtual do Python, arquivos `.env` e os `.zip` que só repetem as pastas.
