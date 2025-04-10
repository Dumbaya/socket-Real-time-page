function ranChat_start(){
	let arg = getSession('user_nickname');
	if(!arg){
		alert('다시 시도해주세요.');
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
				alert("서버 연결에 실패했습니다."+error+ xhr.responseText);
			}
		})
	}
	else{
		alert('다시 시도해주세요.');
		return false;
	}
}