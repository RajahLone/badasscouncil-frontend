import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MenuComponent } from '../menu/menu.component';
import { Message } from '../../interfaces/misc';
import { AccountService } from '../../services/account.service'
import { MiscService } from '../../services/misc.service'

@Component({ selector: 'app-home', imports: [MenuComponent, RouterLink], templateUrl: './home.component.html',  changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './home.component.css' })

export class HomeComponent implements OnInit
{

  logged: boolean = false;
  pseudonyme: string = "";
  message: Message = new Message();

  constructor(
    private diversService: MiscService,
    private accountService: AccountService
  ) { }

  ngOnInit()
  {
    this.logged = this.accountService.isLogged();

    if (this.logged) { this.pseudonyme = this.accountService.getLoginName(); }

    this.diversService.getMessage().subscribe(data => { this.message = data; });
  }

}
