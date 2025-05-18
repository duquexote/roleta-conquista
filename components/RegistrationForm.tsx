import React, { useState } from 'react';

interface RegistrationFormProps {
  onRegister: (name: string, phone: string, spins: number, investment: string, leader: string) => void;
  onClose: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [value, setValue] = useState('');
  const [leader, setLeader] = useState('');
  const [errors, setErrors] = useState({ name: '', phone: '', value: '', leader: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = { name: '', phone: '', value: '', leader: '' };

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
      valid = false;
    }

    if (!phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
      valid = false;
    } else if (!/^[0-9]{10,11}$/.test(phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Telefone inválido. Digite um número válido com DDD';
      valid = false;
    }

    if (!value.trim()) {
      newErrors.value = 'Valor é obrigatório';
      valid = false;
    } else if (isNaN(Number(value)) || Number(value) < 300) {
      newErrors.value = 'O valor mínimo é 300';
      valid = false;
    }

    if (!leader.trim()) {
      newErrors.leader = 'Líder da caravana é obrigatório';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const calculateSpins = (amount: number): number => {
    return Math.floor(amount / 300);
  };

  const saveToAPI = async (name: string, phoneNumber: string) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: name,
          numero: phoneNumber.replace(/\D/g, '')
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Erro ao salvar no API:', data.error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Exceção ao salvar na API:', err);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const amount = Number(value);
        const spins = calculateSpins(amount);
        
        // Salvar via API
        const success = await saveToAPI(name, phone);
        
        if (success) {
          // Continuar com o fluxo normal
          onRegister(name, phone, spins, value, leader);
        } else {
          // Em caso de erro, continuar mesmo assim para não impedir a experiência do usuário
          console.warn('Continuando apesar do erro na API');
          onRegister(name, phone, spins, value, leader);
        }
      } catch (error) {
        console.error('Erro ao processar o formulário:', error);
        // Continuar com o fluxo normal mesmo em caso de erro
        onRegister(name, phone, calculateSpins(Number(value)), value, leader);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    let formatted = '';

    if (numbers.length <= 2) {
      formatted = numbers;
    } else if (numbers.length <= 6) {
      formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }

    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhone(e.target.value);
    setPhone(formattedPhone);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Aceitar apenas números
    const numericValue = e.target.value.replace(/\D/g, '');
    setValue(numericValue);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="mb-2 text-center">
          <h2 className="text-2xl font-bold mb-2 gradient-text">Cadastre-se para Girar</h2>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-1 rounded-full bg-pink-500 opacity-50"></div>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Preencha seus dados para girar a roleta e concorrer a um produto exclusivo
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="name" className="block mb-2 font-medium text-gray-300">
              Nome completo
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg bg-[#242430] text-white focus:border-pink-500 focus:outline-none transition-all"
              placeholder="Digite seu nome completo"
            />
            {errors.name && <p className="text-pink-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="mb-5">
            <label htmlFor="phone" className="block mb-2 font-medium text-gray-300">
              Telefone com DDD
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full p-3 border border-gray-700 rounded-lg bg-[#242430] text-white focus:border-pink-500 focus:outline-none transition-all"
              placeholder="(00) 00000-0000"
            />
            {errors.phone && <p className="text-pink-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div className="mb-5">
            <label htmlFor="value" className="block mb-2 font-medium text-gray-300">
              Valor (R$)
            </label>
            <input
              type="text"
              id="value"
              value={value}
              onChange={handleValueChange}
              className="w-full p-3 border border-gray-700 rounded-lg bg-[#242430] text-white focus:border-pink-500 focus:outline-none transition-all"
              placeholder="300 (1 giro), 600 (2 giros), 900 (3 giros)..."
            />
            {errors.value && <p className="text-pink-500 text-sm mt-1">{errors.value}</p>}
            {value && Number(value) >= 300 && (
              <p className="text-green-400 text-sm mt-1">
                Você terá direito a {calculateSpins(Number(value))} giro(s)
              </p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="leader" className="block mb-2 font-medium text-gray-300">
              Líder da Caravana
            </label>
            <input
              type="text"
              id="leader"
              value={leader}
              onChange={(e) => setLeader(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg bg-[#242430] text-white focus:border-pink-500 focus:outline-none transition-all"
              placeholder="Nome do líder da caravana"
            />
            {errors.leader && <p className="text-pink-500 text-sm mt-1">{errors.leader}</p>}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Confirmar e Girar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm; 