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

socket.on('connect', () => {
  const nickname = getSession('user_nickname');
  if (nickname) {
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
	const files = document.getElementById('file_upload').files;
	if(!msg && ( !files || files.length==0 ) ){
		return alert('�޽����� ������ Ȯ�����ּ���.');
	}

	if(msg){
		socket.emit('send_message', { nickname: nickname, message: msg });

		document.getElementById('messageInput').value = '';
	}
	if(files && files.length!=0){
		const formData = new FormData();
		const password = document.getElementById('file_password').value;
		const now = new Date();
		const formattedTime = now.toLocaleTimeString().replace(/:/g, '-');
		const filename = `${formattedTime}_${nickname}`;

		for(let file of files){
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

        document.getElementById('file_upload').value = '';
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

  chatBox.innerHTML += `<p><strong>${from}</strong> [${formattedTime}]: ${message}</p>`;
});
socket.on('receive_file', ({ from, filename, url, time }) => {
  const chatBox = document.getElementById('chat');
	const formattedTime = new Date(time).toLocaleTimeString();
	const displayName = from==nickname?'��':from;
	chatBox.innerHTML += `
    <p><strong>${displayName}</strong> [${formattedTime}]: 
    <a href="http://localhost:3000${url}" download><button>${filename}</button></a></p>
  `;
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