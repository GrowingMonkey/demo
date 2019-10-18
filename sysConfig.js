const configs = {
	// 正式环境
	production: {
		HTTP_SERVER: 'https://api.xxx.com',

		WS_SERVER: 'wss://api.xxx.com',
	},

	// 测试环境
	test: {
		HTTP_SERVER: 'https://192.168.1.1:9443',

		WS_SERVER: 'wss://192.168.1.1:9443',
	},
};
const API_ENV = API_ENV ? APP_TYPE: 'site';
console.log(API_ENV);
export const env = configs[API_ENV];