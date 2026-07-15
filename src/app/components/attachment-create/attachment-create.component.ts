import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http'
import SparkMD5 from 'spark-md5-es';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faPlus, faUpload } from '@fortawesome/free-solid-svg-icons';

import { MenuComponent } from '../menu/menu.component';
import { Attachment } from '../../interfaces/attachment';
import { AttachmentService } from '../../services/attachment.service';
import { UserShort } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { AccountService } from '../../services/account.service'

@Component({ selector: 'app-attachment-create', imports: [FontAwesomeModule, FormsModule, MenuComponent], templateUrl: './attachment-create.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './attachment-create.component.css' })

export class AttachmentCreateComponent implements OnInit
{
  faXmark = faXmark; faPlus = faPlus; faUpload = faUpload;

  users: UserShort[] = [];

  @ViewChild('formRef') attachmentForm!: NgForm;
  @ViewChild('uploadButton', {static: false}) uploadButton!: ElementRef;
  @ViewChild('labelMessage', {static: false}) labelMessage!: ElementRef;

  attachment: Attachment = new Attachment();
  uploadFile: boolean = false;
  file!: any;
  remainder: number = 0;
  hashed: string = "";
  chunkIndex = 0;

  constructor(
    private accountService : AccountService,
    private attachmentService: AttachmentService,
    private userService: UserService,
    private router: Router,
    private menu: MenuComponent,
    private renderer: Renderer2
  ) { }

  ngOnInit() { this.retreiveUsers(); this.attachment.ownerId = this.accountService.getUserId(); }

  private retreiveUsers() { this.userService.getUserListOptions().subscribe(data => { this.users = data; }); }

  onArchiveSelected(event: any)
  {
    const et = event.target;
    const reader = new FileReader();

    if (et.files && et.files.length > 0)
    {
      const file = et.files[0];

      this.attachment.archiveName = "";
      this.attachment.versionNumber = 0;

      this.file = et.files[0];
      this.uploadFile = true;
      this.computeChecksumMd5(this.file).then(md5 => { this.hashed = md5 });
		}
  }
  /** https://dev.to/qortex/compute-md5-checksum-for-a-file-in-typescript-59a4 */
  computeChecksumMd5(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunkSize = 2097152;
      const spark = new SparkMD5.ArrayBuffer();
      const fileReader = new FileReader();
      let cursor = 0;

      fileReader.onerror = function(): void { reject('MD5 computation failed - error reading the file'); };

      function processChunk(chunk_start: number): void { const chunk_end = Math.min(file.size, chunk_start + chunkSize); fileReader.readAsArrayBuffer(file.slice(chunk_start, chunk_end)); }

      fileReader.onload = function(e: any): void { spark.append(e.target.result); cursor += chunkSize; if (cursor < file.size) { processChunk(cursor); } else { resolve(spark.end()); } };

      processChunk(0);
    });
  }

  async saveArchive(id: number)
  {
    const spark = new SparkMD5.ArrayBuffer();
    const chunkSize = 1024 * 1024;
    let start = 0;

    this.chunkIndex = 0;
    this.remainder = 0;

    try
    {
      while (start < this.file.size)
      {
        const end = Math.min(this.file.size, start + chunkSize);
        const chunk = this.file.slice(start, end);

        await this.attachmentService.uploadChunk(id, chunk, this.chunkIndex, this.file.name);

        this.remainder += chunk.size;
        let pourcentage = Math.floor((this.remainder*100)/this.file.size);
        this.setMessage('<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width:' + pourcentage +'%">' + pourcentage + '%</div></div>', false);

        start += chunkSize;
        this.chunkIndex++;
      }
    }
    catch (err:any) { console.error(err); }
    finally
    {
      this.attachmentService.mergeChunks(id, this.file.name, this.chunkIndex, this.hashed).subscribe({
        next: (msg) => { this.setButtonEndingUpload(); if (msg.erreur) { this.setMessage(msg.erreur, true); } else { this.goToAttachmentList(); } },
        error: (e:HttpErrorResponse) => { this.setButtonEndingUpload(); this.setMessage(e.error.message, true); },
        complete: () => { }
      });
    }
  }
  private saveAttachment()
  {
    this.setButtonStartingUpload();

    this.attachmentService.createAttachment(this.attachment).subscribe({
      next: async (ret) => { await this.saveArchive(Number('' + ret)); this.setButtonEndingUpload(); this.goToAttachmentList(); },
      error: (e:HttpErrorResponse) => { this.setButtonEndingUpload(); this.setMessage(e.error.message, true); },
      complete: () => { }
    });
  }
  private setMessage(m: string, e: boolean) { if (this.labelMessage) { this.renderer.setProperty(this.labelMessage.nativeElement, 'innerHTML', m); if (e) { this.renderer.addClass(this.labelMessage.nativeElement, 'text-danger'); } else { this.renderer.removeClass(this.labelMessage.nativeElement, 'text-danger'); } } }
  private setButtonStartingUpload() { if (this.uploadButton && this.uploadFile) { this.renderer.setProperty(this.uploadButton.nativeElement, 'innerHTML', '<fa-icon [icon]="faUpload" animation="fade"></fa-icon>&nbsp;' + $localize`Téléversement en cours`); } }
  private setButtonEndingUpload() { if (this.uploadButton) { this.renderer.setProperty(this.uploadButton.nativeElement, 'innerHTML', '<fa-icon [icon]="faPlus"></fa-icon>&nbsp;' + $localize`Créer`); }  }

  addProduction() { if (this.attachmentForm.valid) { this.saveAttachment(); } }

  goToAttachmentList() { this.router.navigate(['/attachment-list']); }

}
