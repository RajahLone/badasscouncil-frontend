import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { timer } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faComment, faPlus, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import { MenuComponent } from '../menu/menu.component';
import { MessageShort, Room } from '../../interfaces/chat';
import { NickName } from '../../interfaces/user';
import { ChatService } from '../../services/chat.service';
import { AccountService } from '../../services/account.service'

@Component({ selector: 'app-chat', imports: [FontAwesomeModule, FormsModule, MenuComponent], templateUrl: './chat.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './chat.component.css' })

export class ChatComponent implements OnInit
{
  faComment = faComment; faPlus = faPlus; faCircleInfo = faCircleInfo;

  logged: boolean = false;
  disabled: boolean = false;

  rooms: Room[] = [];

  currentRoomId: number = 0;
  currentTopic: string = "no room yet selected";
  lastMessageId: number = 0;

  messages: MessageShort[] = [];

  newMessage: MessageShort = new MessageShort();

  nicknames: NickName[] = [];

  constructor(
    private chatService: ChatService,
    private accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit()
  {
    this.logged = this.accountService.isLogged();

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

        this.retreiveLastMessages();
      });
    }
  }

  goToNewRoom() { this.router.navigate(['/room-create']); }
  goToRoomDetails(id: number) { this.router.navigate(['/room-details', id]); }

  openRoom(id: number) { this.currentRoomId = id; this.messages = []; if (id > 0) { this.retreiveLastMessages(); } }

  retreiveLastMessages()
  {
    if ((this.router.url !== '/chat')) { return; }

    this.logged = this.accountService.isLogged();

    if ((this.logged) && (this.disabled == false) && (this.currentRoomId > 0))
    {
      this.chatService.getNew(this.currentRoomId, this.lastMessageId).subscribe(data => { if (data) { this.messages = [...this.messages, ...data]; } this.setLastId(); });

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
      this.disabled = true;
      this.chatService.addNew(this.currentRoomId, this.lastMessageId, this.newMessage).subscribe(data => {
        this.messages = [...this.messages, ...data];
        this.newMessage = new MessageShort();
        this.newMessage.nickName = this.accountService.getLoginName();
        this.setLastId();
        this.disabled = false;
        });
    }
  }

  private retreiveNicknames() { this.chatService.getNickNameListOption().subscribe(data => { this.nicknames = data; }); }

}
