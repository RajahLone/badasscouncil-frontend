import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ChatComponent } from './components/chat/chat.component';
import { AccountSubscribeComponent } from './components/account-subscribe/account-subscribe.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { AccountUpdateComponent } from './components/account-update/account-update.component';
import { AccountPasswordComponent } from './components/account-password/account-password.component';
import { AdminGuard } from './guards/admin.guard';
import { RegulGuard } from './guards/regul.guard';
import { UserGuard } from './guards/user.guard';
import { VariableListComponent } from './components/variable-list/variable-list.component';
import { VariableCreateComponent } from './components/variable-create/variable-create.component';
import { VariableDetailsComponent } from './components/variable-details/variable-details.component';
import { VariableUpdateComponent } from './components/variable-update/variable-update.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserCreateComponent } from './components/user-create/user-create.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserUpdateComponent } from './components/user-update/user-update.component';
import { AttachmentListComponent } from './components/attachment-list/attachment-list.component';
import { AttachmentCreateComponent } from './components/attachment-create/attachment-create.component';
import { AttachmentDetailsComponent } from './components/attachment-details/attachment-details.component';
import { AttachmentUpdateComponent } from './components/attachment-update/attachment-update.component';
import { AttachmentUploadComponent } from './components/attachment-upload/attachment-upload.component';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, runGuardsAndResolvers: 'always' },
  {path: 'login', component: LoginComponent, runGuardsAndResolvers: 'always' },
  {path: 'chat', component: ChatComponent, canActivate: [UserGuard], runGuardsAndResolvers: 'always' },
  {path: 'account-subscribe', component: AccountSubscribeComponent, runGuardsAndResolvers: 'always' },
  {path: 'account-details', component: AccountDetailsComponent, canActivate: [UserGuard], runGuardsAndResolvers: 'always' },
  {path: 'account-update', component: AccountUpdateComponent, canActivate: [UserGuard], runGuardsAndResolvers: 'always' },
  {path: 'account-password', component: AccountPasswordComponent, canActivate: [UserGuard], runGuardsAndResolvers: 'always' },
  {path: 'variable-list', component: VariableListComponent, canActivate: [AdminGuard], runGuardsAndResolvers: 'always'},
  {path: 'variable-create', component: VariableCreateComponent, canActivate: [AdminGuard], runGuardsAndResolvers: 'always'},
  {path: 'variable-details/:var-id', component: VariableDetailsComponent, canActivate: [AdminGuard], runGuardsAndResolvers: 'always'},
  {path: 'variable-update/:var-id', component: VariableUpdateComponent, canActivate: [AdminGuard], runGuardsAndResolvers: 'always'},
  {path: 'user-list', component: UserListComponent, canActivate: [UserGuard], runGuardsAndResolvers: 'always' },
  {path: 'user-create', component: UserCreateComponent, canActivate: [RegulGuard], runGuardsAndResolvers: 'always' },
  {path: 'user-details/:user-id', component: UserDetailsComponent, canActivate: [UserGuard], runGuardsAndResolvers: 'always' },
  {path: 'user-update/:user-id', component: UserUpdateComponent, canActivate: [RegulGuard], runGuardsAndResolvers: 'always' },
  {path: 'attachment-list', component: AttachmentListComponent, canActivate: [UserGuard], runGuardsAndResolvers: 'always' },
  {path: 'attachment-create', component: AttachmentCreateComponent, canActivate: [UserGuard], runGuardsAndResolvers: 'always' },
  {path: 'attachment-details/:file-id', component: AttachmentDetailsComponent, canActivate: [UserGuard], runGuardsAndResolvers: 'always' },
  {path: 'attachment-update/:file-id', component: AttachmentUpdateComponent, canActivate: [UserGuard], runGuardsAndResolvers: 'always' },
  {path: 'attachment-upload/:file-id', component: AttachmentUploadComponent, canActivate: [UserGuard], runGuardsAndResolvers: 'always' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' }), BrowserModule, FormsModule],
  exports: [RouterModule],
})

export class AppRoutingModule { }
