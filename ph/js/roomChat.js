const nickname = getSession('user_nickname');
const title = getSession('room_title');

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function (match) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return map[match];
  });
}

window.addEventListener('beforeunload', (event) => {
	event.preventDefault();

	fetch('../../php/chat/roomChat_end.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_nickname: nickname, room_title: title }),
  })
    .then(res => res.json())
    .then(data => {
      // console.log('PHP 응답:', data.message);
      if (data.flag === 'fail') chatBox.innerHTML += `<p><strong>System</strong> [${formattedTime}]: ${data.message} / detail : ${data.detail}</p>`;;
	});
});

const socket = io('/roomChat');

document.addEventListener('DOMContentLoaded', () => {
  const messageInput = document.getElementById('messageInput');

  messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = messageInput.scrollHeight + 'px';
  });

	messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return;
      } else {
        e.preventDefault();
        send();
      }
    }
  });

  messageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = this.selectionStart;
      const end = this.selectionEnd;
      this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + 1;
    }
  });

  const room_title = document.getElementById('room_title');
  room_title.innerHTML += title;
});

socket.on('connect', () => {
  const nickname = getSession('user_nickname');
  if (nickname) {
		const now = new Date();
		const formattedTime = now.toLocaleTimeString();

		const chatBox = document.getElementById('chat');
    chatBox.innerHTML += `
<div class="grid-wrapper center">
<div class="system-message">
<span class="text_container">System [${formattedTime}]: ${title} 방에 입장하였습니다.</span>
</div>
</div>
    `;
    socket.emit('reconnect_user', { nickname });
  }
});

socket.emit('join_room', {
	nickname: nickname,
	room_title: title
});

socket.on('joined_room_chat', ({ room }) => {
  console.log('채팅 입장 완료:', room);

  const now = new Date();
  const formattedTime = now.toLocaleTimeString();

  const chatBox = document.getElementById('chat');

  fetch('../../php/chat/roomChat_start.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_nickname: nickname, room_title: title }),
  })
    .then(res => res.json())
    .then(data => {
      console.log('PHP 응답:', data);
      if (data.flag === 'fail') chatBox.innerHTML += `<p><strong>System</strong> [${formattedTime}]: ${data.message} / detail : ${data.detail}</p>`;;
    });
});

async function send() {
	const msg = document.getElementById('messageInput').value;
  
	if(!msg && sharedFiles.length == 0 ){
		return alert('메시지나 파일을 확인해주세요.');
	}

	if(msg){
		socket.emit('send_message', { nickname: nickname, message: msg });

		document.getElementById('messageInput').value = '';
    document.getElementById('messageInput').style.height = '40px';
	}
	if(sharedFiles.length > 0){
		const formData = new FormData();
		const password = document.getElementById('file_password').value;
		const now = new Date();
		const formattedTime = now.toLocaleTimeString().replace(/:/g, '-');
		const filename = `${formattedTime}_${nickname}`;

		for(let file of sharedFiles){
      console.log("파일 이름:", file.name);
      console.log("파일 이름:", encodeURIComponent(file.name));
			formData.append('files', file);
		}
		formData.append('nickname', nickname);
		formData.append('password', password);
		formData.append('room_title', title);
		formData.append('filename', filename);

		try {
      const res = await fetch('/roomChat/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        socket.emit('send_file', {
          nickname: nickname,
          filename: result.filename,
          url: result.downloadURL,
        });

        sharedFiles = [];
        document.getElementById('file_list').innerHTML = '';
				document.getElementById('file_password').value = '';
      } else {
        alert('파일 업로드 실패: ' + decodeURIComponent(result.message));
      }
    } catch (err) {
      console.error(err);
      alert('업로드 중 오류가 발생했습니다.');
    }
	}
}

socket.on('receive_message', ({ from, message, time }) => {
  const chatBox = document.getElementById('chat');
  const formattedTime = new Date(time).toLocaleTimeString();
	const formattedMsg = escapeHtml(message);

  const isSelf = from == '나'?true :false;

  const messageStyle = isSelf==true ? 'grid-wrapper right' : 'grid-wrapper left';
	
  chatBox.innerHTML += `
<div class="${messageStyle}">
<div class="message-container">
<div class="nickname">${from}</div>
<div class="bubble"><span class="text_container">${formattedMsg}</span></div>
<div class="time">${formattedTime}</div>
</div>
</div>
	`;
	chatBox.scrollTop = chatBox.scrollHeight;
});
socket.on('receive_file', ({ from, filename, url, time }) => {
  const chatBox = document.getElementById('chat');
	const formattedTime = new Date(time).toLocaleTimeString();
	const displayName = from==nickname?'나':from;

  const isSelf = from === nickname;
  const messageStyle = isSelf ? 'grid-wrapper right' : 'grid-wrapper left';

	chatBox.innerHTML += `
<div class="${messageStyle}">
<div class="message-container">
<div class="nickname">${displayName}</div>
<div class="bubble">
<span class="text_container">
<a href="${url}" download>
<button class="download-button">${filename}</button>
</a>
</span>
</div>
<div class="time">${formattedTime}</div>
</div>
</div>
  `;
	chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on('system_message', (msg) => {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString();
  const chatBox = document.getElementById('chat');
  const formattedMsg = escapeHtml(msg).replace(/\n/g, '<br>');

  chatBox.innerHTML += `
<div class="grid-wrapper center">
<div class="system-message">
<span class="text_container">System [${formattedTime}]: ${formattedMsg}</span>
</div>
</div>
  `;
  chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on('idletimer', (msg) => {
  console.log(msg);
})

function exit() {
  if (confirm("정말 대화를 종료하시겠습니까?")) {
		fetch('../../php/chat/roomChat_end.php', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ user_nickname: nickname, room_title: title }),
		})
			.then(res => res.json())
			.then(data => {
				console.log('PHP 응답:', data);
				if(data.flag=='success'){
					alert(data.message);
          socket.disconnect();
					removeSession('room_title');
					navigate('./roomChat_menu.htm');
				}
				if (data.flag === 'fail') alert(data.message);
		});
  }
}

socket.on('update_user_list', (userList) => {
  const userListBox = document.getElementById('userList');

  userListBox.innerHTML = '';

  userList.forEach(user => {
    const td = document.createElement('td');
    const tr = document.createElement('tr');
    td.textContent = user;

    tr.appendChild(td);
    userListBox.appendChild(tr);
  });

  document.getElementById('userCount').textContent = `현재 유저 수: ${userList.length}`;
});