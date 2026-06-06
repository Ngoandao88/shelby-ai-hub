'use client';
import { useState } from 'react';
import { AptosWalletAdapterProvider, useWallet } from '@aptos-labs/wallet-adapter-react';

interface Model {
  id: string;
  name: string;
  description: string;
  type: string;
  size: string;
  price: string;
  owner: string;
  cid: string;
  downloads: number;
  createdAt: string;
}

const DEMO_MODELS: Model[] = [
  { id: '1', name: 'LLaMA 7B', description: "Meta's open-source LLM optimized for inference", type: 'GGUF', size: '4GB', price: '10', owner: '0xabcd...1234', cid: 'bafybeig...', downloads: 142, createdAt: '2025-01-15' },
  { id: '2', name: 'Stable Diffusion XL', description: 'High-resolution image generation model', type: 'safetensors', size: '6.5GB', price: '15', owner: '0xefgh...5678', cid: 'bafybeih...', downloads: 89, createdAt: '2025-01-20' },
  { id: '3', name: 'Whisper Large', description: "OpenAI's speech recognition, 99 languages", type: 'PyTorch', size: '2.9GB', price: '0', owner: '0xijkl...9012', cid: 'bafybeii...', downloads: 310, createdAt: '2025-01-10' },
];

function AppContent() {
  const { connect, disconnect, connected, account } = useWallet();
  const addr = account?.address?.toString();
  const [tab, setTab] = useState<'marketplace' | 'upload' | 'vault'>('marketplace');
  const [models, setModels] = useState<Model[]>(DEMO_MODELS);
  const [myModels, setMyModels] = useState<Model[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [form, setForm] = useState({ name: '', description: '', type: 'GGUF', price: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!connected) { alert('Connect wallet first!'); return; }
    if (!selectedFile || !form.name) { alert('Fill in all fields and select a file!'); return; }

    setUploading(true);
    try {
      setUploadProgress('Uploading to IPFS...');
      await new Promise(r => setTimeout(r, 1500));

      setUploadProgress('Writing metadata to Aptos...');
      await new Promise(r => setTimeout(r, 1000));

      const newModel: Model = {
        id: Date.now().toString(),
        name: form.name,
        description: form.description,
        type: form.type,
        size: (selectedFile.size / (1024 * 1024 * 1024)).toFixed(2) + 'GB',
        price: form.price || '0',
        owner: addr?.slice(0, 6) + '...' + addr?.slice(-4) || '',
        cid: 'bafybei' + Math.random().toString(36).slice(2, 12),
        downloads: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };

      setUploadProgress('Success!');
      setModels(prev => [newModel, ...prev]);
      setMyModels(prev => [newModel, ...prev]);
      setForm({ name: '', description: '', type: 'GGUF', price: '' });
      setSelectedFile(null);
      setTab('vault');
    } catch (e: any) {
      alert('Upload failed: ' + e.message);
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* NAV */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-[#1a1a1a]">
        <div className="text-2xl font-bold cursor-pointer" onClick={() => setTab('marketplace')}>
          Shelby <span className="text-orange-500">AI Hub</span>
        </div>
        <div className="flex items-center gap-4">
          {connected && (
            <>
              <button onClick={() => setTab('marketplace')} className={`text-sm px-4 py-2 rounded-lg transition ${tab === 'marketplace' ? 'bg-orange-500' : 'text-gray-400 hover:text-white'}`}>Marketplace</button>
              <button onClick={() => setTab('upload')} className={`text-sm px-4 py-2 rounded-lg transition ${tab === 'upload' ? 'bg-orange-500' : 'text-gray-400 hover:text-white'}`}>Upload Model</button>
              <button onClick={() => setTab('vault')} className={`text-sm px-4 py-2 rounded-lg transition ${tab === 'vault' ? 'bg-orange-500' : 'text-gray-400 hover:text-white'}`}>My Vault</button>
            </>
          )}
          {connected && addr ? (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-300">{addr.slice(0,6)}...{addr.slice(-4)}</span>
              <button onClick={disconnect} className="bg-[#222] px-4 py-2 rounded-lg text-sm">Disconnect</button>
            </div>
          ) : (
            <button onClick={() => connect('Petra')} className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold transition">Connect Wallet</button>
          )}
        </div>
      </nav>

      {/* HERO - only when not connected */}
      {!connected && (
        <div className="text-center pt-24 pb-16 px-10">
          <div className="inline-block border border-[#333] px-4 py-1 rounded-full text-xs text-orange-400 mb-8 tracking-widest">DECENTRALIZED HUGGING FACE ✦ APTOS L1</div>
          <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">Your AI Models.<br/><span className="text-[#444]">On-chain. Forever.</span></h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">Upload, share & monetize AI model weights on Shelby decentralized network, anchored to the Aptos blockchain.</p>
          <button onClick={() => connect('Petra')} className="bg-orange-500 hover:bg-orange-600 px-10 py-4 rounded-xl text-lg font-bold transition">Connect Wallet to Start</button>
          <div className="flex justify-center gap-12 mt-16 text-center">
            <div><div className="text-3xl font-black text-orange-500">∞</div><div className="text-gray-400 text-sm mt-1">Storage</div></div>
            <div><div className="text-3xl font-black text-orange-500">0%</div><div className="text-gray-400 text-sm mt-1">Platform Fee</div></div>
            <div><div className="text-3xl font-black text-orange-500">L1</div><div className="text-gray-400 text-sm mt-1">Aptos Chain</div></div>
          </div>
        </div>
      )}

      {/* MARKETPLACE TAB */}
      {(tab === 'marketplace' || !connected) && (
        <div className="max-w-6xl mx-auto px-10 pb-24 pt-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Model Marketplace</h2>
            <span className="text-gray-400 text-sm">{models.length} models</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {models.map((m) => (
              <div key={m.id} className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 hover:border-orange-500/30 transition">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{m.name}</h3>
                  <span className="text-xs text-gray-500">{m.createdAt}</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{m.description}</p>
                <div className="flex gap-2 flex-wrap mb-3">
                  <span className="border border-[#333] px-3 py-1 rounded-full text-xs">{m.type}</span>
                  <span className="border border-[#333] px-3 py-1 rounded-full text-xs">{m.size}</span>
                </div>
                <div className="text-xs text-gray-500 mb-3">by {m.owner} · {m.downloads} downloads</div>
                <div className="text-orange-500 font-bold text-lg mb-4">{m.price === '0' ? 'Free' : m.price + ' ShelbyUSD'}</div>
                <button onClick={!connected ? () => connect('Petra') : undefined} className="w-full bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] py-2 rounded-xl text-sm transition">
                  {connected ? (m.price === '0' ? '⬇ Download Free' : '💳 Buy & Download') : 'Connect to Download'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UPLOAD TAB */}
      {connected && tab === 'upload' && (
        <div className="max-w-2xl mx-auto px-10 pb-24 pt-12">
          <h2 className="text-3xl font-bold mb-2">Upload Model</h2>
          <p className="text-gray-400 mb-8">Your model will be stored on IPFS, metadata anchored to Aptos L1.</p>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Model Name *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. LLaMA 7B Fine-tuned" className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe your model..." rows={3} className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Format</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition">
                  <option>GGUF</option>
                  <option>safetensors</option>
                  <option>PyTorch</option>
                  <option>ONNX</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Price (ShelbyUSD)</label>
                <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="0 = Free" type="number" min="0" className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition" />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Model File *</label>
              <label className="w-full bg-[#111] border-2 border-dashed border-[#333] rounded-xl p-8 flex flex-col items-center cursor-pointer hover:border-orange-500/50 transition">
                <div className="text-4xl mb-3">📦</div>
                <div className="text-gray-300 font-medium">{selectedFile ? selectedFile.name : 'Click to select model file'}</div>
                <div className="text-gray-500 text-sm mt-1">{selectedFile ? (selectedFile.size / (1024*1024*1024)).toFixed(2) + ' GB' : 'GGUF, safetensors, PyTorch, ONNX...'}</div>
                <input type="file" className="hidden" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
              </label>
            </div>
            {uploadProgress && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl px-4 py-3 text-orange-400 text-sm">
                ⏳ {uploadProgress}
              </div>
            )}
            <button onClick={handleUpload} disabled={uploading} className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 py-4 rounded-xl font-bold text-lg transition">
              {uploading ? 'Uploading...' : '🚀 Upload to Shelby'}
            </button>
          </div>
        </div>
      )}

      {/* VAULT TAB */}
      {connected && tab === 'vault' && (
        <div className="max-w-6xl mx-auto px-10 pb-24 pt-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">My Vault</h2>
              <p className="text-gray-400 text-sm mt-1">{addr?.slice(0,6)}...{addr?.slice(-4)}</p>
            </div>
            <button onClick={() => setTab('upload')} className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold transition">+ Upload Model</button>
          </div>
          {myModels.length === 0 ? (
            <div className="text-center py-24 text-gray-500">
              <div className="text-6xl mb-4">📭</div>
              <div className="text-xl mb-2">No models yet</div>
              <div className="text-sm">Upload your first AI model to get started</div>
              <button onClick={() => setTab('upload')} className="mt-6 bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-xl font-semibold transition text-white">Upload Now</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myModels.map((m) => (
                <div key={m.id} className="bg-[#111] border border-orange-500/20 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-2">{m.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{m.description}</p>
                  <div className="flex gap-2 flex-wrap mb-3">
                    <span className="border border-[#333] px-3 py-1 rounded-full text-xs">{m.type}</span>
                    <span className="border border-[#333] px-3 py-1 rounded-full text-xs">{m.size}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">CID: {m.cid}</div>
                  <div className="text-xs text-gray-500 mb-3">{m.downloads} downloads</div>
                  <div className="text-orange-500 font-bold mb-4">{m.price === '0' ? 'Free' : m.price + ' ShelbyUSD'}</div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] py-2 rounded-xl text-xs transition">✏️ Edit</button>
                    <button className="flex-1 bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] py-2 rounded-xl text-xs transition">🔗 Share</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <footer className="text-center py-8 text-gray-600 border-t border-[#111] text-sm">
        Shelby AI Hub ✦ Decentralized Hugging Face on Aptos L1
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <AptosWalletAdapterProvider optInWallets={['Petra']} autoConnect={false}>
      <AppContent />
    </AptosWalletAdapterProvider>
  );
}