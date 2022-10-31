import { RecordingHelper, SelectorHelper } from "../../helpers";

class EventListener {

    contextMenuAt = null;

    constructor() {
        this._clickListener = (evt) => {
            if (!this._isUserTriggeredEvent(evt) || this._isEventFromRecorder(evt.target)) {
                return;
            }
            RecordingHelper.addEvent({
                type: 'click',
                selectors: SelectorHelper.getSelectors(evt.target)
            });
        }

        this._doubleClickListener = (evt) => {
            if (!this._isUserTriggeredEvent(evt) || this._isEventFromRecorder(evt.target)) {
                return;
            }

            RecordingHelper.addEvent({
                type: 'dblclick',
                selectors: SelectorHelper.getSelectors(evt.target)
            });
        }

        this._inputListener = (evt) => {


            if (!this._isUserTriggeredEvent(evt) || this._isEventFromRecorder(evt.target)) {
                return;
            }

            if (['checkbox', 'radiobox'].indexOf(evt.target?.type) > -1) {
                //handle checkbox and radiobox events via click handler and safely ignore them here
                return;
            }


            RecordingHelper.addEvent({
                type: evt.target.nodeName === 'SELECT' ? 'select' : 'input',
                selectors: SelectorHelper.getSelectors(evt.target),
                value: evt.target.nodeName === 'SELECT' ? Array.from(evt.target.selectedOptions).map(option => (option.value || '')) : (evt.target?.value || '')
            });

        }

        this._keypressListener = (evt) => {

            if (!this._isUserTriggeredEvent(evt) || this._isEventFromRecorder(evt.target) || this._shouldIgnoreKeyDown(evt)) {
                return;
            }

            if (['Shift', 'Meta', 'Control', 'Alt'].indexOf(evt.key) > -1) {
                //ignore standalone modification key press events
                return;
            }

            //do not send shift or alt key along with current key.
            RecordingHelper.addEvent({
                type: 'keydown',
                selectors: SelectorHelper.getSelectors(evt.target),
                key: evt.key,
                metaKey: evt.metaKey,
                ctrlKey: evt.ctrlKey
            });
        }

        this._contextMenuListener = (evt) => {
            this.contextMenuAt = { x: evt.clientX, y: evt.clientY };
        }

        this._messageListener = (request) => {
            let selection;
            if (this.contextMenuAt) {
                selection = SelectorHelper.getSelectionAtPoint(this.contextMenuAt.x, this.contextMenuAt.y);
                if (!selection) {
                    console.error(`Unable to determine selected element at ${this.contextMenuAt}. Action not captured.`)
                    return;
                }
            } else {
                console.error(`Unable to determine context menu location. Action not captured!`)
                return;
            }

            if (request === 'record-hover') {
                RecordingHelper.addEvent({
                    type: 'hover',
                    selectors: selection.selectors
                });
            } else if (request === 'wait-for-selector') {
                RecordingHelper.addEvent({
                    type: 'waitforselector',
                    selectors: selection.selectors
                });
            }
        }
    }

    start() {
        window.addEventListener('click', this._clickListener, true);
        window.addEventListener('dblclick', this._doubleClickListener, true);
        window.addEventListener('input', this._inputListener, true);
        window.addEventListener('keydown', this._keypressListener, true);
        window.addEventListener('contextmenu', this._contextMenuListener, true);
        chrome.runtime.onMessage.addListener(this._messageListener);
    }

    stop() {
        window.removeEventListener('click', this._clickListener, true);
        window.removeEventListener('dblclick', this._doubleClickListener, true);
        window.removeEventListener('input', this._inputListener, true);
        window.removeEventListener('keydown', this._keypressListener, true);
        window.removeEventListener('contextmenu', this._contextMenuListener, true);
        chrome.runtime.onMessage.removeListener(this._messageListener);
    }


    _isEventFromRecorder(element) {
        return document.getElementById('__dr-recorder').contains(element);
    }

    _shouldIgnoreKeyDown(evt) {
        if (evt.repeat) {
            return true;
        }

        if (['INPUT', 'TEXTAREA', 'SELECT'].indexOf(evt.target?.nodeName) > -1) {
            //event is on an input field - any value change will be captured by inputListener
            //ignore capturing all events on input fields except Tab, Shift Tab or Enter events
            //ESC is required for closing modal dialogs
            if (['Tab', 'Escape', 'Enter'].indexOf(evt.key) > -1) {
                return false;
            }
            return true;
        }
        return false;
    }

    _isUserTriggeredEvent(evt) {
        return evt.isTrusted;
    }


}

export default EventListener;