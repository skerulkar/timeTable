import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfDetailsComponent } from './component/prof-details/prof-details.component';
import { TimeDetailsComponent } from './component/time-details/time-details.component';
import { TimetableComponent } from './component/timetable/timetable.component';

const routes: Routes = [
  { path: '', redirectTo: '/prof-details', pathMatch: 'full' },
  { path: 'prof-details', component: ProfDetailsComponent },
  { path: 'time-details', component: TimeDetailsComponent },
  { path: 'timeTable', component: TimetableComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
