import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'angular-calendar';
import { CalendarWeekHoursViewModule } from 'angular-calendar-week-hours-view';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClientModule } from '@angular/common/http';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { AppComponent } from './app.component';
import { TestPOCComponent } from './test/test.component';
import { CalendarDemoComponent } from './calendar-demo/calendar-demo.component';
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';
import { CalendarService } from './calendar.service';
import { HealthService } from './health.service';
import { CreateEventDialogComponent } from './create-event-dialog/create-event-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    TestPOCComponent,
    CalendarDemoComponent,
    CalendarHeaderComponent,
    CreateEventDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatInputModule,
    CalendarModule.forRoot(),
    CalendarWeekHoursViewModule,
    TimepickerModule.forRoot(),
    FormsModule
  ],
  entryComponents: [CreateEventDialogComponent],
  providers: [CalendarService, HealthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
