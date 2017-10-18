/*
NOTE: this is currently one BIG module that includes all the visualizations.
that's ok generally but it would be better to have each visualization be its own
module that deals with its own dependencies so that they could be imported individually
into an application (and simplify this module's imports).

see the commented out start of such a module in ./clipped-wms-map

probably should be an activity for a later date, or if time permits.
*/
import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import {VisualizationDownloadComponent} from './visualization-download.component';

import {ScatterPlotSelectionFactory,ScatterPlotComponent,ScatterPlotControls} from './scatter-plot';
import {CalendarSelectionFactory,CalendarComponent,CalendarControlComponent} from './calendar';
import {ActivityCurvesSelectionFactory,ActivityCurvesComponent,CurveControlComponent,ActivityCurvesControlComponent} from './activity-curves';
import {ClippedWmsMapComponent,ClippedWmsMapControl,ClippedWmsMapSelectionFactory} from './clipped-wms-map';
//import {ClippedWmsMapVisModule} from './clipped-wms-map';
import {ObserverActivitySelectionFactory,ObserverActivityComponent,ObserverActivityControl} from './observer-activity';
import {ObservationFrequencySelectionFactory,ObservationFrequencyComponent,ObservationFrequencyControl} from './observation-frequency';
import {VisualizationComponent} from './visualization.component';

import {VisualizationSelectionFactory} from './visualization-selection-factory.service';
import {SpeciesPhenophaseInputComponent,YearRangeInputComponent} from './common-controls';

import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule,MatButtonModule, MatCheckboxModule, MatSelectModule, MatProgressSpinnerModule,MatExpansionModule,MatAutocompleteModule,MatInputModule,MatSliderModule} from '@angular/material';

import {AgmCoreModule} from '@agm/core';

import {NpnCommonModule} from '../common';
import {NpnGriddedModule} from '../gridded';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FormsModule,ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule, MatCheckboxModule,
    MatSelectModule, MatProgressSpinnerModule, MatExpansionModule,
    MatAutocompleteModule,MatInputModule,MatSliderModule,
    AgmCoreModule,
    NpnCommonModule,NpnGriddedModule,
  ],
  declarations: [
      ScatterPlotComponent,ScatterPlotControls,
      CalendarComponent,CalendarControlComponent,
      ActivityCurvesComponent,CurveControlComponent,ActivityCurvesControlComponent,
      ObserverActivityComponent,ObserverActivityControl,
      ObservationFrequencyComponent,ObservationFrequencyControl,
      ClippedWmsMapComponent,ClippedWmsMapControl,
      VisualizationDownloadComponent,
      VisualizationComponent,
      SpeciesPhenophaseInputComponent,
      YearRangeInputComponent
  ],
  exports: [
      ScatterPlotComponent,
      ScatterPlotControls,
      ActivityCurvesComponent,ActivityCurvesControlComponent,
      ObserverActivityComponent,ObserverActivityControl,
      ObservationFrequencyComponent,ObservationFrequencyControl,
      CalendarComponent,CalendarControlComponent,
      ClippedWmsMapComponent,ClippedWmsMapControl,
      VisualizationComponent,
      SpeciesPhenophaseInputComponent
  ],
  providers: [
      DatePipe,
      // can inject a specific type of factory
      ScatterPlotSelectionFactory,
      CalendarSelectionFactory,
      ClippedWmsMapSelectionFactory,
      ActivityCurvesSelectionFactory,
      ObserverActivitySelectionFactory,
      ObservationFrequencySelectionFactory,
      // OR one factory to rule them all
      VisualizationSelectionFactory
  ]
})
export class VisualizationsModule { }

export {VisSelection,NetworkAwareVisSelection,StationAwareVisSelection} from './vis-selection';
export {VisualizationSelectionFactory} from './visualization-selection-factory.service';
export * from './calendar';
export * from './scatter-plot';
export * from './activity-curves';
export * from './clipped-wms-map';
export * from './observer-activity';
export * from './observation-frequency';
