function chk_session(){
	window.onload = function(){
		if(!getSession('user_nickname')){
			alert('세션이 만료되었습니다. 다시 로그인해주세요.');
			navigate('user/sign_in.htm');
		}
	}
}

function navigate(arg){
	window.location.href=arg;
}
function popup_navigate(arg){
	self.close();
	opener.location.href=arg;
}

function setSession(key, value){
	sessionStorage.setItem(key, value);
}
function getSession(key){
	return sessionStorage.getItem(key);
}
function removeSession(key){
	sessionStorage.removeItem(key);
}