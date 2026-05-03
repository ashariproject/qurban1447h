import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Auto-set default Google Sheets config if not yet configured
const DEFAULT_SHEETS_API_KEY = 'AIzaSyDqG6gb-4D-veCGF2tZD6lIhkijzw6H7H0';
const DEFAULT_SHEETS_ID = '12R3cUns47re1EfLBYHikok4S-QNk7yLMZUdVpMQwDuI';
if (!localStorage.getItem('googleSheetsApiKey')) {
  localStorage.setItem('googleSheetsApiKey', DEFAULT_SHEETS_API_KEY);
}
if (!localStorage.getItem('googleSheetsSpreadsheetId')) {
  localStorage.setItem('googleSheetsSpreadsheetId', DEFAULT_SHEETS_ID);
}

createRoot(document.getElementById("root")!).render(<App />);
