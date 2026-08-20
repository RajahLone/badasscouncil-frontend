import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faPen } from '@fortawesome/free-solid-svg-icons';

import { MenuComponent } from '../menu/menu.component';
import { Room, RoomEnum, RoomState, RoomPurgeMethod } from '../../interfaces/chat';
import { ChatService } from '../../services/chat.service';

@Component({ selector: 'app-room-details', imports: [FontAwesomeModule, FormsModule, MenuComponent], templateUrl: './room-details.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './room-details.component.css' })

export class RoomDetailsComponent implements OnInit
{
  faXmark = faXmark; faPen = faPen;

  roomId: number = 0;

  room: Room = new Room();

  PM: RoomEnum[] = RoomPurgeMethod;
  ST: RoomEnum[] = RoomState;

  constructor(private chatService: ChatService, private router: Router, private route: ActivatedRoute, private menu: MenuComponent) { }

  ngOnInit(): void
  {
    this.roomId = this.route.snapshot.params['room-id'];
    this.room = new Room();
    this.chatService.getRoomById(this.roomId).subscribe( data => { this.room = data; });
  }

  updateRoom(id: number) { this.router.navigate(['/room-update', id]); }

  goToChat() { this.router.navigate(['/chat']); }

}
