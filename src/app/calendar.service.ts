import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as moment from "moment";
import { Observable } from "rxjs/Observable";
import { map, merge, tap } from "rxjs/operators";
import { CalendarEvent } from "angular-calendar";
import { ICalendarModel } from "./calendar.model";
import { IViewChanged } from "./utils";

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
}
