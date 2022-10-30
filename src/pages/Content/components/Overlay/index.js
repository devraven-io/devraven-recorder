import React, { useState, useEffect, Fragment } from 'react';
import { RecordingHelper } from "../../../helpers";
import CodeGenerator from '../../modules/codeGenerator';
import EventTranslator from '../../modules/eventTranslator';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { irBlack } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const Overlay = (props) => {

    const { state, events } = props.recording;

    const codeGenerator = new CodeGenerator();

    const eventTranslator = new EventTranslator();

    const isStopped = () => {
        return state === 'stopped';
    }

    const [expanded, setExpanded] = useState(isStopped() || props.recording.isOverlayExpanded());
    const [minimized, setMinimized] = useState(props.recording.isMinimized());

    const [code, setCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [screenshotAdded, setScreenshotAdded] = useState(false);
    const [tab, setTab] = useState('code');

    const captureScreenshotEvent = e => {
        e.preventDefault();
        RecordingHelper.addEvent({
            type: 'screenshot',
            timestamp: new Date().getTime()
        });
        setScreenshotAdded(true);
        setTimeout(() => {
            setScreenshotAdded(false);
        }, 2000);
    }
    const stopRecording = (e) => {
        e.preventDefault();
        setExpanded(true);
        RecordingHelper.stopRecording();
    }

    const clearRecording = (e) => {
        e.preventDefault();
        RecordingHelper.clearRecording();
    }

    const copyCode = (e) => {
        e.preventDefault();
        window.navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }

    const toggleOverlay = (e) => {
        e.preventDefault();
        RecordingHelper.toggleOverlay();
    }

    const switchTab = (tab) => {
        setTab(tab);
        RecordingHelper.selectTab(tab);
    }

    const toggleMinimized = (e) => {
        e.preventDefault();
        RecordingHelper.toggleMinimized();
    }

    useEffect(() => {
        if (props.recording) {
            setExpanded(isStopped() || props.recording.isOverlayExpanded());
            setCode(() => codeGenerator.process(events));
            setTab(props.recording.selectedTab() || 'code');
            setMinimized(props.recording.isMinimized());
        }
    }, [props.recording]);

    if (!props.recording) {
        return <Fragment />
    }

    return <div id="overlay" className="overlay">
        <div className="title"><span className="blink">{isStopped() ? '✅ Recording Stopped' : '🔴 Recording In Progress'}</span>
            <span className="expand" onClick={toggleMinimized}>
                {minimized ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>}
            </span>
        </div>
        {!minimized && <Fragment>
            {!isStopped() && <Fragment>
                <div className="selector">Selector: {props.selector?.selector || 'None'}</div>
                <div className="last-event">Last captured event: {props.recording?.events?.length > 0 ? eventTranslator.processEvent(props.recording.events.at(-1)) : 'None'}</div>
            </Fragment>}
            <div className="controls">
                <div className="left-section">
                    {!isStopped() && <button className="icon" onClick={captureScreenshotEvent}>
                        <div className="svg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                            </svg>
                        </div>
                        <div className="label">
                            {screenshotAdded ? 'Done!' : 'Screenshot'}
                        </div>
                    </button>}
                    <button disabled={!events} className="icon" role="button" onClick={copyCode}>
                        <div className="svg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                            </svg>
                        </div>
                        <div className="label">
                            {copied ? 'Copied!' : 'Copy Code'}
                        </div>
                    </button>
                    {!isStopped() && <button disabled={!events} className="icon" role="button" onClick={toggleOverlay}>
                        <div className="svg">
                            {expanded ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                            </svg>}
                        </div>
                        <div className="label">
                            {expanded ? 'Collapse' : 'Expand'}
                        </div>
                    </button>}
                </div>
                <div className="right-section">
                    {!isStopped() && <button className="icon" role="button" onClick={stopRecording}>
                        <div className="svg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                            </svg>
                        </div>
                        <div className="label">
                            Stop
                        </div>
                    </button>}
                    {isStopped() && <button className="icon" role="button" onClick={clearRecording}>
                        <div className="svg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="label">
                            Clear
                        </div>
                    </button>}
                </div>
            </div>
            {expanded && events && <Fragment>
                <div className="tabs">
                    <button className={`tab${tab === 'events' ? ' is-active' : ''}`} onClick={() => switchTab('events')}>Show Events</button>
                    <button className={`tab${tab === 'code' ? ' is-active' : ''}`} onClick={() => switchTab('code')}>Show Code</button>
                </div>
                {tab === 'events' && <div className="event-list">
                    {eventTranslator.process(events)}
                </div>}
                {tab === 'code' && <div className="code">
                    <SyntaxHighlighter language="javascript" style={irBlack} wrapLongLines={true}>
                        {code}
                    </SyntaxHighlighter>
                </div>}
            </Fragment>}
        </Fragment>}
    </div>
}

export default Overlay;