import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';

import { AccountService } from '../../services/account.service';

import { MenuComponent } from '../menu/menu.component';
import { Room, RoomEnum, RoomState, RoomPurgeType } from '../../interfaces/chat';
import { ChatService } from '../../services/chat.service';

@Component({ selector: 'app-room-update', imports: [FontAwesomeModule, FormsModule, MenuComponent], templateUrl: './room-update.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './room-update.component.css' })

export class RoomUpdateComponent implements OnInit
{
  faXmark = faXmark; faCheck = faCheck; faTrash = faTrash;

  @ViewChild('formRef') roomForm!: NgForm;

  logged: boolean = false;
  role: string = "";
  userId: number = 0;

  roomId: number = 0;

  room: Room = new Room();

  PM: RoomEnum[] = RoomPurgeType;
  ST: RoomEnum[] = RoomState;

  constructor(private chatService: ChatService, private accountService: AccountService, private route: ActivatedRoute, private router: Router, private menu: MenuComponent) { }

  ngOnInit(): void
  {
    this.logged = this.accountService.isLogged();
    this.role = this.accountService.getRole();
    this.userId = this.accountService.getUserId();

    this.roomId = this.route.snapshot.params['room-id'];

    this.chatService.getRoomById(this.roomId).subscribe(data => { this.room = data; });
  }

  hasRight(): boolean { if ((this.role === 'ADMIN') || (this.role === 'REGUL') || (this.userId == this.room.ownerId)) { return true; } return false; }

  updateConfirmed() { if (this.roomForm.valid && this.hasRight()) { this.chatService.updateRoom(this.roomId, this.room).subscribe(() => { this.goToChat(); }); } }

  deleteConfirmed() { if (this.hasRight()) { this.chatService.deleteRoom(this.roomId).subscribe(() => { this.goToChat(); }); } }

  goToChat() { this.router.navigate(['/chat']); }

}
