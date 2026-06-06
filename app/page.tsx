'use client';
import { useState, useEffect } from 'react';

declare global {
  interface Window {
    aptos?: any;
    petra?: any;
  }
}

export default function Home() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [error, setError] = useState('');

  const connectWallet = async () => {
    setError('');
    try {
      // Chờ extension inject vào window
      await new Promise(r => setTimeout(r, 300));

      let provider: any = null;

      // AIP-62: duyệt qua danh sách ví đã đăng ký
      const registered = (window as any).registeredWallets
        || (window as any).aptosWallets?.getWallets?.()
        || [];

      for (const w of registered) {
        if (w?.name?.toLowerCase().includes('petra')) {
          provider = w;
          break;
        }
      }

      // Fallback cũ
      if (!provider) provider = window.petra || window.aptos;

      if (!provider) {
        setError('Không tìm thấy Petra Wallet!');
        window.open('https://petra.app', '_blank');
        return;
      }

      // Kết nối
      let res: any;
      if (typeof provider.connect === 'function') {
        res = await provider.connect();
      } else if (typeof provider.features?.['aptos:connect']?.connect === 'function') {
        res = await provider.features['aptos:connect'].connect();
      }

      const address = res?.address || res?.account?.address || res?.publicKey;
      if (address) {
        setWallet(typeof address === 'string' ? address : address.toString());
      } else {
        setError('Không lấy được địa chỉ ví: ' + JSON.stringify(res));
      }
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  const models = [
    { name: 'LLaMA 7B', desc: "Meta's open-source LLM optimized for inference", type: 'GGUF', size: '4GB', price: '10 ShelbyUSD' },
    { name: 'Stable Diffusion XL', desc: 'High-res image generation by Stability AI', type: 'safetensors', size: '6.5GB', price: '15 ShelbyUSD' },
    { name: 'Whisper Large', desc: "OpenAI's speech recognition, 99 languages", type: 'PyTorch', size: '2.9GB', price: 'Free' },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <nav className="flex justify-between items-center px-10 py-5 border-b border-[#1a1a1a]">
        <div className="text-2xl font-bold">Shelby <span className="text-orange-500">AI Hub</span></div>
        {wallet ? (
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-300">{wallet.slice(0,6)}...{wallet.slice(-4)}</span>
            <button onClick={() => setWallet(null)} className="bg-[#222] px-4 py-2 rounded-lg text-sm">Disconnect</button>
          </div>
        ) : (
          <button onClick={connectWallet} className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold transition">Connect Wallet</button>
        )}
      </nav>

      <div className="text-center pt-24 pb-16 px-10">
        <div className="inline-block border border-[#333] px-4 py-1 rounded-full text-xs text-orange-400 mb-8 tracking-widest">SHELBY PROTOCOL ✦ APTOS L1</div>
        <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">Your AI Models.<br/><span className="text-[#444]">On-chain. Forever.</span></h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">Shelby AI Hub stores your AI model weights permanently on Shelby decentralized network, anchored to the Aptos blockchain.</p>
        {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}
        {!wallet ? (
          <button onClick={connec