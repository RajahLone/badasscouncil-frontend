import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faPen, faKey } from '@fortawesome/free-solid-svg-icons';

import { MenuComponent } from '../menu/menu.component';
import { User, UserEnum, RoleList } from '../../interfaces/user';
import { AccountService } from '../../services/account.service'
import { MiscService } from '../../services/misc.service'

@Component({ selector: 'app-account-details', imports: [FontAwesomeModule, FormsModule, MenuComponent], templateUrl: './account-details.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './account-details.component.css' })

export class AccountDetailsComponent implements OnInit
{
  faXmark = faXmark; faPen = faPen; faKey = faKey;

  role: string = "";
  roles: UserEnum[] = RoleList;

  user: User = new User();

  constructor(
    private miscService: MiscService,
    private accountService : AccountService,
    private router: Router,
    private menu: MenuComponent
  ) { }

  ngOnInit()
  {
    this.role = this.accountService.getRole();

    this.user = new User();
    this.accountService.getAccount().subscribe( data => { this.user = data; });
  }

  updateAccount() { this.router.navigate(['/account-update']); }

  updateMotDePasse() { this.router.navigate(['/account-password']); }

  goToHome() { this.router.navigate(['/'], { queryParams: { 'refresh': this.menu.getRandomInteger(1, 100000) } }); }

}
