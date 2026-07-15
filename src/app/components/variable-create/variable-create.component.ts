import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';

import { MenuComponent } from '../menu/menu.component';
import { Variable } from '../../interfaces/variable';
import { VariableService } from '../../services/variable.service';

@Component({ selector: 'app-variable-create', imports: [FontAwesomeModule, FormsModule, MenuComponent], templateUrl: './variable-create.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './variable-create.component.css' })

export class VariableCreateComponent implements OnInit
{
  faXmark = faXmark; faPlus = faPlus;

  @ViewChild('formRef') variableForm!: NgForm;

  variable: Variable = new Variable();

  constructor(private variableService: VariableService, private router: Router, private menu: MenuComponent) { }

  ngOnInit() { }

  private saveVariable() { this.variableService.createVariable(this.variable).subscribe(() => { this.goToListVariable(); }); }

  addVariable() { if (this.variableForm.valid) { this.saveVariable(); } }

  goToListVariable() { this.router.navigate(['/variable-list']); }

}
