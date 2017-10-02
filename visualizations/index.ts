import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {VisualizationDownloadComponent} from './visualization-download.component';

import {ScatterPlotSelectionFactory,ScatterPlotComponent,ScatterPlotControls} from './scatter-plot';
import {CalendarSelectionFactory,CalendarComponent} from './calendar';
import {AgddMapComponent,AgddMapSelectionFactory} from './agdd-map';
import {VisualizationComponent} from './visualization.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdButtonModule, MdCheckboxModule, MdSelectModule, MdProgressSpinnerModule} from '@angular/material';

import {AgmCoreModule} from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule, MdButtonModule, MdCheckboxModule, MdSelectModule, MdProgressSpinnerModule,
    AgmCoreModule
  ],
  declarations: [
      ScatterPlotComponent,
      ScatterPlotControls,
      CalendarComponent,
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
      ScatterPlotSelectionFactory,
      CalendarSelectionFactory,
      AgddMapSelectionFactory
  ]
})
export class VisualizationsModule { }

export {VisSelection} from './vis-selection';
export * from './calendar';
export * from './scatter-plot';
export * from './agdd-map';
