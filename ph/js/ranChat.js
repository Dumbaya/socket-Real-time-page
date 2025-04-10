const socket = io('http://localhost:3000');
const nickname = getSession('user_nickname');

socket.emit('register_nickname', nickname);

socket.on('ready_for_match', () => {
  console.log('���� ��� �Ϸ�, ��Ī ��û ����');

  fetch('../../php/ranChat.php', {
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

  console.log(partner);
  if (partner && msg) {
    socket.emit('send_message', { to: partner, message: msg });
    document.getElementById('messageInput').value = '';
  }
}

socket.on('receive_message', ({ from, message }) => {
  const chatBox = document.getElementById('chat');
  chatBox.innerHTML += `<p><strong>${from}</strong>: ${message}</p>`;
});
