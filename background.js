browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'setProxy') {
    const { 
        proxyType, host, port, 
        httpProxy = false, httpsProxy = false, socks = false,
        passthrough
    } = message;

    let proxyConfig = { "proxyType": proxyType, "passthrough": passthrough };

    if (proxyType === 'manual') {
        if (httpProxy) {
            proxyConfig.http = `${host}:${port}`;
        }
        if (httpsProxy) {
            proxyConfig.ssl = `${host}:${port}`;
        }
        if (socks) {
            proxyConfig.socks = `${host}:${port}`;
            proxyConfig.socksVersion = 5;
        }
    }

    browser.proxy.settings.set({ value: proxyConfig });
  }
});
