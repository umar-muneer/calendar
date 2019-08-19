import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as moment from "moment";
@Component({
  selector: 'app-create-event-dialog',
  templateUrl: './create-event-dialog.component.html',
  styleUrls: ['./create-event-dialog.component.css']
})
export class CreateEventDialogComponent implements OnInit {
  startDate: Date;
  startTime: Date;
  endDate: Date;
  endTime: Date;
  title: string;
  constructor(
    public dialogRef: MatDialogRef<CreateEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.title = data.title; 
      this.startDate = moment(data.startDate).clone().toDate();
      this.startTime = moment(data.startDate).clone().toDate();
      this.endDate = moment(data.endDate).clone().toDate();
      this.endTime = moment(data.endDate).clone().toDate();
    }

  get time() {
    return {
      title: this.title,
      startDate: this.parseDateAndTime(this.startDate, this.startTime),
      endDate: this.parseDateAndTime(this.endDate, this.endTime)
    }
  }
  parseDateAndTime(date: Date, time: Date): Date {
    const output: moment.Moment = moment(date).startOf("day"); 
    return output.set({ hour: time.getHours(), minute: time.getMinutes() }).toDate();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
