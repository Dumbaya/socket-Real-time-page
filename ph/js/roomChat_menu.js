const socket = io('http://localhost:3000/roomChat');

function makeRoom_open_popup(){
	
	var popupURL = './make_room_popup.htm';

	var popupSet = "width=600,height=400,scrollbars=yes";

	window.open(popupURL, "Popup", popupSet);
}

function make_room(){
	const room_title = document.getElementById('room_title').value;
	if(!room_title) {
		alert('방 이름을 입력해주세요.'); 
		return;
	}

	socket.emit('create_room', room_title);
	window.opener.setSession('room_title', room_title);
	popup_navigate('./roomChat.htm');
}

socket.on('connect', () => {
  const nickname = getSession('user_nickname');
  if (nickname) {
    socket.emit('reconnect_user', { nickname });
		socket.emit('request_room_list');
  }
});

socket.on('update_room_list', (roomList) => {
  const roomListBox = document.getElementById('roomList');

  roomListBox.innerHTML = '';

	if(roomList.length==0){
		const li = document.createElement('li');
		li.textContent = '현재 방이 없습니다.';

		roomListBox.appendChild(li);
	}
	else{
		roomList.forEach(room => {
			const li = document.createElement('li');
			li.textContent = room;

			const btn = document.createElement('button');
			btn.style = 'margin-left: 50px;'
			btn.textContent = '입장하기';
			btn.onclick = () => {
				setSession('room_title', room);
				navigate('./roomChat.htm');
			};

			li.appendChild(btn);
			roomListBox.appendChild(li);
		});
	}

  document.getElementById('roomCount').textContent = `현재 채팅방 수: ${roomList.length}`;
});