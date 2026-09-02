import { Component, OnInit, ViewChild, ElementRef, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { timer } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faComment, faPlus, faCircleInfo, faLock } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { MenuComponent } from '../menu/menu.component';
import { MessageShort, MessageShortPass, Room, RoomPassword } from '../../interfaces/chat';
import { NickName } from '../../interfaces/user';
import { ChatService } from '../../services/chat.service';
import { AccountService } from '../../services/account.service'

@Component({ selector: 'app-chat', imports: [FontAwesomeModule, FormsModule, MenuComponent], templateUrl: './chat.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './chat.component.css' })

export class ChatComponent implements OnInit
{
  faComment = faComment; faPlus = faPlus; faCircleInfo = faCircleInfo; faLock = faLock;

  modalRoomPassword?: BsModalRef;

  @ViewChild('modalInputPassword') modalInputPassword!: ElementRef;

  logged: boolean = false;
  role: string = "";
  userId: number = 0;

  disabled: boolean = false;
  first: boolean = true;

  rooms: Room[] = [];
  passwords: RoomPassword[] = [];
  promptOpened: boolean = false;
  roomPasswordValue: string = "";

  currentRoomId: number = 0;
  currentTopic: string = "no room yet selected";
  lastMessageId: number = 0;

  messages: MessageShort[] = [];

  newMessage: MessageShortPass = new MessageShortPass();

  nicknames: NickName[] = [];

  constructor(
    private chatService: ChatService,
    private accountService: AccountService,
    private router: Router,
    private modalService: BsModalService
  ) { }

  ngOnInit()
  {
    this.logged = this.accountService.isLogged();
    this.role = this.accountService.getRole();
    this.userId = this.accountService.getUserId();

    if (this.logged)
    {
      this.newMessage.nickName = this.accountService.getNickName();

      this.retreiveNicknames();

      timer(0, 7000).subscribe(() => { this.retreiveRooms(); });
    }
  }

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
    this.currentRoomId = id;
    this.messages = [];
    if (id > 0) { this.retreiveLastMessages(); }
  }

  openPasswordPrompt(template: TemplateRef<void>, id: number)
  {
    this.lastMessageId = 0;
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

  retreiveLastMessages()
  {
    if (this.promptOpened) { return; }
    if ((this.router.url !== '/chat')) { return; }

    this.logged = this.accountService.isLogged();

    if ((this.logged) && (this.disabled == false) && (this.currentRoomId > 0))
    {
      let pass:string = ""; for (let p of this.passwords) { if (this.currentRoomId == p.roomId) { pass = p.password; } }

      this.chatService.getNew(this.currentRoomId, this.lastMessageId, pass).subscribe(data => { if (data) { this.messages = [...this.messages, ...data]; } this.setLastId(); });

      for (var i in this.rooms) { if (this.currentRoomId == this.rooms[i].roomId) { this.currentTopic = this.rooms[i].topic; } }
    }
  }

  private setLastId()
  {
    this.lastMessageId = 0;

    if (this.messages != null)
    {
      if (this.messages.length > 0)
      {
        for (let i = 0; i < this.messages.length; i++) { this.lastMessageId = Math.max(this.lastMessageId, this.messages[i].messageId); }
      }
    }
  }

  sendNewMessage()
  {
    if (this.logged)
    {
      let pass:string = ""; for (let p of this.passwords) { if (this.currentRoomId == p.roomId) { pass = p.password; } }

      this.disabled = true;
      this.newMessage.password = pass;

      this.chatService.addNew(this.currentRoomId, this.lastMessageId, this.newMessage).subscribe(data => {
        this.messages = [...this.messages, ...data];
        this.newMessage = new MessageShortPass();
        this.newMessage.nickName = this.accountService.getLoginName();
        this.newMessage.password = pass;
        this.setLastId();
        this.disabled = false;
        });
    }
  }

  private retreiveNicknames() { this.chatService.getNickNameListOption().subscribe(data => { this.nicknames = data; }); }

}
