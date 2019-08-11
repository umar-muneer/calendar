import * as moment from "moment";
import { Component, OnInit } from "@angular/core";
import * as views from "../../constants";
import { CalendarService } from "../calendar.service";
@Component({
  selector: "app-calendar-demo",
  templateUrl: "./calendar-demo.component.html",
  styleUrls: ["./calendar-demo.component.css"]
})
export class CalendarDemoComponent implements OnInit {
  events: any;
  viewDate: Date = new Date();
  views: any = views;
  selectedView: string = views.VIEW_DAY;
  constructor(private calendarService: CalendarService) {}
  async ngOnInit() {
    this.calendarService.getEvents(moment()).subscribe(
      data => {
        this.events = data;
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
