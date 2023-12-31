import axios from 'axios';
import { httpCodes, httpError, httpMessages } from '../http-manager.js';
import { VARS } from '../vars.js';

import { WeChatPayloadPhone, WeChatPayloadOpenId, WeChatPayloadToken, WeChatPayloadBase, WeChatPayloadEncryptedKey } from '../models/wechat.js';
import { utilityService } from './utility.js';

class WeChatService {

  /**
   * Get access token
   * @returns {Promise<WeChatPayloadToken>} Returns token
   */
  async obtainAccessToken() {
    const requestUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${VARS.APP_ID}&secret=${VARS.APP_SECRET}`;
    try {
      /** @type {import('axios').AxiosResponse} */
      const response = await axios(requestUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      /** @type {WeChatPayloadToken} */
      const payload = response.data;
      return payload;
    }
    catch(error) {
      throw httpError(httpCodes.BAD_REQUEST, httpMessages.BAD_REQUEST, error);
    }
  }

  /**
   * Get telephone data
   * @param {string} accessToken Access token
   * @param {string} code Login code
   * @param {string} openid Open ID
   * @returns {Promise<WeChatPayloadPhone>} Returns data payload of the phone
   */
  async obtainTelephone(accessToken, code, openid) {
    const requestUrl = `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${accessToken}`;
    try {
      /** @type {import('axios').AxiosResponse} */
      const response = await axios(requestUrl, {
        method: 'POST',
        data: {
          code, openid
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      /** @type {WeChatPayloadPhone} */
      const payload = response.data;
      return payload;
    }
    catch(error) {
      throw httpError(httpCodes.BAD_REQUEST, httpMessages.BAD_REQUEST, error);
    }
  }

  /**
   * Get Open ID data
   * @param {string} code Login code
   * @returns {Promise<WeChatPayloadOpenId>} Returns data
   */
  async obtainOpenId(code) {
    const requestUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${VARS.APP_ID}&secret=${VARS.APP_SECRET}&js_code=${code}&grant_type=authorization_code`;
    try {
      /** @type {import('axios').AxiosResponse} */
      const response = await axios(requestUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      /** @type {WeChatPayloadOpenId} */
      const payload = response.data;
      return payload;
    }
    catch(error) {
      throw httpError(httpCodes.BAD_REQUEST, httpMessages.BAD_REQUEST, error);
    }
  }

  /**
   * Verify session key
   * @param {string} openId WeChat open ID
   * @param {string} accessToken Access token
   * @param {string} sessionKey Session key
   * @returns {Promise<WeChatPayloadBase>} Returns data
   * @deprecated
   */
  async verifySession(openId, accessToken, sessionKey) {
    const signature = utilityService.sign('', sessionKey);
    const requestUrl = `https://api.weixin.qq.com/wxa/checksession?access_token==${accessToken}&openid=${openId}&signature=${signature}&sig_method=hmac_sha256`;
    try {
      /** @type {import('axios').AxiosResponse} */
      const response = await axios(requestUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      /** @type {WeChatPayloadBase} */
      const payload = response.data;
      return payload;
    }
    catch(error) {
      throw httpError(httpCodes.BAD_REQUEST, httpMessages.BAD_REQUEST, error);
    }
  }

  /**
   * Fetch WeChat user information
   * @param {string} openId WeChat open ID
   * @param {string} accessToken Access token
   * @param {string} sessionKey Session key
   * @returns {Promise<WeChatPayloadEncryptedKey>} Returns data
   */
  async fetchUser(openId, accessToken, sessionKey) {
    const signature = utilityService.sign('', sessionKey);
    const requestUrl = `https://api.weixin.qq.com/wxa/getuserencryptkey?access_token==${accessToken}&openid=${openId}&signature=${signature}&sig_method=hmac_sha256`;
    try {
      /** @type {import('axios').AxiosResponse} */
      const response = await axios(requestUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if(response.status === httpCodes.OK) {
        /** @type {WeChatPayloadEncryptedKey} */
        const payload = response.data;
        const encryptedKey = payload.key_info_list[0];
        // @todo: Check where is the encryptedData...
        return payload;
      }
      throw httpError(httpCodes.BAD_REQUEST, httpMessages.BAD_REQUEST);
    }
    catch(error) {
      throw httpError(httpCodes.BAD_REQUEST, httpMessages.BAD_REQUEST, error);
    }
  }
}

export const wechatService = new WeChatService();
