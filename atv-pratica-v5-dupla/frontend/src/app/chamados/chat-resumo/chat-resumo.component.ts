import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChamadosService, ResumoChamado } from '../chamados.service';

interface Turno {
  id: number;
  texto: string;
  status: 'loading' | 'done' | 'error' | 'cancelled';
  resumo?: ResumoChamado;
  erro?: string;
}

interface Exemplo {
  rotulo: string;
  texto: string;
}

@Component({
  selector: 'app-chat-resumo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat-resumo.component.html',
  styleUrl: './chat-resumo.component.css',
})
export class ChatResumoComponent {
  private readonly chamados = inject(ChamadosService);
  private readonly fim = viewChild<ElementRef<HTMLElement>>('fim');
  private readonly campo = viewChild<ElementRef<HTMLTextAreaElement>>('campo');
  private abortController?: AbortController;
  private proximoId = 1;

  readonly exemplos: Exemplo[] = [
    {
      rotulo: 'Chamado objetivo',
      texto: 'Não consigo emitir a segunda via do boleto no portal do aluno.',
    },
    {
      rotulo: 'Com uma negação',
      texto:
        'Não consigo acessar o portal do aluno. A senha está correta e o sistema não mostra mensagem de erro.',
    },
    {
      rotulo: 'Texto curto demais',
      texto: 'Preciso de ajuda.',
    },
  ];

  texto = '';
  readonly turnos = signal<Turno[]>([]);
  readonly enviando = signal(false);

  async enviar(): Promise<void> {
    const texto = this.texto.trim();
    if (!texto || this.enviando()) return;

    const id = this.proximoId++;
    this.abortController = new AbortController();
    this.texto = '';
    this.enviando.set(true);
    this.turnos.update((atual) => [...atual, { id, texto, status: 'loading' }]);
    this.rolarParaOFim();

    try {
      const resumo = await this.chamados.resumir(texto, this.abortController.signal);
      this.atualizar(id, { status: 'done', resumo });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        this.atualizar(id, { status: 'cancelled' });
      } else {
        const mensagem =
          error instanceof Error ? error.message : 'Não foi possível resumir o chamado.';
        this.atualizar(id, { status: 'error', erro: mensagem });
      }
    } finally {
      this.abortController = undefined;
      this.enviando.set(false);
      this.rolarParaOFim();
    }
  }

  cancelar(): void {
    this.abortController?.abort();
  }

  preencher(exemplo: string): void {
    if (this.enviando()) return;
    this.texto = exemplo;
    queueMicrotask(() => this.campo()?.nativeElement.focus());
  }

  aoTeclar(event: KeyboardEvent): void {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      void this.enviar();
    }
  }

  private atualizar(id: number, patch: Partial<Turno>): void {
    this.turnos.update((atual) =>
      atual.map((turno) => (turno.id === id ? { ...turno, ...patch } : turno)),
    );
  }

  private rolarParaOFim(): void {
    queueMicrotask(() => {
      this.fim()?.nativeElement.scrollIntoView({ block: 'end' });
    });
  }
}
