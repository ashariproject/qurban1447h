import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dhtwmyscdyccepulhuzt.supabase.co';
const supabaseKey = 'sb_publishable_3Y4mnWcJiu2ZWQYz09V7lg_AmHsc_NO';

const supabase = createClient(supabaseUrl, supabaseKey);

const targetOrder = [
  "Sugeng Hariyanto",
  "Ika Desti Ariani",
  "Bambang widjanarko",
  "dr. Ariyanto setyoaji",
  "dr. Ariyanto setyoaji",
  "Sulimah",
  "Eddy Baktiana",
  "Syarif Bachmid",
  "Muhammad Yazid Zidane bin Ucok Wahyudi",
  "Hj. Hanik Chiswariningsih",
  "Jumantoro",
  "Bryan wakita bin rukani",
  "Retno wijayanti",
  "Pamujiah",
  "Ir. H. Sigit Panoentoen, M.Si",
  "Evi Sylvia Awwalia",
  "H. Ashari",
  "Asriana Fardha Aisyahbilla",
  "Ellyne Dwi Poespasari",
  "Cahyo Rubyan",
  "Dimas Prasetyo",
  "Gumilar Rahadhyan Prasetya",
  "Devhi Andayuni Yuda Putri",
  "Heryuda",
  "Retno wahyuni",
  "Devha Andhika Yuda Putra",
  "Anne Nurjanah Fitriani",
  "Rudi Gunawan",
  "Ir. Fadjar Harjo Saputro, S.T., M.Sc",
  "Gatot Prawoto",
  "Agus Supriyadi",
  "Annis Catur Adi",
  "Annis Catur Adi",
  "Ahmad Kristriono W",
  "Dwi Ari Retnani"
];

const newPatungan4Names = [
  "Gumilar Rahadhyan Prasetya",
  "Devhi Andayuni Yuda Putri",
  "Heryuda",
  "Retno wahyuni",
  "Devha Andhika Yuda Putra",
  "Anne Nurjanah Fitriani",
  "Rudi Gunawan"
];

async function updateOrder() {
  console.log("Fetching data...");
  const { data, error } = await supabase.from('shohibul').select('*').eq('jenisQurban', 'sapi-patungan');
  
  if (error) {
    console.error("Error fetching:", error);
    return;
  }
  
  const baseDate = new Date('2024-05-01T00:00:00Z');
  let usedIds = new Set();
  
  // First, find and update all the MATCHING records from the user list
  for (let i = 0; i < targetOrder.length; i++) {
    const targetName = targetOrder[i].trim().toLowerCase();
    
    // Skip the Patungan 4 ones for now, we'll assign them from the remaining later if not found
    if (newPatungan4Names.map(n => n.toLowerCase()).includes(targetName)) {
      continue; 
    }
    
    const matches = data.filter(d => d.nama.toLowerCase().includes(targetName) && !usedIds.has(d.id));
    if (matches.length > 0) {
      const match = matches[0];
      usedIds.add(match.id);
      
      const newDate = new Date(baseDate.getTime() + i * 60000).toISOString();
      await supabase.from('shohibul').update({ tanggalDaftar: newDate }).eq('id', match.id);
      console.log(`Updated existing: ${match.nama} -> position ${i}`);
    }
  }

  // Find remaining unassigned records (should be 7)
  const remaining = data.filter(d => !usedIds.has(d.id));
  console.log(`Found ${remaining.length} unassigned records. Assigning them to Patungan 4...`);
  
  let p4Index = 0;
  for (let i = 0; i < targetOrder.length; i++) {
    const targetName = targetOrder[i].trim();
    if (newPatungan4Names.includes(targetName)) {
      if (p4Index < remaining.length) {
        const match = remaining[p4Index];
        const newDate = new Date(baseDate.getTime() + i * 60000).toISOString();
        
        await supabase.from('shohibul').update({ 
          nama: targetName,
          tanggalDaftar: newDate 
        }).eq('id', match.id);
        
        console.log(`Renamed & Updated: ${match.nama} -> ${targetName} (position ${i})`);
        p4Index++;
      }
    }
  }
  
  console.log("Finished exact ordering!");
}

updateOrder();
