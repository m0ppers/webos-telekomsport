const telekomWebClient = function(method: string, args: any[]): Promise<any> {
    return fetch('/telekomservice/' + method, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(args),
    })
    .then((response) => {
        if (response.status == 200) {
            return response.json();
        } else {
            return response.text()
            .then(text => {
                return Promise.reject('Got a non 200 status: ' + response.status + ': ' + text);
            });
        }
    });
};

const telekomWebOSClient = function(method: string, args: any[]): Promise<any> {
    return new Promise(function(resolve, reject) {
        webOS.service.request("luna://koeln.mop.telekomsport.comm/", {
            method,
            parameters: {
                args
            },
            onSuccess: function(inResponse: any) {
                if (inResponse.returnValue) {
                    resolve(inResponse.result);
                } else {
                    reject(inResponse.errorText);
                }
            },
            onFailure: function(inError: any) {
                reject(inError.errorText);
            },
        });
    })
};

export const telekomClient = process.env.NODE_ENV == 'production' ? telekomWebOSClient : telekomWebClient;