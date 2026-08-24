import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faPen } from '@fortawesome/free-solid-svg-icons';

import { AccountService } from '../../services/account.service';

import { MenuComponent } from '../menu/menu.component';
import { Room, RoomEnum, RoomState, RoomPurgeMethod } from '../../interfaces/chat';
import { ChatService } from '../../services/chat.service';

@Component({ selector: 'app-room-details', imports: [FontAwesomeModule, FormsModule, MenuComponent], templateUrl: './room-details.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './room-details.component.css' })

export class RoomDetailsComponent implements OnInit
{
  faXmark = faXmark; faPen = faPen;

  logged: boolean = false;
  role: string = "";
  userId: number = 0;

  roomId: number = 0;

  room: Room = new Room();

  PM: RoomEnum[] = RoomPurgeMethod;
  ST: RoomEnum[] = RoomState;

  constructor(private chatService: ChatService, private accountService: AccountService, private router: Router, private route: ActivatedRoute, private menu: MenuComponent) { }

  ngOnInit(): void
  {
    this.logged = this.accountService.isLogged();
    this.role = this.accountService.getRole();
    this.userId = this.accountService.getUserId();

    this.roomId = this.route.snapshot.params['room-id'];
    this.room = new Room();
    this.chatService.getRoomById(this.roomId).subscribe( data => { this.room = data; });
  }

  updateRoom(id: number) { if ((this.role === 'ADMIN') || (this.role === 'REGUL') || (this.userId == this.room.ownerId)) { this.router.navigate(['/room-update', id]); } }

  goToChat() { this.router.navigate(['/chat']); }

}
