const socket = io('http://localhost:3000');
const nickname = getSession('user_nickname');

socket.emit('register_nickname', nickname);

socket.on('ready_for_match', () => {
  console.log('���� ��� �Ϸ�, ��Ī ��û ����');

  fetch('../../php/chat/ranChat.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_nickname: nickname }),
  })
    .then(res => res.json())
    .then(data => {
      console.log('PHP ����:', data);
      if (data.flag === 'fail') alert(data.message);
    });
});

socket.on('matched', ({ partner }) => {
  console.log("matched with", partner);
  window.partnerNickname = partner;
  alert(`${partner}�԰� ��Ī�Ǿ����ϴ�!`);
});

function sendMessage() {
  const msg = document.getElementById('messageInput').value;
  const partner = window.partnerNickname;

  if (partner && msg) {
    socket.emit('send_message', { to: partner, message: msg });

    const now = new Date();
    const formattedTime = now.toLocaleTimeString();

    const chatBox = document.getElementById('chat');
    chatBox.innerHTML += `<p><strong>��</strong> [${formattedTime}]: ${msg}</p>`;

    document.getElementById('messageInput').value = '';
  }
}

socket.on('receive_message', ({ from, message, time }) => {
  const chatBox = document.getElementById('chat');
  const formattedTime = new Date(time).toLocaleTimeString();

  chatBox.innerHTML += `<p><strong>${from}</strong> [${formattedTime}]: ${message}</p>`;
});
