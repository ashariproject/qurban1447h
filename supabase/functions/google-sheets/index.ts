import { corsHeaders } from '@supabase/supabase-js/cors';

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/google_sheets/v4';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const GOOGLE_SHEETS_API_KEY = Deno.env.get('GOOGLE_SHEETS_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY tidak terkonfigurasi');
    if (!GOOGLE_SHEETS_API_KEY) throw new Error('GOOGLE_SHEETS_API_KEY tidak terkonfigurasi');

    const { action, spreadsheetId, range, values } = await req.json();
    if (!spreadsheetId) throw new Error('spreadsheetId wajib diisi');

    let url = '';
    let method = 'GET';
    let body: string | undefined;

    if (action === 'read') {
      url = `${GATEWAY_URL}/spreadsheets/${spreadsheetId}/values/${range}`;
    } else if (action === 'write') {
      url = `${GATEWAY_URL}/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`;
      method = 'PUT';
      body = JSON.stringify({ values });
    } else if (action === 'append') {
      url = `${GATEWAY_URL}/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;
      method = 'POST';
      body = JSON.stringify({ values });
    } else if (action === 'verify') {
      url = `${GATEWAY_URL}/spreadsheets/${spreadsheetId}`;
    } else {
      throw new Error(`Action tidak dikenal: ${action}`);
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': GOOGLE_SHEETS_API_KEY,
        'Content-Type': 'application/json',
      },
      body,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Google Sheets API gagal [${response.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('google-sheets error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
