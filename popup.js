document.addEventListener('DOMContentLoaded', () => {
    updateProxyStatus();
    addEventListeners();
});

browser.extension.isAllowedIncognitoAccess().then((isAllowed) => {
    if (isAllowed) {
        document.getElementById('incognito-warning').style.display = 'none';
        document.getElementById('main').style.display = 'block';
    } else {
        document.getElementById('main').style.display = 'none';
    }
})

function updateProxyStatus() {
    browser.runtime.sendMessage({ type: 'getProxyStatus' }).then(response => {
        const statusDiv = document.getElementById('proxy-status');
        if (!statusDiv) return;

        const status = response.status;
        switch (status && status.proxyType) {
            case 'none':
                statusDiv.textContent = "Proxy not connected";
                statusDiv.style.color = "red";
                break;
            case 'manual':
                statusDiv.textContent = `Proxy connected to ${status.ssl || status.http || status.socks || ''}`;
                statusDiv.style.color = "green";
                break;
            default:
                statusDiv.textContent = "";
                statusDiv.style.color = "";
                break;
        }
    });
}

function addEventListeners() {
    const applyProxyBtn = document.getElementById('applyProxyBtn');
    const turnOffBtn = document.getElementById('turnOffBtn');
    const applyLocal40000Btn = document.getElementById('applyLocal40000Btn');

    if (applyProxyBtn) {
        applyProxyBtn.addEventListener('click', handleApplyProxy);
    }
    if (turnOffBtn) {
        turnOffBtn.addEventListener('click', handleTurnOffProxy);
    }
    if (applyLocal40000Btn) {
        applyLocal40000Btn.addEventListener('click', handleApplyLocal40000);
    }
}

function handleApplyProxy() {
    const host = document.getElementById('proxyHost').value;
    const port = parseInt(document.getElementById('proxyPort').value, 10);

    if (host && port) {
        browser.runtime.sendMessage({
            type: 'setProxy',
            host: host,
            port: port,
            proxy_mode: 'manual'
        }).then(updateProxyStatus);
    } else {
        alert('Please provide valid proxy settings.');
    }
}

function handleTurnOffProxy() {
    browser.runtime.sendMessage({
        type: 'setProxy',
        proxyType: 'none'
    }).then(updateProxyStatus);
}

function handleApplyLocal40000() {
    browser.runtime.sendMessage({
        type: 'setProxy',
        host: '127.0.0.1',
        port: 40000,
        proxyType: 'manual',
        passthrough: '192.168.1.1/24, 192.168.0.1/24, vnu.edu.vn, dangkyhoc.vnu.edu.vn, messenger.com',
        httpsProxy: true,
    }).then(updateProxyStatus);
}
