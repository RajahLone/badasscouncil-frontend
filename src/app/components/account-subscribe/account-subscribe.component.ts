import { Component, ViewChild, ElementRef, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, FormBuilder, FormControl, FormGroupDirective, FormGroup, NgForm, Validators, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faPlus, faRightToBracket } from '@fortawesome/free-solid-svg-icons';

import { MenuComponent } from '../menu/menu.component';
import { User } from '../../interfaces/user';
import { NewPassword, Captcha } from '../../interfaces/account';
import { AccountService } from '../../services/account.service'
import { MiscService } from '../../services/misc.service'

@Component({ selector: 'app-account-subscribe', imports: [FontAwesomeModule, CommonModule, FormsModule, ReactiveFormsModule, MenuComponent], templateUrl: './account-subscribe.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './account-subscribe.component.css' })

export class AccountSubscribeComponent
{
  faXmark = faXmark; faPlus = faPlus; faRightToBracket = faRightToBracket;

  user: User = new User();
  newpassword: NewPassword = new NewPassword();

  captcha: Captcha = new Captcha();

  public success:boolean = false;

  public myGroup!: FormGroup;

  public passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?.:,;(){}[\]])[A-Za-z\d#$@!%&*?.:,;(){}[\]]{8,16}$/

  constructor(
    private accountService: AccountService,
    private miscService: MiscService,
    private router: Router,
    private menu: MenuComponent,
    private renderer: Renderer2,
    private formbuilder: FormBuilder
  )
  {
    this.miscService.getCaptcha("subscribe").subscribe(data => { this.captcha = data; if (this.captcha.question) { this.myGroup.addControl('answer', new FormControl('', [Validators.required])); } });

    this.formInit();
  }
  private formInit()
  {
    this.myGroup = this.formbuilder.group({
      subscribeMotive: ['', [Validators.required]],
      loginName: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      sessionTimeout: ['15', []],
      nickName: ['', [Validators.required]],
      groupName: ['', []],
      firstName: ['', []],
      lastName: ['', []],
      displayContactDetails: [false, []],
      address: ['', []],
      zipCode: ['', []],
      town: ['', []],
      country: ['', []],
      phone: ['', []],
      email: ['', [Validators.email]]
      }, { validator: this.checkingValues });
  }
  public checkingValues(formGroup: FormGroup)
  {
    if (
           formGroup.controls['subscribeMotive'].value
        && formGroup.controls['loginName'].value
        && formGroup.controls['newPassword'].value
        && formGroup.controls['newPassword'].value.length >= 8 && formGroup.controls['newPassword'].value.length <= 16
        && formGroup.controls['confirmPassword'].value
        && formGroup.controls['confirmPassword'].value.length >= 8 && formGroup.controls['confirmPassword'].value.length <= 16
        && formGroup.controls['nickName'].value
        )
    {
      return formGroup.controls['newPassword'].value === formGroup.controls['confirmPassword'].value ? false : { "notMatched": true }
    }

    return false;
  }
  public checkValidations(index: string, type: string) {
    switch (type)
    {
      case 'special-character': return /[#$@!%&*?.:,;(){}[\]]/.test(this.myGroup.controls[index].value);;
      case 'number': return /\d/.test(this.myGroup.controls[index].value);
      case 'lowercase': return /[a-z]/.test(this.myGroup.controls[index].value);
      case 'uppercase': return /[A-Z]/.test(this.myGroup.controls[index].value);
      case 'length': return this.myGroup.controls[index].value.length >= 8 && this.myGroup.controls[index].value.length <= 16;
      default: return false
    }
  }

  sendSubscription()
  {
    this.newpassword = new NewPassword();

    this.user.loginName = this.myGroup.controls['loginName'].value;
    this.user.password = this.myGroup.controls['newPassword'].value;
    this.user.sessionTimeout = this.myGroup.controls['sessionTimeout'].value;
    this.user.subscribeMotive = this.myGroup.controls['subscribeMotive'].value;
    this.user.nickName = this.myGroup.controls['nickName'].value;
    this.user.groupName = this.myGroup.controls['groupName'].value;
    this.user.firstName = this.myGroup.controls['firstName'].value;
    this.user.lastName = this.myGroup.controls['lastName'].value;
    this.user.displayContactDetails = this.myGroup.controls['displayContactDetails'].value;
    this.user.address = this.myGroup.controls['address'].value;
    this.user.zipCode = this.myGroup.controls['zipCode'].value;
    this.user.town = this.myGroup.controls['town'].value;
    this.user.country = this.myGroup.controls['country'].value;
    this.user.phone = this.myGroup.controls['phone'].value;
    this.user.email = this.myGroup.controls['email'].value;
    if (this.captcha.question) { this.user.answer = this.myGroup.controls['answer'].value; }

    this.accountService.sendSubscription(this.user).subscribe(data => {
      if (data.error !== "")
      {
        this.newpassword.error = data.error;
      }
      else if ((data.success !== "" ) || (data.newPassword === "<success@new>"))
      {
        this.newpassword.success = data.success;
        this.success = true;
      }
    });
  }

  goToHome() { this.router.navigate(['/']); }

  goToSignIn() { this.router.navigate(['/login']); }

}
