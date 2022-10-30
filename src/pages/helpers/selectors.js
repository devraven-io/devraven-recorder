import { getCssSelector } from 'css-selector-generator';

const _processAttributes = (element, attributes, type = 'css') => {

    for (const attr of attributes) {
        const val = element.getAttribute(attr);
        if (val) {
            return {
                selector: `[${attr}=${JSON.stringify(val)}]`,
                type
            }
        }
    }
    return null;
}
const _getTestSelectors = (element) => {
    const testIdAttributes = ['data-testid', 'data-test-id', 'data-test', 'data-automationid'];
    return _processAttributes(element, testIdAttributes, 'css');
}

const _getIdSelector = (element) => {
    const attributes = ['id'];
    return _processAttributes(element, attributes, 'css');
}

const _getAriaSelectors = (element) => {
    const attributes = ['aria-label', 'aria-description', 'aria-describedby'];
    return _processAttributes(element, attributes, 'css');
}

const getSelectors = (element) => {
    const selectors = [];
    //check test-id attributes first
    let testSelector = _getTestSelectors(element);
    if (testSelector) {
        selectors.push(testSelector);
    }

    //check for id selector
    const idSelector = _getIdSelector(element)
    if (idSelector) {
        selectors.push(idSelector)
    }

    //getCssSelectors returns unique selectors on the page. Prioritize these after test specific id and id selectors
    //blacklist .focus, .active kind of class selectors
    selectors.push({
        selector: getCssSelector(element, { selectors: ['class', 'tag', 'nthchild', 'nthoftype'], blacklist: [/focus/, /active/] }),
        type: 'css'
    });

    selectors.push({
        selector: getCssSelector(element, { selectors: ['tag', 'attribute'], includeTag: true, whitelist: ['[alt]', '[title]', '[href]'] }),
        type: 'css'
    });

    //aria and text slectors are not guaranteed unique on the page
    const ariaSelector = _getAriaSelectors(element)
    if (ariaSelector) {
        selectors.push(ariaSelector)
    }

    if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
        const placeholderSelector = _processAttributes(element, ['placeholder']);
        if (placeholderSelector) {
            selectors.push(placeholderSelector);
        }
    }

    if (element.innerText) {
        selectors.push({
            selector: `text=${JSON.stringify(element.innerText)}`,
            type: 'text'
        })
    }


    return selectors;
};

const getSelectionAtPoint = (x, y) => {
    const elementAtMouse = document.elementFromPoint(x, y);
    if (elementAtMouse?.nodeName === 'IFRAME') {
        //iframe content is not supported currently            
        return null;
    }

    if (elementAtMouse && !document.getElementById('__dr-recorder').contains(elementAtMouse)) {
        return {
            selectors: SelectorHelper.getSelectors(elementAtMouse),
            boundary: elementAtMouse.getBoundingClientRect()
        }
    }
    return null;
}


const SelectorHelper = {
    getSelectors,
    getSelectionAtPoint
}

export default SelectorHelper;