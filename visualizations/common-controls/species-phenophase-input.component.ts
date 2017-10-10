import {Component,Input,Output,EventEmitter,OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import {Species,Phenophase,SpeciesService,SpeciesTitlePipe} from '../../common';

const COLORS = [
  '#1f77b4','#ff7f0e','#2ca02c','#d62728','#222299', '#c51b8a',  '#8c564b', '#637939', '#843c39',
  '#5254a3','#636363',
  '#bcbd22', '#7b4173','#e7ba52', '#222299',  '#f03b20', '#1b9e77','#e377c2',  '#ef8a62', '#91cf60', '#9467bd'
];

@Component({
    selector: 'species-phenophase-input',
    template: `
    <md-form-field class="species-input">
        <input mdInput placeholder="Species" aria-label="Species"
               [mdAutocomplete]="sp"
               [formControl]="speciesControl" [(ngModel)]="species"/>
        <md-autocomplete #sp="mdAutocomplete" [displayWith]="speciesTitle.transform">
          <md-option *ngFor="let s of filteredSpecies | async" [value]="s">
            {{s | speciesTitle}} ({{s.number_observations}})
          </md-option>
        </md-autocomplete>
    </md-form-field>

    <md-select class="phenophase-input" placeholder="Phenophase" [(ngModel)]="phenophase" [disabled]="!phenophaseList.length">
      <md-option *ngFor="let p of phenophaseList" [value]="p">{{p.phenophase_name}}</md-option>
    </md-select>

    <md-select *ngIf="gatherColor" class="color-input" placeholder="Color" [(ngModel)]="color">
      <md-option *ngFor="let c of colorList" [value]="c"><div class="color-swatch" [ngStyle]="{'background-color':c}">{{c}}</div></md-option>
    </md-select>
    `,
    styles: [`
        .species-input {
            width: 300px;
        }
        .phenophase-input {
            width: 400px;
        }
        .color-swatch {
            display: inline-block;
            width: 20px;
            height: 20px;
        }
    `]
})
export class SpeciesPhenophaseInputComponent implements OnInit {
    @Input() startYear:number;
    @Input() endYear:number;
    @Input() networkIds:any[];
    @Input() stationIds:any[];

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

    speciesControl:FormControl = new FormControl();
    filteredSpecies: Observable<Species[]>;
    speciesList:Species[] = [];

    phenophaseList:Phenophase[] = [];

    constructor(private speciesService: SpeciesService,
                private speciesTitle: SpeciesTitlePipe) {
        this.filteredSpecies = this.speciesControl.valueChanges
            .startWith(null)
            .map(s => {
                return s && this.speciesList ?
                    this.filterSpecies(s) :
                    this.speciesList ? this.speciesList.slice() : []
            });
    }

    ngOnInit() {
        // load up the available species
        this.speciesService.getAllSpecies()
            .then(species => {
                this.speciesList = species;
            });
    }

    filterSpecies(s) {
        if(typeof(s) === 'string') {
            s = s.toLowerCase();
            return (this.speciesList||[]).filter(sp => {
                let title = this.speciesTitle.transform(sp).toLowerCase();;
                return title.indexOf(s) !== -1;
            }).sort((a,b) => {
                if(a.number_observations < b.number_observations) {
                    return 1;
                }
                if(a.number_observations > b.number_observations) {
                    return -1;
                }
                return 0;
            });
        }
        return [s];
    }

    filterPhenophases(s) {
        if(typeof(s) === 'string') {
            s = s.toLowerCase();
            return (this.phenophaseList||[]).filter(p => {
                return p.phenophase_name.toLowerCase().indexOf(s) !== -1;
            });
        }
        return [s];
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
