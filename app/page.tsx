'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import RegistrationForm from '../components/RegistrationForm';
import ResultModal from '../components/ResultModal';

// Importação dinâmica do componente de roleta para evitar erros de SSR
const RouletteWheel = dynamic(() => import('../components/RouletteWheel'), {
  ssr: false,
});

export default function Home() {
  const [user, setUser] = useState<{ name: string; phone: string; spins: number; investment: string; leader: string } | null>(null);
  const [remainingSpins, setRemainingSpins] = useState(0);
  const [showRegistration, setShowRegistration] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [allPrizes, setAllPrizes] = useState<string[]>([]);
  const [canSpin, setCanSpin] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [spinId, setSpinId] = useState(0); // ID único para cada giro

  const handleRegister = (name: string, phone: string, spins: number, investment: string, leader: string) => {
    setUser({ name, phone, spins, investment, leader });
    setRemainingSpins(spins);
    setShowRegistration(false);
    setCanSpin(true);
    // Limpar os prêmios anteriores ao iniciar um novo registro
    setAllPrizes([]);
  };

  const handleSpinClick = () => {
    setShowRegistration(true);
  };

  // Função para salvar o prêmio via API
  const savePrizeToAPI = async (prizes: string[]) => {
    if (!user) return;
    
    try {
      // Concatenar todos os prêmios em uma única string separada por vírgulas
      const premiosString = prizes.join(', ');
      
      const response = await fetch('/api/premio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome_lead: user.name,
          numero_lead: user.phone.replace(/\D/g, ''),
          premio: premiosString,
          investimento: user.investment,
          lider_caravana: user.leader
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Erro ao salvar prêmio na API:', data.error);
      }
    } catch (err) {
      console.error('Exceção ao salvar prêmio na API:', err);
    }
  };

  const handleRouletteFinish = (prize: string) => {
    // Armazena o prêmio, mas ainda não mostra o modal
    setWinner(prize);
    
    // Adiciona o prêmio atual à lista de todos os prêmios
    setAllPrizes(prev => [...prev, prize]);
    
    // Decrementa o número de giros restantes
    setRemainingSpins(prev => prev - 1);
    
    // Configura um timer para mostrar o modal após 2 segundos
    setTimeout(() => {
      setShowWinner(true);
    }, 2000);
    
    // Desativa a capacidade de girar até que o modal seja fechado
    setCanSpin(false);
    
    // Log para debug
    console.log('Usuário:', user);
    console.log('Prêmio:', prize);
    console.log('Giros restantes:', remainingSpins - 1);
    console.log('Todos os prêmios até agora:', [...allPrizes, prize]);
  };

  const resetGame = () => {
    setWinner(null);
    setShowWinner(false);
    
    // Se ainda tiver giros, permite continuar
    if (remainingSpins > 0) {
      // Incrementa o ID do giro para forçar um novo giro
      setSpinId(prevId => prevId + 1);
      
      // Pequeno timeout para garantir que a UI atualize corretamente
      setTimeout(() => {
        setCanSpin(true);
      }, 100);
    } else {
      // Quando não há mais giros, salva todos os prêmios no banco de dados
      if (user && allPrizes.length > 0) {
        savePrizeToAPI(allPrizes);
      }
      
      setUser(null);
      setCanSpin(false);
      setAllPrizes([]);
    }
  };

  // Efeito para monitorar os giros restantes
  useEffect(() => {
    if (remainingSpins <= 0) {
      setCanSpin(false);
    }
  }, [remainingSpins]);

  // Determinando se deve mostrar o botão de registro
  const shouldShowRegisterButton = (!user || (!canSpin && remainingSpins <= 0)) && !showRegistration && !winner;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-16 px-4 bg-gradient-to-b from-[#0a0a0f] to-[#121218]">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-sans">
        <div className="mb-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-2 gradient-text">
            LE DEBUT
          </h1>
          <p className="text-xl text-gray-300 opacity-80">PREMIAÇÃO EXCLUSIVA</p>
        </div>
        
        <div className="bg-[#1a1a20] shadow-2xl rounded-2xl p-8 mb-10 border border-[rgba(255,0,153,0.2)] backdrop-blur-sm">
          <p className="text-center text-lg mb-6 text-gray-300">
            Gire a roleta e ganhe um dos nossos produtos exclusivos
          </p>
          
          {/* Contador de giros restantes */}
          {user && remainingSpins > 0 && (
            <div className="text-center mb-4">
              <span className="text-white font-semibold">
                Giros restantes: <span className="text-pink-500">{remainingSpins}</span>
              </span>
            </div>
          )}
          
          {/* Container da roleta */}
          <div className="mx-auto flex justify-center mb-16">
            <RouletteWheel 
              onFinished={handleRouletteFinish} 
              canSpin={canSpin}
              spinId={spinId}
            />
          </div>
        </div>
        
        {/* Botão de registro, agora FORA do container principal da roleta */}
        <div className="fixed bottom-10 left-0 right-0 flex justify-center">
          {shouldShowRegisterButton && (
            <button
              onClick={handleSpinClick}
              className="btn-primary text-xl font-bold tracking-wide px-10 py-5 animate-pulse"
            >
              CADASTRE-SE PARA GIRAR
            </button>
          )}
        </div>
        
        <footer className="text-center text-sm text-gray-500 mt-16">
          <p>Le Debut © {new Date().getFullYear()} - Todos os direitos reservados</p>
        </footer>
      </div>
      
      {showRegistration && (
        <RegistrationForm
          onRegister={handleRegister}
          onClose={() => setShowRegistration(false)}
        />
      )}
      
      {/* Modal de resultado mostra apenas após o delay */}
      {showWinner && winner && (
        <ResultModal
          prize={winner}
          onClose={() => setShowWinner(false)}
          onSpin={resetGame}
          hasMoreSpins={remainingSpins > 0}
        />
      )}
    </main>
  );
} 
