
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Beef } from 'lucide-react';
import { ShohibulData } from '@/contexts/QurbanContext';

interface SapiKolektifGroupsProps {
  shohibulList: ShohibulData[];
}

const SapiKolektifGroups: React.FC<SapiKolektifGroupsProps> = ({ shohibulList }) => {
  const patunganList = shohibulList
    .filter(s => s.jenisQurban === 'sapi-patungan')
    .sort((a, b) => {
      const dateCompare = (a.tanggalDaftar || '').localeCompare(b.tanggalDaftar || '');
      if (dateCompare !== 0) return dateCompare;
      return a.nama.localeCompare(b.nama);
    });
  
  // Group into arrays of 7
  const groups: ShohibulData[][] = [];
  for (let i = 0; i < patunganList.length; i += 7) {
    groups.push(patunganList.slice(i, i + 7));
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 text-gray-500">
        Belum ada peserta Sapi Patungan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group, index) => (
        <Card key={index} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Beef className="h-5 w-5" />
                SAPI PATUNGAN #{index + 1}
              </CardTitle>
              <Badge variant="outline" className="bg-white/20 text-white border-white/40">
                {group.length}/7 Peserta
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-gray-100">
              {group.map((shohibul, sIdx) => (
                <li key={shohibul.id} className="p-3 flex items-center gap-3 hover:bg-orange-50 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                    {sIdx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{shohibul.nama}</p>
                    <p className="text-xs text-gray-500 truncate">{shohibul.alamat || '-'}</p>
                  </div>
                  {shohibul.pembayaran.status.startsWith('lunas') ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none text-[10px] h-5 px-1.5">LUNAS</Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-400 border-gray-200 text-[10px] h-5 px-1.5">PENDING</Badge>
                  )}
                </li>
              ))}
              {/* Fill empty slots */}
              {Array.from({ length: 7 - group.length }).map((_, i) => (
                <li key={`empty-${i}`} className="p-3 flex items-center gap-3 bg-gray-50/50">
                  <div className="h-8 w-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold text-xs">
                    {group.length + i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-300 italic">Menunggu Peserta...</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SapiKolektifGroups;
