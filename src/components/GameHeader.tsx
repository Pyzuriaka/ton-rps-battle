
import { Wallet, ArrowLeft } from 'lucide-react';

interface GameHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  showWallet?: boolean;
}

const GameHeader = ({ title, showBack, onBack, showWallet }: GameHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      </div>
      
      {showWallet && (
        <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors">
          <Wallet size={16} />
          <span>Connect</span>
        </button>
      )}
    </div>
  );
};

export default GameHeader;
