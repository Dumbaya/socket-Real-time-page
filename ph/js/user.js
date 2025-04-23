$(document).ready(function () {
	$('#user_id, #user_password').on('keydown', function (e) {
		if (e.key === 'Enter') {
			sign_in();
		}
	});
});

function sign_in(){
	console.log("test");
	if(!$("#user_id").val()){
		alert('아이디를 입력해주세요.');
		$('#user_id').focus();
		return;
	}
	if(!$('#user_password').val()){
		alert('비밀번호를 입력해주세요.');
		$('#user_password').focus();
		return;
	}

	let user_info={user_id:$('#user_id').val(), user_password:$('#user_password').val()};
	console.log(user_info);
	if(user_info){
		$.ajax({
			type:'post'
			, contentType:'application/json'
			, data: JSON.stringify(user_info)
			, dataType: 'json'
			, url: '../../php/user/sign_in.php'
			, success: function(result){
				if(result.flag=='success'){
					alert(result.message);
					setSession('user_nickname', result.user_nickname);
					setSession('user_role', result.user_role);
					navigate('../homepage.htm');
				}
				else{
					alert(result.message);
				}
			}
			, error : function(xhr, status, error) {
				alert("서버 연결에 실패했습니다.");
			}
		})
	}
	else{
		alert('다시 로그인해주세요.');
		return false;
	}
}

function sign_up(){
	if(!$('#user_id').val()){
		alert('아이디를 입력해주세요.');
		return;
	}
	if(!$('#user_password').val()){
		alert('비밀번호를 입력해주세요.');
		return;
	}
	if(!$('#user_email').val()){
		alert('이메일을 입력해주세요.');
		return;
	}
	if(!$('#user_nickname').val()){
		alert('닉네임을 입력해주세요.');
		return;
	}

	let user_info={user_id:$('#user_id').val(), user_password:$('#user_password').val(), user_email:$('#user_email').val(), user_nickname:$('#user_nickname').val()};
	console.log(JSON.stringify(user_info));
	// return;
	if(user_info){
		$.ajax({
			type:'post'
			, contentType:'application/json'
			, data: JSON.stringify(user_info)
			, dataType: 'json'
			, url: '../../php/user/sign_up.php'
			, success: function(result){
				if(result.flag=='success'){
					alert(result.message);
					navigate('./sign_in.htm');
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
	else{
		alert('다시 시도해주세요.');
		return false;
	}
}

function sign_out(){
	removeSession('user_nickname');
	removeSession('user_role');
	navigate('./homepage.htm');
}