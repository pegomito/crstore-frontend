'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';

export default function LoginRouter({ children }) {
  const router = useRouter();

  const loginUsuario = async (content) => {
    try {
      const response = await axios.post('/users/login', content);
      if (response.status === 200) {
        const token = response.data.response;
        localStorage.setItem('authToken', token);
        toaster.create({
          title: 'Login realizado com sucesso!',
          description: 'Você foi autenticado com sucesso.',
          type: 'success',
        });
        router.push('/lobby');
      } else {
        toaster.create({
          title: 'Erro no login',
          description: response.data.message || 'Falha ao realizar login.',
          type: 'error',
        });
      }
    } catch (error) {
      toaster.create({
        title: 'Erro no login',
        description: error.response?.data?.message || 'Erro ao realizar login.',
        type: 'error',
      });
      console.error('Erro durante o login:', error);
    }
  };

  return <>{children({ loginUsuario })}</>;
}