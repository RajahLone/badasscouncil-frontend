import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { HttpParams } from '@angular/common/http'
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { saveAs } from 'file-saver-es';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faRotate, faFilter, faFilterCircleXmark, faDownload, faUserTie, faShareNodes, faLock, faArrowLeft, faArrowRight, faPen, faCheck, faBan } from '@fortawesome/free-solid-svg-icons';

import { MenuComponent } from '../menu/menu.component';
import { AttachmentShort, AttachmentCount } from '../../interfaces/attachment';
import { Pagination, FILES_PER_MEMBER, FILES_FILTERS } from '../../interfaces/misc';
import { AttachmentService } from '../../services/attachment.service';
import { MiscService } from '../../services/misc.service'
import { PreferenceService } from '../../services/preference.service'

import { AccountService } from '../../services/account.service';

@Component({ selector: 'app-attachment-list', imports: [FontAwesomeModule, FormsModule, TooltipModule, MenuComponent], templateUrl: './attachment-list.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './attachment-list.component.css' })

export class AttachmentListComponent implements OnInit
{
  faPlus = faPlus; faRotate = faRotate; faShareNodes = faShareNodes; faLock = faLock; faPen = faPen; faCheck = faCheck; faBan = faBan;
  faFilterCircleXmark = faFilterCircleXmark; faFilter = faFilter;
  faDownload = faDownload; faUserTie = faUserTie;
  faArrowLeft = faArrowLeft; faArrowRight = faArrowRight;

  userId: number = 0;
  role: string = "";

  nameFilter: string = "";
  statusFilter: string = "";
  sort: number = 0;

  attachments: AttachmentShort[] = [];

  pagination: Pagination = new Pagination();
  pages: number[] = [1];

  ownAttachmentCount: AttachmentCount = new AttachmentCount();
  generalAttachmentCount: AttachmentCount = new AttachmentCount();

  @ViewChild('attachmentslist', {static: false}) attachmentsList!: ElementRef;

  constructor(
    private miscService: MiscService,
    private attachmentService: AttachmentService,
    private preferenceService: PreferenceService,
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService
  ) { }

  ngOnInit()
  {
    this.userId = this.accountService.getUserId();
    this.role = this.accountService.getRole();

    this.preferenceService.getPreference(FILES_FILTERS).subscribe(data =>
    {
      if (data != null)
      {
        const httpParams = new HttpParams({ fromString: data });

        if (httpParams.has("name")) { this.nameFilter = "" + httpParams.get("name"); }
        if (httpParams.has("status")) { this.statusFilter = "" + httpParams.get("status"); }
        if (httpParams.has("sort")) { this.sort = parseInt("" + httpParams.get("sort")); }
      }
      this.goToAttachementRefreshList();
    });
  }

  private retreiveDatas(wanted: number)
  {
    this.miscService.getOwnAttachmentCount().subscribe(data => { this.ownAttachmentCount = data; });
    this.miscService.getGeneralAttachmentCount().subscribe(data => { this.generalAttachmentCount = data; });

    this.attachmentService.getPagination(this.nameFilter, this.statusFilter, wanted).subscribe(page =>
    {
      this.pagination = page;

      this.pages = [1];
      if (this.pagination.total > 1) { for (let i = 2; i <= this.pagination.total; i++) { this.pages.push(i); } }

      this.attachmentService.getAttachmentList(this.nameFilter, this.statusFilter, this.sort, this.pagination.current, this.pagination.size).subscribe(data => {
        this.attachments = data;
        if (this.attachmentsList) { this.attachmentsList.nativeElement.scrollTop = 0; }
      });
    });
  }

  goToAttachementRefreshList() { this.retreiveDatas(this.pagination.current); }
  goToNextPage() { this.retreiveDatas(this.pagination.current + 1); }
  goToPrevPage() { this.retreiveDatas(this.pagination.current - 1); }
  goToPage(wanted: number) { this.retreiveDatas(wanted); }

  sortList(event: any) { this.sort = event.target.value; this.retreiveDatas(0); }
  filterByName() { this.retreiveDatas(this.pagination.current); }
  filterByStatus(event: any) { this.statusFilter = event.target.value; this.retreiveDatas(this.pagination.current); }
  resetFilters() { this.nameFilter = ""; this.statusFilter = ""; this.retreiveDatas(this.pagination.current); }

  goToAttachementCreation() { this.router.navigate(['/attachment-create']); }

  goToAttachementDetails(id: number) { this.router.navigate(['/attachment-details', id]); }

  getFile(id: number, nom: string) { this.attachmentService.getAttachmentItem(id).subscribe(response => { this.saveFile(response.body, nom); }); }

  saveFile(data: any, filename?: string) { const blob = new Blob([data], {type: 'application/zip'}); saveAs(blob, filename); }

  setMaxPerPage(event: any) { this.preferenceService.setPreference(FILES_PER_MEMBER, event.target.value).subscribe(() => { this.retreiveDatas(0); }); }

  claim(id: number) { this.attachmentService.claimAttachmentItem(id).subscribe(response => { this.retreiveDatas(0); }); }

  decline(id: number) { this.attachmentService.declineAttachmentItem(id).subscribe(response => { this.retreiveDatas(0); });}

}
