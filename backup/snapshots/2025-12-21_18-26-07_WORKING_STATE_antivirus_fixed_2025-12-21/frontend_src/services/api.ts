import axios from 'axios';
import type { SystemInfo, SecurityAssessment, RatingResult } from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000
});

export const apiService = {
  async getSystemInfo(): Promise<SystemInfo> {
    const { data } = await api.get<SystemInfo>('/system/info');
    return data;
  },

  async getPublicIp(): Promise<{ publicIp: string }> {
    const { data } = await api.get<{ publicIp: string }>('/system/public-ip');
    return data;
  },

  async performSecurityAssessment(): Promise<SecurityAssessment> {
    const { data } = await api.post<{ assessment: SecurityAssessment }>('/scan/security');
    return data.assessment;
  },

  async calculateRating(browserFingerprint: any): Promise<RatingResult> {
    const { data } = await api.post<RatingResult>('/rating/calculate', {
      browserFingerprint
    });
    return data;
  },

  async getCompleteScan(): Promise<{
    systemInfo: SystemInfo;
    securityAssessment: SecurityAssessment;
    rating: RatingResult;
  }> {
    const { data } = await api.get('/scan/complete');
    return data;
  }
};
