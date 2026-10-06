import { Injectable } from '@angular/core';

export interface ResumoChamado {
  titulo: string;
  resumo: string;
  pontosImportantes: string[];
  revisaoHumana: boolean;
  modelo: string;
}

@Injectable({ providedIn: 'root' })
export class ChamadosService {
  async resumir(texto: string, signal: AbortSignal): Promise<ResumoChamado> {
    const response = await fetch('http://localhost:3000/chamados/resumir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto }),
      signal,
    });

    if (!response.ok) {
      throw new Error(await mensagemDeErro(response));
    }

    return (await response.json()) as ResumoChamado;
  }
}

async function mensagemDeErro(response: Response): Promise<string> {
  const body = await response.json().catch(() => null);
  const message = body?.message;

  if (Array.isArray(message)) {
    return message.join(' ');
  }

  if (typeof message === 'string' && message.trim()) {
    return message;
  }

  return `Falha ao resumir: HTTP ${response.status}`;
}
