import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Auto-set default Google Sheets config if not yet configured
const DEFAULT_SHEETS_API_KEY = 'AIzaSyDqG6gb-4D-veCGF2tZD6lIhkijzw6H7H0';
const DEFAULT_SHEETS_ID = '1-63ACPYm_ZI7jhkK4sCc8_E09YnlgSgZRw-oCZGa-qo';
// Always sync to latest defaults
localStorage.setItem('googleSheetsApiKey', DEFAULT_SHEETS_API_KEY);
localStorage.setItem('googleSheetsSpreadsheetId', DEFAULT_SHEETS_ID);

createRoot(document.getElementById("root")!).render(<App />);
