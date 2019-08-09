import * as moment from "moment";
import { Component, OnInit } from '@angular/core';
import * as views from '../../constants';
@Component({
  selector: 'app-calendar-demo',
  templateUrl: './calendar-demo.component.html',
  styleUrls: ['./calendar-demo.component.css']
})
export class CalendarDemoComponent implements OnInit {
  viewDate: Date = new Date();
  views: any = views;
  selectedView: string = views.VIEW_DAY;
  constructor() {
  }
  ngOnInit() {
  }
  onViewChanged(view: string): void {
    this.selectedView = view;
  }
  onDateChanged(date: moment.Moment): void {
    this.viewDate = date.toDate();
  }
}
