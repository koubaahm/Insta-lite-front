import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/public/home/home.component';
import { LoginComponent } from './components/public/login/login.component';
import { UserProfileComponent } from './components/private/user-profile/user-profile.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { PageNotFoundComponent } from './components/errors/page-not-found/page-not-found.component';
import { UploadImageComponent } from './components/private/upload-image/upload-image.component';
import { UploadVideoComponent } from './components/private/upload-video/upload-video.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { PortfolioComponent } from './components/public/portfolio/portfolio.component';
import { UsersListComponent } from './components/public/users-list/users-list.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ResourceViewerComponent } from './components/public/resource-viewer/resource-viewer.component';
import { SignUpComponent } from './components/public/sign-up/sign-up.component';

const routes: Routes = [
  // Routes publiques
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'portfolio/:id', component: PortfolioComponent },
  { path: 'users-list', component: UsersListComponent},
  { path: 'resource/:type/:id', component: ResourceViewerComponent },

  // Routes utilisateur connecté
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'upload-image', component: UploadImageComponent, canActivate: [AuthGuard] },
  { path: 'upload-video', component: UploadVideoComponent, canActivate: [AuthGuard] },

  // Routes administrateur
  { path: 'admin/user-management', component: UserManagementComponent, canActivate: [AdminGuard] },
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AdminGuard] },

  // Page 404
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
