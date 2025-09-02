import axios from 'axios';
import { MERCHANT_CONFIG } from '../config/merchant';

const API_BASE_URL = MERCHANT_CONFIG.apiBaseUrl;

class GiftCardAPI {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
      }
    });
  }

  async redeemGiftCard(giftCardId, amountMinor, taxMinor = 0, merchantId, locationId, posId, receiptNumber) {
    try {
      const payload = {
        amountMinor,
        taxMinor,
        merchantId,
        locationId,
        posId,
        receiptNumber
      };

      const response = await this.api.post(
        `/GiftCards/${giftCardId}/redeem-by-passkit-member`,
        payload
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error redeeming gift card:', error);
      return {
        success: false,
        error: error.response?.data || error.message || 'Error desconocido'
      };
    }
  }
}

export default new GiftCardAPI();
