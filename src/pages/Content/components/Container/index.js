import React, { Fragment, useEffect, useState, } from "react";
import Overlay from '../Overlay';
import Highlighter from '../Highlighter';
import throttle from 'lodash.throttle';
import { SelectorHelper, RecordingHelper } from "../../../helpers";
import Recording from "../../../models/recording";

const Container = () => {
    let isMounted = true;

    const [recording, setRecording] = useState(null);
    const [highlighterBoundary, setHighlighterBoundary] = useState(null);
    const [bestSelector, setBestSelector] = useState(null);

    const mouseEventListener = throttle((e) => {
        if (!isMounted) {
            return;
        }
        const selection = SelectorHelper.getSelectionAtPoint(e.clientX, e.clientY);
        if (selection) {
            if (selection.selectors && selection.selectors.length > 0) {
                setBestSelector(selection.selectors[0]);
            }
            setHighlighterBoundary(() => selection.boundary);
        } else {
            setBestSelector(null);
            setHighlighterBoundary(null);
        }
    }, 250);

    useEffect(() => {
        RecordingHelper.getRecording().then(recording => {
            setRecording(recording);
        });

        window.addEventListener('mousemove', mouseEventListener);

        chrome.storage.onChanged.addListener(storageListener);


        return () => {
            isMounted = false;
            window.removeEventListener('mousemove', mouseEventListener);
            chrome.storage.onChanged.removeListener(storageListener);
        }
    }, []);

    const storageListener = (changes) => {
        if (!isMounted) {
            return;
        }
        setRecording(() => changes.recording?.newValue ? new Recording(changes.recording?.newValue) : null);
    }

    if (!recording) {
        return <Fragment />
    }


    return <div id="container" className="container">
        {recording.isRecording() && <Highlighter highlighterBoundary={highlighterBoundary} />}
        <Overlay selector={recording.isRecording() ? bestSelector : null} recording={recording} />
    </div>
}

export default Container;