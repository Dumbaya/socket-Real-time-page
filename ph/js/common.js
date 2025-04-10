function chk_session(){
	window.onload = function(){
		if(!getSession('user_nickname')){
			alert('������ ����Ǿ����ϴ�. �ٽ� �α������ּ���.');
			navigate('user/sign_in.htm');
		}
	}
}

function navigate(arg){
	window.location.href=arg;
}

function setSession(key, value){
	sessionStorage.setItem(key, value);
}
function getSession(key){
	return sessionStorage.getItem(key);
}
function removeSession(key){
	sessionStorage.removeItem(key);
	navigate('page/homepage.htm');
}