import si from 'systeminformation';
import { SoftwareInfo } from '../../types';

export async function getSoftwareInfo(): Promise<SoftwareInfo> {
  try {
    const [installedApps, processes] = await Promise.all([
      si.versions(),
      si.processes()
    ]);

    // Converti versions object in array
    const appsArray = Object.entries(installedApps).map(([name, version]) => ({
      name,
      version: version as string || 'Unknown',
      publisher: 'System'
    }));

    // Limita il numero di app mostrate (top 50 per evitare overload)
    const topApps = appsArray.slice(0, 50);

    return {
      installedApps: topApps,
      processes: processes.all
    };
  } catch (error) {
    console.error('Error getting software info:', error);
    // Fallback: ritorna dati minimi
    return {
      installedApps: [],
      processes: 0
    };
  }
}
