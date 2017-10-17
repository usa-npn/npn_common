import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';

import {VisualizationsModule} from './visualizations';
import {Window} from './common/window';
import {NpnCommonModule} from './common';

import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    NpnCommonModule,
    VisualizationsModule,
    HttpModule,
    FormsModule
  ],
  providers: [
      {provide: Window, useValue: window},
  ]
})
export class NpnLibModule { }

export * from './common';
export * from './visualizations';
