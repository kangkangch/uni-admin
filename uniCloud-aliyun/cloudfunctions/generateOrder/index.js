'use strict';

/**
 * 生成订单
 * @param {Object}  event
 * @param {String}  event.user_id       用户id
 * @param {int}  	event.price 
 * @param {int}  	event.goods_type
 * @param {string}  event.goods_id
 * @param {Array}   event.to_ids 
 * @returns {Object} user	获取到的用户
 */

exports.main = async (event, context) => {
	console.log('event : ', event)

	const db = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云函数的event和context，必传
		event,
		context
	})
	//event为客户端上传的参数
	const phone = await db.collection('user').where("_id== $event.user_id");
	console.log(phone);

	let order = {
		user_id: "",
		phone: phone,
		price: "",
		goods_type: 1,
		goods_id: "",
		to_ids: [],
	}

	for (let key in param) {
		order[key] = param[key];
	}

	await db.collection('order').add(user, {
					toastTitle: '新增成功', // toast提示语
					success: (res) => { // 新增成功后的回调
						console.log(res);
					},
					fail: (err) => { // 新增失败后的回调
						console.log(err) err
					},
					complete: () => { // 完成后的回调
					}
				})

	//返回数据给客户端
	return event
};