document.getElementById('applyProxyBtn').addEventListener('click', function() {
  const host = document.getElementById('proxyHost').value;
  const port = parseInt(document.getElementById('proxyPort').value, 10);

//   if (host && port) {
  if (true) {
    browser.runtime.sendMessage({
      type: 'setProxy',
      host: host,
      port: port,
      proxy_mode: 'manual' 
    });
  } else {
    alert('Please provide valid proxy settings.');
  }
});

document.getElementById('turnOffBtn').addEventListener('click', function() {
  browser.runtime.sendMessage({
      type: 'setProxy',
      proxyType: 'none' 
    });
})

document.getElementById('applyLocal40000Btn').addEventListener('click', function() {
  browser.runtime.sendMessage({
      type: 'setProxy',
      host: '127.0.0.1',
      port: 40000,
      proxyType: 'manual',
      passthrough: '192.168.1.1/24, 192.168.0.1/24, vnu.edu.vn, dangkyhoc.vnu.edu.vn, messenger.com',
      httpsProxy: true,
    });
})
