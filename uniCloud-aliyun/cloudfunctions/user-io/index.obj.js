// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129

// let db  = uniCloud.database();
var db = null;
module.exports = {


	_before: function() { // 通用预处理器
		db = uniCloud.databaseForJQL({
			clientInfo: this.getClientInfo()
		})

		db.setUser({ // 指定后续执行操作的用户信息，此虚拟用户将同时拥有传入的uid、role、permission
			role: ['admin'], // 指定当前执行用户的角色为admin。如果只希望指定为admin身份，可以删除uid和permission字段
		})
	},
	/**
	 * method1方法描述
	 * @param {string} param1 参数1描述
	 * @returns {object} 返回值描述
	 */
	/* 
	method1(param1) {
		// 参数校验，如无参数则不需要
		if (!param1) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '参数不能为空'
			}
		}
		// 业务逻辑
		
		// 返回结果
		return {
			param1 //请根据实际需要返回值
		}
	}
	*/

	/**
	 * 新增用户
	 * @param {Object}  params
	 * @param {String}  params.user_name       用户名
	 * @param {String}  params.password       密码
	 * @param {Array}   params.role_id        用户角色列表
	 * @param {String}  params.phone         手机号
	 * @param {String}  params.email          邮箱
	 * @param {String}   params.area      	  注册地区
	 * @returns
	 */
	registerUser: function(param) {
		//查找数据库看是否已经注册
		db.collection('user').where({
			phone: param.phone
		}).get().then((res) => {
			// console.log(res);
			if (!res.data.length) {

				let user = {
					user_name: "",
					phone: "",
					email: "",
					area: "",
					password: "",
					role_id: null
				};

				for (let key in user) {
					user[key] = param[key];
				}

				user["role_id"] = 1;



				db.collection('user').add(user, {
					toastTitle: '新增成功', // toast提示语
					success: (res) => { // 新增成功后的回调
						const {
							code,
							message
						} = res
					},
					fail: (err) => { // 新增失败后的回调
						console.log(err)
						const {
							message
						} = err
					},
					complete: () => { // 完成后的回调
					}
				})
			} else
				throw {
					errCode: "该手机号已注册"
				}

			// res 为数据库查询结果
		}).catch((err) => {
			console.log('获取表信息失败----', err)
			throw (error);
			// err.message 错误信息
			// err.code 错误码
		})

	},

	/**
	 * 登录
	 * @param {Object}  params
	 * @param {String}  params.password       密码
	 * @param {String}  params.phone         手机号
	 * @returns
	 */
	loginwithpwd: async function(params) {
		const users = await db.collection('user').where({
			phone: params.phone
		}).get()
		if (!users.data.length) {
			throw {
				message: "该账号未注册"
			}
		} else {
			let user = users.data[0];
			// console.log(111)
			if (user.password == params.password) {
				let token = {
					user_id: user._id,
					role_id: user.role_id,
					user_name: user.user_name
				}
				// console.log(token);
				return token;
			} else {
				throw {
					message: "密码错误"
				}
			}
		}

	},
	
	/**
	 * 获取用户信息
	 * @param {Object}  params
	 * @param {String}  params.user_id       用户id
	 * @returns {Object} user	获取到的用户
	 */
	
	getUserInfo: async function(params) {
		const user = await db.collection('user').where({
			_id: params.user_id
		}).get()
		return user;
	}

}