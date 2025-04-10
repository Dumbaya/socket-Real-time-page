function ranChat_start(){
	let arg = getSession('user_nickname');
	if(!arg){
		alert('�ٽ� �õ����ּ���.');
		return;
	}
	let arr = {user_nickname:arg};
	if(arr){
		$.ajax({
			type:'post'
			, contentType:'application/json'
			, data: JSON.stringify(arr)
			, dataType: 'json'
			, url: '../../php/chat/ranChat.php'
			, success: function(result){
				if(result.flag=='success'){
					alert(result.message);
					navigate('./ranChat.htm');
				}
				else{
					alert(result.message);
				}
			}
			, error : function(xhr, status, error) {
				alert("���� ���ῡ �����߽��ϴ�."+error+ xhr.responseText);
			}
		})
	}
	else{
		alert('�ٽ� �õ����ּ���.');
		return false;
	}
}