import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as moment from "moment";
import { Observable } from "rxjs/Observable";

@Injectable()
export class CalendarService {
  constructor(private httpClient: HttpClient) {}

  getEvents(time: moment.Moment) {
    return this.httpClient.get("/calendar/events");
  }
}
