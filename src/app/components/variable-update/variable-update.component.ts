import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';

import { MenuComponent } from '../menu/menu.component';
import { Variable } from '../../interfaces/variable';
import { VariableService } from '../../services/variable.service';

@Component({ selector: 'app-variable-update', imports: [FontAwesomeModule, FormsModule, MenuComponent], templateUrl: './variable-update.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './variable-update.component.css' })

export class VariableUpdateComponent implements OnInit
{
  faXmark = faXmark; faCheck = faCheck; faTrash = faTrash;

  @ViewChild('formRef') variableForm!: NgForm;

  variableId: number = 0;

  variable: Variable = new Variable();

  constructor(private variableService: VariableService, private route: ActivatedRoute, private router: Router, private menu: MenuComponent) { }

  ngOnInit(): void
  {
    this.variableId = this.route.snapshot.params['var-id'];
    this.variableService.getByIdVariable(this.variableId).subscribe(data => { this.variable = data; });
  }

  updateConfirmed() { if (this.variableForm.valid) { this.variableService.updateVariable(this.variableId, this.variable).subscribe(() => { this.goToListVariable(); }); } }

  deleteConfirmed() { this.variableService.deleteVariable(this.variableId).subscribe(() => { this.goToListVariable(); });  }

  goToListVariable() { this.router.navigate(['/variable-list']); }

}
