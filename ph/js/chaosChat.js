const socket = io('http://localhost:3000/chaosChat');
const nickname = getSession('user_nickname');

socket.emit('register_nickname', nickname);

socket.on('joined_chaos_chat', ({ room }) => {
  console.log('단체 채팅 입장 완료:', room);

  const now = new Date();
  const formattedTime = now.toLocaleTimeString();

  const chatBox = document.getElementById('chat');

  fetch('../../php/chat/chaosChat_start.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_nickname: nickname }),
  })
    .then(res => res.json())
    .then(data => {
      console.log('PHP 응답:', data);
      if (data.flag === 'fail') chatBox.innerHTML += `<p><strong>System</strong> [${formattedTime}]: ${data.message}</p>`;;
    });
});

function sendMessage() {
  const msg = document.getElementById('messageInput').value;
  const partner = window.partnerNickname;

  if (msg) {
    socket.emit('send_message', { message: msg });

    const now = new Date();
    const formattedTime = now.toLocaleTimeString();

    const chatBox = document.getElementById('chat');
    chatBox.innerHTML += `<p><strong>나</strong> [${formattedTime}]: ${msg}</p>`;

    document.getElementById('messageInput').value = '';
  }
}

socket.on('receive_message', ({ from, message, time }) => {
  if(from==nickname) return;
  const chatBox = document.getElementById('chat');
  const formattedTime = new Date(time).toLocaleTimeString();

  chatBox.innerHTML += `<p><strong>${from}</strong> [${formattedTime}]: ${message}</p>`;
});

socket.on('system_message', (msg) => {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString();
  const chatBox = document.getElementById('chat');

  chatBox.innerHTML += `<p><strong>System</strong> [${formattedTime}]: ${msg}</p>`;
});

function exit() {
  if (confirm("정말 대화를 종료하시겠습니까?")) {
    $.ajax({
			type:'post'
			, contentType:'application/json'
			, data: JSON.stringify({ user_nickname: nickname })
			, dataType: 'json'
			, url: '../../php/chat/chaosChat_end.php'
			, success: function(result){
				if(result.flag=='success'){
					alert(result.message);
          socket.disconnect();
					navigate("./menu.htm");
				}
				else{
					alert(result.message);
				}
			}
			, error : function(xhr, status, error) {
				alert("서버 연결에 실패했습니다."+error+xhr.responseText);
			}
		})
  }
}

function handleEnter(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
}

socket.on('update_user_list', (userList) => {
  const userListBox = document.getElementById('userList');

  userListBox.innerHTML = '';

  userList.forEach(user => {
    const item = document.createElement('li');
    item.textContent = user;
    userListBox.appendChild(item);
  });

  document.getElementById('userCount').textContent = `현재 유저 수: ${userList.length}`;
});