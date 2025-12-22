import { Router } from 'express';
import { getSystemInfo } from '../modules/system-info';
import { performSecurityAssessment } from '../modules/security-assessment';
import { RatingEngine } from '../modules/rating-engine';

const router = Router();
const ratingEngine = new RatingEngine();

// Store in-memory per risultati scansioni
const scanResults = new Map<string, any>();

// GET /api/system/info - Info sistema base
router.get('/system/info', async (_req, res) => {
  try {
    const systemInfo = await getSystemInfo();
    res.json(systemInfo);
  } catch (error) {
    console.error('Error getting system info:', error);
    res.status(500).json({ error: 'Failed to retrieve system information' });
  }
});

// GET /api/system/public-ip - IP pubblico
router.get('/system/public-ip', async (_req, res) => {
  try {
    const systemInfo = await getSystemInfo();
    res.json({ publicIp: systemInfo.network.publicIp });
  } catch (error) {
    console.error('Error getting public IP:', error);
    res.status(500).json({ error: 'Failed to retrieve public IP' });
  }
});

// POST /api/scan/security - Avvia security assessment
router.post('/scan/security', async (_req, res) => {
  try {
    const assessment = await performSecurityAssessment();
    const scanId = `scan-${Date.now()}`;

    scanResults.set(scanId, {
      type: 'security',
      data: assessment,
      timestamp: new Date()
    });

    res.json({ scanId, assessment });
  } catch (error) {
    console.error('Error performing security assessment:', error);
    res.status(500).json({ error: 'Failed to perform security assessment' });
  }
});

// GET /api/scan/security/:id - Risultati assessment
router.get('/scan/security/:id', (req, res) => {
  const { id } = req.params;
  const result = scanResults.get(id);

  if (!result || result.type !== 'security') {
    return res.status(404).json({ error: 'Scan not found' });
  }

  return res.json(result.data);
});

// POST /api/rating/calculate - Calcola rating complessivo
router.post('/rating/calculate', async (req, res) => {
  try {
    const { browserFingerprint } = req.body;

    // Get system info e security assessment
    const [systemInfo, securityAssessment] = await Promise.all([
      getSystemInfo(),
      performSecurityAssessment()
    ]);

    const rating = ratingEngine.calculateRating(
      browserFingerprint || null,
      securityAssessment,
      systemInfo
    );

    res.json(rating);
  } catch (error) {
    console.error('Error calculating rating:', error);
    res.status(500).json({ error: 'Failed to calculate rating' });
  }
});

// GET /api/scan/complete - Scansione completa
router.get('/scan/complete', async (_req, res) => {
  try {
    const [systemInfo, securityAssessment] = await Promise.all([
      getSystemInfo(),
      performSecurityAssessment()
    ]);

    const rating = ratingEngine.calculateRating(
      null, // Browser fingerprint verrà dal frontend
      securityAssessment,
      systemInfo
    );

    res.json({
      systemInfo,
      securityAssessment,
      rating
    });
  } catch (error) {
    console.error('Error performing complete scan:', error);
    res.status(500).json({ error: 'Failed to perform complete scan' });
  }
});

export default router;
