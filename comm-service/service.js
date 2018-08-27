// helloworld_webos_service.js
// simple service, based on low-level Palmbus API

// var base_url = "https://www.telekomsport.de/api/v1"
var oauthUrl = "https://accounts.login.idm.telekom.com/oauth2/tokens"
var jwtUrl = "https://www.telekomsport.de/service/auth/app/login/jwt"
// // const heartbeat_url = "https://www.telekomsport.de/service/heartbeat"
var streamUrl = "https://www.telekomsport.de/service/player/streamAccess"
// // const main_page = "/navigation"

// var pkgInfo = require('./package.json');
// var Service = require('webos-service');
// // Register com.yourdomain.@DIR@.service, on both buses
// var service = new Service(pkgInfo.name);

var Service = require('webos-service'); 
var service = new Service("koeln.mop.telekomsport.comm");

var TelekomSportService = require('webos-telekomsport-service').TelekomSportService;
var telekomSportService = new TelekomSportService();
Object.getOwnPropertyNames(TelekomSportService.prototype).filter(function(prop) {
	return prop != 'constructor';
})
.forEach(function(prop) {
	service.register(prop, function(message) {
		var fn = telekomSportService[prop];
		fn.apply(service, message.payload.args)
        .then(function(result) {
			message.respond({
				returnValue: true,
				result: result,
			})
		}, function(e) {
			message.respond({
				returnValue: false,
				errorText: e,
				errorCode: 1
			});
		});
	});
});