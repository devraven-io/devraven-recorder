import React from 'react';
import { createRoot } from 'react-dom/client';
import Container from './components/Container';
import EventListener from './modules/eventListener';
import ContentStyles from './content.styles.scss';

const HOST_ID = '__dr-recorder';
const TARGET_ID = '__dr-target';
const eventListener = new EventListener();

let host = document.getElementById(HOST_ID);
let shadow;
if (!host) {
    //setup the shadowroot to render the container
    const hostElement = document.createElement('div');
    hostElement.setAttribute('id', HOST_ID);
    host = document.body.appendChild(hostElement);
    shadow = host.attachShadow({ mode: 'open' });
    const styleTag = document.createElement('style');
    styleTag.innerHTML = ContentStyles;
    host.shadowRoot.appendChild(styleTag);
    const target = document.createElement('div');
    target.setAttribute('id', TARGET_ID);
    host.shadowRoot.appendChild(target);
}

const container = host.shadowRoot.getElementById(TARGET_ID)
const root = createRoot(container);
eventListener.start();
root.render(<Container />);

const storageListener = (changes) => {
    if (changes.recording?.newValue?.state === 'stopped') {
        eventListener.stop();
    }

    if (!changes.recording?.newValue) {
        root.unmount();
        chrome.storage.onChanged.removeListener(storageListener);
    }
}
//setup a listener for stop/clear events to unmount the container
chrome.storage.onChanged.addListener(storageListener);