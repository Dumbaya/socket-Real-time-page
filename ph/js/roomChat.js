const nickname = getSession('user_nickname');
const title = getSession('room_title');

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
      console.log('PHP ����:', data);
      if (data.flag === 'fail') chatBox.innerHTML += `<p><strong>System</strong> [${formattedTime}]: ${data.message} / detail : ${data.detail}</p>`;;
	});
});

const socket = io('http://localhost:3000/roomChat');

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
});


socket.on('connect', () => {
  const nickname = getSession('user_nickname');
  if (nickname) {
		const now = new Date();
		const formattedTime = now.toLocaleTimeString();

		const chatBox = document.getElementById('chat');
		chatBox.innerHTML += `<p><strong>System</strong> [${formattedTime}]: ${title} �濡 �����Ͽ����ϴ�.</p>`;
    socket.emit('reconnect_user', { nickname });
  }
});

socket.emit('join_room', {
	nickname: nickname,
	room_title: title
});

socket.on('joined_room_chat', ({ room }) => {
  console.log('ä�� ���� �Ϸ�:', room);

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
      console.log('PHP ����:', data);
      if (data.flag === 'fail') chatBox.innerHTML += `<p><strong>System</strong> [${formattedTime}]: ${data.message} / detail : ${data.detail}</p>`;;
    });
});

async function send() {
	const msg = document.getElementById('messageInput').value;
  
	if(!msg && sharedFiles.length == 0 ){
		return alert('�޽����� ������ Ȯ�����ּ���.');
	}

	if(msg){
		socket.emit('send_message', { nickname: nickname, message: msg });

		document.getElementById('messageInput').value = '';
	}
	if(sharedFiles.length > 0){
		const formData = new FormData();
		const password = document.getElementById('file_password').value;
		const now = new Date();
		const formattedTime = now.toLocaleTimeString().replace(/:/g, '-');
		const filename = `${formattedTime}_${nickname}`;

		for(let file of sharedFiles){
      console.log("���� �̸�:", file.name);
      console.log("���� �̸�:", encodeURIComponent(file.name));
			formData.append('files', file);
		}
		formData.append('nickname', nickname);
		formData.append('password', password);
		formData.append('room_title', title);
		formData.append('filename', filename);

		try {
      const res = await fetch('http://localhost:3000/roomChat/upload', {
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
        alert('���� ���ε� ����: ' + result.message);
      }
    } catch (err) {
      console.error(err);
      alert('���ε� �� ������ �߻��߽��ϴ�.');
    }
	}
}

socket.on('receive_message', ({ from, message, time }) => {
  const chatBox = document.getElementById('chat');
  const formattedTime = new Date(time).toLocaleTimeString();
	const formattedMsg = message.replace(/\n/g, '<br>');
	
  chatBox.innerHTML += `
		<div style="display: flex; align-items: flex-start; margin-bottom: 4px;">
			<strong style="white-space: nowrap;">${from} [${formattedTime}]:&nbsp;</strong>
			<span style="white-space: pre-line;">${formattedMsg}</span>
		</div>
	`;
	chatBox.scrollTop = chatBox.scrollHeight;
});
socket.on('receive_file', ({ from, filename, url, time }) => {
  const chatBox = document.getElementById('chat');
	const formattedTime = new Date(time).toLocaleTimeString();
	const displayName = from==nickname?'��':from;
	chatBox.innerHTML += `
		<div style="display: flex; align-items: flex-start; margin-bottom: 4px;">
			<strong style="white-space: nowrap;">${displayName} [${formattedTime}]:&nbsp;</strong>
			<span style="white-space: pre-line;"><a href="http://localhost:3000${url}" download><button>${filename}</button></a></span>
		</div>
  `;
	chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on('system_message', (msg) => {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString();
  const chatBox = document.getElementById('chat');

  chatBox.innerHTML += `<p><strong>System</strong> [${formattedTime}]: ${msg}</p>`;
});

function exit() {
  if (confirm("���� ��ȭ�� �����Ͻðڽ��ϱ�?")) {
		fetch('../../php/chat/roomChat_end.php', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ user_nickname: nickname, room_title: title }),
		})
			.then(res => res.json())
			.then(data => {
				console.log('PHP ����:', data);
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
    const item = document.createElement('li');
    item.textContent = user;
    userListBox.appendChild(item);
  });

  document.getElementById('userCount').textContent = `���� ���� ��: ${userList.length}`;
});