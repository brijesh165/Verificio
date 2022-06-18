import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/auth' },
  { path: 'auth', loadChildren: () => import('src/app/auth/auth.module').then(m => m.AuthModule) },
  { path: 'app', loadChildren: () => import('src/app/main/main.module').then(m => m.MainModule) },
  { path: 'admin', loadChildren: () => import('src/app/super-admin/super-admin.module').then(m => m.SuperAdminModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
