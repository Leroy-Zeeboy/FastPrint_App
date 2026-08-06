import { Routes, Route } from 'react-router-dom';
import ClientLayout from './ClientLayout';
import ClientHome from './ClientHome';
import DeposerDocument from './DeposerDocument';
import MesCommandes from './MesCommandes';
import Boutique from './Boutique';
import Notifications from './Notifications';

export default function ClientDashboard() {
  return (
    <ClientLayout>
      <Routes>
        <Route path="/" element={<ClientHome />} />
        <Route path="/deposer" element={<DeposerDocument />} />
        <Route path="/commandes" element={<MesCommandes />} />
        <Route path="/boutique" element={<Boutique />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </ClientLayout>
  );
}