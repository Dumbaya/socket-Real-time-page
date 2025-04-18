const nickname = getSession('user_nickname');
const title = getSession('room_title');

window.addEventListener('beforeunload', (event) => {
	event.preventDefault();

	$.ajax({
		type:'post'
		, contentType:'application/json'
		, data: JSON.stringify({ user_nickname: nickname, room_title: title })
		, dataType: 'json'
		, url: '../../php/chat/roomChat_end.php'
		, error : function(xhr, status, error) {
			alert("���� ���ῡ �����߽��ϴ�."+error+xhr.responseText);
		}
	})
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
	console.log(msg);
	console.log(files);
	if(!msg && ( !files || files.length==0 ) ){
		return alert('�޽����� ������ Ȯ�����ּ���.');
	}

	if(msg){
		socket.emit('send_message', { nickname: nickname, message: msg });

		document.getElementById('messageInput').value = '';
	}
	if(files && files.length!=0){
		const zip = new JSZip();

		for(let file of files){
			zip.file(file.name, file);
		}

		const zipBlob = await zip.generateAsync({ type: "blob" });
		const arrayBuffer = await zipBlob.arrayBuffer();
		const now = new Date();
		const formattedTime = now.toLocaleTimeString().replace(/:/g, '-');
		const filename = `${formattedTime}_${nickname}.zip`;

		socket.emit('send_file', {
			nickname: nickname,
			buffer: arrayBuffer,
			filename: filename
		});
	
		document.getElementById('file_upload').value = '';
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

	chatBox.innerHTML += `
    <p><strong>${from}</strong> [${formattedTime}]: 
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
    $.ajax({
			type:'post'
			, contentType:'application/json'
			, data: JSON.stringify({ user_nickname: nickname, room_title: title })
			, dataType: 'json'
			, url: '../../php/chat/roomChat_end.php'
			, success: function(result){
				if(result.flag=='success'){
					alert(result.message);
          socket.disconnect();
					removeSession('room_title')
					navigate('./roomChat_menu.htm');
				}
				else{
					alert(result.message);
				}
			}
			, error : function(xhr, status, error) {
				alert("���� ���ῡ �����߽��ϴ�."+error+xhr.responseText);
			}
		})
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