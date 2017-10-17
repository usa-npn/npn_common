import {Component, Input, OnInit} from '@angular/core';

import {ObserverActivitySelection} from './observer-activity-selection';

@Component({
    selector: 'observer-activity-control',
    template:`
    <mat-form-field>
        <mat-select class="year-input" placeholder="Year" [(ngModel)]="selection.year" (change)="selection.update()">
            <mat-option *ngFor="let y of validYears" [value]="y">{{y}}</mat-option>
        </mat-select>
    </mat-form-field>
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
