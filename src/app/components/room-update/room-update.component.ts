import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';

import { MenuComponent } from '../menu/menu.component';
import { Room, RoomEnum, RoomState, RoomPurgeMethod } from '../../interfaces/chat';
import { ChatService } from '../../services/chat.service';

@Component({ selector: 'app-room-update', imports: [FontAwesomeModule, FormsModule, MenuComponent], templateUrl: './room-update.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './room-update.component.css' })

export class RoomUpdateComponent implements OnInit
{
  faXmark = faXmark; faCheck = faCheck; faTrash = faTrash;

  @ViewChild('formRef') roomForm!: NgForm;

  roomId: number = 0;

  room: Room = new Room();

  PM: RoomEnum[] = RoomPurgeMethod;
  ST: RoomEnum[] = RoomState;

  constructor(private chatService: ChatService, private route: ActivatedRoute, private router: Router, private menu: MenuComponent) { }

  ngOnInit(): void
  {
    this.roomId = this.route.snapshot.params['room-id'];
    this.chatService.getRoomById(this.roomId).subscribe(data => { this.room = data; });
  }

  updateConfirmed() { if (this.roomForm.valid) { this.chatService.updateRoom(this.roomId, this.room).subscribe(() => { this.goToChat(); }); } }

  deleteConfirmed() { this.chatService.deleteRoom(this.roomId).subscribe(() => { this.goToChat(); });  }

  goToChat() { this.router.navigate(['/chat']); }

}
