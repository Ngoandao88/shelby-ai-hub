'use client';
import { useState } from 'react';
import { useWallet, AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';

function WalletButton() {
  const { connect, disconnect, account, connected, wallets } = useWallet();

  if (connected && account) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <span className="text-sm text-gray-300">{account.address.slice(0,6)}...{account.address.slice(-4)}</span>
        <button onClick={disconnect} className="bg-[#222] px-4 py-2 rounded-lg text-sm">Disconnect</button>
      </div>
    );
  }

  return (
    <button onClick={() => connect(wallets[0]?.name)} className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold transition">
      Connect Wallet
    </button>
  );
}

function MainContent() {
  const { connect, account, connected, wallets } = useWallet();

  const models = [
    { name: 'LLaMA 7B', desc: "Meta's open-source large language model optimized for inference", type: 'GGUF', size: '4GB', price: '10 ShelbyUSD' },
    { name: 'Stable Diffusion XL', desc: 'High-resolution image generation model by Stability AI', type: 'safetensors', size: '6.5GB', price: '15 ShelbyUSD' },
    { name: 'Whisper Large', desc: "OpenAI's speech recognition model supporting 99 languages", type: 'PyTorch', size: '2.9GB', price: 'Free' },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <nav className="flex justify-between items-center px-10 py-5 border-b border-[#1a1a1a]">
        <div className="text-2xl font-bold">Shelby <span className="text-orange-500">AI Hub</span></div>
        <WalletButton />
      </nav>

      <div className="text-center pt-24 pb-16 px-10">
        <div className="inline-block border border-[#333] px-4 py-1 rounded-full text-xs text-orange-400 mb-8 tracking-widest">SHELBY PROTOCOL ✦ APTOS L1</div>
        <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">Your AI Models.<br/><span className="text-[#444]">On-chain. Forever.</span></h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">Shelby AI Hub stores your AI model weights permanently on Shelby decentralized network, anchored to the Aptos blockchain.</p>
        {!connected ? (
          <button onClick={() => connect(wallets[0]?.name)} className="bg-orange-500 hover:bg-orange-600 px-10 py-4 rounded-xl text-lg font-bold transition">Connect Wallet to Start</button>
        ) : (
          <div className="inline-block bg-green-900/30 border border-green-500/30 px-8 py-3 rounded-xl">
            <span className="text-green-400 font-bold">✅ Connected: {account?.address.slice(0,6)}...{account?.address.slice(-4)}</span>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-10 pb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Available Models</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {models.map((m) => (
            <div key={m.name} className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 hover:border-orange-500/30 transition">
              <h3 className="text-xl font-bold mb-2">{m.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{m.desc}</p>
              <div className="flex gap-2 flex-wrap mb-4">
                <span className="border border-[#333] px-3 py-1 rounded-full text-xs">{m.type}</span>
                <span className="border border-[#333] px-3 py-1 rounded-full text-xs">{m.size}</span>
              </div>
              <div className="text-orange-500 font-bold text-lg mb-4">{m.price}</div>
              <button onClick={!connected ? () => connect(wallets[0]?.name) : undefined} className="w-full bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] py-2 rounded-xl text-sm transition">
                {connected ? '⬇ Download' : 'Connect Wallet'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <footer className="text-center py-8 text-gray-600 border-t border-[#111] text-sm">
        Built on Shelby Protocol ✦ Aptos L1 | Shelby AI Hub 2025
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <AptosWalletAdapterProvider autoConnect={false}>
      <MainContent />
    </AptosWalletAdapterProvider>
  );
}