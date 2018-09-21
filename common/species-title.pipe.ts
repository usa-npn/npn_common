import {Pipe,PipeTransform} from '@angular/core';

import {environment} from '../environments/environment';

import {Species} from './species';

@Pipe({name: 'speciesTitle'})
export class SpeciesTitlePipe implements PipeTransform {
    transform(item: Species,format?: string): any {
        if(item) {
            format = format||environment.appConfig.tagSpeciesTitle;
            if(format === 'common-name') {
                return item.common_name;
            } else if(format === 'scientific-name') {
                return `${item.genus} ${item.species}`;
            }
        }
        return item;
    }
}
