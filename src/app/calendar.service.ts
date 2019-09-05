import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as moment from "moment";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";
import { CalendarEvent } from "angular-calendar";
import { ICalendarModel } from "./calendar.model";
import { IViewChanged, IEvent } from "./utils";

@Injectable()
export class CalendarService {
  viewChanged = new EventEmitter<IViewChanged>();

  constructor(private httpClient: HttpClient) {}

  getEvents(time: moment.Moment): Observable<Array<CalendarEvent>> {
    return this.httpClient
      .get<Array<ICalendarModel>>("/api/calendar/events")
      .pipe(
        map(events => {
          return events.map((val: ICalendarModel) => {
            return {
              title: val.summary,
              start: moment(val.start.dateTime).toDate(),
              end: moment(val.end.dateTime).toDate()
            };
          });
        })
      );
  }

  createEvent(data: IEvent): Observable<any> {
    const { startDate, endDate, title } = data;
    return this.httpClient.post("/api/calendar/events", {
      startDate,
      endDate,
      title
    });
  }
}
