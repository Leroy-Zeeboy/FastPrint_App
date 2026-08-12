import { Routes, Route } from 'react-router-dom';
import GerantLayout from './GerantLayout';
import GerantHome from './GerantHome';
import CommandesEnAttente from './CommandesEnAttente';
import HistoriqueCommandes from './HistoriqueCommandes';
import CommandesArticles from './CommandesArticles';
import Accessoires from './Accessoires';

export default function GerantDashboard() {
  return (
    <GerantLayout>
      <Routes>
        <Route path="/" element={<GerantHome />} />
        <Route path="/commandes" element={<CommandesEnAttente />} />
        <Route path="/historique" element={<HistoriqueCommandes />} />
        <Route path="/commandes-articles" element={<CommandesArticles />} />
        <Route path="/accessoires" element={<Accessoires />} />
      </Routes>
    </GerantLayout>
  );
}