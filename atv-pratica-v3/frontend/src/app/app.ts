import { Component, signal } from '@angular/core';
import { ChatStreamComponent } from './ia/chat-stream/chat-stream.component';

@Component({
  imports: [ChatStreamComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
}
