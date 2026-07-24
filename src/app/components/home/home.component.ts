import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MenuComponent } from '../menu/menu.component';
import { HomeInformation, Quote } from '../../interfaces/misc';
import { AccountService } from '../../services/account.service'
import { UserCount } from '../../interfaces/user';
import { MiscService } from '../../services/misc.service'

@Component({ selector: 'app-home', imports: [MenuComponent, RouterLink], templateUrl: './home.component.html',  changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './home.component.css' })

export class HomeComponent implements OnInit
{

  logged: boolean = false;
  expired: boolean = false;
  nickName: string = "";
  message: HomeInformation = new HomeInformation();
  userCount: UserCount = new UserCount();
  quote: Quote = new Quote();

  constructor(
    private miscService: MiscService,
    private accountService: AccountService
  ) { }

  ngOnInit()
  {
    this.logged = this.accountService.isLogged();
    this.expired = this.accountService.hasPasswordExpired();

    if (this.logged) { this.nickName = this.accountService.getNickName(); }

    this.miscService.getMessage().subscribe(data => { this.message = data; });

    this.miscService.getUserCount().subscribe(data => { this.userCount = data; });

    this.miscService.getQuote().subscribe(data => { this.quote = data; });
  }

}
