require('isomorphic-fetch');

var programmUrl = "https://www.telekomsport.de/api/v2/epg/64";
var eventUrl = "https://www.telekomsport.de/api/v2/event/";
var oauthUrl = "https://accounts.login.idm.telekom.com/oauth2/tokens"
var jwtUrl = "https://www.telekomsport.de/service/auth/app/login/jwt"
// // const heartbeat_url = "https://www.telekomsport.de/service/heartbeat"
var streamUrl = "https://www.telekomsport.de/service/player/streamAccess"

export class TelekomSportService {
    private internalAuth(authProperties: any) {
        let data: any = { "claims": "{'id_token':{'urn:telekom.com:all':null}}", "client_id": "10LIVESAM30000004901TSMAPP00000000000000", "scope": "tsm offline_access" };
        for (var key in authProperties) {
            data[key] = authProperties[key];
        }
        var urlEncoded = Object.keys(data).map(key => {
            // @ts-ignore
            var value: string = data[key];
            return key + '=' + encodeURIComponent(value);
        });
        
        return Promise.resolve()
        .then(() => {
            return fetch(oauthUrl, {
                body: urlEncoded.join('&'),
                method: 'POST',
            })
            .then((response) => {
                return response.json();
            })
            .then((jsonResult) => {
                if (jsonResult['access_token']) {
                    const refreshToken = jsonResult['refresh_token'];
                    return fetch(jwtUrl, {
                        body: 'token=' + jsonResult['access_token'],
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        }
                    })
                    .then((jwtResponse: any) => {
                        return jwtResponse.json();
                    })
                    // @ts-ignore
                    .then((jwtResult: any) => {
                        if (typeof jwtResult == 'object' && jwtResult['status'] && jwtResult['status'] == "success" && typeof jwtResult['data'] == 'object' && jwtResult['data']['token']) {
                            return {
                                refreshToken, 
                                jwt: jwtResult['data']['token'],
                                name: jwtResult['data']['display_name'],
                            }
                        } else {
                            return Promise.reject('Invalid jwt result: ' + JSON.stringify(jwtResult));
                        }
                    });
                } else {
                    return Promise.reject('access_token not in oauthresult: ' + JSON.stringify(jsonResult));
                }
            })

        });
    }

    public refreshAuth(refreshToken: string): Promise<any> {
        const authProperties = {
            "grant_type": "refresh_token",
            "refresh_token": refreshToken,
        };
    
        return this.internalAuth(authProperties);
    }

    public passwordAuth(username: string, password: string): Promise<any> {
        const authProperties = {
            "grant_type": "password",
            "username": username,
            "password": password,
        };
    
        return this.internalAuth(authProperties);
    }

    public getVideoStream(jwt: string, videoId: number) {
        return Promise.resolve()
        .then(function() {
            return fetch(streamUrl, {
                body: JSON.stringify({videoId}),
                headers: {
                    'xauthorization': jwt,
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            })
            .then(streamResponse => streamResponse.json());
        })
    }

    public getPlayList(jwt: string, playlistUrl: string) {
        return Promise.resolve()
        .then(function() {
            return fetch(playlistUrl + '?hdnea= ' + jwt)
            .then(streamResponse => streamResponse.text());
        })
    }

    public getNavigation() {
        return Promise.resolve()
        .then(function() {
            return fetch(programmUrl)
            .then(streamResponse => streamResponse.json());
        })
    }

    public getEventVideos(eventId: number) {
        return Promise.resolve()
        .then(function() {
            return fetch(eventUrl + eventId)
            .then(streamResponse => streamResponse.json());
        })
    }
}