import { execSync } from 'child_process';

// Test diretto del comando PowerShell
const cmd = 'powershell.exe -Command "Get-CimInstance -Namespace root/SecurityCenter2 -ClassName AntiVirusProduct | Select-Object displayName, productState | ConvertTo-Json"';

console.log('Testing antivirus detection...\n');

try {
  const output = execSync(cmd, { encoding: 'utf-8', timeout: 10000 });
  const products = JSON.parse(output.trim());
  const avList = Array.isArray(products) ? products : [products];

  console.log(`Found ${avList.length} antivirus products:\n`);

  for (const av of avList) {
    const state = av.productState;
    const hex = state.toString(16).padStart(6, '0');

    // New decoding logic
    const defStatus = hex.substring(0, 2);
    const providerState = hex.substring(2, 4);

    const enabled = providerState !== '00';
    const updated = defStatus === '00' || defStatus === '01';

    console.log(`Name: ${av.displayName}`);
    console.log(`  State: ${state} (0x${hex})`);
    console.log(`  Def Status: ${defStatus} | Provider State: ${providerState}`);
    console.log(`  Enabled: ${enabled}`);
    console.log(`  Updated: ${updated}`);
    console.log();
  }

  // Test priority selection
  const thirdParty = avList.find((av: any) => {
    const hex = av.productState.toString(16).padStart(6, '0');
    const providerState = hex.substring(2, 4);
    const enabled = providerState !== '00';
    return enabled && !av.displayName.toLowerCase().includes('defender');
  });

  console.log('=== Selection Result ===');
  if (thirdParty) {
    console.log(`Selected: ${thirdParty.displayName} (Third-party antivirus)`);
  } else {
    console.log('Selected: Windows Defender (fallback)');
  }

} catch (error) {
  console.error('Error:', error);
}
