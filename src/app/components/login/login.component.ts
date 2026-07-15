import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';

import { MenuComponent } from '../menu/menu.component';
import { AccountService } from '../../services/account.service'
import { Account } from '../../interfaces/account';

@Component({ selector: 'app-login', imports: [FontAwesomeModule, FormsModule, MenuComponent], templateUrl: './login.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './login.component.css' })

export class LoginComponent implements OnInit
{
  faRightToBracket = faRightToBracket;

  @ViewChild('formRef') loginForm!: NgForm;
  @ViewChild('userRef') userField!: NgModel; @ViewChild('userid', {static: false}) userFieldf!: ElementRef;
  @ViewChild('passRef') passField!: NgModel;

  account: Account = new Account();

  constructor(private router : Router, private accountService : AccountService) { }

  ngOnInit()
  {
  }

  connexion()
  {
    if (this.loginForm.valid)
    {
      this.accountService.signIn(this.account).subscribe(data => { this.account = data; if (this.account.loginName === "") { this.userFieldf.nativeElement.focus(); } else if (this.account.password === "<success@auth>") { this.router.navigate(['/']); } });
    }
  }

}
