import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faFilter, faRotate, faFlagCheckered, faFilterCircleXmark, faCircleCheck, faBed, faCircleXmark, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { MenuComponent } from '../menu/menu.component';
import { UserShort, UserEnum, UserStatusList } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { Pagination } from '../../interfaces/misc';
import { MiscService } from '../../services/misc.service'

@Component({ selector: 'app-user-list', imports: [FontAwesomeModule, TooltipModule, FormsModule, MenuComponent], templateUrl: './user-list.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './user-list.component.css' })

export class UserListComponent implements OnInit
{
  faPlus = faPlus; faFilter = faFilter; faRotate = faRotate; faFlagCheckered = faFlagCheckered; faFilterCircleXmark = faFilterCircleXmark; faCircleCheck = faCircleCheck; faBed = faBed;
  faCircleXmark = faCircleXmark; faArrowLeft = faArrowLeft; faArrowRight = faArrowRight;

  sort: number = 0;
  nameFilter: string = "";
  statusFilter: number = 0;

  SL: UserEnum[] = UserStatusList;

  pagination: Pagination = new Pagination();
  pages: number[] = [1];
  users: UserShort[] = [];

  @ViewChild('userslist', {static: false}) usersList!: ElementRef;

  selection: Array<number> = new Array<number>();

  constructor(
    private diversService: MiscService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2
  ) { }

  ngOnInit()
  {
    this.goToUserListRefresh();
  }

  private retreiveDatas(wantedPage: number)
  {
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
  resetFilters() { this.nameFilter = ""; this.statusFilter = 0; this.retreiveDatas(this.pagination.current); }

  goToAddUser() { this.router.navigate(['/user-create']); }

  goToUserDetails(id: number) { this.router.navigate(['/user-details', id]); }

}
