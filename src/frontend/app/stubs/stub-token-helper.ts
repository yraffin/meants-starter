import * as CryptoJS from 'crypto-js';

export const SECRET_KEY = 'my-test-secret';
export class StubTokenHelper {
    header = {
        'alg': 'HS256',
        'typ': 'JWT'
    };

    generateToken(username) {
        const expDate = new Date();
        expDate.setUTCSeconds(35 * 60);
        const expTime = expDate.getTime() / 1000;
        const encodedHeader = this.base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(this.header)));
        const encodedData = this.base64url(CryptoJS.enc.Utf8.parse(JSON.stringify({
            username: username,
            exp: expTime
        })));

        const token = encodedHeader + '.' + encodedData;
        const signature = this.base64url(CryptoJS.HmacSHA256(token, SECRET_KEY));

        return {
            token: token + '.' + signature
        };
    }

    generateWithoutToken(username) {
        return {};
    }

    base64url(source) {
        // Encode in classical base64
        let encodedSource = CryptoJS.enc.Base64.stringify(source);

        // Remove padding equal characters
        encodedSource = encodedSource.replace(/=+$/, '');

        // Replace characters according to base64url specifications
        encodedSource = encodedSource.replace(/\+/g, '-');
        encodedSource = encodedSource.replace(/\//g, '_');

        return encodedSource;
    }
}
