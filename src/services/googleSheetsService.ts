
interface GoogleSheetsConfig {
  apiKey: string;
  spreadsheetId: string;
}

export class GoogleSheetsService {
  private apiKey: string;
  private spreadsheetId: string;
  private baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';

  constructor(config: GoogleSheetsConfig) {
    this.apiKey = config.apiKey;
    this.spreadsheetId = config.spreadsheetId;
  }

  // Read data from sheet
  async readSheet(range: string) {
    try {
      const url = `${this.baseUrl}/${this.spreadsheetId}/values/${range}?key=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error('Error reading from Google Sheets:', error);
      throw error;
    }
  }

  // Write data to sheet
  async writeSheet(range: string, values: any[][]) {
    try {
      const url = `${this.baseUrl}/${this.spreadsheetId}/values/${range}?valueInputOption=RAW&key=${this.apiKey}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: values
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error writing to Google Sheets:', error);
      throw error;
    }
  }

  // Append data to sheet
  async appendSheet(range: string, values: any[][]) {
    try {
      const url = `${this.baseUrl}/${this.spreadsheetId}/values/${range}:append?valueInputOption=RAW&key=${this.apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: values
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error appending to Google Sheets:', error);
      throw error;
    }
  }
}
