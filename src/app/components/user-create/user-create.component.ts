import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';

import { MenuComponent } from '../menu/menu.component';
import { User, UserEnum, RoleList, UserStatusList, UserCount } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { MiscService } from '../../services/misc.service'
import { AccountService } from '../../services/account.service';

@Component({ selector: 'app-user-create', imports: [FontAwesomeModule, FormsModule, MenuComponent], templateUrl: './user-create.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './user-create.component.css' })

export class UserCreateComponent implements OnInit
{
  faXmark = faXmark; faPlus = faPlus;

  role: string = "";
  roles: UserEnum[] = RoleList;

  SL: UserEnum[] = UserStatusList;

  @ViewChild('formRef') userForm!: NgForm;

  user: User = new User();

  userCount: UserCount = new UserCount();

  constructor(
    private miscService: MiscService,
    private userService: UserService,
    private router: Router,
    private menu: MenuComponent,
    private accountService: AccountService
  ) { }

  ngOnInit()
  {
    this.role = this.accountService.getRole();

    this.miscService.getUserCount().subscribe(data => { this.userCount = data; });
  }

  private saveUser() { this.userService.createUser(this.user).subscribe(() => { this.goToUserList(); }); }

  addUser() { if (this.userForm.valid) { this.saveUser(); } }

  goToUserList() { this.router.navigate(['/user-list']); }

}
