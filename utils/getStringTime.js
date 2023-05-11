function getStringTime(date) {
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	month >= 1 && month <= 9 ? (month = "0" + month) : "";
	day >= 0 && day <= 9 ? (day = "0" + day) : "";
	var timer = year + '-' + month + '-' + day
	return timer;
}

function transTime(date, month) {
	
	if(typeof(date) == 'string') date = new Date(date);
	
	date.setMonth(date.getMonth() + month); // 增加月份
	const options = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	};
	const dateString = date.toLocaleDateString('zh-CN', options).replace(/\//g, '-');
	return dateString
}
module.exports = {
	getStringTime,
	transTime
};