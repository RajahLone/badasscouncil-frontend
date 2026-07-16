import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { timer } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

import { MenuComponent } from '../menu/menu.component';
import { MessageShort } from '../../interfaces/chat';
import { NickName } from '../../interfaces/user';
import { ChatService } from '../../services/chat.service';
import { AccountService } from '../../services/account.service'

@Component({ selector: 'app-chat', imports: [FontAwesomeModule, FormsModule, MenuComponent], templateUrl: './chat.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './chat.component.css' })

export class ChatComponent implements OnInit
{
  faComment = faComment;

  logged: boolean = false;
  disabled: boolean = false;

  lastId: number = 0;

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

      timer(0, 7000).subscribe(() => { this.retreiveLastMessages(); });
    }
  }

  retreiveLastMessages()
  {
    if ((this.router.url !== '/chat')) { return; }

    this.logged = this.accountService.isLogged();

    if ((this.logged) && (this.disabled == false))
    {
      this.chatService.getNew(this.lastId).subscribe(data => { if (data) { this.messages = [...data, ...this.messages]; } this.setLastId(); });
    }
  }

  private setLastId()
  {
    this.lastId = 0;

    if (this.messages != null)
    {
      if (this.messages.length > 0)
      {
        for (let i = 0; i < this.messages.length; i++) { this.lastId = Math.max(this.lastId, this.messages[i].messageId); }
      }
    }
  }

  sendNewMessage()
  {
    if (this.logged)
    {
      this.disabled = true;
      this.chatService.addNew(this.lastId, this.newMessage).subscribe(data => {
        this.messages = [...data, ...this.messages];
        this.newMessage = new MessageShort();
        this.newMessage.nickName = this.accountService.getLoginName();
        this.setLastId();
        this.disabled = false;
        });
    }
  }

  private retreiveNicknames() { this.chatService.getNickNameListOption().subscribe(data => { this.nicknames = data; }); }

}
