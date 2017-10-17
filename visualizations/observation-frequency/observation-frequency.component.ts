import {Component, Input, ElementRef} from '@angular/core';

import {Window} from '../../common';
import {VisualizationMargins} from '../visualization-base.component';
import {SvgVisualizationBaseComponent,DEFAULT_MARGINS,FONT_SIZE,FONT_SIZE_PX} from '../svg-visualization-base.component';

import {ObservationFrequencySelection} from './observation-frequency-selection';

import {Axis,axisBottom,axisLeft} from 'd3-axis';
import {Selection} from 'd3-selection';
import {ScaleBand,scaleBand,ScaleLinear,scaleLinear,ScaleOrdinal,scaleOrdinal} from 'd3-scale';
import * as d3 from 'd3';

const TITLE = 'Site visits by month';

@Component({
  selector: 'observation-frequency',
  templateUrl: '../svg-visualization-base.component.html',
  styleUrls: ['../svg-visualization-base.component.scss'],
})
export class ObservationFrequencyComponent extends SvgVisualizationBaseComponent {
    @Input()
    selection:ObservationFrequencySelection;

    title: Selection<any,any,any,any>;

    x: ScaleBand<number>;
    xAxis: Axis<number>;

    y: ScaleLinear<number,number>;
    yAxis: Axis<number>;

    filename:string = 'observation-frequency.png';
    margins: VisualizationMargins = {...DEFAULT_MARGINS, ...{top: 100,left: 80}};

    data:any;

    constructor(protected window: Window,protected rootElement: ElementRef) {
        super(window,rootElement);
    }

    private getMonthFormat(): string {
        if(this.sizing && this.sizing.width < 800) {
            return '%b';
        }
        return '%B';
    }

    protected reset(): void {
        super.reset();
        let chart = this.chart,
            sizing = this.sizing,
            d3_month_fmt = d3.timeFormat(this.getMonthFormat()),
            fontSize:number = this.baseFontSize() as number;
        this.title =  chart.append('g')
                     .attr('class','chart-title')
                     .append('text')
                     .attr('y', '0')
                     .attr('dy','-4.2em')
                     .attr('x', '0')
                     .style('text-anchor','start')
                     .style('font-size','18px');

        this.x = scaleBand<number>()
            .rangeRound([0,sizing.width])
            .paddingInner(0.05)
            .align(0.1)
            .domain(d3.range(0,13)); // default domain to 12 months + total
        this.xAxis = axisBottom<number>(this.x).tickFormat((i) => {
            let domain = this.x.domain(),
                label = i === domain[domain.length-1] ?
                    'Total' :
                    d3_month_fmt(new Date(1900,i));
            return label;
        });
        chart.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + sizing.height + ')')
            .call(this.xAxis);

        this.y = scaleLinear().range([sizing.height,0]).domain([0,20]); // just a default domain
        this.yAxis = axisLeft<number>(this.y);

        this.commonUpdates();
    }

    protected update(): void {
        this.reset();
        this.selection.getData()
            .then(data => {
                this.data = data;
                this.redraw();
            })
            .catch(this.handleError);
    }

    protected redrawSvg(): void {
        if(!this.data) {
            return;
        }
        this.title.text(`${TITLE}, "TODO: Refuge Name", ${this.selection.year}`);

        console.log('DATA',this.data);
        let data = this.data.months.slice(),
            chart = this.chart;
        // add a new record at the end that is the sum
        data.push({})
        console.log('VIS DATA',data);

        // update x axis with months+total
        this.x.domain(d3.range(0,data.length));
        this.chart.selectAll('g .x.axis').call(this.xAxis);

        this.commonUpdates();
    }
}
