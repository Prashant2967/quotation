/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Shield, 
  Cctv, 
  Cpu, 
  Lock, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Printer, 
  Plus, 
  Trash2, 
  FileText,
  Download
} from 'lucide-react';
import { motion } from 'motion/react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface ProductItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface ClientDetails {
  billing: string;
  delivery: string;
}

export default function App() {
  const [quotationNo, setQuotationNo] = useState('HA/2024-25/001');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [clientDetails, setClientDetails] = useState<ClientDetails>({
    billing: 'Client Name\nAddress Line 1\nAddress Line 2\nGSTIN: ',
    delivery: 'Same as Billing'
  });
  const [items, setItems] = useState<ProductItem[]>([
    { id: '1', description: '4CH 5MP IP CCTV Camera System with Installation', quantity: 1, unitPrice: 25000 },
    { id: '2', description: 'Smart Door Lock with Fingerprint & RFID', quantity: 2, unitPrice: 8500 },
  ]);
  const [freight, setFreight] = useState(500);
  const [gstRate, setGstRate] = useState(18);
  const quotationRef = useRef<HTMLDivElement>(null);

  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const gstAmount = (subtotal * gstRate) / 100;
  const grandTotal = subtotal + gstAmount + freight;

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(36).substr(2, 9), description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof ProductItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!quotationRef.current) return;

    const element = quotationRef.current;
    const safeQuotationNo = quotationNo.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    const opt = {
      margin: [0, 0] as [number, number],
      filename: `Quotation_${safeQuotationNo}.pdf`,
      image: { type: 'jpeg' as const, quality: 1 },
      html2canvas: { 
        scale: 3, 
        useCORS: true, 
        logging: false,
        letterRendering: true,
        windowWidth: 800 // Force a consistent width for rendering
      },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    // Temporarily hide elements and remove shadows that shouldn't be in the PDF
    const printHiddenElements = element.querySelectorAll('.print\\:hidden');
    printHiddenElements.forEach(el => (el as HTMLElement).style.setProperty('display', 'none', 'important'));
    
    // Remove shadows which often use oklch/oklab in v4
    const shadowedElements = element.querySelectorAll('.shadow-2xl, .shadow-xl, .shadow-lg, .shadow-md, .shadow-sm, .shadow');
    shadowedElements.forEach(el => (el as HTMLElement).style.boxShadow = 'none');

    html2pdf().set(opt).from(element).save().then(() => {
      // Restore elements
      printHiddenElements.forEach(el => (el as HTMLElement).style.display = '');
      shadowedElements.forEach(el => (el as HTMLElement).style.boxShadow = '');
    }).catch((err: any) => {
      console.error('PDF Generation Error:', err);
      alert('There was an error generating the PDF. Please try the Print option instead.');
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans print:bg-white print:p-0">
      {/* Controls - Hidden on Print */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap gap-4 justify-between items-center print:hidden">
        <div className="flex items-center gap-2">
          <Shield className="text-blue-600 w-6 h-6" />
          <h1 className="text-xl font-bold text-slate-800">Quotation Builder</h1>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Download size={18} />
            Download PDF
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Printer size={18} />
            Print
          </button>
        </div>
      </div>

      {/* A4 Page Container */}
      <motion.div 
        ref={quotationRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[210mm] mx-auto bg-white shadow-2xl rounded-sm overflow-hidden print:shadow-none print:rounded-none min-h-[297mm] flex flex-col"
      >
        {/* Header Section */}
        <div className="p-8 border-b-4 border-blue-600 text-center">
          <div className="space-y-4">
            <div>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">HITECH AUTOMATION</h2>
              <div className="mt-3 text-xs text-slate-600 flex flex-wrap justify-center items-center gap-x-3 gap-y-1">
                <p className="flex items-center gap-1"><MapPin size={12} className="text-blue-600" /> Office No. 3, Opposite Water Tank, Khamtarai, Raipur – 492008</p>
                <span className="text-slate-300">|</span>
                <p className="flex items-center gap-1 font-semibold"><FileText size={12} className="text-blue-600" /> GSTIN: 22AARFH4942H1Z9</p>
                <span className="text-slate-300">|</span>
                <p className="flex items-center gap-1"><Phone size={12} className="text-blue-600" /> +91 9826702967</p>
                <span className="text-slate-300">|</span>
                <p className="flex items-center gap-1"><Mail size={12} className="text-blue-600" /> info@hitechautomation.shop</p>
                <span className="text-slate-300">|</span>
                <p className="flex items-center gap-1"><Globe size={12} className="text-blue-600" /> www.hitechautomation.shop</p>
              </div>
            </div>

            <div className="flex justify-center items-center gap-8 text-sm text-slate-700 pt-2">
              <div className="flex items-center gap-2">
                <span className="font-bold">Quotation No :</span>
                <input 
                  value={quotationNo} 
                  onChange={(e) => setQuotationNo(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 p-0 w-32 outline-none font-medium"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Date :</span>
                <input 
                  type="date"
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 p-0 w-32 outline-none font-medium"
                />
              </div>
            </div>
          </div>
          
          {/* Tech Icons Accent */}
          <div className="mt-6 flex justify-center gap-8 text-slate-400 border-t border-slate-100 pt-4 print:hidden">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]"><Cctv size={14} className="text-blue-600" /> Surveillance</div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]"><Lock size={14} className="text-blue-600" /> Access Control</div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]"><Cpu size={14} className="text-blue-600" /> Home Automation</div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]"><Shield size={14} className="text-blue-600" /> Security</div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]"><Cpu size={14} className="text-blue-600" /> High-tech Automation</div>
          </div>
        </div>

        {/* Client Details Section */}
        <div className="px-8 py-6 grid grid-cols-2 gap-8 bg-slate-50/50">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span> Billing Details
            </h3>
            <textarea 
              value={clientDetails.billing}
              onChange={(e) => setClientDetails({ ...clientDetails, billing: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-700 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="Enter billing address..."
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span> Delivery Details
            </h3>
            <textarea 
              value={clientDetails.delivery}
              onChange={(e) => setClientDetails({ ...clientDetails, delivery: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-700 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="Enter delivery address..."
            />
          </div>
        </div>

        {/* Product Table */}
        <div className="px-8 py-4 flex-grow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white text-left text-xs uppercase tracking-wider">
                <th className="p-3 w-16 text-center rounded-tl-lg">Item</th>
                <th className="p-3">Description</th>
                <th className="p-3 w-24 text-center">Qty</th>
                <th className="p-3 w-32 text-right">Unit Price</th>
                <th className="p-3 w-32 text-right rounded-tr-lg">Total</th>
                <th className="p-3 w-10 print:hidden"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {items.map((item, index) => (
                <tr key={item.id} className="border-b border-slate-100 group hover:bg-slate-50 transition-colors">
                  <td className="p-3 text-center text-slate-400 font-mono">{index + 1}</td>
                  <td className="p-3">
                    <input 
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 p-0 font-medium text-slate-800 outline-none"
                      placeholder="Product description..."
                    />
                  </td>
                  <td className="p-3 text-center">
                    <input 
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-16 bg-transparent border-none focus:ring-0 p-0 text-center font-semibold outline-none"
                    />
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-slate-400">₹</span>
                      <input 
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-24 bg-transparent border-none focus:ring-0 p-0 text-right font-semibold outline-none"
                      />
                    </div>
                  </td>
                  <td className="p-3 text-right font-bold text-slate-900">
                    ₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 print:hidden">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button 
            onClick={addItem}
            className="mt-4 flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest hover:text-blue-700 transition-colors print:hidden cursor-pointer"
          >
            <Plus size={16} /> Add New Item
          </button>
        </div>

        {/* Pricing Summary */}
        <div className="px-8 py-6 flex justify-between items-start bg-slate-50/30">
          <div className="w-1/2 space-y-4">
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Terms & Conditions</h3>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                <li>100% advance payment required for order processing.</li>
                <li>Subject to material availability at the time of order.</li>
                <li>Quotation valid for 10 days from the date of issue.</li>
                <li>Installation charges as per actual site conditions.</li>
                <li>Standard manufacturer warranty applicable on products.</li>
              </ul>
            </div>
          </div>
          
          <div className="w-1/3 space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600 items-center">
              <div className="flex items-center gap-2">
                <span>GST</span>
                <input 
                  type="number" 
                  value={gstRate} 
                  onChange={(e) => setGstRate(parseInt(e.target.value) || 0)}
                  className="w-10 bg-slate-100 border-none rounded text-[10px] p-1 text-center font-bold print:hidden outline-none"
                />
                <span className="text-[10px] font-bold text-slate-400">({gstRate}%)</span>
              </div>
              <span className="font-semibold text-slate-900">₹{gstAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600 items-center">
              <span>Freight</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-400">₹</span>
                <input 
                  type="number" 
                  value={freight} 
                  onChange={(e) => setFreight(parseFloat(e.target.value) || 0)}
                  className="w-20 bg-slate-100 border-none rounded text-sm p-1 text-right font-semibold print:hidden outline-none"
                />
                <span className="print:inline hidden font-semibold text-slate-900">{freight.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="pt-4 mt-2 border-t-2 border-slate-200 flex justify-between items-center">
              <span className="text-lg font-black text-slate-900 uppercase">Grand Total</span>
              <span className="text-2xl font-black text-blue-600">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="p-8 mt-auto border-t border-slate-100">
          <div className="flex justify-between items-end">
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bank Details</p>
                <p className="text-xs text-slate-600 font-medium">HITECH AUTOMATION | HDFC BANK | A/C: 50200104089137 | IFSC: HDFC0000152</p>
              </div>
            </div>
            
            <div className="text-center space-y-12">
              <div className="w-48 h-24 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-[10px] text-slate-300 uppercase tracking-widest">
                Company Stamp
              </div>
              <div className="space-y-1">
                <div className="w-48 border-t border-slate-900 mx-auto"></div>
                <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">Authorized Signatory</p>
                <p className="text-[10px] text-slate-500">for HITECH AUTOMATION</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          * { box-shadow: none !important; }
          @page {
            size: A4;
            margin: 0;
          }
          input, textarea {
            border: none !important;
            padding: 0 !important;
            background: transparent !important;
            resize: none !important;
          }
        }
      `}} />
    </div>
  );
}
