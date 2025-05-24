document.addEventListener('DOMContentLoaded', () => {
    function setText(id, messageName) {
        const el = document.getElementById(id);
        if (el) el.textContent = chrome.i18n.getMessage(messageName);
    }

    setText('incognito-warning', 'incognitoWarning');
    setText('proxy-status', 'proxyStatusLoading');
    setText('header', 'header');
    setText('applyLocal40000Btn', 'applyLocal40000');
    setText('moreSettingsBtn', 'moreSettings');
    setText('autoDetectBtn', 'autoDetect');
    setText('systemBtn', 'system');
    setText('manualBtn', 'manual');
    setText('autoConfigBtn', 'autoConfig');
    setText('manualApplyBtn', 'apply');
    setText('autoConfigApplyBtn', 'apply');
    setText('turnOffBtn', 'turnOff');

    document.getElementById('proxyHost').placeholder = chrome.i18n.getMessage('proxyHost');
    document.getElementById('proxyPort').placeholder = chrome.i18n.getMessage('proxyPort');
    document.getElementById('autoConfigUrl').placeholder = chrome.i18n.getMessage('autoConfigUrl');
});