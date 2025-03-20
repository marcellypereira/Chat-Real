import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';

const StartConversationSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .required('Número de telefone é obrigatório')
    .matches(/^\+?[0-9]{10,15}$/, 'Formato inválido. Use: +5511999999999'),
  message: Yup.string()
    .required('A mensagem é obrigatória')
    .min(1, 'A mensagem não pode estar vazia')
    .max(1000, 'A mensagem é muito longa (máx. 1000 caracteres)'),
});

const StartConversation = () => {
  const [hasOptedIn, setHasOptedIn] = useState(false);

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setStatus },
  ) => {
    try {
      console.log('Iniciando envio para:', values.phoneNumber);
      console.log('Dados completos a enviar:', values);

      // Usar uma variável para a URL do API para facilitar modificações
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      console.log('URL da API:', apiUrl);

      const response = await fetch(`${apiUrl}/api/start-conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: values.phoneNumber,
          message: values.message,
        }),
      });

      console.log('Resposta recebida:', response);

      if (!response.ok) {
        console.error('Resposta não-OK:', response.status, response.statusText);
        throw new Error(`Status: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Dados da resposta:', data);

      if (response.ok) {
        setStatus({ success: 'Mensagem enviada com sucesso!' });
        resetForm();
      } else {
        setStatus({ error: data.error || 'Erro ao enviar mensagem' });
      }
    } catch (error) {
      console.error('Erro detalhado:', error);
      setStatus({ error: `Erro ao conectar com o servidor: ${error.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Iniciar Nova Conversa</h2>

      <Formik
        initialValues={{ phoneNumber: '', message: '' }}
        validationSchema={StartConversationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="space-y-4">
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-secondary-700 mb-1"
              >
                Número de WhatsApp
              </label>
              <Field
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                className="input w-full"
                placeholder="+5511999999999"
              />
              <ErrorMessage
                name="phoneNumber"
                component="div"
                className="text-sm text-danger mt-1"
              />
              <p className="text-xs text-secondary-500 mt-1">
                Inclua o código do país com o + (Ex: +5511999999999)
              </p>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-secondary-700 mb-1"
              >
                Mensagem
              </label>
              <Field
                as="textarea"
                name="message"
                id="message"
                rows="4"
                className="input w-full"
                placeholder="Digite sua mensagem..."
              />
              <ErrorMessage
                name="message"
                component="div"
                className="text-sm text-danger mt-1"
              />
            </div>

            {status && status.success && (
              <div className="bg-success/10 text-success p-3 rounded-md">
                {status.success}
              </div>
            )}

            {status && status.error && (
              <div className="bg-danger/10 text-danger p-3 rounded-md">
                {status.error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
            </button>
          </Form>
        )}
      </Formik>

      {!hasOptedIn && (
        <div className="mt-6 p-4 bg-warning/10 rounded-md">
          <p className="text-warning-700 mb-2 font-medium">⚠️ Importante</p>
          <p className="text-sm mb-2">
            Para receber mensagens, você precisa primeiro conectar seu WhatsApp
            ao nosso sistema.
          </p>
          <Link to="/connect" className="btn btn-warning mt-2 w-full">
            Conectar WhatsApp
          </Link>
        </div>
      )}

      <div className="mt-4 text-xs text-secondary-500 p-3 bg-secondary-50 rounded-md">
        <p className="font-medium mb-2">Observações importantes:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            O destinatário precisa ter registrado seu número no Sandbox do
            Twilio primeiro
          </li>
          <li>
            Para registrar, o usuário deve enviar uma mensagem para o número do
            WhatsApp do Twilio
          </li>
          <li>
            Após 24 horas de inatividade, pode haver limitações nas mensagens
            que podem ser enviadas
          </li>
          <li>
            As mensagens serão enviadas do número do Sandbox do Twilio, não do
            seu número pessoal
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StartConversation;
