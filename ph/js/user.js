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
		alert('���̵� �Է����ּ���.');
		$('#user_id').focus();
		return;
	}
	if(!$('#user_password').val()){
		alert('��й�ȣ�� �Է����ּ���.');
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
				alert("���� ���ῡ �����߽��ϴ�.");
			}
		})
	}
	else{
		alert('�ٽ� �α������ּ���.');
		return false;
	}
}

function sign_up(){
	if(!$('#user_id').val()){
		alert('���̵� �Է����ּ���.');
		return;
	}
	if(!$('#user_password').val()){
		alert('��й�ȣ�� �Է����ּ���.');
		return;
	}
	if(!$('#user_email').val()){
		alert('�̸����� �Է����ּ���.');
		return;
	}
	if(!$('#user_nickname').val()){
		alert('�г����� �Է����ּ���.');
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
				alert("���� ���ῡ �����߽��ϴ�."+error+xhr.responseText);
			}
		})
	}
	else{
		alert('�ٽ� �õ����ּ���.');
		return false;
	}
}

function sign_out(){
	removeSession('user_nickname');
	removeSession('user_role');
	navigate('./homepage.htm');
}