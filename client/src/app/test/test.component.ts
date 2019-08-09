import { Component, Input } from "@angular/core";

@Component({
    selector: 'test-poc',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.css']
})
export class TestPOCComponent {
    title: 'test-poc';
    @Input() subtitle: string;
}