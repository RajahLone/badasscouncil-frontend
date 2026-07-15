import { Injectable, Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHome, faRightToBracket, faClock, faEye, faUser, faRightFromBracket, faComments, faSave, faVoteYea, faTrophy, faUsers, faLayerGroup, faDisplay, faSlidersH } from '@fortawesome/free-solid-svg-icons';

import { AccountService } from '../../services/account.service';

@Component({ selector: 'app-menu', imports: [FontAwesomeModule, TooltipModule, RouterLink, RouterLinkActive], templateUrl: './menu.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './menu.component.css' })

@Injectable({ providedIn: 'root' })

export class MenuComponent implements OnInit
{
  faHome = faHome; faRightToBracket = faRightToBracket; faClock = faClock; faEye = faEye; faUser = faUser; faRightFromBracket = faRightFromBracket; faComments = faComments;
  faSave = faSave; faTrophy = faTrophy; faVoteYea = faVoteYea; faUsers = faUsers; faLayerGroup = faLayerGroup; faDisplay = faDisplay; faSlidersH = faSlidersH;

  logged: boolean = false;
  role: string = "";

  private idleState: string = 'NOT_STARTED';
  private countdown: number = 0;
  private timedOut: boolean = false;
  @ViewChild('signouticon', {static: false}) signOutIcon!: ElementRef;

  constructor(private idle: Idle, private router: Router, private accountService: AccountService, private el: ElementRef, private renderer: Renderer2)
  {
    this.idle.setIdle(900);
    this.idle.setTimeout(15);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleStart.subscribe(() => { this.idleState = 'IDLE'; this.showPendingLogout(); });
    this.idle.onIdleEnd.subscribe(() => { this.resetIdle(); });
    this.idle.onTimeout.subscribe(() => { if (this.logged) { this.idleState = 'TIMED_OUT'; this.timedOut = true; this.deconnexion(); } else { this.resetIdle(); } });
    this.idle.onTimeoutWarning.subscribe((countdown) => { this.countdown = countdown; });
  }

  ngOnInit()
  {
    this.logged = this.accountService.isLogged();
    this.role = this.accountService.getRole();

    this.idle.setIdle(Math.max(15, this.accountService.getSessionTimeout()) * 60);
    this.resetIdle();
    this.idle.watch();
  }

  deconnexion() { this.accountService.signOut(); this.logged = false; if ((this.router.url === '/') || (this.router.url === '/home')) { window.location.reload(); } else { this.router.navigate(['/']); }  }

  getRandomInteger(min: number, max: number) { min = Math.ceil(min); max = Math.floor(max); return Math.floor(Math.random() * (max - min)) + min; }

  resetIdle() { this.hidePendingLogout(); this.idleState = "NOT_IDLE"; this.timedOut = false; this.countdown = 0; }

  showPendingLogout() { if (this.logged) { if (this.signOutIcon) { this.renderer.addClass(this.signOutIcon.nativeElement, 'fa-beat-fade'); this.renderer.addClass(this.signOutIcon.nativeElement, 'text-danger'); } } }
  hidePendingLogout() { if (this.logged) { if (this.signOutIcon) { this.renderer.removeClass(this.signOutIcon.nativeElement, 'fa-beat-fade'); this.renderer.removeClass(this.signOutIcon.nativeElement, 'text-danger'); } } }

}
