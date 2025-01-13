import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/public/login/login.component';
import { HomeComponent } from './components/public/home/home.component';
import { UserProfileComponent } from './components/private/user-profile/user-profile.component';
import { PageNotFoundComponent } from './components/errors/page-not-found/page-not-found.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { UserDashboardComponent } from './components/public/user-dashboard/user-dashboard.component';
import { UploadImageComponent } from './components/private/upload-image/upload-image.component';
import { UploadVideoComponent } from './components/private/upload-video/upload-video.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { UsersListComponent } from './components/public/users-list/users-list.component';
import { PortfolioComponent } from './components/public/portfolio/portfolio.component';
import { VideoPlayerComponent } from './components/public/video-player/video-player.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ResourceViewerComponent } from './components/public/resource-viewer/resource-viewer.component';
import { SignUpComponent } from './components/public/sign-up/sign-up.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    UserProfileComponent,
    PageNotFoundComponent,
    UserDashboardComponent,
    UploadImageComponent,
    UploadVideoComponent,
    UserManagementComponent,
    UsersListComponent,
    PortfolioComponent,
    VideoPlayerComponent,
    DashboardComponent,
    ResourceViewerComponent,
    SignUpComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
