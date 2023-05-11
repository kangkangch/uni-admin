'use strict';


/**
 * 支付订单,在支付成功后进行调用
 * @param {Object}  event
 * @param {String}  event.order_id
 */
// const {
// 	getStringTime,
// 	transTime
// } = require('@/utils/getStringTime');

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
	var temp_date = JSON.parse(JSON.stringify(date))

	if (typeof(temp_date) == 'string') temp_date = new Date(temp_date);

	temp_date.setMonth(temp_date.getMonth() + month); // 增加月份
	const options = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	};
	const dateString = temp_date.toLocaleDateString('zh-CN', options).replace(/\//g, '-');
	return dateString
}

exports.main = async (event, context) => {
	console.log('event : ', event)

	const db = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云函数的event和context，必传
		event,
		context
	})
	//event为客户端上传的参数
	var order = await db.collection('order').where({
		_id: event.order_id
	}).get();


	// console.log(order);
	order = order.data[0];


	const now_time = new Date()
	const now_time_string = getStringTime(now_time)
	const now_time_timestamp = now_time.getTime()
	eTime = transTime(now_time, 12);
	// console.log("now_time", now_time, "eTime", eTime)
	// console.log("now_time_string", now_time_string)


	//支付成功后修改订单的支付状态和支付时间
	var orderRes = await db.collection('order').where({
		_id: order._id
	}).update({
		status: true,
		last_time: now_time_timestamp,
		pay_time: now_time_timestamp
	})

	//先结算订单再修改数据
	if (orderRes.errCode == 0) {
		console.log("订单结算完成")
		//判断该订单的商品类型-》根据商品类型选择数据库-》获取商品的信息-》修改对应的表

		//购买课程，通过订单中的商品编号查找course库，只插入用户id和课程id即可
		if (order.goods_type == 1) {
			//遍历收货人订单添加参加课程表,并且修改课程表使得参加人数+1
			for (let item of order.to_ids) {
				let params = {
					user_id: item,
					course_id: order.goods_id,
				}

				var course = await db.collection('course').where({
					_id: order.goods_id
				}).get();

				var attend_num = course.data[0].attend_num;
				attend_num++;

				await db.collection('course').where({
					_id: order.goods_id
				}).update({
					attend_num: attend_num
				})

				await db.collection('attend_course').add(params)
			}
		}

		//成为vip，根据goods_id从member_package中获取month，然后设置member表
		//user_id, create_time, end_time, package_id
		else if (order.goods_type == 2) {

			var member_package = await db.collection('member_package').where({
				_id: order.goods_id
			}).get();
			var month = member_package.data[0].month;

			// console.log(member_package);

			let user_id = order.to_ids[0];

			await db.collection('user').where({
				_id: user_id
			}).update({
				role_id: 2
			})

			let package_id = order.goods_id;

			var eTime = transTime(now_time, month);

			let params = {
				user_id: user_id,
				package_id: package_id,
				create_time: now_time_string,
				end_time: eTime
			}

			let memberRes = await db.collection('member').add(params);
			//成为会员成功就发放优惠券
			if(memberRes.errCode == 0){
				const member_package = await db.collection('member_package').where({
					_id : package_id
				}).get()
				
				// console.log("member_package",member_package)
				
				const package_type = member_package.data[0].package_type
				
				const coupon = await db.collection('coupon').where({
					coupon_type : 1
				}).get()
				
				var reduce = coupon.data[0].reduce
				var effect_time = coupon.data[0].effect_time
				
				eTime = transTime(now_time, effect_time)
				// console.log("now_time", now_time, "eTime", eTime)
				
				params = {
					reduce : reduce,
					user_id: user_id,
					end_time: eTime
				}
				
				for(let i=0; i< package_type*2; i++){
					await db.collection('use_coupon').add(params)
				}
			}

		}


		//续费会员
		//更改package_id, update_time, end_time
		else if (order.goods_type == 3) {
			var member_package = await db.collection('member_package').where({
				_id: order.goods_id
			}).get();
			var month = member_package.data[0].month;

			// console.log(member_package);

			let user_id = order.to_ids[0];
			let package_id = order.goods_id;

			var member = await db.collection('member').where({
				user_id: user_id
			}).get();

			// var member_id = member.data[0]._id;

			let end_time = member.data[0].end_time;
			end_time = new Date(end_time);
			let eTime = transTime(end_time, month);

			let params = {
				package_id: package_id,
				update_time: now_time_string,
				end_time: eTime
			}

			let memberRes = await db.collection('member').where({
				user_id: user_id
			}).update(params)
			
			if(memberRes.errCode == 0){
				const member_package = await db.collection('member_package').where({
					_id : package_id
				}).get()
				
				// console.log("member_package",member_package)
				
				const package_type = member_package.data[0].package_type
				
				const coupon = await db.collection('coupon').where({
					coupon_type : 1
				}).get()
				
				var reduce = coupon.data[0].reduce
				var effect_time = coupon.data[0].effect_time
				
				eTime = transTime(now_time, effect_time)
				// console.log("now_time", now_time, "eTime", eTime)
				
				params = {
					reduce : reduce,
					user_id: user_id,
					end_time: eTime
				}
				
				for(let i=0; i< package_type*2; i++){
					await db.collection('use_coupon').add(params)
				}
			}
		}
	}



	// console.log(11111111, phone);

	// var order = {
	// 	user_id: "",
	// 	phone: phone,
	// 	price: "",
	// 	goods_type: 1,
	// 	goods_id: "",
	// 	to_ids: [],
	// }

	// for (let key in event) {
	// 	order[key] = event[key];
	// }



	//返回数据给客户端
	return order.goods_type
};