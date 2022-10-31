import { RecordingHelper } from '../helpers';
import ContextMenuLoader from './contextMenuLoader';

const menu = {
    PARENT: 'dr-recorder',
    RECORD_HOVER: 'dr-hover-action',
    WAIT_FOR_SELECTOR: 'dr-wait-for-selector'
}

function navListener(details) {

    if (details?.parentFrameId !== -1) {
        return;
    }

    RecordingHelper.addNavEvent({
        type: 'navigation',
        url: details?.url
    });
}

function fullPageNavListener(navDetails) {
    if (navDetails?.parentFrameId !== -1) {
        return;
    }

    RecordingHelper.getRecording().then(recording => {
        if (recording?.tabId && recording?.tabId === navDetails.tabId) {
            RecordingHelper.addEvent({
                type: 'navigation',
                url: navDetails?.url
            });
        }
    });
}


function storageListener(changes) {
    //recording stopped or cleared, remove context menu and remove listeners
    if (!changes.recording?.newValue || changes.recording?.newValue?.state === 'stopped') {
        ContextMenuLoader.clearContextMenu();
        chrome.webNavigation.onHistoryStateUpdated.removeListener(navListener);

        //url hash change events
        chrome.webNavigation.onReferenceFragmentUpdated.removeListener(navListener);

        //full page navigation
        chrome.webNavigation.onCompleted.removeListener(fullPageNavListener);
    } else {
        //when the recording starts, setup the context menu and add listeners
        ContextMenuLoader.setupContextMenu(menu);
        //SPA navigations
        chrome.webNavigation.onHistoryStateUpdated.addListener(navListener);

        //url hash change events
        chrome.webNavigation.onReferenceFragmentUpdated.addListener(navListener);

        //full page navigation
        chrome.webNavigation.onCompleted.addListener(fullPageNavListener);
    }
}

function contextMenuListener(info, tab) {
    if (!tab) { //tab is optional per doc
        return;
    }
    RecordingHelper.getRecording().then(recording => {
        if (recording?.tabId === tab.id) {
            if (info.menuItemId === menu.RECORD_HOVER) {
                chrome.tabs.sendMessage(tab.id, "record-hover");
            } else if (info.menuItemId === menu.WAIT_FOR_SELECTOR) {
                chrome.tabs.sendMessage(tab.id, "wait-for-selector");
            }
        }
    });
}

//handles page refreshes or full page navigations when a recording is in progress
//check if the tab currently being recorded is refreshed and relaunch the recorder
chrome.webNavigation.onCompleted.addListener(async (navDetails) => {
    //load only on top frame
    if (navDetails.parentFrameId === -1) {
        await RecordingHelper.getRecording().then(recording => {
            if (recording?.tabId && recording?.tabId === navDetails.tabId) {
                const file = "contentScript.bundle.js";
                chrome.scripting.executeScript({
                    target: { tabId: navDetails.tabId, allFrames: false },
                    files: [file],
                });
            }
        });
    }
});

chrome.storage.onChanged.addListener(storageListener);
chrome.contextMenus.onClicked.addListener(contextMenuListener);




