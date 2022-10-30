import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './Popup';
import PopupStyles from './index.scss';

const styleTag = document.createElement('style');
styleTag.innerHTML = PopupStyles;
document.body.appendChild(styleTag);

const container = document.getElementById('app-container');
const root = createRoot(container);

root.render(<Popup />);