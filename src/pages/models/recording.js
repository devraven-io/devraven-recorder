const RecordingStates = {
    STARTED: 'started',
    STOPPED: 'stopped'
}

class Recording {
    constructor(data) {
        if (data) {
            this.tabId = data.tabId;
            this.state = data.state || RecordingStates.STARTED
            this.events = [...data.events];
            this.props = data.props || {};
        }
    }

    getEvents() {
        return this.events;
    }

    isRecording() {
        return this.state === RecordingStates.STARTED;
    }

    isStopped() {
        return this.state === RecordingStates.STOPPED;
    }

    isOverlayExpanded() {
        return !!this.props.overlayExpanded;
    }
    setStopRecording() {
        this.state = RecordingStates.STOPPED;
    }

    selectedTab() {
        return this.props.selectedTab;
    }

    isMinimized() {
        return !!this.props.minimized;
    }
}

export default Recording;