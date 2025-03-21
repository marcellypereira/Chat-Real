import React from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';

const Welcome = () => {
  const sandboxNumber = '+14155238886';

  const joinCode = 'join somebody-way';
  const whatsappLink = `https://wa.me/${sandboxNumber.replace(
    '+',
    '',
  )}?text=${encodeURIComponent(joinCode)}`;

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
  };

  const slideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto py-8 px-4"
    >
      <motion.div
        variants={slideUp}
        className="bg-white rounded-lg shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="bg-white p-4 mb-4 inline-block mx-auto">
              <QRCodeSVG
                value={whatsappLink}
                size={200}
                bgColor="#FFFFFF"
                level="L"
                includeMargin={false}
              />
            </div>

            <div className="text-sm text-text-secondary mb-6 text-center">
              <p className="mb-1">
                Ou envie a mensagem{' '}
                <strong className="select-all">"{joinCode}"</strong> para o
                número <strong className="select-all">{sandboxNumber}</strong>
              </p>
            </div>
          </div>

          <div className="mb-8 bg-white text-center">
            <h3 className="font-bold text-lg mb-3 text-gray-600 py-1">
              Como funciona:
            </h3>

            <div className="space-y-1 text-left mx-auto max-w-xs">
              <p className="text-xs text-gray-600">
                <strong>1.</strong>Escaneie o QR code com a câmera do seu
                WhatsApp
              </p>
              <p className="text-xs text-gray-600">
                <strong>2.</strong>Envie a mensagem pré-preenchida para conectar
              </p>
              <p className="text-xs text-gray-600">
                <strong>3.</strong>Envie sua dúvida para iniciar o atendimento
              </p>
              <p className="text-xs text-gray-600">
                <strong>4.</strong>Nossa equipe responderá rapidamente
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-whatsapp text-white py-3 px-4 rounded-lg hover:opacity-90 transition-opacity inline-block flex items-center justify-center shadow-chat"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
              Abrir WhatsApp
            </motion.a>

            <Link
              to="/pending"
              className="bg-primary text-white py-3 px-4 rounded-lg hover:opacity-90 transition-opacity inline-block flex items-center justify-center shadow-chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
              Ver Solicitações
            </Link>
          </div>
        </div>

        <div className="border-t py-4 px-8 text-center text-sm text-text-secondary">
          Estamos disponíveis para atendimento de segunda a sexta, das 8h às
          18h.
          <br />
          Para emergências, ligue para (11) 9999-9999.
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Welcome;
