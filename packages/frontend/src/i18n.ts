// Configuração básica de internacionalização (i18n)
import { createIntl, createIntlCache } from 'react-intl';

const messages = {
  'pt-BR': {
    connectWallet: 'Conectar Carteira',
    disconnect: 'Desconectar',
    createCircle: 'Criar Círculo',
    healthStatus: 'Status do Sistema',
    priceSui: 'Preço SUI',
  },
  'en-US': {
    connectWallet: 'Connect Wallet',
    disconnect: 'Disconnect',
    createCircle: 'Create Circle',
    healthStatus: 'System Status',
    priceSui: 'SUI Price',
  },
};

const cache = createIntlCache();
const intl = createIntl({
  locale: 'pt-BR',
  messages: messages['pt-BR'],
}, cache);

export { intl, messages };
