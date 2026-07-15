import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { saveAs } from 'file-saver-es';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faRotate, faComment, faQuestion, faVideo, faMusic, faImage, faSquareBinary, faDownload, faUserTie } from '@fortawesome/free-solid-svg-icons';

import { MenuComponent } from '../menu/menu.component';
import { AttachmentShort } from '../../interfaces/attachment';
import { AttachmentService } from '../../services/attachment.service';

@Component({ selector: 'app-attachment-list', imports: [FontAwesomeModule, FormsModule, TooltipModule, MenuComponent], templateUrl: './attachment-list.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './attachment-list.component.css' })

export class AttachmentListComponent implements OnInit
{
  faPlus = faPlus; faRotate = faRotate; faComment = faComment; faQuestion = faQuestion; faVideo = faVideo; faMusic = faMusic; faImage = faImage; faSquareBinary = faSquareBinary;
  faDownload = faDownload; faUserTie = faUserTie;

  attachments: AttachmentShort[] = [];

  sort: number = 0;

  constructor(
    private attachmentService: AttachmentService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() { this.goToAttachementRefreshList(); }

  private retreiveDatas() { this.attachmentService.getAttachmentList(this.sort).subscribe(data => { this.attachments = data; }); }

  sortList(event: any) { this.sort = event.target.value; this.retreiveDatas(); }

  goToAttachementRefreshList() { this.retreiveDatas(); }

  goToAttachementCreation() { this.router.navigate(['/attachment-create']); }

  goToAttachementDetails(id: number) { this.router.navigate(['/attachment-details', id]); }

  getFile(id: number, nom: string) { this.attachmentService.getAttachmentItem(id).subscribe(response => { this.saveFile(response.body, nom); }); }

  saveFile(data: any, filename?: string) { const blob = new Blob([data], {type: 'application/zip'}); saveAs(blob, filename); }

}
