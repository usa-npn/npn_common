import {Component, Input, ElementRef} from '@angular/core';

import {Window} from '../../common';
import {VisualizationMargins} from '../visualization-base.component';
import {SvgVisualizationBaseComponent,DEFAULT_MARGINS,FONT_SIZE,FONT_SIZE_PX} from '../svg-visualization-base.component';

import {ObserverActivitySelection} from './observer-activity-selection';

import {Axis,axisBottom,axisLeft} from 'd3-axis';
import {Selection} from 'd3-selection';
import {ScaleBand,scaleBand,ScaleLinear,scaleLinear,ScaleOrdinal,scaleOrdinal} from 'd3-scale';
import * as d3 from 'd3';

const TITLE = 'New/Active Observers by Month';

@Component({
  selector: 'observer-activity',
  templateUrl: '../svg-visualization-base.component.html',
  styleUrls: ['../svg-visualization-base.component.scss'],
})
export class ObserverActivityComponent extends SvgVisualizationBaseComponent {
    @Input()
    selection:ObserverActivitySelection;

    title: Selection<any,any,any,any>;

    x: ScaleBand<number>;
    xAxis: Axis<number>;

    y: ScaleLinear<number,number>;
    yAxis: Axis<number>;

    keyLabels:string[] = ['New observers','Active observers'];
    keys:string[] = ['number_new_observers','number_active_observers'];
    z: ScaleOrdinal<string,string> = scaleOrdinal<string,string>()
        .domain(this.keys)
        .range(["#98abc5", "#d0743c"]);

    filename:string = 'observer-activity.png';
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
        let legend = chart.append('g')
            .attr('class','legend')
            .attr('transform','translate(0,-'+(sizing.margin.top-10)+')')
            .attr('text-anchor','start')
            .style('font-size',fontSize)
            .selectAll('g')
            .data(this.keyLabels)
            .enter().append('g')
            .attr('transform',(d,i) => `translate(0,${i*22+24})`);
        legend.append('rect')
            .attr('x',0)
            .attr('width',20)
            .attr('height',20)
            .attr('fill',this.z);
        legend.append('text')
            .attr('x',24)
            .attr('y',fontSize-0.5)
            .attr('dy','0.32em')
            .text(d => d);

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
        chart.append('g')
            .attr('class', 'y axis')
            .call(this.yAxis)
          .append('text')
          .attr('fill','#000') // somehow parent g has fill="none"
          .attr('transform', 'rotate(-90)')
          .attr('y', '0')
          .attr('dy','-3em')
          .attr('x',-1*(sizing.height/2)) // looks odd but to move in the Y we need to change X because of transform
          .style('text-anchor', 'middle')
          .text(TITLE);
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
            chart = this.chart,
            new_sum = data.reduce((sum,d) => sum+d.number_new_observers,0),
            active_sum = data.reduce((sum,d) => sum+d.number_active_observers,0);
        // add a new record at the end that is the sum
        data.push({
            number_new_observers: new_sum,
            number_active_observers: active_sum
        })
        console.log('VIS DATA',data);
        console.log('STACKED',d3.stack().keys(this.keys)(data));

        // update x axis with months+total
        this.x.domain(d3.range(0,data.length));
        this.chart.selectAll('g .x.axis').call(this.xAxis);

        // update y axis, domain is 0 to max of sum of the two keys
        // largest will always be the total column
        this.y.domain([0,(new_sum+active_sum)]);
        this.chart.selectAll('g .y.axis').call(this.yAxis);

        this.chart.selectAll('g .bars').remove();
        this.chart.append('g')
            .attr('class','bars')
            .selectAll('g')
            .data(d3.stack().keys(this.keys)(data))
        .enter().append('g')
          .attr('fill', d => this.z(d.key))
        .selectAll('rect')
        .data(d => d as any[])
            .enter().append('rect')
              .attr('x', (d,i) => this.x(i))
              .attr('y', d => this.y(d[1]))
              .attr('title', d => `${d[1]}`)
              .attr('height',d => this.y(d[0]) - this.y(d[1]))
              .attr('width',this.x.bandwidth());
        this.commonUpdates();
    }
}
