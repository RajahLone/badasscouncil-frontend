import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';

import { AccountService } from '../../services/account.service';

import { MenuComponent } from '../menu/menu.component';
import { Room, RoomEnum, RoomPurgeType } from '../../interfaces/chat';
import { ChatService } from '../../services/chat.service';

@Component({ selector: 'app-room-create', imports: [FontAwesomeModule, FormsModule, MenuComponent], templateUrl: './room-create.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './room-create.component.css' })

export class RoomCreateComponent implements OnInit
{
  faXmark = faXmark; faPlus = faPlus;

  @ViewChild('formRef') roomForm!: NgForm;

  room: Room = new Room();

  PM: RoomEnum[] = RoomPurgeType;

  constructor(private chatService: ChatService, private accountService: AccountService, private router: Router, private menu: MenuComponent) { }

  ngOnInit()
  {
    this.room.ownerId = this.accountService.getUserId();
  }

  private saveRoom() { this.chatService.createRoom(this.room).subscribe(() => { this.goToChat(); }); }

  addRoom() { if (this.roomForm.valid) { this.saveRoom(); } }

  goToChat() { this.router.navigate(['/chat']); }

}
