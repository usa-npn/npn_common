import {Component,Input,Output,EventEmitter,OnInit,DoCheck,OnChanges,SimpleChanges} from '@angular/core';
import {FormControl,Validators} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import {Species,Phenophase,SpeciesService,SpeciesTitlePipe,detectIE} from '../../common';
import {VisSelection} from '../vis-selection';

const COLORS = [
  '#1f77b4','#ff7f0e','#2ca02c','#d62728','#222299', '#c51b8a',  '#8c564b', '#637939', '#843c39',
  '#5254a3','#636363',
  '#bcbd22', '#7b4173','#e7ba52', '#222299',  '#f03b20', '#1b9e77','#e377c2',  '#ef8a62', '#91cf60', '#9467bd'
];

@Component({
    selector: 'species-phenophase-input',
    template: `
    <mat-form-field class="species-input">
        <input matInput [placeholder]="'Species'+(required ? ' *':'')" aria-label="Species"
               [matAutocomplete]="sp"
               [formControl]="speciesControl" [(ngModel)]="species" (focus)="speciesFocus()" />
        <mat-autocomplete #sp="matAutocomplete" [displayWith]="speciesTitle.transform">
          <mat-option *ngFor="let s of filteredSpecies | async" [value]="s">
            {{s | speciesTitle}} ({{s.number_observations}})
          </mat-option>
        </mat-autocomplete>
        <mat-error *ngIf="speciesControl.errors && speciesControl.errors.required">Species is required</mat-error>
        <mat-progress-bar *ngIf="!speciesList || !speciesList.length" mode="query"></mat-progress-bar>
    </mat-form-field>

    <mat-form-field class="phenophase-input">
        <mat-select placeholder="Phenophase" [(ngModel)]="phenophase" [disabled]="disabled || !phenophaseList.length">
          <mat-option *ngFor="let p of phenophaseList" [value]="p">{{p.phenophase_name}}</mat-option>
        </mat-select>
    </mat-form-field>

    <mat-form-field *ngIf="gatherColor" class="color-input">
        <mat-select  [placeholder]="'Color'+(required ? ' *':'')" [(ngModel)]="color" [formControl]="colorControl">
          <mat-select-trigger><div class="color-swatch" [ngStyle]="{'background-color':color}"></div></mat-select-trigger>
          <mat-option *ngFor="let c of colorList" [value]="c"><div class="color-swatch" [ngStyle]="{'background-color':c}"></div></mat-option>
        </mat-select>
        <mat-error *ngIf="colorControl.errors && colorControl.errors.required">Color is required</mat-error>
    </mat-form-field>
    `,
    styles: [`
        .species-input {
            width: 200px;
        }
        .phenophase-input {
            width: 250px;
        }
        .color-swatch {
            display: inline-block;
            width: 20px;
            height: 20px;
        }
        .color-input {
            width: 60px;
        }
        .color-input /deep/ .mat-select-trigger {
            //border: 1px solid red;
        }
    `]
})
export class SpeciesPhenophaseInputComponent implements OnInit,DoCheck,OnChanges {
    @Input() required:boolean = true;
    @Input() disabled:boolean = false;

    @Input() startYear:number;
    @Input() endYear:number;
    @Input() selection:VisSelection;

    @Output() speciesChange = new EventEmitter<Species>();
    speciesValue:Species;
    @Output() onSpeciesChange = new EventEmitter<any>();

    @Output() phenophaseChange = new EventEmitter<Phenophase>();
    phenophaseValue:Phenophase;
    @Output() onPhenophaseChange = new EventEmitter<any>();

    @Input() gatherColor:boolean = false;
    @Output() colorChange = new EventEmitter<String>();
    colorValue:string;
    @Output() onColorChange = new EventEmitter<any>();
    colorList:string[] = COLORS;

    requiredValidator = (c) => {
        if(this.required && !c.disabled && !c.value) {
            return {
                required: true
            };
        }
        return null;
    };

    speciesControl:FormControl = new FormControl(null,this.requiredValidator);
    colorControl:FormControl = new FormControl(null,this.requiredValidator);

    filteredSpecies: Observable<Species[]>;
    speciesList:Species[];

    phenophaseList:Phenophase[] = [];

    private lastSpeciesParams:string;
    private speciesParams = new Subject<any>();

    private isIE:boolean;

    constructor(private speciesService: SpeciesService,
                public speciesTitle: SpeciesTitlePipe) {
        this.filteredSpecies = this.speciesControl.valueChanges
            .debounceTime(500)
            .filter(s => typeof(s) === 'string')
            .map(s => {
                return s && this.speciesList ?
                    this.filterSpecies(s) :
                    this.speciesList ? this.speciesList.slice() : []
            });
        this.isIE = !!detectIE();
    }

    ngOnInit() {
        this.speciesParams
            .subscribe(params => {
                this.speciesList = undefined;
                // load up the available species
                this.speciesService.getAllSpecies(params)
                    .then(species => {
                        this.speciesList = species.sort((a,b) => {
                            if(a.number_observations < b.number_observations) {
                                return 1;
                            }
                            if(a.number_observations > b.number_observations) {
                                return -1;
                            }
                            return 0;
                        });
                    });
            });
    }

    ngOnChanges(changes:SimpleChanges) {
        if(changes.disabled) {
            if(changes.disabled.currentValue) {
                this.speciesControl.disable();
                this.colorControl.disable();
            } else {
                this.speciesControl.enable();
                this.colorControl.enable();
            }
        }
    }

    ngDoCheck() {
        if(this.selection) {
            let params = {},paramsS;
            (this.selection.networkIds||[]).forEach((id,i) => params[`network_id[${i}]`] = `${id}`);
            (this.selection.stationIds||[]).forEach((id,i) => params[`station_ids[${i}]`] = `${id}`);
            paramsS = JSON.stringify(params);
            if(paramsS !== this.lastSpeciesParams) {
                this.lastSpeciesParams = paramsS;
                this.speciesParams.next(params);
            }
        }
    }

    // this kicks speciesControl.valueChanges to display a list of
    // all species on focus
    speciesFocus() {
        if(!this.isIE && this.speciesList) {
            this.speciesControl.setValue(' ');
        }
    }

    filterSpecies(s) {
        s = s.trim().toLowerCase();
        return s !== '' ?
            (this.speciesList||[]).filter(sp => {
                let title = this.speciesTitle.transform(sp).toLowerCase();;
                return title.indexOf(s) !== -1;
            }) : (this.speciesList||[]);
    }

    displayPhenophase(p) {
        return p ? p.phenophase_name : p;
    }

    @Input('species')
    get species():Species {
        return this.speciesValue;
    }
    set species(s:Species) {
        if(!s || typeof(s) === 'object') { // might as well use any
            if(s !== this.speciesValue) {
                let oldValue = this.speciesValue;
                this.speciesChange.emit(this.speciesValue = s);
                this.onSpeciesChange.emit({
                    oldValue: oldValue,
                    newValue: this.speciesValue
                });
                this.phenophase = undefined;
                this.phenophaseList = [];
                if(s) {
                    this.speciesService.getPhenophases(s,this.startYear,this.endYear)
                        .then(phenophases => {
                            this.phenophaseList = phenophases;
                            this.phenophase = this.phenophaseList[0];
                        });
                }
            }
        }
    }

    @Input('phenophase')
    get phenophase():Phenophase {
        return this.phenophaseValue;
    }
    set phenophase(p:Phenophase) {
        if(p !== this.phenophaseValue) {
            let oldValue = this.phenophaseValue;
            this.phenophaseChange.emit(this.phenophaseValue = p);
            this.onPhenophaseChange.emit({
                oldValue: oldValue,
                newValue: this.phenophaseValue
            });
        }
    }

    @Input('color')
    get color(): string {
        return this.colorValue;
    }
    set color(c:string) {
        if(c !== this.colorValue) {
            let oldValue = this.colorValue;
            this.colorChange.emit(this.colorValue = c);
            this.onColorChange.emit({
                oldValue: oldValue,
                newValue: this.colorValue
            });
        }
    }
}
