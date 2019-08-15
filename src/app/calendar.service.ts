import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as moment from "moment";
import * as Rx from "rxjs/Rx";
import { Observable } from "rxjs/Observable";
import { map, merge, tap } from "rxjs/operators";
import { CalendarEvent } from "angular-calendar";
import { ICalendarModel } from "./calendar.model";

const HEALTH_CHECK_INTERVAL = 5000;
const HEALTHY_RESPONSE = "OK";

@Injectable()
export class CalendarService {
  public healthObservable: Observable<any>;
  constructor(private httpClient: HttpClient) {
    const interval = Rx.Observable.interval(HEALTH_CHECK_INTERVAL);
    const getRequest = this.httpClient
      .get("/api/health")
      .pipe(map((val: string) => val === HEALTHY_RESPONSE));
    this.healthObservable = interval.pipe(merge(getRequest));
  }

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
