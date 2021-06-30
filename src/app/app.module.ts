import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatCardModule } from '@angular/material/card';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { ProfDetailsComponent } from './component/prof-details/prof-details.component';
import { CrudService } from './shared/crud.service';
import { ToastrModule } from 'ngx-toastr';
import { TimeDetailsComponent } from './component/time-details/time-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimetableComponent } from './component/timetable/timetable.component';

@NgModule({
  declarations: [
    AppComponent,
    ProfDetailsComponent,
    TimeDetailsComponent,
    TimetableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    MatCardModule
  ],
  providers: [CrudService],
  bootstrap: [AppComponent]
})
export class AppModule { }
