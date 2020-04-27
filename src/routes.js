import React from 'react';
import DefaultLayout from './Components/DefaultLayout';

const CryptoDashboard = React.lazy(() => import('./Components/Crypto/CryptoDashboard'));
const CryptoComponent = React.lazy(() => import('./Components/Crypto/CryptoComponent'));
const CryptoTrading = React.lazy(() => import('./Components/Crypto/CryptoTrade'));

const FourD = React.lazy(() => import('./Components/FourDComponent'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', name: 'home', component: DefaultLayout, exact: true },
  { path: '/crypto/dashboard', name: 'crypto', component: CryptoDashboard},
  { path: '/crypto/candle-analysis', name: 'Candle analysis', component: CryptoComponent },
  { path: '/crypto/trading', name: 'trading', component: CryptoTrading },
  { path: '/4d', name: '4d', component: FourD, exact: true },

];

export default routes;
