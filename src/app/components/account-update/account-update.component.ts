import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';

import { MenuComponent } from '../menu/menu.component';
import { User, UserEnum, RoleList } from '../../interfaces/user';
import { AccountService } from '../../services/account.service'
import { MiscService } from '../../services/misc.service'

@Component({ selector: 'app-account-update', imports: [FontAwesomeModule, FormsModule, MenuComponent], templateUrl: './account-update.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './account-update.component.css' })

export class AccountUpdateComponent implements OnInit
{
  faXmark = faXmark; faCheck = faCheck;

  role: string = "";
  roles: UserEnum[] = RoleList;

  @ViewChild('formRef') userForm!: NgForm;

  user: User = new User();

  constructor(
    private diversService: MiscService,
    private accountService : AccountService,
    private router: Router,
    private menu: MenuComponent
  ) { }

  ngOnInit()
  {
    this.role = this.accountService.getRole();

    this.user = new User();
    this.accountService.getAccount().subscribe(data => { this.user = data; });
  }

  updateConfirmed() { if (this.userForm.valid) { this.accountService.updateAccount(this.user).subscribe(() => { this.goToHome(); });  } }

  goToHome() { this.router.navigate(['/'], { queryParams: { 'refresh': this.menu.getRandomInteger(1, 100000) } }); }

}
