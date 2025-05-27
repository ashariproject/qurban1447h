import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

interface PackagingData {
  sapi: {
    input: number;
    output: number;
  };
  kambing: {
    input: number;
    output: number;
  };
}

const PackagingDataTable = () => {
  const [data, setData] = useState<PackagingData>({
    sapi: { input: 0, output: 0 },
    kambing: { input: 0, output: 0 }
  });

  // Calculate total packs produced
  const totalPacksProduced = data.sapi.output + data.kambing.output;

  const updateValue = (type: 'sapi' | 'kambing', operation: 'input' | 'output', action: 'increment' | 'decrement') => {
    setData(prev => {
      const newData = { ...prev };
      const currentValue = newData[type][operation];
      
      if (action === 'increment') {
        newData[type][operation] = currentValue + 1;
      } else if (action === 'decrement' && currentValue > 0) {
        newData[type][operation] = currentValue - 1;
      }
      
      // Untuk output, tidak boleh melebihi input
      if (operation === 'output' && newData[type].output > newData[type].input) {
        newData[type].output = newData[type].input;
      }
      
      return newData;
    });
  };

  const CounterControl = ({ 
    label, 
    value, 
    onIncrement, 
    onDecrement, 
    bgColor 
  }: { 
    label: string; 
    value: number; 
    onIncrement: () => void; 
    onDecrement: () => void;
    bgColor: string;
  }) => (
    <div className={`${bgColor} rounded-lg p-4 text-white`}>
      <div className="text-center">
        <h4 className="font-semibold text-lg mb-2">{label}</h4>
        <div className="flex items-center justify-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onDecrement}
            className="bg-white bg-opacity-20 border-white text-white hover:bg-white hover:bg-opacity-30 p-2"
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
          
          <div className="bg-white bg-opacity-20 px-4 py-2 rounded-md min-w-[60px] text-center">
            <span className="text-2xl font-bold">{value}</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onIncrement}
            className="bg-white bg-opacity-20 border-white text-white hover:bg-white hover:bg-opacity-30 p-2"
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const StockIndicator = ({ input, output, type }: { input: number; output: number; type: string }) => {
    const remaining = input - output;
    const percentage = input > 0 ? Math.round((output / input) * 100) : 0;
    
    return (
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="text-sm text-gray-600 mb-1">Stok {type.charAt(0).toUpperCase() + type.slice(1)}</div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-green-600">Sisa: {remaining}</span>
          <span className="text-sm text-gray-500">({percentage}% keluar)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">Data Pengemasan Daging Qurban</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Total Pack Summary */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">TOTAL PACK DIHASILKAN</h3>
            <div className="text-4xl font-bold">{totalPacksProduced}</div>
            <div className="text-purple-100 text-sm mt-2">Pack Daging Siap Distribusi</div>
          </div>

          {/* Daging Sapi */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">DAGING SAPI</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CounterControl
                label="INPUT (Pack Masuk)"
                value={data.sapi.input}
                onIncrement={() => updateValue('sapi', 'input', 'increment')}
                onDecrement={() => updateValue('sapi', 'input', 'decrement')}
                bgColor="bg-gradient-to-br from-green-500 to-green-600"
              />
              <CounterControl
                label="OUTPUT (Pack Keluar)"
                value={data.sapi.output}
                onIncrement={() => updateValue('sapi', 'output', 'increment')}
                onDecrement={() => updateValue('sapi', 'output', 'decrement')}
                bgColor="bg-gradient-to-br from-red-500 to-red-600"
              />
            </div>
            <StockIndicator input={data.sapi.input} output={data.sapi.output} type="sapi" />
          </div>

          {/* Daging Kambing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">DAGING KAMBING</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CounterControl
                label="INPUT (Pack Masuk)"
                value={data.kambing.input}
                onIncrement={() => updateValue('kambing', 'input', 'increment')}
                onDecrement={() => updateValue('kambing', 'input', 'decrement')}
                bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <CounterControl
                label="OUTPUT (Pack Keluar)"
                value={data.kambing.output}
                onIncrement={() => updateValue('kambing', 'output', 'increment')}
                onDecrement={() => updateValue('kambing', 'output', 'decrement')}
                bgColor="bg-gradient-to-br from-orange-500 to-orange-600"
              />
            </div>
            <StockIndicator input={data.kambing.input} output={data.kambing.output} type="kambing" />
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">RINGKASAN</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{data.sapi.input + data.kambing.input}</div>
                <div className="text-sm text-gray-600">Total Input</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{data.sapi.output + data.kambing.output}</div>
                <div className="text-sm text-gray-600">Total Output</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{(data.sapi.input - data.sapi.output) + (data.kambing.input - data.kambing.output)}</div>
                <div className="text-sm text-gray-600">Sisa Stok</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {data.sapi.input + data.kambing.input > 0 ? 
                    Math.round(((data.sapi.output + data.kambing.output) / (data.sapi.input + data.kambing.input)) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">Persentase Keluar</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PackagingDataTable;
