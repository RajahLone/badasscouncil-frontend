import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import SparkMD5 from 'spark-md5-es';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faUpload } from '@fortawesome/free-solid-svg-icons';

import { Environnement } from '../../env';
import { MenuComponent } from '../menu/menu.component';
import { AttachmentItem } from '../../interfaces/attachment';
import { AttachmentService } from '../../services/attachment.service';
import { HomeInformation } from '../../interfaces/misc';

@Component({ selector: 'app-attachment-upload', imports: [FontAwesomeModule, FormsModule, MenuComponent], templateUrl: './attachment-upload.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './attachment-upload.component.css' })

export class AttachmentUploadComponent implements OnInit
{
  faXmark = faXmark; faUpload = faUpload;

  @ViewChild('formRef') attachmentForm!: NgForm;
  @ViewChild('uploadButton', {static: false}) uploadButton!: ElementRef;
  @ViewChild('labelMessage', {static: false}) labelMessage!: ElementRef;

  attachment: AttachmentItem = new AttachmentItem();

  fileId: number = 0;
  uploadFile: boolean = false;
  file!: any;
  remainder: number = 0;
  hashed: string = "";

  constructor(
    private attachmentService: AttachmentService,
    private route: ActivatedRoute,
    private router: Router,
    private menu: MenuComponent,
    private renderer: Renderer2,
    private httpClient: HttpClient
  ) { }

  ngOnInit()
  {
    this.fileId = this.route.snapshot.params['file-id'];
    this.attachmentService.getAttachmentItemById(this.fileId).subscribe(data => { this.attachment = data; });
  }

  onArchiveSelected(event: any)
  {
    const et = event.target;

    if (et.files && et.files.length > 0)
    {
      this.file = et.files[0];
      this.uploadFile = true;
      this.computeChecksumMd5(this.file).then(md5 => { this.hashed = md5; console.log(md5); });
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

  async saveAttachment()
  {
    this.setButtonStartingUpload();

    const chunkSize = 1024 * 1024;
    let start = 0;
    let chunkIndex = 0;

    this.remainder = 0;

    try
    {
      while (start < this.file.size)
      {
        const end = Math.min(this.file.size, start + chunkSize);
        const chunk = this.file.slice(start, end);

        await this.attachmentService.uploadChunk(this.fileId, chunk, chunkIndex, this.file.name);

        this.remainder += chunk.size;
        let pourcentage = Math.floor((this.remainder*100)/this.file.size);
        this.setMessage('<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width:' + pourcentage +'%">' + pourcentage + '%</div></div>', false);

        start += chunkSize;
        chunkIndex++;
      }
    }
    catch (err:any) { console.error(err); }
    finally
    {
      this.attachmentService.mergeChunks(this.fileId, this.file.name, chunkIndex, this.hashed).subscribe({
        next: (msg) => { this.setButtonEndingUpload(); if (msg.error) { this.setMessage(msg.error, true); } else { this.goToAttachmentList(); } },
        error: (e:HttpErrorResponse) => { this.setButtonEndingUpload(); this.setMessage(e.error.message, true); },
        complete: () => { }
      });
    }
  }
  private setMessage(m: string, e: boolean) { if (this.labelMessage) { this.renderer.setProperty(this.labelMessage.nativeElement, 'innerHTML', m); if (e) { this.renderer.addClass(this.labelMessage.nativeElement, 'text-danger'); } else { this.renderer.removeClass(this.labelMessage.nativeElement, 'text-danger'); } } }
  private setButtonStartingUpload() { if (this.uploadButton) { this.renderer.setProperty(this.uploadButton.nativeElement, 'innerHTML', '<fa-icon [icon]="faUpload" animation="fade"></fa-icon>&nbsp;' + $localize`Téléversement en cours`); } }
  private setButtonEndingUpload() { if (this.uploadButton) { this.renderer.setProperty(this.uploadButton.nativeElement, 'innerHTML', '<fa-icon [icon]="faUpload"></fa-icon>&nbsp;' + $localize`Téléverser`); }  }

  addAttachmentFile() { this.saveAttachment(); }

  goToAttachmentList() { this.router.navigate(['/attachment-list']); }

}
