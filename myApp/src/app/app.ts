import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from './root/menu';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
