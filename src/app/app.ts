import { Component, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountService } from './services/account.service';

@Component({ selector: 'app-root', imports: [RouterOutlet], templateUrl: './app.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './app.css' })

export class App implements OnInit
{
  protected readonly title = signal('Bad Ass Council');

  logged: boolean = false;

  constructor(private accountService: AccountService) { }

  ngOnInit()
  {
    this.logged = this.accountService.isLogged();
  }
}
