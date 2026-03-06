/**
 * cPanel UAPI helpers for managing email accounts.
 *
 * Network Solutions uses cPanel. Set these env vars:
 *   CPANEL_HOST     – hostname of cPanel (e.g. yourdomain.com or cpanel.yourdomain.com)
 *   CPANEL_PORT     – cPanel port, default 2083
 *   CPANEL_USERNAME – your cPanel login username
 *   CPANEL_PASSWORD – your cPanel login password (never exposed to students)
 *   EMAIL_DOMAIN    – the domain to create addresses on (e.g. yourschool.com)
 *   CPANEL_INSECURE – set to "true" to skip SSL verification (dev only)
 */

function getCpanelConfig() {
  const host = process.env.CPANEL_HOST;
  const port = process.env.CPANEL_PORT || '2083';
  const username = process.env.CPANEL_USERNAME;
  const password = process.env.CPANEL_PASSWORD;
  const domain = process.env.EMAIL_DOMAIN;

  if (!host || !username || !password || !domain) {
    throw new Error(
      'Missing cPanel config. Set CPANEL_HOST, CPANEL_USERNAME, CPANEL_PASSWORD, and EMAIL_DOMAIN in .env.local'
    );
  }

  const credentials = Buffer.from(`${username}:${password}`).toString('base64');
  const baseUrl = `https://${host}:${port}/execute/Email`;

  return { baseUrl, credentials, domain };
}

async function cpanelPost(endpoint: string, params: Record<string, string>) {
  const { baseUrl, credentials } = getCpanelConfig();

  const fetchOptions: RequestInit = {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(params).toString(),
  };

  // Allow insecure connections in dev if needed
  if (process.env.CPANEL_INSECURE === 'true') {
    const https = await import('https');
    (fetchOptions as any).agent = new https.Agent({ rejectUnauthorized: false });
  }

  const res = await fetch(`${baseUrl}/${endpoint}`, fetchOptions);

  if (!res.ok) {
    throw new Error(`cPanel HTTP error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.status === 0) {
    throw new Error(`cPanel error: ${(json.errors ?? []).join(', ')}`);
  }

  return json;
}

/**
 * Create a new email inbox via cPanel.
 */
export async function createCpanelEmail(localPart: string, password: string): Promise<void> {
  const { domain } = getCpanelConfig();
  await cpanelPost('add_pop', {
    email: localPart,
    password,
    domain,
    quota: '250', // MB quota; adjust as needed
  });
}

/**
 * Delete an email inbox via cPanel.
 */
export async function deleteCpanelEmail(localPart: string): Promise<void> {
  const { domain } = getCpanelConfig();
  await cpanelPost('delete_pop', {
    email: `${localPart}@${domain}`,
    domain,
  });
}
