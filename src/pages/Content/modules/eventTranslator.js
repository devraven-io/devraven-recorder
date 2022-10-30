import React from "react";

class EventTranslator {
    constructor() { }

    process(events) {
        return events.map(event => {
            return <div key={event.timestamp} className="event-row">{this.processEvent(event)}</div>;
        })
    }

    processEvent(event) {
        if (event.type === 'goto') {
            return <span>Launch browser and go to <b>{event.value}</b></span>
        } else if (event.type === 'click') {
            return <span>Click on <b>{event.selectors?.[0].selector}</b></span>
        } else if (event.type === 'dblclick') {
            return <span>Double click on <b>{event.selectors?.[0].selector}</b></span>
        } else if (event.type === 'input') {
            return <span>Fill input on <b>{event.selectors?.[0].selector}</b></span>
        } else if (event.type === 'keydown') {
            return <span>Press key on <b>{event.selectors?.[0].selector}</b></span>
        } else if (event.type === 'select') {
            return <span>Select value on <b>{event.selectors?.[0].selector}</b></span>
        } else if (event.type === 'screenshot') {
            return <span>Capture Screenshot</span>
        } else if (event.type === 'hover') {
            return <span>Hover on <b>{event.selectors?.[0].selector}</b></span>
        } else if (event.type === 'waitforselector') {
            return <span>Wait for selector <b>{event.selectors?.[0].selector}</b></span>
        } else if (event.type === 'navigation') {
            return <span>Wait for navigation to <b>{event.url}</b></span>
        } else {
            return <span>None</span>
        }
    }
}

export default EventTranslator;