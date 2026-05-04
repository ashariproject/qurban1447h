import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Default Spreadsheet ID — auth handled via Lovable Cloud Connector (no API key needed in frontend)
const DEFAULT_SHEETS_ID = '1-63ACPYm_ZI7jhkK4sCc8_E09YnlgSgZRw-oCZGa-qo';
localStorage.setItem('googleSheetsSpreadsheetId', DEFAULT_SHEETS_ID);
// Legacy key marker so isConfigured checks pass
localStorage.setItem('googleSheetsApiKey', 'lovable-cloud-connector');

createRoot(document.getElementById("root")!).render(<App />);
