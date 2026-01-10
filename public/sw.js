// public/sw.js
let currentAudio = null;
let isPlaying = false;

self.addEventListener('install', (event) => {
  console.log('Service Worker 安装');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker 激活');
  event.waitUntil(clients.claim());
});

// 接收主线程的消息
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  if (type === 'PLAY_MUSIC') {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    
    currentAudio = new Audio(data.url);
    currentAudio.loop = true;
    
    currentAudio.play().then(() => {
      isPlaying = true;
      // 通知所有客户端
      sendToAllClients({ type: 'MUSIC_STATE', data: { isPlaying: true } });
    }).catch(console.error);
    
  } else if (type === 'TOGGLE_MUSIC') {
    if (currentAudio) {
      if (isPlaying) {
        currentAudio.pause();
        isPlaying = false;
      } else {
        currentAudio.play();
        isPlaying = true;
      }
      sendToAllClients({ type: 'MUSIC_STATE', data: { isPlaying } });
    }
    
  } else if (type === 'GET_MUSIC_STATE') {
    event.ports[0].postMessage({ isPlaying });
  }
});

// 发送消息给所有客户端
function sendToAllClients(message) {
  clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage(message);
    });
  });
}