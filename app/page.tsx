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
  ownerFull: string;
  cid: string;
  downloads: number;
  likes: number;
  createdAt: string;
  tags: string[];
  license: string;
}

const DEMO_MODELS: Model[] = [
  { id: '1', name: 'LLaMA 7B', description: "Meta's open-source LLM fine-tuned for Vietnamese instruction following. Optimized for inference with 4-bit quantization.", type: 'GGUF', size: '4GB', price: '10', owner: '0xabcd...1234', ownerFull: '0xabcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234', cid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi', downloads: 142, likes: 38, createdAt: '2025-01-15', tags: ['LLM', 'Vietnamese', 'Instruction'], license: 'MIT' },
  { id: '2', name: 'Stable Diffusion XL', description: 'High-resolution image generation model by Stability AI. Fine-tuned on anime/illustration dataset for superior artistic output.', type: 'safetensors', size: '6.5GB', price: '15', owner: '0xefgh...5678', ownerFull: '0xefgh5678efgh5678efgh5678efgh5678efgh5678efgh5678efgh5678efgh5678', cid: 'bafybeihkoviema7g3gxyt6la7vd5wqy6nqykiosskzgrz44c23532tbwga', downloads: 89, likes: 24, createdAt: '2025-01-20', tags: ['Image', 'Anime', 'Art'], license: 'CreativeML' },
  { id: '3', name: 'Whisper Large', description: "OpenAI's state-of-the-art speech recognition model supporting 99 languages with high accuracy transcription.", type: 'PyTorch', size: '2.9GB', price: '0', owner: '0xijkl...9012', ownerFull: '0xijkl9012ijkl9012ijkl9012ijkl9012ijkl9012ijkl9012ijkl9012ijkl9012', cid: 'bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq', downloads: 310, likes: 95, createdAt: '2025-01-10', tags: ['Speech', 'ASR', 'Multilingual'], license: 'Apache 2.0' },
];

function ModelDetail({ model, onBack, connected, onConnect }: { model: Model; onBack: () => void; connected: boolean; onConnect: () => void }) {
  const [downloading, setDownloading] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleDownload = async () => {
    if (!connected) { onConnect(); return; }
    if (model.price !== '0') { alert('🔒 Payment via ShelbyUSD coming soon! Stay tuned.'); return; }
    setDownloading(true);
    await new Promise(r => setTimeout(r, 2000));
    setDownloading(false);
    alert('âœ… Download started! File will be saved from IPFS.');
  };

  return (
    <div className="max-w-4xl mx-auto px-10 pb-24 pt-8">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition">
        â† Back to Marketplace
      </button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="md:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-black mb-2">{model.name}</h1>
              <div className="flex gap-2 flex-wrap mb-3">
                {model.tags.map(t => (
                  <span key={t} className="bg-orange-500/10 border border-orange-500/30 text-orange-400 px-3 py-1 rounded-full text-xs">{t}</span>
                ))}
              </div>
            </div>
            <button onClick={() => setLiked(!liked)} className={`flex items-center gap-1 px-4 py-2 rounded-xl border transition ${liked ? 'border-red-500/50 text-red-400' : 'border-[#333] text-gray-400 hover:text-white'}`}>
              {liked ? 'â¤ï¸' : 'ðŸ¤'} {model.likes + (liked ? 1 : 0)}
            </button>
          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-8">{model.description}</p>

          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 mb-6">
            <h3 className="font-bold mb-4 text-gray-300">Model Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Format', value: model.type },
                { label: 'Size', value: model.size },
                { label: 'License', value: model.license },
                { label: 'Uploaded', value: model.createdAt },
                { label: 'Downloads', value: model.downloads.toLocaleString() },
                { label: 'Network', value: 'Aptos L1' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-xs text-gray-500 mb-1">{label}</div>
                  <div className="text-white font-medium">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6">
            <h3 className="font-bold mb-3 text-gray-300">On-chain Info</h3>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-500 mb-1">IPFS CID</div>
                <div className="text-xs text-orange-400 font-mono break-all">{model.cid}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Owner Address</div>
                <div className="text-xs text-gray-300 font-mono break-all">{model.ownerFull}</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 sticky top-8">
            <div className="text-center mb-6">
              <div className="text-5xl font-black text-orange-500 mb-1">
                {model.price === '0' ? 'Free' : model.price}
              </div>
              {model.price !== '0' && <div className="text-gray-400 text-sm">ShelbyUSD</div>}
            </div>

            <button onClick={handleDownload} disabled={downloading} className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 py-4 rounded-xl font-bold text-lg transition mb-3">
              {downloading ? 'â³ Processing...' : connected ? (model.price === '0' ? 'â¬‡ Download Free' : 'ðŸ’³ Buy & Download') : 'ðŸ”— Connect to Download'}
            </button>

            <button className="w-full bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] py-3 rounded-xl text-sm transition mb-6">
              ðŸ”— Share Model
            </button>

            <div className="border-t border-[#1e1e1e] pt-4">
              <div className="text-xs text-gray-500 mb-3">Uploaded by</div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 text-xs font-bold">
                  {model.owner.slice(2,4).toUpperCase()}
                </div>
                <div className="text-sm text-gray-300 font-mono">{model.owner}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { connect, disconnect, connected, account } = useWallet();
  const addr = account?.address?.toString();
  const [tab, setTab] = useState<'marketplace' | 'upload' | 'vault'>('marketplace');
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [models, setModels] = useState<Model[]>(DEMO_MODELS);
  const [myModels, setMyModels] = useState<Model[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [form, setForm] = useState({ name: '', description: '', type: 'GGUF', price: '', license: 'MIT', tags: '' });
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
        ownerFull: addr || '',
        cid: 'bafybei' + Math.random().toString(36).slice(2, 12),
        downloads: 0,
        likes: 0,
        createdAt: new Date().toISOString().split('T')[0],
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        license: form.license,
      };
      setModels(prev => [newModel, ...prev]);
      setMyModels(prev => [newModel, ...prev]);
      setForm({ name: '', description: '', type: 'GGUF', price: '', license: 'MIT', tags: '' });
      setSelectedFile(null);
      setTab('vault');
    } catch (e: any) {
      alert('Upload failed: ' + e.message);
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  if (selectedModel) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white font-sans">
        <nav className="flex justify-between items-center px-10 py-5 border-b border-[#1a1a1a]">
          <div className="text-2xl font-bold cursor-pointer" onClick={() => setSelectedModel(null)}>Shelby <span className="text-orange-500">AI Hub</span></div>
          {connected && addr ? (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-300">{addr.slice(0,6)}...{addr.slice(-4)}</span>
              <button onClick={disconnect} className="bg-[#222] px-4 py-2 rounded-lg text-sm">Disconnect</button>
            </div>
          ) : (
            <button onClick={() => connect('Petra')} className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold transition">Connect Wallet</button>
          )}
        </nav>
        <ModelDetail model={selectedModel} onBack={() => setSelectedModel(null)} connected={connected} onConnect={() => connect('Petra')} />
        <footer className="text-center py-8 text-gray-600 border-t border-[#111] text-sm">Shelby AI Hub âœ¦ Decentralized Hugging Face on Aptos L1</footer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <nav className="flex justify-between items-center px-10 py-5 border-b border-[#1a1a1a]">
        <div className="text-2xl font-bold cursor-pointer" onClick={() => setTab('marketplace')}>Shelby <span className="text-orange-500">AI Hub</span></div>
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

      {!connected && (
        <div className="text-center pt-24 pb-16 px-10">
          <div className="inline-block border border-[#333] px-4 py-1 rounded-full text-xs text-orange-400 mb-8 tracking-widest">DECENTRALIZED HUGGING FACE âœ¦ APTOS L1</div>
          <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">Your AI Models.<br/><span className="text-[#444]">On-chain. Forever.</span></h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">Upload, share & monetize AI model weights on Shelby decentralized network, anchored to the Aptos blockchain.</p>
          <button onClick={() => connect('Petra')} className="bg-orange-500 hover:bg-orange-600 px-10 py-4 rounded-xl text-lg font-bold transition">Connect Wallet to Start</button>
          <div className="flex justify-center gap-12 mt-16 text-center">
            <div><div className="text-3xl font-black text-orange-500">âˆž</div><div className="text-gray-400 text-sm mt-1">Storage</div></div>
            <div><div className="text-3xl font-black text-orange-500">0%</div><div className="text-gray-400 text-sm mt-1">Platform Fee</div></div>
            <div><div className="text-3xl font-black text-orange-500">L1</div><div className="text-gray-400 text-sm mt-1">Aptos Chain</div></div>
          </div>
        </div>
      )}

      {(tab === 'marketplace' || !connected) && (
        <div className="max-w-6xl mx-auto px-10 pb-24 pt-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Model Marketplace</h2>
            <span className="text-gray-400 text-sm">{models.length} models</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {models.map((m) => (
              <div key={m.id} onClick={() => setSelectedModel(m)} className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 hover:border-orange-500/50 transition cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold group-hover:text-orange-400 transition">{m.name}</h3>
                  <span className="text-xs text-gray-500">{m.createdAt}</span>
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{m.description}</p>
                <div className="flex gap-2 flex-wrap mb-3">
                  <span className="border border-[#333] px-3 py-1 rounded-full text-xs">{m.type}</span>
                  <span className="border border-[#333] px-3 py-1 rounded-full text-xs">{m.size}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xs text-gray-500">by {m.owner}</div>
                  <div className="text-xs text-gray-500">â¬‡ {m.downloads} Â· â¤ï¸ {m.likes}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-orange-500 font-bold">{m.price === '0' ? 'Free' : m.price + ' ShelbyUSD'}</div>
                  <div className="text-xs text-orange-400 opacity-0 group-hover:opacity-100 transition">View details â†’</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                  <option>GGUF</option><option>safetensors</option><option>PyTorch</option><option>ONNX</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Price (ShelbyUSD)</label>
                <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="0 = Free" type="number" min="0" className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">License</label>
                <select value={form.license} onChange={e => setForm({...form, license: e.target.value})} className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition">
                  <option>MIT</option><option>Apache 2.0</option><option>CreativeML</option><option>GPL-3.0</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Tags (comma separated)</label>
                <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="LLM, Vietnamese, Chat" className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition" />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Model File *</label>
              <label className="w-full bg-[#111] border-2 border-dashed border-[#333] rounded-xl p-8 flex flex-col items-center cursor-pointer hover:border-orange-500/50 transition">
                <div className="text-4xl mb-3">ðŸ“¦</div>
                <div className="text-gray-300 font-medium">{selectedFile ? selectedFile.name : 'Click to select model file'}</div>
                <div className="text-gray-500 text-sm mt-1">{selectedFile ? (selectedFile.size / (1024*1024*1024)).toFixed(2) + ' GB' : 'GGUF, safetensors, PyTorch, ONNX...'}</div>
                <input type="file" className="hidden" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
              </label>
            </div>
            {uploadProgress && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl px-4 py-3 text-orange-400 text-sm">â³ {uploadProgress}</div>
            )}
            <button onClick={handleUpload} disabled={uploading} className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 py-4 rounded-xl font-bold text-lg transition">
              {uploading ? 'Uploading...' : 'ðŸš€ Upload to Shelby'}
            </button>
          </div>
        </div>
      )}

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
              <div className="text-6xl mb-4">ðŸ“­</div>
              <div className="text-xl mb-2">No models yet</div>
              <button onClick={() => setTab('upload')} className="mt-6 bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-xl font-semibold transition text-white">Upload Now</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myModels.map((m) => (
                <div key={m.id} onClick={() => setSelectedModel(m)} className="bg-[#111] border border-orange-500/20 rounded-2xl p-6 cursor-pointer hover:border-orange-500/50 transition">
                  <h3 className="text-xl font-bold mb-2">{m.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{m.description}</p>
                  <div className="flex gap-2 flex-wrap mb-3">
                    <span className="border border-[#333] px-3 py-1 rounded-full text-xs">{m.type}</span>
                    <span className="border border-[#333] px-3 py-1 rounded-full text-xs">{m.size}</span>
                  </div>
                  <div className="text-orange-500 font-bold">{m.price === '0' ? 'Free' : m.price + ' ShelbyUSD'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <footer className="text-center py-8 text-gray-600 border-t border-[#111] text-sm">
        Shelby AI Hub âœ¦ Decentralized Hugging Face on Aptos L1
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


