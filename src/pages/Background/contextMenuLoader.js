const ContextMenuLoader = {
    setupContextMenu: (menu) => {
        chrome.contextMenus.removeAll();

        chrome.contextMenus.create({
            title: 'DevRaven Recorder',
            enabled: true,
            id: menu.PARENT,
            contexts: ['all']
        });
        chrome.contextMenus.create({
            title: 'Record hover',
            enabled: true,
            parentId: menu.PARENT,
            id: menu.RECORD_HOVER,
            contexts: ['all']
        });
        chrome.contextMenus.create({
            title: 'Record waitForSelector',
            enabled: true,
            parentId: menu.PARENT,
            id: menu.WAIT_FOR_SELECTOR,
            contexts: ['all']
        });
    },
    clearContextMenu: () => {
        chrome.contextMenus.removeAll();
    }
}

export default ContextMenuLoader;