import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faPen, faUpload } from '@fortawesome/free-solid-svg-icons';

import { MenuComponent } from '../menu/menu.component';
import { AttachmentShort } from '../../interfaces/attachment';
import { AttachmentService } from '../../services/attachment.service';

@Component({ selector: 'app-attachment-details', imports: [FontAwesomeModule, FormsModule, MenuComponent], templateUrl: './attachment-details.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './attachment-details.component.css' })

export class AttachmentDetailsComponent implements OnInit
{
  faXmark = faXmark; faPen = faPen; faUpload = faUpload;

  fileId: number = 0;

  attachment: AttachmentShort = new AttachmentShort();

  constructor(private attachmentService: AttachmentService, private route: ActivatedRoute, private router: Router, private menu: MenuComponent) { }

  ngOnInit()
  {
    this.fileId = this.route.snapshot.params['file-id'];
    this.attachment = new AttachmentShort();
    this.attachmentService.getAttachmentById(this.fileId).subscribe( data => { this.attachment = data; });
  }

  updateArchive(id: number) { this.router.navigate(['/attachment-upload', id]); }

  updateAttachment(id: number) { this.router.navigate(['/attachment-update', id]); }

  goToAttachmentList() { this.router.navigate(['/attachment-list']); }

}
