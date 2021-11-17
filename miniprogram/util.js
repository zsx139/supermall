const config = require('config.js')
function showMessage(content,duration,icon) {
	wx.showToast({
		title: content,
		icon: icon || 'none',
		duration: duration || 2000
	})
}

function showModal(title, content) {
	wx.showModal({
		title: title,
		content: content,
	})
}

/**
 * login
 * 先check wx session是否有效，有效则使用本地userToken跳过服务端/token
 * 无效时，则进行wx.login、请求服务端/token
 */
function login(options){
	options = options || {}
	console.log(wx.getStorageSync('userToken'))
	if (wx.getStorageSync('userToken') == '') {
		
		
	}else{
		// showMessage('登陆成功')
		wx.switchTab({
			url: '/pages/indexs/index/index'
		})
	}
}
/*
 * 封装微信的的request get，携带token header
 */
function get(options) {
	options.method = 'GET'
	request(options)
	wx.showToast({
		title: '加载中',
		icon: 'loading',
		duration: 20000
	})
}

/**
 * 封装微信的的request get，携带token header
 */
function post(options) {
	options.method = 'POST'
	request(options)
	wx.showToast({
		title: '加载中',
		icon: 'loading',
		duration: 20000
	})
}

var networkErrorModalShowing = false
/**
 * 封装微信的的request，携带token header
 */
function request(options) {
	options = options || {}
	let url = options.url
	let data = options.data || {}
	let success = options.success || function() {}
	let fail = options.fail || function() {}
	let method = options.method || "GET"
	let header = options.header || {}
	let networkErrorShowSkip = options.networkErrorShowSkip || false
	if (!url) {
		wx.showModal({
			title: '请求失败',
			content: '空url，请联系客服。',
		})
		return
	}
	if (url.indexOf('https') != 0) { // 业务逻辑简化携带config.baseUrl
		url = config.baseUrl + url
	}
	var jsonHeader = {
		'whoareyou':1,
		'VPToken':wx.getStorageSync('userToken'),
	}
	var formHeader = {
		'whoareyou':1,
		'VPToken':wx.getStorageSync('userToken'),
		'content-type': 'application/x-www-form-urlencoded'
	}
	if(header == jsonHeader){
		header=jsonHeader
	}else if(header == formHeader){
		header=formHeader
	}
	// console.log(url)
	wx.request({
		url: url,
		data: data,
		method: method,
		header: header,
		success: function(res) {
			wx.hideToast()
			if (res.statusCode == 200) {
				if (res.code == -2) { // 重复请求
					console.log('repeat request', res)
					return
				}
				success(res);
			} else if (res.statusCode == 401) {
				wx.removeStorageSync('userToken')
			} else if (res.statusCode == 429) {
				if (!networkErrorShowSkip && !networkErrorModalShowing) {
					networkErrorModalShowing = true
					fail(res) // 提前回调fail
					wx.showModal({
						title: '请求异常',
						content: '请求数量过多，请耐心等待，稍后重试',
						confirmText: '重试',
						success: res => {
							networkErrorModalShowing = false
							if (res.confirm) {
								request(options)
							}
						}
					})
				} else {
					fail(res)
				}
			} else if (res.statusCode == 503 || res.statusCode == 500) {
				if (!networkErrorShowSkip && !networkErrorModalShowing) {
					networkErrorModalShowing = true
					fail(res) // 提前回调fail
					if (res.data && res.data.code == -1 && res.data.msg == 'permissionDenied'){
						wx.showModal({
							title: '访问受限',
							content: '访问受限，您还是放弃吧，如有疑问请联系客服',
							confirmText: '知道了',
							showCancel: false,
							success: res => {
								networkErrorModalShowing = false
							}
						})
					} else {
						wx.showModal({
							title: '请求异常',
							content: '请求服务出现异常，请稍后重试',
							confirmText: '重试',
							success: res => {
								networkErrorModalShowing = false
								if (res.confirm){
									request(options)
								}
							}
						})
					}
				} else {
					fail(res)
				}
			} else {
				debugShow('statusCode: ' + res.statusCode)
				fail(res)
			}
		},
		fail: function(res) {
			// console.log('util', method, 'fail', res)
			console.log(res,url)
			debugShow()
			fail(res)
		}
	})
}

function removeStorageUserToken() {
	// wx.removeStorageSync('userToken')
  wx.setStorageSync('userToken', '')
	wx.navigateTo({
		url: '/pages/userLogin/login/index',
	})
	console.log(wx.getStorageSync('userToken'))
}

function debugShow(errorInfo) {
	var userToken = wx.getStorageSync('siteId')

	var debug = config.dev || userToken.debug
	if (debug) {
		wx.showToast({
			title: '[开发时提示] 访问服务异常' + (errorInfo ? ' ' + errorInfo : ''),
			icon: 'none'
		})
	}
}
// 返回上一页面
function _navback() {
	wx.navigateBack()
}
module.exports = {
	showMessage,
	showModal,
	get: get,
	post: post,
	request: request,
	removeStorageUserToken: removeStorageUserToken,
	login: login,
	navback:_navback,
}
