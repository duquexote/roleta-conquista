import React from 'react';

interface ResultModalProps {
  prize: string;
  onClose: () => void;
  onSpin: () => void;
  hasMoreSpins?: boolean;
}

const ResultModal: React.FC<ResultModalProps> = ({ prize, onClose, onSpin, hasMoreSpins = false }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content text-center">
        <div className="mb-2">
          <h2 className="text-3xl font-bold mb-4 gradient-text">Parabéns!</h2>
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-1 rounded-full bg-pink-500 opacity-50"></div>
          </div>
        </div>
        
        <p className="text-xl mb-4 text-gray-200">
          Você ganhou: 
        </p>
        
        <div className="mb-8 py-4 px-6 bg-[rgba(255,0,153,0.1)] rounded-lg border border-[rgba(255,0,153,0.2)]">
          <span className="text-2xl font-bold gradient-text">{prize}</span>
        </div>
        
        <p className="mb-8 text-gray-400">
          Retire agora seu prêmio e tenha um novo recomeço para os seus cabelos.
        </p>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Fechar
          </button>
          <button
            onClick={onSpin}
            className="btn-primary"
          >
            {hasMoreSpins ? 'Girar Novamente' : 'Cadastrar Novamente'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal; 
