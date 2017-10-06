import {EventEmitter} from '@angular/core';

export const NULL_DATA = -9999;
export const ONE_DAY_MILLIS:number = (24*60*60*1000);

export const enum VisSelectionEvent {
    RESET, // go back to a "clean" slate
    REDRAW, // assuming you have data simply re-draw with that data
    UPDATE, // go get new data and reset/redraw
    RESIZE, // short cut for reset/redraw
}

/*
 * A VisSelection is a jumble of properties and methods, not all of which should be serialized
 * and deserialized when [re]storing a selection to/from JSON.  In standard JavaScript this
 * could probably be dealt with cleanly via Object.defineProperty (and a big constructor) but
 * with TypeScript it's significantly more complicated.  For this reason all properties that
 * are part of what should be serialized for a given selection MUST be annotated with @selectionProperty()
 *
 * The virtual `external` property on a selection will produce a plain object representation
 * for a selection.  Assigning an object to the `external` property will deserialize it onto
 * the selection object.
 */
import 'reflect-metadata';
const selectionPropertyMetadataKey = Symbol('npnSelectionProperty');
const IDENTITY = d => d;
/**
 * Defines a property handler for a selection property.
 */
export class SelectionPropertyHandler {
    /**
     * A function that is used to serialize a property object.
     * Takes as input an object and returns an object.
     * Defaults to object identity.
     */
    ser?: Function;
    /**
     * A function that is used to serialize a property object.
     * Takes as input an object and returns an object.
     * Defaults to object identity.
     */
    des?: Function;
}
/**
 * Property decorator to indicate which properties of a selection should
 * be part of the external form of the selection.
 * E.g.
 * <pre>
 *   @selectionProperty()
 *   private s:string;
 *   @selectionProperty({des: d => new Date(d)})
 *   private date:Date;
 *   @selectionProperty({
 *     des: d => {
 *       let o = new MyClass();
 *       ... copy properties for d to o ...
 *       return o;
 *     },
 *     ser: d => d
 *   })
 *   private o:MyClass;
 * </pre>
 */
export const selectionProperty = (handler?:SelectionPropertyHandler) => {
    let the_handler = {
        ...{des: IDENTITY,ser:IDENTITY},
        ...(handler||{})
    };
    return Reflect.metadata(selectionPropertyMetadataKey,the_handler);
};
const isSelectionProperty = (target:any, propertyKey: string) => {
    return Reflect.getMetadata(selectionPropertyMetadataKey,target,propertyKey);
};
// these are exported functions so that other classes can use similar
// s11n/des11n functionality.
export function GET_EXTERNAL() {
    let ext = {
        $class: this.constructor.name
    };
    Object.keys(this).forEach(key => {
        let handler = isSelectionProperty(this,key);
        if(handler) {
            let v = this[key];
            if(Array.isArray(v)) {
                ext[key] = v.map(d => handler.ser(d));
            } else {
                ext[key] = handler.ser(v);
            }
        }
    });
    return ext;
};
export function SET_EXTERNAL(o) {
    Object.keys(o).forEach(key => {
        let handler = isSelectionProperty(this,key);
        if(handler) {
            let v = o[key];
            if(typeof(v) !== 'undefined') {
                if(Array.isArray(v)) {
                    this[key] = v.map(d => handler.des(d));
                } else {
                    this[key] = handler.des(v);
                }
            } else {
                this[key] = undefined;
            }
        }
    });
};

/**
 * Base class for visualization selection (user input).  A VisSelection is attached
 * to a specific visualization and the selection itself sends events to the visualization
 * to tell it when meaningful changes have happened and it should reset/redraw or update.
 *
 * The utility methods reset/redraw/update send instructions to the visualization.  These
 * functions can be called at any time, even before the selection has been wired to its
 * visualization.  Events will be held onto and delivered if/when the visualization has
 * subscribed.
 *
 * Note: EventEmitter does not have an unsubscribe (though it, today, extends RxJs Subject)
 * so technically does.  Should perhaps consider not extending Angular's EventEmitter
 */
export abstract class VisSelection extends EventEmitter<VisSelectionEvent> {
    debug:boolean = false;
    working:boolean = false;

    private firstSubscriberResolver:any;
    private firstSubscriber:Promise<any> = new Promise<any>((resolve) => {
        this.firstSubscriberResolver = resolve;
    });

    get external() { return GET_EXTERNAL.apply(this,arguments); }
    set external(o) { SET_EXTERNAL.apply(this,arguments); }

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

export interface NetworkAwareVisSelection {
    networkIds:any[];
}
export interface StationAwareVisSelection {
    stationIds:any[];
}
