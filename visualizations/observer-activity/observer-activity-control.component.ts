import {Component, Input, OnInit} from '@angular/core';

import {ObserverActivitySelection} from './observer-activity-selection';

@Component({
    selector: 'observer-activity-control',
    template:`
    <md-select class="year-input" placeholder="Year" [(ngModel)]="selection.year" (change)="selection.update()">
        <md-option *ngFor="let y of validYears" [value]="y">{{y}}</md-option>
    </md-select>
    `,
    styles:[`
    `]
})
export class ObserverActivityControl implements OnInit {
    @Input()
    selection: ObserverActivitySelection;

    // TODO what are the valid years?
    validYears:number[] = (function(){
        let max = (new Date()).getFullYear()+1,
            current = 2000,
            years:number[] = [];
        while(current < max) {
            years.push(current++);
        }
        return years.reverse();
    })();

    ngOnInit() {

    }
}
