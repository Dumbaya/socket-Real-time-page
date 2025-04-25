
const socket = io('/ranChat');
const nickname = getSession('user_nickname');

socket.emit('register_nickname', nickname);
socket.on('ready_for_match', () => {
  console.log('소켓 등록 완료, 매칭 요청 시작');

  const now = new Date();
  const formattedTime = now.toLocaleTimeString();

  const chatBox = document.getElementById('chat');

  fetch('../../php/chat/ranChat_start.php', {
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

socket.on('matched', ({ partner }) => {
  console.log("matched with", partner);
  window.partnerNickname = partner;
  socket.emit("matched_partner", partner);

  const now = new Date();
  const formattedTime = now.toLocaleTimeString();

  const chatBox = document.getElementById('chat');
  chatBox.innerHTML += `<p><strong>System</strong> [${formattedTime}]: ${partner}님과 매칭되었습니다!</p>`;
});

function sendMessage() {
  const msg = document.getElementById('messageInput').value;
  const partner = window.partnerNickname;

  if (partner && msg) {
    socket.emit('send_message', { to: partner, message: msg });

    const now = new Date();
    const formattedTime = now.toLocaleTimeString();

    const chatBox = document.getElementById('chat');
    chatBox.innerHTML += `<p><strong>나</strong> [${formattedTime}]: ${msg}</p>`;

    document.getElementById('messageInput').value = '';
  }
}

socket.on('receive_message', ({ from, message, time }) => {
  const chatBox = document.getElementById('chat');
  const formattedTime = new Date(time).toLocaleTimeString();

  chatBox.innerHTML += `<p><strong>${from}</strong> [${formattedTime}]: ${message}</p>`;
});

socket.on('partner_disconnected', (data) => {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString();

  const chatBox = document.getElementById('chat');
  chatBox.innerHTML += `<p><strong>System</strong> [${formattedTime}]: ${data.message}</p>`;
});

function exit() {
  if (confirm("정말 대화를 종료하시겠습니까?")) {
    socket.emit('exit_chat', {
      nickname: nickname,
      partnerNickname: window.partnerNickname
    });
    $.ajax({
			type:'post'
			, contentType:'application/json'
			, data: JSON.stringify({ user_nickname: nickname, partner_nickname: window.partnerNickname })
			, dataType: 'json'
			, url: '../../php/chat/ranChat_end.php'
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

function other_search(){
  if (confirm("상대를 다시 찾으시겠습니까?")) {
    document.getElementById("chat").innerHTML = '';

    const now = new Date();
    const formattedTime = now.toLocaleTimeString();

    const chatBox = document.getElementById('chat');
    
    socket.emit('exit_chat', {
      nickname: nickname,
      partnerNickname: window.partnerNickname
    });
    
    fetch('../../php/chat/ranChat_restart.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_nickname: nickname }),
    })
    .then(res => res.json())
    .then(data => {
      console.log('PHP 응답:', data);
      if (data.flag === 'fail') chatBox.innerHTML += `<p><strong>System</strong> [${formattedTime}]: ${data.message}</p>`;
    });
    socket.emit('register_nickname', nickname);
  }
}

function handleEnter(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
}