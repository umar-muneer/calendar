import * as moment from "moment";
import { Component, OnInit } from "@angular/core";
import { CalendarEvent } from "angular-calendar";
import * as R from "ramda";
import * as views from "../../constants";
import { CalendarService } from "../calendar.service";
import any from "ramda/es/any";
@Component({
  selector: "app-calendar-demo",
  templateUrl: "./calendar-demo.component.html",
  styleUrls: ["./calendar-demo.component.css"]
})
export class CalendarDemoComponent implements OnInit {
  events: CalendarEvent[];
  viewDate: Date = new Date();
  views: any = views;
  selectedView: string = views.VIEW_DAY;
  constructor(private calendarService: CalendarService) {}
  async ngOnInit() {
    this.calendarService.getEvents(moment()).subscribe(
      (data: Array<any>) => {
        this.events = data.map<CalendarEvent>((evt: any) => {
          return {
            title: evt.summary,
            start: moment(evt.start.dateTime).toDate(),
            end: moment(evt.end.dateTime).toDate()
          };
        });
      },
      err => console.log(err),
      () => console.log("done")
    );
  }
  onViewChanged(view: string): void {
    this.selectedView = view;
  }
  onDateChanged(date: moment.Moment): void {
    this.viewDate = date.toDate();
  }
}
