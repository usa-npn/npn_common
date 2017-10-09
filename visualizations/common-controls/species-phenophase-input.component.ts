import {Component,Input,Output,EventEmitter,OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';


import {Species,Phenophase,SpeciesService,SpeciesTitlePipe} from '../../common';

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
    `,
    styles: [`
        .species-input {
            width: 300px;
        }
        .phenophase-input {
            width: 400px;
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
    @Output() onSpeciesChange = new EventEmitter<Species>();

    @Output() phenophaseChange = new EventEmitter<Phenophase>();
    phenophaseValue:Phenophase;

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
                // TODO - if species is set then?
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
            this.speciesChange.emit(this.speciesValue = s);
            this.onSpeciesChange.emit(this.speciesValue);
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

    @Input('phenophase')
    get phenophase():Phenophase {
        return this.phenophaseValue;
    }
    set phenophase(p:Phenophase) {
        this.phenophaseChange.emit(this.phenophaseValue = p);
    }
}
