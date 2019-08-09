import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { NgModule } from '@angular/core';
import { CalendarModule} from "angular-calendar";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { AppComponent } from './app.component';
import { TestPOCComponent } from "./test/test.component";
import { CalendarDemoComponent } from './calendar-demo/calendar-demo.component';
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';
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
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    CalendarModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
