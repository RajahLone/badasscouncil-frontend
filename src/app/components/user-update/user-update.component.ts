import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';

import { MenuComponent } from '../menu/menu.component';
import { User, UserEnum, RoleList, UserStatusList } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { MiscService } from '../../services/misc.service'
import { AccountService } from '../../services/account.service';

@Component({ selector: 'app-user-update', imports: [FontAwesomeModule, FormsModule, MenuComponent], templateUrl: './user-update.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './user-update.component.css' })

export class UserUpdateComponent implements OnInit
{
  faXmark = faXmark; faCheck = faCheck; faTrash = faTrash;

  role: string = "";
  roles: UserEnum[] = RoleList;

  SL: UserEnum[] = UserStatusList;

  @ViewChild('formRef') userForm!: NgForm;

  userId: number = 0;
  user: User = new User();

  constructor(
    private miscService: MiscService,
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
    this.userService.getUserById(this.userId).subscribe(data => { this.user = data; });
  }

  updateConfirmed() { if (this.userForm.valid) { this.userService.updateUser(this.userId, this.user).subscribe(() => { this.goToUserList(); }); } }

  deleteConfirmed() { this.userService.deleteUser(this.userId).subscribe(() => { this.goToUserList(); }); }

  goToUserList() { this.router.navigate(['/user-list']); }

}
