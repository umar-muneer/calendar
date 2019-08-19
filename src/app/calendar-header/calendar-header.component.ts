import * as moment from "moment";
import { Component, OnInit, Input, Output, OnDestroy } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { CalendarService } from "../calendar.service";
import * as views from "../../constants";
import { Subscription } from "rxjs/Subscription";
import { HealthService } from "../health.service";
import { IViewChanged } from "../utils";
@Component({
  selector: "app-calendar-header",
  templateUrl: "./calendar-header.component.html",
  styleUrls: ["./calendar-header.component.css"]
})
export class CalendarHeaderComponent implements OnInit, OnDestroy {
  @Input() timezone: string;
  @Output() dateChanged = new EventEmitter<moment.Moment>();
  title: string;
  viewOptions: string[] = [views.VIEW_DAY, views.VIEW_WEEK, views.VIEW_MONTH];
  selectedView = views.VIEW_DAY;
  baseline: moment.Moment;
  status: boolean;
  private healthSubscription: Subscription;
  constructor(
    private healthService: HealthService,
    private calendarService: CalendarService
  ) {
    this.baseline = moment();
    this.title = this.getDay(moment());
  }
  ngOnInit() {
    this.healthSubscription = this.healthService.healthCheck.subscribe(
      (status: boolean) => {
        this.status = status;
      }
    );
    this.calendarService.viewChanged.subscribe((args: IViewChanged) => {
      this.selectedView = args.viewType;
      this.baseline = moment(args.day);
      if (this.isDay()) {
        this.title = this.getDay(this.baseline);
      } else if (this.isWeek()) {
        this.title = this.getWeek(this.baseline);
      } else if (this.isMonth()) {
        this.title = this.getMonth(this.baseline);
      }
    });
  }
  ngOnDestroy() {
    this.healthSubscription.unsubscribe();
  }
  getDay(baseline: moment.Moment): string {
    return baseline.clone().format("DD-MMM-YYYY");
  }
  getWeek(baseline: moment.Moment): string {
    const from: string = baseline
      .clone()
      .startOf("week")
      .format("DD MMM");
    const to: string = baseline
      .clone()
      .endOf("week")
      .format("DD MMM");
    const year: string = baseline.clone().format("YYYY");
    return `${from} - ${to}, ${year}`;
  }
  getMonth(baseline: moment.Moment): string {
    return baseline.clone().format("MMM-YYYY");
  }
  isDay(): boolean {
    return this.selectedView === views.VIEW_DAY;
  }
  isWeek(): boolean {
    return this.selectedView === views.VIEW_WEEK;
  }
  isMonth(): boolean {
    return this.selectedView === views.VIEW_MONTH;
  }
  next(): void {
    const clone: moment.Moment = this.baseline.clone();
    if (this.isDay()) {
      this.baseline = clone.add(1, "day");
      this.title = this.getDay(this.baseline);
    } else if (this.isWeek()) {
      this.baseline = clone.startOf("week").add(1, "week");
      this.title = this.getWeek(this.baseline);
    } else if (this.isMonth()) {
      this.baseline = clone.startOf("month").add(1, "month");
      this.title = this.getMonth(this.baseline);
    }
    this.dateChanged.emit(this.baseline);
  }
  previous(): void {
    const clone: moment.Moment = this.baseline.clone();
    if (this.isDay()) {
      this.baseline = clone.subtract(1, "day");
      this.title = this.getDay(this.baseline);
    } else if (this.isWeek()) {
      this.baseline = clone.subtract(1, "week");
      this.title = this.getWeek(this.baseline);
    } else if (this.isMonth()) {
      this.baseline = clone.subtract(1, "month");
      this.title = this.getMonth(this.baseline);
    }
    this.dateChanged.emit(this.baseline);
  }
  today(): void {
    this.baseline = moment();
    if (this.isDay()) {
      this.title = this.getDay(this.baseline);
    } else if (this.isMonth()) {
      this.title = this.getMonth(this.baseline);
    } else if (this.isWeek()) {
      this.title = this.getWeek(this.baseline);
    }
    this.dateChanged.emit(this.baseline);
  }
  changeView(): void {
    console.log("emitting", this.selectedView);
    this.calendarService.viewChanged.emit({ viewType: this.selectedView });
  }
}
