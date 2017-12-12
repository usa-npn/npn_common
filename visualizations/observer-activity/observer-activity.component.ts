import {Component, Input} from '@angular/core';

import {Window} from '../../common';
import {VisualizationMargins} from '../visualization-base.component';
import {SvgVisualizationBaseComponent,DEFAULT_MARGINS,FONT_SIZE,FONT_SIZE_PX} from '../svg-visualization-base.component';

import {ObserverActivitySelection} from './observer-activity-selection';

import {Axis,axisBottom,axisLeft} from 'd3-axis';
import {Selection} from 'd3-selection';
import {ScaleBand,scaleBand,ScaleLinear,scaleLinear,ScaleOrdinal,scaleOrdinal} from 'd3-scale';
import * as d3 from 'd3';

const TITLE = 'New/Active Observers';

@Component({
  selector: 'observer-activity',
  templateUrl: '../svg-visualization-base.component.html',
  styleUrls: ['../svg-visualization-base.component.scss'],
})
export class ObserverActivityComponent extends SvgVisualizationBaseComponent {
    @Input()
    selection:ObserverActivitySelection;

    legend: Selection<any,any,any,any>;
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
    zDarker : ScaleOrdinal<string,string> = scaleOrdinal<string,string>()
        .domain(this.keys)
        .range(this.z.range().map(c => {
            return d3.color(c).darker().toString();
        }));

    filename:string = 'observer-activity.png';
    margins: VisualizationMargins = {...DEFAULT_MARGINS, ...{top: 100,left: 80}};

    data:any;

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
        let legend = this.legend = chart.append('g')
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
            .padding(0.05)
            .domain(d3.range(0,12));
        this.xAxis = axisBottom<number>(this.x).tickFormat((i) => d3_month_fmt(new Date(1900,i)));
        chart.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + sizing.height + ')')
            .call(this.xAxis);

        this.y = scaleLinear().range([sizing.height,0]).domain([0,20]); // just a default domain
        this.yAxis = axisLeft<number>(this.y);
        chart.append('g')
            .attr('class', 'y axis')
            .call(this.yAxis).tickFormat(d3.format('.0'))
          .append('text')
          .attr('fill','#000') // somehow parent g has fill="none"
          .attr('transform', 'rotate(-90)')
          .attr('y', '0')
          .attr('dy','-3em')
          .attr('x',-1*(sizing.height/2)) // looks odd but to move in the Y we need to change X because of transform
          .style('text-anchor', 'middle')
          .text('New/Active Observers');
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
        this.title.text(`${TITLE}, ${this.data.network_name}, ${this.selection.year}`);
        console.debug('ObserverActivityComponent:data',this.data);
        let sizing = this.sizing,
            data = this.data.months.slice(),
            chart = this.chart,
            new_sum = data.reduce((sum,d) => sum+d.number_new_observers,0),
            active_sum = data.reduce((sum,d) => sum+d.number_active_observers,0),
            max = data.reduce((max,d) => {
                if(d.number_new_observers > max) {
                    max = d.number_new_observers;
                }
                if(d.number_active_observers > max) {
                    max = d.number_active_observers;
                }
                return max;
            },0);
        console.debug(`ObserverActivityComponent:vis data (max=${max})`,data);

        // update x axis with months+total
        this.x.domain(d3.range(0,data.length));
        this.chart.selectAll('g .x.axis').call(this.xAxis);

        // update y axis, domain is 0 to max of sum of the two keys
        // largest will always be the total column
        this.y.domain([0,max]);
        this.chart.selectAll('g .y.axis').call(this.yAxis);

        let bars = (key,idx) => {
            let barWidth = this.x.bandwidth()/2;
            this.chart.selectAll(`g .bars.${key}`).remove();
            this.chart.append('g')
                .attr('class', `bars ${key}`)
                .attr('fill', d => this.z(key))
                .selectAll('rect')
                .data(data)
                .enter().append('rect')
                .attr('x', (d,i) => this.x(i)+(barWidth*idx))
                .attr('y', d => this.y(d[key]))
                .attr('title', d => `${d[key]}`)
                .attr('height',d => sizing.height - this.y(d[key]))
                .attr('width',barWidth);

            this.chart.selectAll(`g .bar-labels.${key}`).remove();
            this.chart.append('g')
                .attr('class', `bar-labels ${key}`)
                .attr('fill', d => this.z(key))
                .selectAll('text')
                .data(data)
                .enter().append('text')
                .attr('text-anchor','middle')
                .attr('dy','-0.25em')
                .attr('x',(d,i) => this.x(i)+(barWidth*idx)+(barWidth/2))
                .attr('y',(d) => this.y(d[key]))
                .text(d => `${d[key]}`);
        };
        this.keys.forEach((k,i) => bars(k,i));

        this.legend.selectAll('text')
            .each((function(nSum,aSum,labels){
                return function(d,i) {
                    let t = d3.select(this),
                        n = d === labels[0] ? nSum : aSum;
                    t.text(`${d} [Total: ${n}]`);
                };
            })(new_sum,active_sum,this.keyLabels));
        this.commonUpdates();
    }
}
