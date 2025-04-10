function navigate(arg){
	window.location.href=arg;
}

function setSession(key, value){
	sessionStorage.setItem(key, value);
}
function getSession(key){
	return sessionStorage.getItem(key);
}