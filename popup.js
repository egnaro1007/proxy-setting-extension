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
        const connectedString = browser.i18n.getMessage('proxyConnectedStatus');
        switch (status && status.proxyType) {
            case 'none':
                statusDiv.innerHTML = browser.i18n.getMessage('proxyNotConnectedStatus');
                statusDiv.style.color = "red";
                break;
            case 'autoDetect':
                statusDiv.innerHTML = `${connectedString}<br><b>${browser.i18n.getMessage('proxyAutoDetect')}</b>`;
                statusDiv.style.color = "green";
                break;
            case 'system':
                statusDiv.innerHTML = `${connectedString}<br><b>${browser.i18n.getMessage('proxySystem')}</b>`;
                statusDiv.style.color = "green";
                break;
            case 'manual':
                statusDiv.innerHTML = `${connectedString}<br><b>${status.ssl || status.http || status.socks || ''}</b>`;
                statusDiv.style.color = "green";
                break;
            default:
                statusDiv.textContent = "";
                statusDiv.style.color = "";
                break;
        }
    });
}

function toggleDisplay(id, show) {
    const el = document.getElementById(id);
    if (el) el.style.display = show ? 'block' : 'none';
}

function addEventListeners() {
    document.getElementById('applyLocal40000Btn')?.addEventListener('click', handleApplyLocal40000);

    document.getElementById('moreSettingsBtn')?.addEventListener('click', () => {
        toggleDisplay('moreSettingsBtn', false);
        toggleDisplay('moreSettingsGroup', true);
        toggleDisplay('settingsGroup', true);
    });

    document.getElementById('autoDetectBtn')?.addEventListener('click', () => {
        toggleDisplay('manualSettings', false);
        toggleDisplay('autoConfigSettings', false);
        chooseProxyType('autoDetect');
    });

    document.getElementById('systemBtn')?.addEventListener('click', () => {
        toggleDisplay('manualSettings', false);
        toggleDisplay('autoConfigSettings', false);
        chooseProxyType('system');
    });

    document.getElementById('manualBtn')?.addEventListener('click', () => {
        toggleDisplay('manualSettings', true);
        toggleDisplay('autoConfigSettings', false);
    });

    document.getElementById('manualApplyBtn')?.addEventListener('click', () => {
        chooseProxyType('manual');
    });

    document.getElementById('autoConfigBtn')?.addEventListener('click', () => {
        toggleDisplay('manualSettings', false);
        toggleDisplay('autoConfigSettings', true);
    });

    document.getElementById('autoConfigApplyBtn')?.addEventListener('click', () => {
        chooseProxyType('autoConfig');
    });

    document.getElementById('turnOffBtn')?.addEventListener('click', () => {
        toggleDisplay('moreSettingsBtn', true);
        toggleDisplay('moreSettingsGroup', false);
        toggleDisplay('settingsGroup', false);
        chooseProxyType('none');
    });
}

function chooseProxyType(proxyType) {
    let message = {
        type: 'setProxy',
        proxyType: proxyType
    };

    if (proxyType === 'manual') {
        const hostInput = document.getElementById('proxyHost');
        const portInput = document.getElementById('proxyPort');
        const host = hostInput.value;
        const port = parseInt(portInput.value, 10);

        hostInput.classList.remove('input-error');
        portInput.classList.remove('input-error');

        let hasError = false;

        if (!host) {
            hostInput.classList.add('input-error');
            hostInput.classList.add('shake');
            setTimeout(() => hostInput.classList.remove('shake'), 300);
            hasError = true;
        }
        if (!port || isNaN(port)) {
            portInput.classList.add('input-error');
            portInput.classList.add('shake');
            setTimeout(() => portInput.classList.remove('shake'), 300);
            hasError = true;
        }
        if (hasError) return;

        message.host = host;
        message.port = port;
        message.httpsProxy = true;
        message.httpProxy = true;
    } else if (proxyType === 'autoConfig') {
        const autoConfigUrlInput = document.getElementById('autoConfigUrl');
        const autoConfigUrl = autoConfigUrlInput.value;

        autoConfigUrlInput.classList.remove('input-error');

        let hasError = false;

        if (!autoConfigUrl) {
            autoConfigUrlInput.classList.add('input-error');
            autoConfigUrlInput.classList.add('shake');
            setTimeout(() => autoConfigUrlInput.classList.remove('shake'), 300);
            hasError = true;
        }
        if (hasError) return;

        message.autoConfigUrl = autoConfigUrl;
    }

    console.log(message);

    browser.runtime.sendMessage(message).then(updateProxyStatus);
}

function handleApplyLocal40000() {
    browser.runtime.sendMessage({
        type: 'setProxy',
        proxyType: 'manual',
        host: '127.0.0.1',
        port: 40000,
        passthrough: '192.168.1.1/24, 192.168.0.1/24, vnu.edu.vn, dangkyhoc.vnu.edu.vn, messenger.com',
        httpsProxy: true,
        httpProxy: true,
    }).then(updateProxyStatus);
}
