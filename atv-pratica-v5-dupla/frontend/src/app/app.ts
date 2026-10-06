import { Component } from '@angular/core';
import { ChatResumoComponent } from './chamados/chat-resumo/chat-resumo.component';

@Component({
  imports: [ChatResumoComponent],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {}
