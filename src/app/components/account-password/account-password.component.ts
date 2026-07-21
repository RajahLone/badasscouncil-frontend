import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, FormBuilder, FormControl, FormGroupDirective, FormGroup, NgForm, Validators, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faPen } from '@fortawesome/free-solid-svg-icons';

import { MenuComponent } from '../menu/menu.component';
import { NewPassword } from '../../interfaces/account';
import { AccountService } from '../../services/account.service'

@Component({ selector: 'app-account-password', imports: [FontAwesomeModule, CommonModule, FormsModule, ReactiveFormsModule, MenuComponent], templateUrl: './account-password.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './account-password.component.css' })

export class AccountPasswordComponent
{
  faXmark = faXmark; faPen = faPen;

  newpassword: NewPassword = new NewPassword();

  public form!: FormGroup;

  public passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?.:,;(){}[\]])[A-Za-z\d#$@!%&*?.:,;(){}[\]]{8,16}$/

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
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      }, { validator: this.checkingPasswords });
  }
  public checkingPasswords(formGroup: FormGroup)
  {
    if (
        formGroup.controls['oldPassword'].value && formGroup.controls['newPassword'].value && formGroup.controls['confirmPassword'].value
        && formGroup.controls['newPassword'].value.length >= 8 && formGroup.controls['newPassword'].value.length <= 16
        && formGroup.controls['confirmPassword'].value.length >= 8 && formGroup.controls['confirmPassword'].value.length <= 16
        )
    {
     return formGroup.controls['newPassword'].value === formGroup.controls['confirmPassword'].value ? false : { "notMatched": true }
    }

    return false;
  }
  public checkValidations(index: string, type: string) {
    switch (type)
    {
      case 'special-character': return /[#$@!%&*?.:,;(){}[\]]/.test(this.form.controls[index].value);;
      case 'number': return /\d/.test(this.form.controls[index].value);
      case 'lowercase': return /[a-z]/.test(this.form.controls[index].value);
      case 'uppercase': return /[A-Z]/.test(this.form.controls[index].value);
      case 'length': return this.form.controls[index].value.length >= 8 && this.form.controls[index].value.length <= 16;
      default: return false
    }
  }

  ngOnInit()
  {
    this.accountService.getAccount().subscribe( data => {
      this.newpassword.loginName = data.loginName;
    });
  }

  updatePasswordConfirmed()
  {
    this.newpassword.oldPassword = this.form.controls['oldPassword'].value;
    this.newpassword.newPassword = this.form.controls['newPassword'].value;

    this.accountService.updatePassword(this.newpassword).subscribe(data => {
      if (data.error !== "") { this.newpassword.error = data.error; }
      else if ((data.success !== "" ) || (data.newPassword === "<success@new>")) { this.newpassword.success = data.success; setTimeout(() => { this.router.navigate(['/']); }, 5000); }
    });
  }

  goToAccountDetails() { this.router.navigate(['/account-details'], { queryParams: { 'refresh': this.menu.getRandomInteger(1, 100000) } }); }

}
