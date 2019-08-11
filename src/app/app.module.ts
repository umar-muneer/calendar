import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { NgModule } from '@angular/core';
import { CalendarModule} from "angular-calendar";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from './app.component';
import { TestPOCComponent } from "./test/test.component";
import { CalendarDemoComponent } from './calendar-demo/calendar-demo.component';
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';
import { CalendarService } from './calendar.service';
@NgModule({
  declarations: [
    AppComponent,
    TestPOCComponent,
    CalendarDemoComponent,
    CalendarHeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    CalendarModule.forRoot()
  ],
  providers: [CalendarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
