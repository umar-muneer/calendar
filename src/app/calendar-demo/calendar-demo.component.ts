import * as moment from "moment";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { CalendarEvent } from "angular-calendar";
import * as views from "../../constants";
import { CalendarService } from "../calendar.service";
import { ICalendarModel } from "../calendar.model";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-calendar-demo",
  templateUrl: "./calendar-demo.component.html",
  styleUrls: ["./calendar-demo.component.css"]
})
export class CalendarDemoComponent implements OnInit, OnDestroy {
  events: CalendarEvent[];
  viewDate: Date = new Date();
  views: any = views;
  selectedView: string = views.VIEW_DAY;
  private eventsSubscription: Subscription;
  constructor(private calendarService: CalendarService) {}
  async ngOnInit() {
    this.eventsSubscription = this.calendarService
      .getEvents(moment())
      .subscribe(
        (data: Array<CalendarEvent>) => {
          this.events = [...data];
        },
        err => console.log(err),
        () => console.log("done")
      );
    this.calendarService.viewChanged.subscribe((selectedView: string) => {
      this.selectedView = selectedView;
    });
  }
  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
  onDateChanged(date: moment.Moment): void {
    this.viewDate = date.toDate();
  }
  onDayClickedInMonthView($event) {
    this.calendarService.viewChanged.emit(views.VIEW_DAY);
  }
  onRightClick($event) {
    console.log("right click:", $event);
  }
}
