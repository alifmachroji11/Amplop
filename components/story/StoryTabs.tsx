'use client';

import { useState } from 'react';

type Tab = 'cerita' | 'transaksi';

export function StoryTabs({
  storyPanel,
  transactionsPanel,
}: {
  storyPanel: React.ReactNode;
  transactionsPanel: React.ReactNode;
}) {
  const [tab, setTab] = useState<Tab>('cerita');

  return (
    <div>
      <div className="mb-6.5 flex gap-6 border-b border-border">
        <TabButton active={tab === 'cerita'} onClick={() => setTab('cerita')}>
          Cerita
        </TabButton>
        <TabButton active={tab === 'transaksi'} onClick={() => setTab('transaksi')}>
          Transaksi
        </TabButton>
      </div>

      <div className={tab === 'cerita' ? 'block' : 'hidden'}>{storyPanel}</div>
      <div className={tab === 'transaksi' ? 'block' : 'hidden'}>{transactionsPanel}</div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer border-b-2 pb-3 text-[15px] font-medium transition-colors ${
        active ? 'border-sage text-ink' : 'border-transparent text-ink-faint hover:text-ink-soft'
      }`}
    >
      {children}
    </button>
  );
}
