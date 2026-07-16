import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, FormBuilder, FormControl, FormGroupDirective, FormGroup, NgForm, Validators, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faPen } from '@fortawesome/free-solid-svg-icons';

import { MenuComponent } from '../menu/menu.component';
import { User } from '../../interfaces/user';
import { NewPassword } from '../../interfaces/account';
import { AccountService } from '../../services/account.service'

@Component({ selector: 'app-account-subscribe', imports: [FontAwesomeModule, CommonModule, FormsModule, ReactiveFormsModule, MenuComponent], templateUrl: './account-subscribe.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './account-subscribe.component.css' })

export class AccountSubscribeComponent
{
  faXmark = faXmark; faPen = faPen;

  user: User = new User();
  newpassword: NewPassword = new NewPassword();

  public form!: FormGroup;

  public passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,16}$/

  constructor(
    private accountService : AccountService,
    private router: Router,
    private menu: MenuComponent,
    private formbuilder: FormBuilder
  )
  {
    this.formInit();
  }
  private formInit()
  {
    this.form = this.formbuilder.group({
      subscribeMotive: ['', [Validators.required]],
      loginName: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      sessionTimeout: { value: '15', disabled: false },
      nickName: ['', [Validators.required]],
      groupName: { value: '', disabled: false },
      firstName: { value: '', disabled: false },
      lastName: { value: '', disabled: false },
      displayCoordinates: { value: false, disabled: false },
      address: { value: '', disabled: false },
      zipCode: { value: '', disabled: false },
      town: { value: '', disabled: false },
      country: { value: '', disabled: false },
      phone: { value: '', disabled: false },
      email: { value: '', disabled: false },
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
        && formGroup.controls['confirmPassword'].value.length >= 8 && formGroup.controls['confirmNewPassword'].value.length <= 16
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
      case 'special-character': return /[#$@!%&*?]/.test(this.form.controls[index].value);;
      case 'number': return /\d/.test(this.form.controls[index].value);
      case 'lowercase': return /[a-z]/.test(this.form.controls[index].value);
      case 'uppercase': return /[A-Z]/.test(this.form.controls[index].value);
      case 'length': return this.form.controls[index].value.length >= 8 && this.form.controls[index].value.length <= 16;
      default: return false
    }
  }

  sendSubscription()
  {

    this.user.loginName = this.form.controls['loginName'].value;
    this.user.password = this.form.controls['password'].value;
    this.user.sessionTimeout = this.form.controls['sessionTimeout'].value;
    this.user.subscribeMotive = this.form.controls['subscribeMotive'].value;
    this.user.nickName = this.form.controls['nickName'].value;
    this.user.groupName = this.form.controls['groupName'].value;
    this.user.firstName = this.form.controls['firstName'].value;
    this.user.lastName = this.form.controls['lastName'].value;
    this.user.displayCoordinates = this.form.controls['displayCoordinates'].value;
    this.user.address = this.form.controls['address'].value;
    this.user.zipCode = this.form.controls['zipCode'].value;
    this.user.town = this.form.controls['town'].value;
    this.user.country = this.form.controls['country'].value;
    this.user.phone = this.form.controls['phone'].value;
    this.user.email = this.form.controls['email'].value;

    this.accountService.sendSubscription(this.user).subscribe(data => {
      if (data.error !== "") { this.newpassword.error = data.error; }
      else if ((data.success !== "" ) || (data.newPassword === "<success@new>")) { this.newpassword.success = data.success; setTimeout(() => { this.router.navigate(['/']); }, 5000); }
    });
  }

  goToHome() { this.router.navigate(['/']); }

}
