import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AccountService } from '../services/account.service';

@Injectable({ providedIn: 'root' })

export class RegulGuard implements CanActivate
{

  constructor(private router: Router, private accountService: AccountService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean
  {
    if (this.accountService.getRole() === 'ADMIN') { return true; }
    if (this.accountService.getRole() === 'REGUL') { return true; }

    return false;
  }

}
