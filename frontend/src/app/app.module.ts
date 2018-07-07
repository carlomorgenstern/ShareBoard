import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './components/app/app.component';
import { UnauthenticatedHttpInterceptor } from './services/authentication/authentication.guard';
import { AuthenticationService } from './services/authentication/authentication.service';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FontAwesomeModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'CSRF-Token',
      headerName: 'CSRF-Token',
    }),
    NgbModule,
    NgxWebstorageModule.forRoot(),
    ReactiveFormsModule,
  ],
  providers: [
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthenticatedHttpInterceptor,
    },
  ],
})
export class AppModule {

  constructor (private readonly authService: AuthenticationService) {
    // Ping current user endpoint when we are not in production to get the CSRF-Token
    if (!environment.production) {
      this.authService.updateUserData().subscribe(() => {}, () => {});
    }
  }
}
