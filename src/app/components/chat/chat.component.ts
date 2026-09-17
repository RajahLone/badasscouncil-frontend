import { Component, OnInit, OnDestroy, ViewChild, ElementRef, TemplateRef, ChangeDetectionStrategy, SecurityContext, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { timer } from 'rxjs';
import { takeWhile } from "rxjs/operators"
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faComment, faPlus, faCircleInfo, faLock, faClockRotateLeft, faFaceSmile, faImages } from '@fortawesome/free-solid-svg-icons';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DomSanitizer } from '@angular/platform-browser';

import { MenuComponent } from '../menu/menu.component';
import { MessageShort, MessageShortPass, Room, RoomPassword } from '../../interfaces/chat';
import { NickName } from '../../interfaces/user';
import { ChatService } from '../../services/chat.service';
import { ImageService } from '../../services/image.service'
import { AccountService } from '../../services/account.service'
import { Pagination } from '../../interfaces/misc';
import { MiscService } from '../../services/misc.service'

@Component({ selector: 'app-chat', imports: [FontAwesomeModule, TooltipModule, FormsModule, MenuComponent], templateUrl: './chat.component.html', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './chat.component.css' })

export class ChatComponent implements OnInit, OnDestroy
{
  faComment = faComment; faPlus = faPlus; faCircleInfo = faCircleInfo; faLock = faLock; faClockRotateLeft = faClockRotateLeft; faFaceSmile = faFaceSmile; faImages = faImages;

  modalRoomPassword?: BsModalRef;

  logged: boolean = false;
  role: string = "";
  userId: number = 0;

  alive: boolean = true;
  timerOnce: boolean = false;
  disabled: boolean = false;
  first: boolean = true;

  rooms: Room[] = [];
  passwords: RoomPassword[] = [];
  promptOpened: boolean = false;
  roomPasswordValue: string = "";

  currentRoomId: number = 0;
  currentTopic: string = "no room yet selected";

  messages: MessageShort[] = [];
  lastMessageId: number = 0;
  pagination: Pagination = new Pagination();
  firstMessageId: number = 0;

  newMessage: MessageShortPass = new MessageShortPass();

  nicknames: NickName[] = [];
  emojis: string = "";

  selectedFiles?: FileList;

  starts: RegExp = /^img_/;
  contains: RegExp = /[img_0-9|]/;

  constructor(
    private chatService: ChatService,
    private imageService: ImageService,
    private accountService: AccountService,
    private router: Router,
    private miscService: MiscService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  )
  { }

  ngOnInit()
  {
    this.logged = this.accountService.isLogged();
    this.role = this.accountService.getRole();
    this.userId = this.accountService.getUserId();

    if (this.logged)
    {
      this.newMessage.nickName = this.accountService.getNickName();
      this.emojis = this.miscService.getEmojis();

      this.retreiveNicknames();

      if (this.timerOnce == false) { this.timerOnce = true; timer(0, 7000).pipe(takeWhile(() => this.alive)).subscribe(() => { this.retreiveRooms(); }); }
    }
  }

  ngOnDestroy() { if (this.timerOnce) { this.alive = false; } }

  private retreiveNicknames() { this.chatService.getNickNameListOption().subscribe(data => { this.nicknames = data; }); }

  retreiveRooms()
  {
    if ((this.router.url !== '/chat')) { return; }

    this.logged = this.accountService.isLogged();

    if ((this.logged) && (this.disabled == false))
    {
      this.chatService.getListRoom().subscribe(data => {
        this.rooms = data;
        if (this.rooms == null) { this.currentRoomId = 0; this.currentTopic = ""; }
        if (this.currentRoomId < 1) { if (this.rooms.length > 0) { this.currentRoomId = this.rooms[0].roomId; } }

        if (this.first)
        {
          for (let r of this.rooms) { this.passwords.push({roomId: r.roomId, password: '', granted: false}); }
          this.first = false;
        }
        else
        {
          for (let p of this.passwords)
          {
            let exists: boolean = false;

            for (let r of this.rooms) { if (p.roomId === r.roomId) { exists = true; } }

            if (!exists) { this.passwords.push({roomId: p.roomId, password: '', granted: false}); }
          }
        }

        this.retreiveLastMessages();
      });
    }
  }

  goToNewRoom() { this.router.navigate(['/room-create']); }
  goToRoomDetails(id: number) { this.router.navigate(['/room-details', id]); }
  stay() {}

  openRoom(id: number)
  {
    this.lastMessageId = 0;
    this.firstMessageId = 0;
    this.currentRoomId = id;
    this.messages = [];
    if (id > 0) { this.retreiveLastMessages(); }
  }

  openPasswordPrompt(template: TemplateRef<void>, id: number)
  {
    this.lastMessageId = 0;
    this.firstMessageId = 0;
    this.currentRoomId = id;
    this.messages = [];
    if (id > 0)
    {
      for (let p of this.passwords) { if (this.currentRoomId == p.roomId) { this.roomPasswordValue = p.password; } }

      this.modalRoomPassword = this.modalService.show(template);
      this.modalService.onHide.subscribe(() => { this.promptOpened = false; });
      this.promptOpened = true;
      setTimeout(() => { let prompt = document.getElementById('modalInputPassword'); if (prompt) { prompt.focus(); } }, 300);
    }
  }
  declinePassword() { this.modalRoomPassword?.hide(); this.promptOpened = false; }
  confirmPassword()
  {
    for (let p of this.passwords) { if (this.currentRoomId == p.roomId) { p.password = this.roomPasswordValue; } }
    this.modalRoomPassword?.hide();
    this.promptOpened = false;
    this.retreiveLastMessages();
  }

  private appendLines(d: MessageShort[])
  {
    if (d != null)
    {
      if (d.length > 0)
      {
        for (let j = 0; j < d.length; j++)
        {
          if (!this.hasId(d[j].messageId))
          {
            let str: string = d[j].content;

            let img: boolean = ((d[j].messageType === 'IMAGES') && this.starts.test(str) && this.contains.test(str));

            if (img) { d[j].content = ""; }

            this.messages.push(d[j]);

            if (img) { this.convertThumbnails(d[j].messageId, str); }
          }
        }
      }
    }
  }

  private insertLines(d: MessageShort[])
  {
    if (d != null)
    {
      if (d.length > 0)
      {
        for (let j = 0; j < d.length; j++)
        {
          if (!this.hasId_backward(d[j].messageId))
          {
            let str: string = d[j].content;

            let img: boolean = ((d[j].messageType === 'IMAGES') && this.starts.test(str) && this.contains.test(str));

            if (img) { d[j].content = ""; }

            this.messages.unshift(d[j]);

            if (img) { this.convertThumbnails(d[j].messageId, str); }
          }
        }
      }
    }
  }

  retreiveLastMessages()
  {
    if (this.promptOpened) { return; }
    if ((this.router.url !== '/chat')) { return; }

    this.logged = this.accountService.isLogged();

    if ((this.logged) && (this.disabled == false) && (this.currentRoomId > 0))
    {
      let pass:string = ""; for (let p of this.passwords) { if (this.currentRoomId == p.roomId) { pass = p.password; } }

      if (this.messages.length == 0)
      {
        this.chatService.getCount(this.currentRoomId).subscribe(page => { this.pagination.items = page.items; this.pagination.size = this.messages.length; });
      }

      this.chatService.getNew(this.currentRoomId, this.lastMessageId, pass).subscribe(data =>
      {
        this.appendLines(data);
        this.setLastId();
      });

      for (var i in this.rooms) { if (this.currentRoomId == this.rooms[i].roomId) { this.currentTopic = this.rooms[i].topic; } }
    }
  }

  retreiveOldMessages()
  {
    if (this.promptOpened) { return; }
    if ((this.router.url !== '/chat')) { return; }

    this.logged = this.accountService.isLogged();

    if ((this.logged) && (this.disabled == false) && (this.currentRoomId > 0))
    {
      let pass:string = ""; for (let p of this.passwords) { if (this.currentRoomId == p.roomId) { pass = p.password; } }

      this.chatService.getOld(this.currentRoomId, this.firstMessageId, pass).subscribe(data =>
      {
        this.insertLines(data);
        this.setLastId();
      });
    }
  }

  private setLastId()
  {
    let maxId = this.lastMessageId;
    let minId = this.firstMessageId;

    this.lastMessageId = 0;
    this.firstMessageId = 999999999999;

    if (this.messages != null)
    {
      if (this.messages.length > 0)
      {
        for (let i = 0; i < this.messages.length; i++)
        {
          this.lastMessageId = Math.max(this.lastMessageId, this.messages[i].messageId);
          this.firstMessageId = Math.min(this.firstMessageId, this.messages[i].messageId);
        }
      }

      this.pagination.size = this.messages.length;
    }

    if (maxId != this.lastMessageId) { setTimeout(() => { let ml = document.getElementById('messagesList'); if (ml) { ml.scrollTop = ml.scrollHeight; } }, 300); }
    else
    if (minId != this.firstMessageId) { setTimeout(() => { let ml = document.getElementById('messagesList'); if (ml) { ml.scrollTop = 0; } }, 300); }
  }
  private hasId(id: number): boolean
  {
    if (this.messages != null)
    {
      if (this.messages.length > 0)
      {
        for (let i = this.messages.length - 1; i > 0; i--) { if (this.messages[i - 1].messageId == id) { return true; } }
      }
    }
    return false;
  }
  private hasId_backward(id: number): boolean
  {
    if (this.messages != null)
    {
      if (this.messages.length > 0)
      {
        for (let i = 0; i < this.messages.length; i++) { if (this.messages[i].messageId == id) { return true; } }
      }
    }
    return false;
  }

  write(event: Event) { if (event.target) { const target = event.target as Element;this.newMessage.content += (' ' + target.innerHTML); } }

  sendNewText()
  {
    if (this.logged && (this.newMessage.content.length > 0))
    {
      let pass:string = ""; for (let p of this.passwords) { if (this.currentRoomId == p.roomId) { pass = p.password; } }

      this.disabled = true;
      this.newMessage.password = pass;
      this.newMessage.messageType = 'TEXT';

      this.chatService.addText(this.currentRoomId, this.lastMessageId, this.newMessage).subscribe(data =>
      {
        this.appendLines(data);

        this.chatService.getCount(this.currentRoomId).subscribe(page => { this.pagination.items = page.items; this.pagination.size = this.messages.length; });

        this.newMessage = new MessageShortPass();
        this.newMessage.nickName = this.accountService.getLoginName();
        this.newMessage.password = pass;
        this.setLastId();
        this.disabled = false;
      });
    }
  }

  sendNewImages(event: any)
  {
    if (event.target == null) { return; }

    this.selectedFiles = event.target.files as FileList;

    if (this.selectedFiles == null) { return; }

    if (this.logged && (this.selectedFiles.length > 0))
    {
      let pass:string = ""; for (let p of this.passwords) { if (this.currentRoomId == p.roomId) { pass = p.password; } }

      this.disabled = true;
      this.newMessage.password = pass;
      this.newMessage.messageType = 'IMAGES';

      this.chatService.addImages(this.currentRoomId, this.lastMessageId, this.newMessage, this.selectedFiles).subscribe(data =>
      {
        this.appendLines(data);

        this.chatService.getCount(this.currentRoomId).subscribe(page => { this.pagination.items = page.items; this.pagination.size = this.messages.length; });

        this.newMessage = new MessageShortPass();
        this.newMessage.nickName = this.accountService.getLoginName();
        this.newMessage.password = pass;
        this.setLastId();
        this.disabled = false;
      });
    }
  }

  convertThumbnails(id: number, txt: string): void
  {
    let imgs = txt.split('|');

    if (imgs.length > 0)
    {
      for (let j = 0; j < imgs.length; j++)
      {
        this.imageService.getThumbnail(id, Number(imgs[j].substring(4))).subscribe(data =>
        {
          if (this.messages != null)
          {
            if (this.messages.length > 0)
            {
              for (let i = 0; i < this.messages.length; i++)
              {
                if (this.messages[i].messageType === 'IMAGES')
                {
                  if (this.messages[i].messageId == id)
                  {
                    let str: string | null = this.sanitizer.sanitize(SecurityContext.HTML, data);

                    if (str) { this.messages[i].content = this.messages[i].content.concat(str); }
                  }
                }
              }
            }
          }
        });
      }
    }
  }

  openImage(event: Event)
  {
    if (event.target)
    {
      const target = event.target as HTMLImageElement;

      if (target.alt)
      {
        let ids: string[] = target.alt.split("_");

        if (ids.length == 2)
        {
          this.imageService.getPlain(Number(ids[0]), Number(ids[1]));
        }
      }
    }
  }

}
