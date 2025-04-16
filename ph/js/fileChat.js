const nickname = getSession('user_nickname');

window.addEventListener('beforeunload', (event) => {
	event.preventDefault();

	$.ajax({
		type:'post'
		, contentType:'application/json'
		, data: JSON.stringify({ user_nickname: nickname })
		, dataType: 'json'
		, url: '../../php/chat/fileChat_end.php'
		, success: function(result){
			if(result.flag=='success'){
			}
			else{
			}
		}
		, error : function(xhr, status, error) {
			alert("서버 연결에 실패했습니다."+error+xhr.responseText);
		}
	})
});

const socket = io('http://localhost:3000/fileChat');

socket.emit('register_nickname', nickname);

socket.on('joined_file_chat', ({ room }) => {
  console.log('단체 채팅 입장 완료:', room);

  const now = new Date();
  const formattedTime = now.toLocaleTimeString();

  const chatBox = document.getElementById('chat');

  fetch('../../php/chat/fileChat_start.php', {
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

async function sendZip() {
	const files = document.getElementById('file_upload').files;
	if(files && files.length!=0){
		const zip = new JSZip();

		for(let file of files){
			zip.file(file.name, file);
		}

		const zipBlob = await zip.generateAsync({ type: "blob" });

		const formData = new FormData();
		
		const now = new Date();
		const formattedTime = now.toLocaleTimeString();

		const filename = `${formattedTime}_${nickname}.zip`;
		const get_url = '../../uploads/'
		const replace_filename = filename.replace(/\:/g,'-');
		formData.append("zipfile", zipBlob, replace_filename);
		formData.append("user_nickname", nickname);
		$.ajax({
			type:'post'
			,	data: formData
			,	processData: false
			,	contentType: false
			, url: '../../php/chat/fileChat_upload.php'
			, success: function(result){
				if(result=='success'){
					console.log(result);

					socket.emit("zip-upload", {
						filename: replace_filename,
						url: get_url,
						time: formattedTime
					});
			
					const chatBox = document.getElementById('chat');
			
					chatBox.innerHTML += 
					`<p>
					<strong>나</strong> [${formattedTime}]: <a href="../../php/chat/fileChat_download.php?file=${filename}&url=${get_url}" download><button>${replace_filename}</button></a>
					</p>`;
				}
				else{
					console.log(result);
				}
			}
			, error : function(xhr, status, error) {
				alert("서버 연결에 실패했습니다."+error+xhr.responseText);
			}
		})

		document.getElementById('file_upload').value = '';
	}
	else{
		alert('파일을 확인해주세요.');
		return;
	}
}

socket.on('receive_message', ({ from, filename, url, time }) => {
  const chatBox = document.getElementById('chat');

	chatBox.innerHTML += 
	`<p>
	<strong>${from}</strong> [${time}]: <a href="../../php/chat/fileChat_download.php?file=${filename}&url=${url}" download><button>${filename}</button></a>
	</p>`;
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
			, url: '../../php/chat/fileChat_end.php'
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