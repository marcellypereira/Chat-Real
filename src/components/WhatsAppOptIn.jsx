import React from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const Welcome = () => {
  // Número do Sandbox do Twilio (substitua pelo seu)
  const sandboxNumber = '+14155238886';

  // Código de join do Sandbox (substitua pelo seu)
  const joinCode = 'join something-word'; // Substitua pelo seu código correto do Twilio

  // Criar link do WhatsApp com mensagem pré-preenchida
  const whatsappLink = `https://wa.me/${sandboxNumber.replace(
    '+',
    '',
  )}?text=${encodeURIComponent(joinCode)}`;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="card p-8">
        <h1 className="text-3xl font-bold text-primary-700 mb-6 text-center">
          Bem-vindo(a) ao Chat Real!
        </h1>

        <p className="text-lg mb-6 text-center">
          Conecte seu WhatsApp escaneando o QR code abaixo para iniciar uma
          conversa.
        </p>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* QR Code */}
          <div className="flex-1 card bg-white p-6 flex flex-col items-center">
            <h2 className="text-xl font-bold text-primary-700 mb-3 text-center">
              Conecte seu WhatsApp
            </h2>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <QRCodeSVG
                value={whatsappLink}
                size={200}
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="L"
                includeMargin={false}
              />
            </div>

            <div className="text-sm text-secondary-500 mb-4 text-center">
              <p>
                Ou envie a mensagem <strong>"{joinCode}"</strong>
              </p>
              <p>
                para o número <strong>{sandboxNumber}</strong>
              </p>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success w-full"
            >
              Abrir WhatsApp
            </a>
          </div>

          {/* Instruções e Navegação */}
          <div className="flex-1">
            <div className="card bg-secondary-50 p-6 mb-6">
              <h2 className="text-xl font-bold text-secondary-700 mb-3">
                Para Atendentes
              </h2>
              <p className="mb-4">
                Acesse o painel de atendimento para gerenciar conversas.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/pending" className="btn btn-secondary">
                  Solicitações
                </Link>
                <Link to="/active" className="btn btn-primary">
                  Em Atendimento
                </Link>
              </div>
            </div>

            <div className="bg-primary-50 p-4 rounded-md">
              <h3 className="font-bold mb-2">Como funciona?</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Escaneie o QR code com seu WhatsApp</li>
                <li>Envie a mensagem pré-preenchida</li>
                <li>Seu número estará habilitado para receber mensagens</li>
                <li>
                  Após enviar uma mensagem, ela aparecerá na aba Solicitações
                </li>
                <li>Os atendentes podem responder na aba Em Atendimento</li>
                <li>Ao concluir, o atendimento ficará na aba Histórico</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
