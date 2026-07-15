import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faPen } from '@fortawesome/free-solid-svg-icons';

import { MenuComponent } from '../menu/menu.component';
import { User, UserEnum, RoleList, UserStatusList } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { MiscService } from '../../services/misc.service'
import { AccountService } from '../../services/account.service';

@Component({ selector: 'app-user-details', imports: [FontAwesomeModule, FormsModule, MenuComponent], templateUrl: './user-details.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './user-details.component.css' })

export class UserDetailsComponent implements OnInit
{
  faXmark = faXmark; faPen = faPen;

  role: string = "";
  roles: UserEnum[] = RoleList;

  SL: UserEnum[] = UserStatusList;

  userId: number = 0;
  user: User = new User();

  constructor(
    private diversService: MiscService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private menu: MenuComponent,
    private accountService: AccountService
  ) { }

  ngOnInit()
  {
    this.role = this.accountService.getRole();

    this.userId = this.route.snapshot.params['user-id'];
    this.user = new User();
    this.userService.getUserById(this.userId).subscribe( data => { this.user = data; });
  }

  updateUser(id: number) { this.router.navigate(['/user-update', id]); }

  goToUserList() { this.router.navigate(['/user-list']); }

}
