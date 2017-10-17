import {Component,Input} from '@angular/core';

import {VisSelection,VisSelectionEvent} from './vis-selection';
import {VisualizationBaseComponent,VisualizationSizing,VisualizationMargins} from './visualization-base.component';

import {Selection} from 'd3-selection';
import * as d3 from 'd3';

export const DEFAULT_MARGINS:VisualizationMargins = {top: 20, right: 30, bottom: 60, left: 40};
export const FONT_SIZE:number = 14;
export const FONT_SIZE_PX:string = FONT_SIZE+'px';

@Component({
  selector: 'svg-visualization-base',
  templateUrl: './svg-visualization-base.component.html',
  styleUrls: ['./svg-visualization-base.component.scss']
})
export abstract class SvgVisualizationBaseComponent extends VisualizationBaseComponent {
    record: any;

    disclaimer: string;

    filename:string = 'visualization.png';

    // wrapping element
    visRoot: Selection<any,any,any,any>;
    // svg element
    svg: Selection<any,any,any,any>;
    // base g element that the chart draws on
    chart: Selection<any,any,any,any>;

    margins: VisualizationMargins = DEFAULT_MARGINS;

    protected minWidth:number = 700;
    thumbnailSrc:any;

    baseFontSize(withPx?:boolean): number | string {
        let fs = FONT_SIZE;
        if(this.sizing) {
            if(this.sizing.width < 650) {
                fs -=2;
            }
            if(this.sizing.width < 400) {
                fs -= 2;
            }
        }
        return withPx ? `${fs}px` : fs;
    }

    /**
     * sub-classes should call after they have redrawn the visualization to get any
     * common styling updates applied.
     */
    protected commonUpdates(): void {
        let chart = this.chart,
            fontSizePx = this.baseFontSize(true);

        ['.axis path','.axis line'].forEach(selector =>
            chart.selectAll(selector).style('fill','none')
                .style('stroke','#000')
                .style('shape-rendering','crispEdges'));

        chart.selectAll('text')
            .style('font-family','Arial');
        chart.selectAll('g .axis text')
            .style('font-size',fontSizePx);
    }

    /**
     * `reset` is intended to initialize a visualziation to it's known "clean" state
     * placing all common elements, etc.  Subclasses will almost certainly over-ride
     * this implementation and call it to get the ball rolling.
     *
     * No asynchronous work should be done here, fetching data, etc. should happen
     * only within `update`.
     */
    protected reset(): void {
        let sizing = this.getSizeInfo(),
            svg = this.svg;
        // remove all children
        svg.selectAll('*').remove();
        // set size
        svg.attr('width', sizing.width + sizing.margin.left + sizing.margin.right)
            .attr('height', sizing.height + sizing.margin.top + sizing.margin.bottom);
        svg.append('g')
            .attr('class','vis-background')
            .append('rect')
            .attr('width','100%')
            .attr('height','100%')
            .attr('fill','#fff');
        this.chart = svg.append('g')
            .attr('transform',`translate(${sizing.margin.left},${sizing.margin.top})`)
            .attr('class','vis-chart');

        svg.append('g')
            .attr('transform',`translate(10,${sizing.height+sizing.margin.top+sizing.margin.bottom-10})`)
            .append('text')
			.attr('font-size', '11px')
			.attr('font-style','italic')
			.attr('text-anchor','right').text('USA National Phenology Network, www.usanpn.org');
    }

    protected resize(): void {
        this.reset();
        this.redraw();
    }

    getSizeInfo(minWidth?:number): VisualizationSizing {
        return super.getSizeInfo(this.minWidth);
    }

    /**
     * IMPORTANT:
     * Sub-classes should implement the redrawSvg and not over-ride redraw.
     * If redraw is over-ridden the implementation  will lose the ability to
     * dynamically replace themselves with a thumbnail should the screen
     * realestate for the visualization get too small.
     */
    protected redraw(): void {
        this.redrawSvg();
        let sizeInfo = this.sizing,
            w = sizeInfo.width + sizeInfo.margin.left + sizeInfo.margin.right;
        if(w === this.minWidth) {
            let native = this.rootElement.nativeElement as HTMLElement,
                svg = native.querySelector('svg.svg-visualization') as SVGElement,
                wrappedSvg = d3.select(svg),
                canvas = native.querySelector('canvas.thumbnail-canvas') as HTMLCanvasElement,
                img = native.querySelector('img.thumbnail-image') as HTMLImageElement,
                wrappedImg = d3.select(img),
                h = sizeInfo.height + sizeInfo.margin.top + sizeInfo.margin.bottom;
            console.debug('SvgVisualizationBaseComponent: minWidth hit, replacing with generated thumbnail image.');
            wrappedSvg.attr('version',1.1)
                .attr('xmlns', 'http://www.w3.org/2000/svg');
            let svgParent = svg.parentNode as HTMLElement,
                html = svgParent.innerHTML;
            canvas.width = +wrappedSvg.attr('width');
            canvas.height = +wrappedSvg.attr('height');
            wrappedImg.attr('width',sizeInfo.scaledWidth);
            let context = canvas.getContext('2d'),
                image = new Image();
            image.onload = () => {
                context.drawImage(image,0,0);
                this.thumbnailSrc = img.src = canvas.toDataURL('image/png');
            };
            image.src = 'data:image/svg+xml;base64,'+ window.btoa(html);
        } else {
            this.thumbnailSrc = undefined;
        }
    }

    /**
     * SVG replacement for the redraw function.
     */
    protected abstract redrawSvg(): void;

    ngAfterViewInit() {
        this.visRoot = d3.select('#'+this.id);
        this.svg = this.visRoot.select('svg');
        // sets up common handlers
        super.ngAfterViewInit();
    }

}
