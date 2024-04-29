export const defaullHeader = {
    headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Allow-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
    }
};

export const jwtHeader = (token: string) => {
    return {
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Allow-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
            'Authorization': 'Bearer ' + token
        }
    };
};