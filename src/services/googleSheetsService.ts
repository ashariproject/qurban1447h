import { supabase } from '@/integrations/supabase/client';

interface GoogleSheetsConfig {
  apiKey?: string;
  spreadsheetId: string;
}

export class GoogleSheetsService {
  private spreadsheetId: string;

  constructor(config: GoogleSheetsConfig) {
    this.spreadsheetId = config.spreadsheetId;
  }

  private async invoke(action: string, payload: Record<string, unknown> = {}) {
    const { data, error } = await supabase.functions.invoke('google-sheets', {
      body: { action, spreadsheetId: this.spreadsheetId, ...payload },
    });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);
    return data;
  }

  async readSheet(range: string) {
    const data = await this.invoke('read', { range });
    return data?.values || [];
  }

  async writeSheet(range: string, values: any[][]) {
    return await this.invoke('write', { range, values });
  }

  async appendSheet(range: string, values: any[][]) {
    return await this.invoke('append', { range, values });
  }

  async verify() {
    return await this.invoke('verify');
  }
}
