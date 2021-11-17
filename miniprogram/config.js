/**
 * config js
 */
var version = '1.0.0.20201123'
// undefined 开发者工具；develop 开发预览版；trial 体验版；release 正式版
var wxVersion = __wxConfig.envVersion

var systemInfo = wx.getSystemInfoSync()
// console.log('systemInfo ', systemInfo)
var platform = systemInfo.platform
var dev = platform == 'devtools' // dev true 开发环境， false 现网环境
console.log(platform, wxVersion, dev)
// 下面地址保持不变，不推荐修改
var baseUrl = false ?
  'https://www.vpxyy.com/' : // 本地开发
  'https://www.vpxyy.com/' // 现网环境
if (wxVersion == 'trial') {
  baseUrl = 'https://www.vpxyy.com/' // 现网体验测试环境
}

var config = {
  version: version,
  wxVersion: wxVersion,
  appId: 'wxfd2bfbc422bcfa67',
  platform: platform,
  dev: dev,
  brand: systemInfo.brand,
  model: systemInfo.model,
  permitPay: dev || platform != 'ios',
  baseUrl: baseUrl,
};
module.exports = config;