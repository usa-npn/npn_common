import {Component,Input,Output,EventEmitter,OnInit} from '@angular/core';

@Component({
    selector: 'year-range-input',
    template: `
    <md-select class="start-year" placeholder="Start year" [(ngModel)]="start">
        <md-option *ngFor="let y of validStarts" [value]="y">{{y}}</md-option>
    </md-select>
    <md-select class="end-year" placeholder="End year" [(ngModel)]="end" [disabled]="!start">
        <md-option *ngFor="let y of validEnds" [value]="y">{{y}}</md-option>
    </md-select>
    `
})
export class YearRangeInputComponent {
    @Output() startChange = new EventEmitter<number>();
    startValue:number;
    @Output() onStartChange = new EventEmitter<any>();

    @Output() endChange = new EventEmitter<number>();
    endValue:number;
    @Output() onEndChange = new EventEmitter<any>();

    @Input()
    maxSpan:number = 10;

    validStarts:number[] = (function(){
        let max = (new Date()).getFullYear(),
            current = 1900,
            years:number[] = [];
        while(current < max) {
            years.push(current++);
        }
        return years;
    })();
    validEnds:number[] = [];

    @Input()
    get start() {
        return this.startValue;
    }
    set start(s:number) {
        if(typeof(s) === 'string') {
            s = +s;
        }
        if(s !== this.startValue) {
            let oldValue = this.startValue;
            this.startChange.emit(this.startValue = s);
            this.onStartChange.emit({
                oldValue: oldValue,
                newValue: this.startValue
            });
            if(s) {
                let thisYear = (new Date()).getFullYear(),
                    current = s+1,
                    max = current+this.maxSpan,
                    ends:number[] = [];
                if(max > thisYear) {
                    max = thisYear+1;
                }
                while(current < max) {
                    ends.push(current++);
                }
                this.validEnds = ends;
                if(this.end > max) {
                    this.end = undefined;
                }
            }
        }
    }

    @Input()
    get end() {
        return this.endValue;
    }
    set end(e:number) {
        if(typeof(e) === 'string') {
            e = +e;
        }
        if(e !== this.endValue) {
            let oldValue = this.endValue;
            this.endChange.emit(this.endValue = e);
            this.onEndChange.emit({
                oldValue: oldValue,
                newValue: this.endValue
            });
        }
    }

}
