
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface AnimalProcessData {
  id: string;
  code: string;
  type: 'sapi' | 'kambing';
  status: 'diterima' | 'disembelih' | 'dipotong';
}

const AnimalDataForm = () => {
  const [animalCounts, setAnimalCounts] = useState({
    sapi: { total: 12, disembelih: 8 },
    kambing: { total: 13, dipotong: 7 }
  });

  // Simulated animal list from shohibul input
  const [animalList] = useState<AnimalProcessData[]>([
    { id: '1', code: 'SP001', type: 'sapi', status: 'diterima' },
    { id: '2', code: 'SP002', type: 'sapi', status: 'diterima' },
    { id: '3', code: 'SP003', type: 'sapi', status: 'disembelih' },
    { id: '4', code: 'KM001', type: 'kambing', status: 'diterima' },
    { id: '5', code: 'KM002', type: 'kambing', status: 'disembelih' },
    { id: '6', code: 'KM003', type: 'kambing', status: 'dipotong' },
    { id: '7', code: 'SP004', type: 'sapi', status: 'diterima' },
    { id: '8', code: 'KM004', type: 'kambing', status: 'diterima' }
  ]);

  const [selectedAnimal, setSelectedAnimal] = useState<string>('');
  const [processAction, setProcessAction] = useState<'sembelih' | 'potong'>('sembelih');

  const updateCount = (type: 'sapi' | 'kambing', action: 'increment' | 'decrement', process: 'disembelih' | 'dipotong') => {
    setAnimalCounts(prev => {
      const current = prev[type][process];
      const total = prev[type].total;
      
      let newValue = current;
      if (action === 'increment' && current < total) {
        newValue = current + 1;
      } else if (action === 'decrement' && current > 0) {
        newValue = current - 1;
      }

      return {
        ...prev,
        [type]: {
          ...prev[type],
          [process]: newValue
        }
      };
    });
  };

  const handleProcessAnimal = () => {
    if (selectedAnimal) {
      console.log(`Processing animal ${selectedAnimal} for ${processAction}`);
      // Here you would update the animal status and counts
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sapi Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold text-orange-600">
              HEWAN SAPI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{animalCounts.sapi.total}</div>
              <div className="text-orange-100">Total Hewan Sapi</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <span className="font-medium">Disembelih:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateCount('sapi', 'decrement', 'disembelih')}
                    disabled={animalCounts.sapi.disembelih <= 0}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <span className="font-bold text-lg w-8 text-center">
                    {animalCounts.sapi.disembelih}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateCount('sapi', 'increment', 'disembelih')}
                    disabled={animalCounts.sapi.disembelih >= animalCounts.sapi.total}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kambing Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold text-green-600">
              HEWAN KAMBING
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{animalCounts.kambing.total}</div>
              <div className="text-green-100">Total Hewan Kambing</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <span className="font-medium">Dipotong:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateCount('kambing', 'decrement', 'dipotong')}
                    disabled={animalCounts.kambing.dipotong <= 0}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <span className="font-bold text-lg w-8 text-center">
                    {animalCounts.kambing.dipotong}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateCount('kambing', 'increment', 'dipotong')}
                    disabled={animalCounts.kambing.dipotong >= animalCounts.kambing.total}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Animal Processing List */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">
            Daftar Hewan untuk Diproses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Animal Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Pilih Hewan:</h3>
              <RadioGroup value={selectedAnimal} onValueChange={setSelectedAnimal}>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {animalList.map((animal) => (
                    <div key={animal.id} className="flex items-center space-x-2 p-2 rounded border">
                      <RadioGroupItem value={animal.id} id={animal.id} />
                      <Label htmlFor={animal.id} className="flex-1 cursor-pointer">
                        <span className="font-medium">{animal.code}</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          animal.type === 'sapi' 
                            ? 'bg-orange-100 text-orange-600' 
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {animal.type.toUpperCase()}
                        </span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          animal.status === 'diterima' 
                            ? 'bg-blue-100 text-blue-600'
                            : animal.status === 'disembelih'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {animal.status}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Process Action */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Proses:</h3>
              <RadioGroup value={processAction} onValueChange={(value: 'sembelih' | 'potong') => setProcessAction(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sembelih" id="sembelih" />
                  <Label htmlFor="sembelih">Penyembelihan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="potong" id="potong" />
                  <Label htmlFor="potong">Pengeletan (Pemotongan)</Label>
                </div>
              </RadioGroup>

              <Button 
                onClick={handleProcessAnimal}
                disabled={!selectedAnimal}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Proses Hewan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimalDataForm;
