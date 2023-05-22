import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { UiModule } from './ui/ui.module';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
import { DeleteDirective } from './directives/admin/delete.directive';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';
import { JwtModule } from '@auth0/angular-jwt';
import { LoginComponent } from './ui/components/login/login.component';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { RegisterComponent } from './ui/components/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [	
    AppComponent,
    LoginComponent,
    RegisterComponent
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    AdminModule, UiModule,
    NgxSpinnerModule,
    HttpClientModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem("accessToken"),
        allowedDomains: ["localhost:7284"],
      }
    }),
    SocialLoginModule
  ],
  providers: [
    {provide: "baseUrl", useValue: "https://localhost:7284/api",multi: true},
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider("542377755542-uace25t7dirvb9rp86o9isajmvj4c2ml.apps.googleusercontent.com")
          }
        ],
        onError: err => console.log(err)
      } as SocialAuthServiceConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
