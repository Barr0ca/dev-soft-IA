# atv-tokenizacao — o mesmo texto, dois tokenizadores

Script Python que mostra como o texto vira IDs antes de chegar num modelo. A frase é fixa no arquivo. Para cada checkpoint o script imprime a classe do tokenizador, os IDs, os tokens visíveis, o tamanho do texto puro e o tamanho da mesma frase dentro do template de chat.

A diferença entre esses dois tamanhos é o overhead: papéis, marcadores e o prefixo de geração que o modelo espera e que a gente não digitou.

Esta pasta não sobe API, não usa Ollama e não usa Node.

## O que tem na pasta

`comparar_tokenizadores.py` percorre a lista `MODELOS`:

- `Qwen/Qwen2.5-0.5B-Instruct`
- `mistralai/Mistral-7B-Instruct-v0.3`

O texto comparado é: “Programação, aplicações Web e IA: custo, segurança e explicabilidade.”

Dá para trocar a frase em `TEXTO` ou acrescentar outro checkpoint público compatível com `AutoTokenizer` na lista `MODELOS`.

## Como iniciar

É preciso Python 3 e rede na primeira execução: o `transformers` baixa o tokenizador do Hugging Face (os pesos do modelo não entram nessa comparação).

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install transformers
python comparar_tokenizadores.py
```

O diretório `.venv` fica de fora do Git.

## O que ler na saída

Para cada modelo:

| Campo | Significado |
| --- | --- |
| Revisão | Commit do checkpoint no Hub, quando o tokenizador informa. |
| IDs do texto / Tokens visíveis | A frase sem o envelope de chat. |
| `T_texto` | Quantidade de tokens dessa frase. |
| `T_mensagem` | Quantidade depois de `apply_chat_template` com papel `user` e prompt de geração. |
| Overhead | `T_mensagem - T_texto`. |

Dois modelos podem discordar no recorte da mesma palavra, da vírgula e dos acentos. Por isso limite de contexto e custo não se comparam só em “número de caracteres”.
