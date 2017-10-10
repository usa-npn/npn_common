import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import {VisualizationDownloadComponent} from './visualization-download.component';

import {ScatterPlotSelectionFactory,ScatterPlotComponent,ScatterPlotControls} from './scatter-plot';
import {CalendarSelectionFactory,CalendarComponent} from './calendar';
import {ActivityCurvesSelectionFactory,ActivityCurvesComponent,CurveControlComponent,ActivityCurvesControlComponent} from './activity-curves';
import {AgddMapComponent,AgddMapSelectionFactory} from './agdd-map';
import {VisualizationComponent} from './visualization.component';

import {VisualizationSelectionFactory} from './visualization-selection-factory.service';
import {SpeciesPhenophaseInputComponent,YearRangeInputComponent} from './common-controls';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdButtonModule, MdCheckboxModule, MdSelectModule, MdProgressSpinnerModule,MatExpansionModule,MatAutocompleteModule,MatInputModule} from '@angular/material';

import {AgmCoreModule} from '@agm/core';

import {NpnCommonModule} from '../common';

@NgModule({
  imports: [
    CommonModule,
    NpnCommonModule,
    FormsModule,ReactiveFormsModule,
    BrowserAnimationsModule, MdButtonModule, MdCheckboxModule, MdSelectModule, MdProgressSpinnerModule, MatExpansionModule,MatAutocompleteModule,MatInputModule,
    AgmCoreModule
  ],
  declarations: [
      ScatterPlotComponent,
      ScatterPlotControls,
      CalendarComponent,
      ActivityCurvesComponent,CurveControlComponent,ActivityCurvesControlComponent,
      AgddMapComponent,
      VisualizationDownloadComponent,
      VisualizationComponent,
      SpeciesPhenophaseInputComponent,
      YearRangeInputComponent
  ],
  exports: [
      ScatterPlotComponent,
      ScatterPlotControls,
      ActivityCurvesComponent,ActivityCurvesControlComponent,
      CalendarComponent,
      AgddMapComponent,
      VisualizationComponent,
      SpeciesPhenophaseInputComponent
  ],
  providers: [
      DatePipe,
      // can inject a specific type of factory
      ScatterPlotSelectionFactory,
      CalendarSelectionFactory,
      AgddMapSelectionFactory,
      ActivityCurvesSelectionFactory,
      // OR one factory to rule them all
      VisualizationSelectionFactory
  ]
})
export class VisualizationsModule { }

export {VisSelection} from './vis-selection';
export {VisualizationSelectionFactory} from './visualization-selection-factory.service';
export * from './calendar';
export * from './scatter-plot';
export * from './activity-curves';
// TODO
export * from './agdd-map';
