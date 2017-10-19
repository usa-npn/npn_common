import {Component,Input,AfterViewInit,HostListener,ElementRef,OnDestroy,OnChanges,SimpleChanges} from '@angular/core';

import {Window} from '../common';
import {WmsMapLegend} from './wms-map-legend';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';

import {Selection} from 'd3-selection';
import * as d3 from 'd3';

@Component({
    selector: 'wms-map-legend',
    template:`
    <svg class="gridded-legend"></svg>
    `,
    styles:[`
    `]
})
export class WmsMapLegendComponent implements AfterViewInit, OnDestroy, OnChanges {
    @Input()
    legend:WmsMapLegend;

    private svg: Selection<any,any,any,any>;

    private resizeSubscription:any;

    constructor(protected window: Window, protected rootElement: ElementRef) {}

    ngAfterViewInit() {
        console.debug('WmsMapLegendComponent.ngAfterViewInit');
        this.resizeSubscription = Observable.fromEvent(window,'resize')
            .debounceTime(500)
            .subscribe(event => this.redraw());
        this.svg = d3.select(this.rootElement.nativeElement).select('svg');
        console.debug('WmsMapLegendComponent:SVG',this.svg);
    }

    ngOnChanges(changes:SimpleChanges):void {
        console.debug('WmsMapLegendComponent.ngOnChanges',changes);
        setTimeout(() => this.redraw()); // all that can change at the moment is the reference to legend
    }

    ngOnDestroy() {
        console.debug('WmsMapLegendComponent.ngOnDestroy');
        if(this.resizeSubscription) {
            this.resizeSubscription.unsubscribe();
        }
    }

    redraw() {
        console.debug('WmsMapLegendComponent.redraw');
        let svg = this.svg,
            legend = this.legend;
        if(svg) {
            svg.selectAll('g').remove();
        }

        if(!legend || !svg) {
            return;
        }
        let width = parseFloat(svg.style('width').replace('px','')),
            height = parseFloat(svg.style('height').replace('px','')),
            data = legend.getData(),
            mid_idx = Math.floor(data.length/2),
            cell_width = width/data.length,
            cell_height = 30,
            top_pad = 2;
        console.debug('WmsMapLegendComponent.svg dimensions',width,height);
        console.debug('WmsMapLegendComponent.legend cell width',cell_width);

        let g = svg.append('g'),
            cell = g.selectAll('g.cell')
                     .data(data)
                     .enter()
                     .append('g')
                     .attr('class',(d,i) => {
                        return 'cell'+
                            ((i === 0) ? ' first' :
                             ((i === mid_idx) ? ' middle' :
                              ((i === data.length -1) ? ' last' : '')));
                     })
                     .attr('transform',function(d,i) { return 'translate('+(i*cell_width)+','+top_pad+')'; })
                     .append('rect')
                     .attr('height',cell_height)
                     .attr('width',cell_width)
                     .style('stroke','black')
                     .style('stroke-width','1px')
                     .style('fill',function(d,i) { return d.color; });

         if(legend.ldef.legend_delimiter_every) {
             let every = legend.ldef.legend_delimiter_every,
                 first_every = false,
                 running_total = 0,
                 separators = data.map(function(d,i){
                     if((i+1) === data.length) {
                         return true;
                     }
                     running_total += (data[i+1].quantity - data[i].quantity);
                     if(running_total >= every) {
                         running_total = 0;
                         return true;
                     }
                     return false;
                 }),
                 top_bottom = [(cell_width+1),cell_height,(cell_width+1),cell_height].join(','), //{ stroke-dasharray: $w,$h,$w,$h }
                 top_right_bottom = [((cell_width*2)+cell_height),cell_height].join(','), //{ stroke-dasharray: (($w*2)+$h),$h }
                 top_left_bottom = [(cell_width+1),cell_height,(cell_width+cell_height+1),0].join(','); ////{ stroke-dasharray: $w,$h,($w+$h),0 }

             console.debug('WmsMapLegendComponent.legend_delimiter_every',every);
             cell.style('stroke-dasharray',function(d,i){
                 if(i === 0) {
                     return separators[i] ? undefined : top_left_bottom;
                 }
                 return separators[i] ? top_right_bottom : top_bottom;
             })
             // top_bottom removes the left/right borders which leaves a little whitespace
             // which looks odd so in cases where there is no right border increase a cell's width
             // by 1px to cover that gap
             .attr('width',function(d,i){
                 var w = parseFloat(d3.select(this).attr('width'));
                 if(i === 0) {
                     return separators[i] ? w : w+1;
                 }
                 return separators[i] ? w : w+1;
             });
             g.selectAll('g.cell').append('line')
                  .attr('stroke',function(d,i){ return separators[i] ? 'black' : 'none'; })
                  .attr('stroke-width', 2)
                  .attr('x1',cell_width-1)
                  .attr('x2',cell_width-1)
                  .attr('y1',0)
                  .attr('y2',cell_height);
         }
         cell.append('title').text(function(d) { return d.label; });

         let tick_length = 5,
             tick_padding = 3;

         function label_cell(cell,label,anchor) {
             let tick_start = (top_pad+cell_height+tick_padding);
             cell.append('line')
                 .attr('x1',(cell_width/2))
                 .attr('y1',tick_start)
                 .attr('x2',(cell_width/2))
                 .attr('y2',tick_start+tick_length)
                 .attr('stroke','black')
                 .attr('stroke-width','1');
             cell.append('text')
                 .attr('dx',(cell_width/2))
                 .attr('dy','3.8em'/*cell_height+tick_length+(2*tick_padding)*/) // need to know line height of text
                 .style('text-anchor',anchor)
                 .text(label);
         }
         label_cell(d3.select('g.cell.first'),data[0].label,'start');
         label_cell(d3.select('g.cell.middle'),data[mid_idx].label,'middle');
         label_cell(d3.select('g.cell.last'),data[data.length-1].label,'end');

         if(legend.ldef.legend_units) {
             svg.append('g')
                .append('text')
                .attr('dx',(width/2))
                .attr('dy',75+top_pad)
                .attr('text-anchor','middle')
                .text(legend.ldef.legend_units);
         }

        let legend_title = legend.ldef.title;
        if(legend.ldef.extent && legend.ldef.extent.current) {
            legend_title += `, ${legend.ldef.extent.current.label}`
        }
		svg.append('g').append('text').attr('dx',5)
            .attr('dy',100+top_pad)
			.attr('font-size', '18px')
            .attr('text-anchor','right').text(legend_title);

		svg.append('g').append('text').attr('dx',5)
            .attr('dy',118+top_pad)
			.attr('font-size', '11px')
            .attr('text-anchor','right').text('USA National Phenology Network, www.usanpn.org');
    }
}
