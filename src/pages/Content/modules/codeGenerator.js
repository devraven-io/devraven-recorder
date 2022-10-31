const SETUP_CODE_BLOCK = `const { chromium } = require('playwright');
const { expect } = require('chai');

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

try{`;

const TEARDOWN_CODE_BLOCK = `} catch(e) {
    //auto-screenshot on failure
    await page.screenshot({ path: 'failed.png', fullPage: true });
    throw e;
} finally {
    await context.close()
    await browser.close(); 
}`;

class CodeGenerator {
    codeBlocks = [];

    constructor() { }

    process(events) {
        this._setup();

        for (let i = 0; i < events.length; i++) {
            const nextEvent = (i + 1 < events.length) ? events[i + 1] : null;
            this.codeBlocks.push(this._processEvent(events[i], nextEvent))

            if (nextEvent?.type === 'navigation') {
                i++;
            }
        }
        this._teardown();
        return this.codeBlocks.join("\n");
    }

    _processEvent(event, nextEvent) {
        let primaryAction;
        if (event.type === 'goto') {
            primaryAction = `page.goto('${event.value}');\n    await page.setViewportSize({ width: ${event.width || 1500}, height: ${event.height || 900} })`;
        } else if (event.type === 'click') {
            primaryAction = `page.locator(${JSON.stringify(event.selectors?.[0].selector)}).click()`;
        } else if (event.type === 'dblclick') {
            primaryAction = `page.locator(${JSON.stringify(event.selectors?.[0].selector)}).dblclick()`;
        } else if (event.type === 'input') {
            primaryAction = `page.locator(${JSON.stringify(event.selectors?.[0].selector)}).fill(${JSON.stringify(event.value)})`;
        } else if (event.type === 'keydown') {
            primaryAction = `page.locator(${JSON.stringify(event.selectors?.[0].selector)}).press(${this._parseKeydownEvent(event)})`;
        } else if (event.type === 'select') {
            primaryAction = `page.locator(${JSON.stringify(event.selectors?.[0].selector)}).selectOption(${JSON.stringify(event.value)})`
        } else if (event.type === 'screenshot') {
            primaryAction = `page.screenshot({ path: '${event.timestamp}.png', fullPage: true })`;
        } else if (event.type === 'hover') {
            primaryAction = `page.hover(${JSON.stringify(event.selectors?.[0].selector)})`;
        } else if (event.type === 'waitforselector') {
            primaryAction = `page.waitForSelector(${JSON.stringify(event.selectors?.[0].selector)})`;
        }

        if (primaryAction) {
            if (nextEvent && nextEvent.type === 'navigation') {
                //wait for naviation
                this.codeBlocks.push(`    await Promise.all([\n        page.waitForNavigation(),\n        ${primaryAction}\n    ]);`);
            } else {
                this.codeBlocks.push(`    await ${primaryAction};`);
            }
        }
    }

    _parseKeydownEvent(event) {
        const keys = [];

        if (event.metaKey) {
            keys.push('Meta');
        }

        if (event.ctrlKey) {
            keys.push('Control');
        }

        keys.push(event.key);

        return JSON.stringify(keys.join('+'));
    }

    _setup() {
        this.codeBlocks.push(SETUP_CODE_BLOCK);
    }
    _teardown() {
        this.codeBlocks.push(TEARDOWN_CODE_BLOCK);
    }

}

export default CodeGenerator;