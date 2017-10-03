import {EventEmitter} from '@angular/core';

export const NULL_DATA = -9999;
export const ONE_DAY_MILLIS:number = (24*60*60*1000);

export const enum VisSelectionEvent {
    RESET, // go back to a "clean" slate
    REDRAW, // assuming you have data simply re-draw with that data
    UPDATE, // go get new data and reset/redraw
    RESIZE, // short cut for reset/redraw
}

/**
 * Base class for visualization selection (user input).  A VisSelection is attached
 * to a specific visualization and the selection itself sends events to the visualization
 * to tell it when meaningful changes have happened and it should reset/redraw or update.
 *
 * The utility methods reset/redraw/update send instructions to the visualization.  These
 * functions can be called at any time, even before the selection has been wired to its
 * visualization.  Events will be held onto and delivered if/when the visualization has
 * subscribed.
 */
export abstract class VisSelection extends EventEmitter<VisSelectionEvent> {
    debug:boolean = false;
    working:boolean = false;

    private firstSubscriberResolver:any;
    private firstSubscriber:Promise<any> = new Promise<any>((resolve) => {
        this.firstSubscriberResolver = resolve;
    });

    get json() {
        return {};
    }

    /**
     * Instruct the visualization to go back to a "clean" slate
     */
    reset(): void {
        this.emit(VisSelectionEvent.RESET);
    }

    /**
     * Instruct the visualization to redraw itself using the data it already
     * has and the current state of the selection.
     */
    redraw(): void {
        this.emit(VisSelectionEvent.REDRAW);
    }

    /**
     * Instruct the visualization to go get new data and reset/redraw itself.
     */
    update(): void {
        this.emit(VisSelectionEvent.UPDATE);
    }

    /**
     * Instruct the visualization to resize itself.
     */
    resize(): void {
        this.emit(VisSelectionEvent.RESIZE);
    }

    // make sure no events go out until there is at least one subscriber to receive them.
    emit(value?: VisSelectionEvent) {
        var self = this, emitArgs = arguments;
        this.firstSubscriber.then(() => {
            super.emit.apply(self,emitArgs);
        });
    }

    subscribe(generatorOrNext?: any, error?: any, complete?: any): any {
        // resolve the above promise..
        this.firstSubscriberResolver();
        return super.subscribe.apply(this,arguments);
    }
}
