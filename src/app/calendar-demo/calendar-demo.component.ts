import * as moment from 'moment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import * as views from '../../constants';
import { CalendarService } from '../calendar.service';
import { Subscription } from 'rxjs/Subscription';
import { CreateEventDialogComponent } from '../create-event-dialog/create-event-dialog.component';
import { IEvent } from '../utils';

@Component({
  selector: 'app-calendar-demo',
  templateUrl: './calendar-demo.component.html',
  styleUrls: ['./calendar-demo.component.css']
})
export class CalendarDemoComponent implements OnInit, OnDestroy {
  events: CalendarEvent[];
  viewDate: Date = new Date();
  views: any = views;
  selectedView: string = views.VIEW_WEEK;
  opInProgress = false;
  private eventsSubscription: Subscription;

  constructor(
    private calendarService: CalendarService,
    private dialog: MatDialog
  ) {}
  async ngOnInit() {
    this.showHideProgressSpinner(true);
    this.eventsSubscription = this.calendarService
      .getEvents(moment())
      .subscribe(
        (data: Array<CalendarEvent>) => {
          this.events = [...data];
        },
        () => this.showHideProgressSpinner(false),
        () => this.showHideProgressSpinner(false)
      );
    this.calendarService.viewChanged.subscribe(({ viewType, day }) => {
      this.selectedView = viewType;
      this.viewDate = day || this.viewDate;
    });
  }
  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
  showHideProgressSpinner(val: boolean): void {
    this.opInProgress = val;
  }
  onDateChanged(date: moment.Moment): void {
    this.viewDate = date.toDate();
  }
  onDayClickedInMonthView({ day: { date } }) {
    this.calendarService.viewChanged.emit({
      viewType: views.VIEW_DAY,
      day: date
    });
  }
  onTimeClickedInDayView($event: { date: Date }) {
    this.openDialog($event.date);
  }
  createEvent(data: IEvent) {
    this.showHideProgressSpinner(true);
    this.calendarService.createEvent(data).subscribe(
      () => {
        this.events = [
          ...this.events,
          {
            title: data.title,
            start: data.startDate,
            end: data.endDate
          }
        ];
      },
      () => this.showHideProgressSpinner(false),
      () => this.showHideProgressSpinner(false)
    );
  }
  openDialog(date: Date): void {
    const dialogRef = this.dialog.open(CreateEventDialogComponent, {
      width: '480px',
      data: {
        title: 'New Event',
        startDate: date,
        endDate: moment(date)
          .add(1, 'hours')
          .toDate()
      }
    });
    dialogRef.afterClosed().subscribe((result: IEvent) => {
      this.createEvent(result);
    });
  }
}
