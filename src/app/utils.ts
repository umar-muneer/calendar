export interface IViewChanged {
    viewType: string;
    day?: Date;
}

export interface IEvent {
    title: string;
    startDate: Date;
    endDate: Date;
}