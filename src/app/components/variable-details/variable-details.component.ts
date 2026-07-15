import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faPen } from '@fortawesome/free-solid-svg-icons';

import { MenuComponent } from '../menu/menu.component';
import { Variable } from '../../interfaces/variable';
import { VariableService } from '../../services/variable.service';

@Component({ selector: 'app-variable-details', imports: [FontAwesomeModule, FormsModule, MenuComponent], templateUrl: './variable-details.component.html', changeDetection: ChangeDetectionStrategy.Eager, styleUrl: './variable-details.component.css' })

export class VariableDetailsComponent implements OnInit
{
  faXmark = faXmark; faPen = faPen;

  variableId: number = 0;

  variable: Variable = new Variable();

  constructor(private variableService: VariableService, private router: Router, private route: ActivatedRoute, private menu: MenuComponent) { }

  ngOnInit(): void
  {
    this.variableId = this.route.snapshot.params['var-id'];
    this.variable = new Variable();
    this.variableService.getByIdVariable(this.variableId).subscribe( data => { this.variable = data; });
  }

  updateVariable(id: number) { this.router.navigate(['/variable-update', id]); }

  goToListVariable() { this.router.navigate(['/variable-list']); }

}
