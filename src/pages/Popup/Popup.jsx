import React from 'react';
import logo from '../../assets/img/logo.svg';
import { useState, useEffect } from 'react';
import { RecordingHelper } from '../helpers';

const Popup = () => {
    const [loading, setLoading] = useState(true);
    const [recording, setRecording] = useState(false);

    useEffect(() => {
        RecordingHelper.getRecording().then(recording => {
            setRecording(recording);
            setLoading(false);
        });
    }, [])

    const toggleRecorder = async () => {
        if (recording) {
            if (recording.isStopped()) {
                RecordingHelper.clearRecording();
            } else {
                await RecordingHelper.stopRecording();
            }
            window.close();
        } else {
            const file = "contentScript.bundle.js";
            //start recording, launch content on current tab
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                const curTab = tabs[0];
                RecordingHelper.startRecording(curTab);
                chrome.scripting.executeScript({
                    target: { tabId: curTab.id, allFrames: false },
                    files: [file],
                });
                window.close();
            });
        }
    }

    return (
        <div className="app">
            <header className="app-header">
                <a href="https://www.devraven.io" target="_blank"><img src={logo} className="app-logo" alt="logo" /></a>
            </header>
            <div className="app-body">
                {!loading &&
                    <button className="action-button" onClick={toggleRecorder}>
                        <div className="action-icon">
                            {recording ? (recording.isStopped() ? <svg xmlns="http://www.w3.org/2000/svg" fill="#efefef" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="#efefef" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                            </svg>)
                                : <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>}
                        </div>
                        <div className="action-label">{recording ? (recording.isStopped() ? 'Clear Recording' : 'Stop Recording') : 'Start Recording'}</div>
                    </button>
                }
            </div>
        </div>
    );
};

export default Popup;
