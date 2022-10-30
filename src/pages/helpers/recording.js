import debounce from 'lodash.debounce';
import Recording from '../models/recording';

const RECORDING_KEY = 'recording';

const RecordingHelper = {
    startRecording: (tab) => {
        const recording = new Recording({
            tabId: tab.id,
            events: [{
                type: 'goto',
                value: tab?.url || 'about:blank',
                width: tab.width,
                height: tab.height
            }]
        });
        chrome.storage.local.set({
            [RECORDING_KEY]: recording
        });
    },
    stopRecording: async () => {
        await RecordingHelper.getRecording().then(recording => {
            if (!recording) {
                return;
            }
            recording.setStopRecording();
            chrome.storage.local.set({
                [RECORDING_KEY]: recording
            });
        });
    },
    clearRecording: () => {
        chrome.storage.local.set({ [RECORDING_KEY]: null });
    },
    getRecording: () => {
        return new Promise((resolve) => {
            chrome.storage.local.get([RECORDING_KEY], val => {
                resolve(val[RECORDING_KEY] ? new Recording(val[RECORDING_KEY]) : null);
            });
        });
    },
    toggleOverlay: async () => {
        await RecordingHelper.getRecording().then(recording => {
            if (!recording) {
                return;
            }
            recording.props.overlayExpanded = !recording.props.overlayExpanded;
            chrome.storage.local.set({
                [RECORDING_KEY]: recording
            });
        })
    },
    selectTab: async (tab) => {
        if (!tab) {
            return;
        }

        await RecordingHelper.getRecording().then(recording => {
            if (!recording) {
                return;
            }
            recording.props.selectedTab = tab;
            chrome.storage.local.set({
                [RECORDING_KEY]: recording
            });
        })
    },
    toggleMinimized: async () => {
        await RecordingHelper.getRecording().then(recording => {
            if (!recording) {
                return;
            }
            recording.props.minimized = !recording.props.minimized;
            chrome.storage.local.set({
                [RECORDING_KEY]: recording
            });
        })
    },
    addEvent: debounce(async (event) => {
        //debounce will help dedupe multiple events triggered by a user action
        //real users will not be able to perform multiple actions within 50ms debounce interval, so we capture the first event triggered by a user action
        if (event) {
            event.timestamp = new Date().getTime();

            await RecordingHelper.getRecording().then(recording => {
                if (!recording) {
                    return;
                }

                let events = recording.getEvents();
                let lastEvent;
                if (events.length > 0) {
                    lastEvent = events[events.length - 1];
                }

                //treat continuous user input to the same field as one event
                if (lastEvent?.type === 'input' && event.type === 'input' && lastEvent?.selectors?.[0]?.selector === event.selectors?.[0]?.selector) {
                    lastEvent.value = event.value;
                } else if (lastEvent?.type === 'select' && event.type === 'select' && lastEvent.selectors?.[0]?.selector === event.selectors?.[0]?.selector) {
                    lastEvent.value = event.value;
                } else if (lastEvent?.type === 'navigation' && event.type === 'navigation') {
                    //dedupe multiple nav events fired via history or navoncomplete
                    lastEvent.url = event.url;
                } else if (lastEvent?.type === 'goto' && event.type === 'navigation') {
                    //on launch user navigating to different url, update the goto url value
                    lastEvent.value = event.url;
                } else {
                    recording.events = [...events, event]
                }

                chrome.storage.local.set({
                    [RECORDING_KEY]: recording
                });
            });
        }
    }, 50, {
        'leading': true,
        'trailing': false
    })
}


export default RecordingHelper;