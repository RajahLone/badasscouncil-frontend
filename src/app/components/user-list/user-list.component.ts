import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faFilter, faRotate, faCheck, faFilterCircleXmark, faArrowLeft, faArrowRight, faCircleCheck, faCircleXmark, faClock, faLock, faBed } from '@fortawesome/free-solid-svg-icons';

import { MenuComponent } from '../menu/menu.component';
import { UserShort, UserEnum, UserStatusList, UserCount } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { Pagination, USERS_PAGE_SIZE } from '../../interfaces/misc';
import { MiscService } from '../../services/misc.service'
import { PreferenceService } from '../../services/preference.service'

import { AccountService } from '../../services/account.service';

@Component({ selector: 'app-user-list', imports: [FontAwesomeModule, TooltipModule, FormsModule, MenuComponent], templateUrl: './user-list.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './user-list.component.css' })

export class UserListComponent implements OnInit
{
  faPlus = faPlus; faFilter = faFilter; faCheck = faCheck; faRotate = faRotate; faFilterCircleXmark = faFilterCircleXmark; faArrowLeft = faArrowLeft; faArrowRight = faArrowRight;
  faCircleCheck = faCircleCheck; faCircleXmark = faCircleXmark; faClock = faClock; faLock = faLock; faBed = faBed;

  logged: boolean = false;
  role: string = "";

  sort: number = 0;
  nameFilter: string = "";
  statusFilter: string = "";

  SL: UserEnum[] = UserStatusList;

  pagination: Pagination = new Pagination();
  pages: number[] = [1];
  users: UserShort[] = [];

  userCount: UserCount = new UserCount();

  @ViewChild('userslist', {static: false}) usersList!: ElementRef;
  @ViewChild('activateButton', {static: false}) activateButton!: ElementRef;

  selection: Array<number> = new Array<number>();

  constructor(
    private miscService: MiscService,
    private userService: UserService,
    private preferenceService: PreferenceService,
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private accountService: AccountService
  ) { }

  ngOnInit()
  {
    this.logged = this.accountService.isLogged();
    this.role = this.accountService.getRole();


    this.goToUserListRefresh();
  }

  private retreiveDatas(wantedPage: number)
  {
    this.miscService.getUserCount().subscribe(data => { this.userCount = data; });

    this.userService.getPagination(this.nameFilter, this.statusFilter, wantedPage).subscribe(page =>
    {
      this.pagination = page;

      this.pages = [1];
      if (this.pagination.total > 1) { for (let i = 2; i <= this.pagination.total; i++) { this.pages.push(i); } }

      this.userService.getUserList(this.nameFilter, this.statusFilter, this.sort, this.pagination.current, this.pagination.size).subscribe(data =>
      {
         this.users = data;
         if (this.usersList) { this.usersList.nativeElement.scrollTop = 0; }
      });
    });
  }

  goToUserListRefresh() { this.retreiveDatas(this.pagination.current); }
  goToNextPage() { this.retreiveDatas(this.pagination.current + 1); }
  goToPrevPage() { this.retreiveDatas(this.pagination.current - 1); }
  goToPage(pageVoulue: number) { this.retreiveDatas(pageVoulue); }

  goToFiltrage() { this.retreiveDatas(this.pagination.current); }

  sortList(event: any) { this.sort = event.target.value; this.retreiveDatas(this.pagination.current); }
  filterByName() { this.retreiveDatas(this.pagination.current); }
  filterByStatus(event: any) { this.statusFilter = event.target.value; this.retreiveDatas(this.pagination.current); }
  resetFilters() { this.nameFilter = ""; this.statusFilter = ""; this.retreiveDatas(this.pagination.current); }

  goToAddUser() { this.router.navigate(['/user-create']); }

  goToUserDetails(id: number) { this.router.navigate(['/user-details', id]); }

  updateSelection(event: any)
  {
    const id = event.target.id;
    if (id)
    {
      if (id.startsWith("check_"))
      {
        let nu = Number('' + id.substring(6));
        let nb = 0;

        if (this.selection.includes(nu)) { this.selection = this.selection.filter(it => it !== nu); nb = this.selection.length; } else { nb = this.selection.push(nu); }

        if (this.activateButton) { if (nb > 0) { this.renderer.removeClass(this.activateButton.nativeElement, 'disabled'); } else { this.renderer.addClass(this.activateButton.nativeElement, 'disabled'); } }
      }
    }
  }

  activateSelection() { if (this.selection.length > 0) { this.userService.activateUsers(this.selection).subscribe(() => { this.retreiveDatas(this.pagination.current) }); } }

  setMaxPerPage(event: any) { this.preferenceService.setPreference(USERS_PAGE_SIZE, event.target.value).subscribe(() => { this.retreiveDatas(0); }); }
}
