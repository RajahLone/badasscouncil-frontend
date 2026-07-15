import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';

import { MenuComponent } from '../menu/menu.component';
import { AttachmentShort } from '../../interfaces/attachment';
import { AttachmentService } from '../../services/attachment.service';
import { UserShort } from '../../interfaces/user';
import { UserService } from '../../services/user.service';

@Component({ selector: 'app-attachment-update', imports: [FontAwesomeModule, FormsModule, MenuComponent], templateUrl: './attachment-update.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './attachment-update.component.css' })

export class AttachmentUpdateComponent implements OnInit
{
  faXmark = faXmark; faCheck = faCheck; faTrash = faTrash;

  users: UserShort[] = [];

  @ViewChild('formRef') attachmentForm!: NgForm;

  attachment: AttachmentShort = new AttachmentShort();

  fileId: number = 0;

  constructor(private attachmentService: AttachmentService, private userService: UserService, private route: ActivatedRoute, private router: Router, private menu: MenuComponent) { }

  ngOnInit()
  {
    this.retreiveUsers();
    this.fileId = this.route.snapshot.params['file-id'];
    this.attachmentService.getAttachmentById(this.fileId).subscribe(data => { this.attachment = data; });
  }

  private retreiveUsers() { this.userService.getUserListOptions().subscribe(data => { this.users = data; }); }

  private saveAttachment() { this.attachmentService.updateAttachment(this.fileId, this.attachment).subscribe(() => { this.goToAttachmentList(); }); }

  updateConfirmed() { if (this.attachmentForm.valid) { this.saveAttachment(); } }

  deleteConfirmed() { this.attachmentService.deleteAttachment(this.fileId).subscribe(() => { this.goToAttachmentList(); }); }

  goToAttachmentList() { this.router.navigate(['/attachment-list']); }

}
