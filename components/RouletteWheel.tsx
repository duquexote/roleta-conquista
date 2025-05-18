import React, { useState, useEffect, useRef } from 'react';
import { Wheel } from 'react-custom-roulette';

interface RouletteWheelProps {
  onFinished: (prize: string) => void;
  canSpin: boolean;
  spinId?: number; // Novo prop para identificar quando deve girar novamente
}

// Estilos inline para o texto na horizontal
const wheelTextStyle = {
  fontWeight: 'bold',
  textShadow: '0 0 3px rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '12px',
  textAlign: 'center',
  height: '100%',
};

// SVG para um ponteiro rosa customizado
const customPointer = (
  <polygon 
    points="0,0 15,30 30,0" 
    style={{ 
      fill: '#ff0099',
      stroke: '#1a1a1a',
      strokeWidth: 2
    }} 
  />
);

const RouletteWheel: React.FC<RouletteWheelProps> = ({ onFinished, canSpin, spinId = 0 }) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);
  const [lastSpinId, setLastSpinId] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Segmentos para exibição
  const segmentsDisplay = [
    'Protetor Solar',
    'Royal',
    'Mask Teia',
    'Tônico',
    'Reparador',
    'Shampoo',
    'Condicionador',
    'Amostra Grátis'
  ];

  // Segmentos completos para resultado
  const segmentsComplete = [
    'Protetor Solar Capilar',
    'Royal',
    'Mask Teia',
    'Tônico',
    'Reparador de Pontas',
    'Daytox Shampoo',
    'Daytox Condicionador',
    'Amostra Grátis'
  ];

  // Cores alternadas para os segmentos
  const segmentColors = [
    '#ff0099', // rosa
    '#FFF1E6', // bege bem claro
    '#ff0099', // rosa
    '#FFF1E6', // bege bem claro
    '#ff0099', // rosa
    '#FFF1E6', // bege bem claro
    '#ff0099', // rosa
    '#FFF1E6'  // bege bem claro
  ];

  // Cores de texto para cada segmento
  const textColors = [
    '#FFFFFF', // branco para fundo rosa
    '#1a1a1a', // preto para fundo bege
    '#FFFFFF', // branco para fundo rosa
    '#1a1a1a', // preto para fundo bege
    '#FFFFFF', // branco para fundo rosa
    '#1a1a1a', // preto para fundo bege
    '#FFFFFF', // branco para fundo rosa
    '#1a1a1a'  // preto para fundo bege
  ];

  // Configuração dos dados para a roda
  const data = segmentsDisplay.map((segment, index) => ({
    option: segment,
    style: {
      backgroundColor: segmentColors[index],
      textColor: textColors[index],
    }
  }));

  // Efeito para verificar mudanças no spinId
  useEffect(() => {
    if (spinId !== lastSpinId && canSpin) {
      // Reset para um novo giro
      setHasSpun(false);
      setMustSpin(false);
      setLastSpinId(spinId);
    }
  }, [spinId, canSpin, lastSpinId]);

  // Ajuste das probabilidades (Mask HEAL Lançamento com 1% de chance)
  const spinRoulette = () => {
    if (!canSpin || mustSpin || hasSpun) return;

    // Gerar número aleatório com probabilidades ajustadas
    const randomValue = Math.random() * 100;
    let accumulatedProbability = 0;
    const probabilities = [12.5, 12.5, 12.5, 12.5, 12.5, 12.5, 12.5, 12.5];
    
    for (let i = 0; i < segmentsDisplay.length; i++) {
      accumulatedProbability += probabilities[i];
      if (randomValue <= accumulatedProbability) {
        setPrizeNumber(i);
        break;
      }
    }
    
    setMustSpin(true);
  };

  // Quando o estado canSpin muda, aciona o giro se for permitido
  useEffect(() => {
    if (canSpin && !mustSpin && !hasSpun) {
      // Pequeno delay para garantir que a UI tenha tempo de atualizar
      const timer = setTimeout(() => {
        spinRoulette();
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [canSpin, mustSpin, hasSpun]);

  // Quando a roleta parar
  const handleStopSpinning = () => {
    setMustSpin(false);
    setHasSpun(true); // Marca que já girou uma vez
    onFinished(segmentsComplete[prizeNumber]);
  };

  // Reset do estado de giro quando canSpin muda para false
  useEffect(() => {
    if (!canSpin) {
      setMustSpin(false);
    }
  }, [canSpin]);

  // Hook para aplicar estilos após a renderização
  useEffect(() => {
    const applyTextStyles = () => {
      if (!wheelRef.current) return;
      
      const wheelTexts = wheelRef.current.querySelectorAll('[data-testid^="wheel-data-"] > div');
      wheelTexts.forEach((text) => {
        Object.assign((text as HTMLElement).style, wheelTextStyle);
      });

      // Alterar a cor do ponteiro padrão se ele existir
      const pointer = wheelRef.current.querySelector('[data-testid="wheel-pointer"]');
      if (pointer) {
        (pointer as HTMLElement).style.fill = '#ff0099';
        (pointer as HTMLElement).style.stroke = '#1a1a1a';
      }
    };

    // Aplicar em múltiplos momentos para garantir que os estilos sejam aplicados
    applyTextStyles();
    const timer1 = setTimeout(applyTextStyles, 100);
    const timer2 = setTimeout(applyTextStyles, 500);
    const timer3 = setTimeout(applyTextStyles, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [mustSpin]);

  return (
    <div className="w-[320px]">
      <div className="relative" ref={wheelRef}>
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          backgroundColors={segmentColors}
          textColors={textColors}
          fontSize={12}
          outerBorderColor="#1a1a1a"
          outerBorderWidth={2}
          innerBorderColor="#1a1a1a"
          innerBorderWidth={2}
          innerRadius={30}
          radiusLineColor="#1a1a1a"
          radiusLineWidth={1}
          perpendicularText={false}
          textDistance={60}
          onStopSpinning={handleStopSpinning}
          spinDuration={0.8}
          pointerProps={{
            src: '',
            style: { filter: 'drop-shadow(0 0 5px rgba(255, 0, 153, 0.5))' }
          }}
        />
        
        {/* Botão de GIRAR no centro (apenas quando canSpin for true e não estiver girando) */}
        {canSpin && !mustSpin && !hasSpun && (
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 
                       bg-black text-white rounded-full w-20 h-20 flex items-center justify-center 
                       cursor-pointer shadow-lg border-2 border-white"
            onClick={spinRoulette}
          >
            <span className="font-bold">GIRAR</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouletteWheel; 