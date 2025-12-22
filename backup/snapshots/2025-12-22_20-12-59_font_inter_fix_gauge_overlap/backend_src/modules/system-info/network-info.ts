import si from 'systeminformation';
import axios from 'axios';
import { NetworkInfo } from '../../types';

export async function getNetworkInfo(): Promise<NetworkInfo> {
  try {
    const [networkInterfaces, defaultGateway] = await Promise.all([
      si.networkInterfaces(),
      si.networkGatewayDefault()
    ]);

    let publicIp = 'Unknown';
    try {
      // Usa API pubblica per ottenere IP
      const response = await axios.get('https://api.ipify.org?format=json', { timeout: 5000 });
      publicIp = response.data.ip;
    } catch (error) {
      console.error('Failed to get public IP:', error);
    }

    return {
      interfaces: networkInterfaces.map(iface => ({
        iface: iface.iface,
        ip4: iface.ip4 || '',
        ip6: iface.ip6 || '',
        mac: iface.mac || '',
        type: iface.type || 'unknown'
      })),
      publicIp,
      defaultGateway: defaultGateway || 'Unknown'
    };
  } catch (error) {
    console.error('Error getting network info:', error);
    throw new Error('Failed to retrieve network information');
  }
}
