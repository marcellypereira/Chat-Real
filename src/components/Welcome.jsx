import React from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';

const Welcome = () => {
  // Número do Sandbox do Twilio (substitua pelo seu)
  const sandboxNumber = '+14155238886';

  // Código de join do Sandbox (substitua pelo seu código correto)
  const joinCode = 'join somebody-way'; // IMPORTANTE: Substitua pelo seu código correto!

  // Criar link do WhatsApp com mensagem pré-preenchida
  const whatsappLink = `https://wa.me/${sandboxNumber.replace(
    '+',
    '',
  )}?text=${encodeURIComponent(joinCode)}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-lg mx-auto py-8"
    >
      <motion.div
        className="bg-white rounded-lg shadow-lg p-8"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <motion.h1
          className="text-2xl font-bold text-indigo-700 mb-6 text-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          Chat Real
        </motion.h1>

        <div className="text-center mb-6">
          <motion.p
            className="mb-4 text-gray-600"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Escaneie o QR code abaixo com seu WhatsApp para iniciar:
          </motion.p>

          <motion.div
            className="bg-white p-4 rounded-lg shadow-sm mb-4 inline-block"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            whileHover={{ boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)' }}
          >
            <QRCodeSVG
              value={whatsappLink}
              size={200}
              bgColor="#FFFFFF"
              fgColor="#000000"
              level="L"
              includeMargin={false}
            />
          </motion.div>

          <motion.div
            className="text-sm text-gray-500 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p>
              Ou envie a mensagem <strong>"{joinCode}"</strong>
            </p>
            <p>
              para o número <strong>{sandboxNumber}</strong>
            </p>
          </motion.div>

          <div className="space-y-3">
            <motion.a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors w-full inline-block flex items-center justify-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
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

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Link
                to="/pending"
                className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors w-full inline-block flex items-center justify-center"
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
            </motion.div>
          </div>
        </div>

        <motion.div
          className="bg-gray-50 p-4 rounded-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="font-medium mb-2 text-gray-700">Como funciona:</h3>
          <ol className="text-sm list-decimal pl-5 space-y-1 text-gray-600">
            <motion.li
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              Escaneie o QR code com seu WhatsApp
            </motion.li>
            <motion.li
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              Envie a mensagem pré-preenchida
            </motion.li>
            <motion.li
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              Depois, envie sua mensagem ou pergunta
            </motion.li>
            <motion.li
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Nossa equipe atenderá você rapidamente
            </motion.li>
          </ol>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Welcome;
