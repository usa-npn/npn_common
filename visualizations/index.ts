import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import {VisualizationDownloadComponent} from './visualization-download.component';

import {ScatterPlotSelectionFactory,ScatterPlotComponent,ScatterPlotControls} from './scatter-plot';
import {CalendarSelectionFactory,CalendarComponent,CalendarControlComponent} from './calendar';
import {ActivityCurvesSelectionFactory,ActivityCurvesComponent,CurveControlComponent,ActivityCurvesControlComponent} from './activity-curves';
import {ClippedWmsMapComponent,ClippedWmsMapSelectionFactory} from './clipped-wms-map';
import {VisualizationComponent} from './visualization.component';

import {VisualizationSelectionFactory} from './visualization-selection-factory.service';
import {SpeciesPhenophaseInputComponent,YearRangeInputComponent} from './common-controls';

import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdButtonModule, MdCheckboxModule, MdSelectModule, MdProgressSpinnerModule,MatExpansionModule,MatAutocompleteModule,MatInputModule,MatSliderModule} from '@angular/material';

import {AgmCoreModule} from '@agm/core';

import {NpnCommonModule} from '../common';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    NpnCommonModule,
    FormsModule,ReactiveFormsModule,
    MdButtonModule, MdCheckboxModule,
    MdSelectModule, MdProgressSpinnerModule, MatExpansionModule,
    MatAutocompleteModule,MatInputModule,MatSliderModule,
    AgmCoreModule
  ],
  declarations: [
      ScatterPlotComponent,ScatterPlotControls,
      CalendarComponent,CalendarControlComponent,
      ActivityCurvesComponent,CurveControlComponent,ActivityCurvesControlComponent,
      ClippedWmsMapComponent,
      VisualizationDownloadComponent,
      VisualizationComponent,
      SpeciesPhenophaseInputComponent,
      YearRangeInputComponent
  ],
  exports: [
      ScatterPlotComponent,
      ScatterPlotControls,
      ActivityCurvesComponent,ActivityCurvesControlComponent,
      CalendarComponent,CalendarControlComponent,
      ClippedWmsMapComponent,
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
export * from './clipped-wms-map';
