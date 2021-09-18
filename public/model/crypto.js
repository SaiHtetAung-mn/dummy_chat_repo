import CryptoMD5 from '../js/crypto/md5.js';
import CryptoAES from '../js/crypto/aes.js';

const MESSAGE_KEY = "msg-123";

export let createHash = (data) => {
    return String(CryptoMD5.MD5(data));
}

export let encryptMessage = (message) => {
    let passPhrase = CryptoAES.enc.Base64.parse(MESSAGE_KEY);
    return CryptoAES.AES.encrypt(message, passPhrase.toString()).toString();
}

export let decryptMessage = (encMessage) => {
    let passPhrase = CryptoAES.enc.Base64.parse(MESSAGE_KEY);
    let cipherText = CryptoAES.AES.decrypt(encMessage, passPhrase.toString());
    return cipherText.toString(CryptoAES.enc.Utf8);
}