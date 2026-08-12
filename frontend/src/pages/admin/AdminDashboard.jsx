import { Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminHome from './AdminHome';
import Utilisateurs from './Utilisateurs';
import TarifsAdmin from './TarifsAdmin';
import ForfaitsAdmin from './ForfaitsAdmin';
import OptionsAdmin from './OptionsAdmin';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/utilisateurs" element={<Utilisateurs />} />
        <Route path="/tarifs" element={<TarifsAdmin />} />
        <Route path="/forfaits" element={<ForfaitsAdmin />} />
        <Route path="/options" element={<OptionsAdmin />} />
      </Routes>
    </AdminLayout>
  );
}