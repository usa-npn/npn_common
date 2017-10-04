import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {VisualizationDownloadComponent} from './visualization-download.component';

import {ScatterPlotSelectionFactory,ScatterPlotComponent,ScatterPlotControls} from './scatter-plot';
import {CalendarSelectionFactory,CalendarComponent} from './calendar';
import {ActivityCurvesSelectionFactory,ActivityCurvesComponent} from './activity-curves';
import {AgddMapComponent,AgddMapSelectionFactory} from './agdd-map';
import {VisualizationComponent} from './visualization.component';

import {VisualizationSelectionFactory} from './visualization-selection-factory.service';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdButtonModule, MdCheckboxModule, MdSelectModule, MdProgressSpinnerModule,MatExpansionModule} from '@angular/material';

import {AgmCoreModule} from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule, MdButtonModule, MdCheckboxModule, MdSelectModule, MdProgressSpinnerModule, MatExpansionModule,
    AgmCoreModule
  ],
  declarations: [
      ScatterPlotComponent,
      ScatterPlotControls,
      CalendarComponent,
      ActivityCurvesComponent,
      AgddMapComponent,
      VisualizationDownloadComponent,
      VisualizationComponent
  ],
  exports: [
      ScatterPlotComponent,
      ScatterPlotControls,
      CalendarComponent,
      AgddMapComponent,
      VisualizationComponent
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
