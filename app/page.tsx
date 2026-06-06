'use client';
import { useState } from 'react';

interface Model {
  id: string;
  name: string;
  desc: string;
  type: string;
  size: string;
  price: string;
  ipfsCid: string;
}

const MODELS: Model[] = [
  { id: '1', name: 'LLaMA 7B', desc: "Meta's open-source LLM", type: 'GGUF', size: '4GB', price: '10', ipfsCid: '' },
  { id: '2', name: 'Stable Diffusion XL', desc: 'Image generation by Stability AI', type: 'safetensors', size: '6.5GB', price: '15', ipfsCid: '' },
  { id: '3', name: 'ngoandao', desc: 'May cat dai', type: 'GGUF', size: '0.01GB', price: '0', ipfsCid: 'bafybei9n0Gprggrx' },
];

const GATEWAYS = [
  'https://gateway.pinata.cloud/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://dweb.link/ipfs/',
];

function ModelCard({ model, wallet, onConnect }: { model: Model; wallet: string | null; onConnect: () => void }) {
  const [downloading, setDownloading] = useState(false);
  const [status, setStatus] = useState('');

  const handleDownload = async () => {
    if (!wallet) { onConnect(); return; }
    if (model.price !== '0') { setStatus('Coming soon - paid models'); return; }
    if (!model.ipfsCid) { setStatus('No file uploaded for this model'); return; }
    setDownloading(true);
    setStatus('Fetching from IPFS...');
    for (const gw of GATEWAYS) {
      try {
        const url = gw + model.ipfsCid;
        setStatus('Trying ' + gw.split('/')[2] + '...');
        const res = await fetch(url);
        if (!res.ok) continue;
        const blob = await res.blob();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = model.name + '.' + model.type.toLowerCase();
        a.click();
        setStatus('Downloaded!');
        setDownloading(false);
        return;
      } catch { continue; }
    }
    setStatus('Failed - try again later');
    setDownloading(false);
  };

  return (
    <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-2">{model.name}</h3>
      <p className="text-gray-400 text-sm mb-4">{model.desc}</p>
      <span className="bg-[#1a1a1a] border border-[#333] px-3 py-1 rounded-full text-xs mr-2">{model.type}</span>
      <span className="bg-[#1a1a1a] border border-[#333] px-3 py-1 rounded-full text-xs">{model.size}</span>
      <div className="text-orange-500 font-bold mt-4">{model.price === '0' ? 'Free' : model.price + ' ShelbyUSD'}</div>
      {status && <p className="text-xs mt-2 text-yellow-400">{status}</p>}
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="mt-4 w-full bg-[#222] hover:bg-[#333] disabled:opacity-50 py-2 rounded-xl text-sm"
      >
        {downloading ? 'Downloading...' : wallet ? (model.price === '0' ? 'Download Free' : 'Buy & Download') : 'Connect Wallet'}
      </button>
    </div>
  );
}

function App() {
  const [wallet, setWallet] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      const petra = (window as any).aptos || (window as any).petra || (window as any).martian;
      if (!petra) { alert('Install Petra Wallet: https://petra.app'); return; }
      const res = await petra.connect();
      setWallet(res.address);
    } catch { alert('Connection failed'); }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex justify-between items-center px-10 py-5 border-b border-[#222]">
        <div className="text-2xl font-bold">Shelby <span className="text-orange-500">AI Hub</span></div>
        {wallet ? (
          <div className="flex items-center gap-3">
            <div className="bg-green-500 w-2 h-2 rounded-full"></div>
            <span className="text-sm text-gray-300">{wallet.slice(0,6)}...{wallet.slice(-4)}</span>
            <button onClick={() => setWallet(null)} className="bg-[#222] px-4 py-2 rounded-lg text-sm">Disconnect</button>
          </div>
        ) : (
          <button onClick={connectWallet} className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold">Connect Wallet</button>
        )}
      </nav>
      <div className="max-w-5xl mx-auto px-10 py-20">
        <h2 className="text-3xl font-bold text-center mb-10">Available Models</h2>
        <div className="grid grid-cols-3 gap-6">
          {MODELS.map(m => <ModelCard key={m.id} model={m} wallet={wallet} onConnect={connectWallet} />)}
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return <App />;
}