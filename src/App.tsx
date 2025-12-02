import { Routes, Route } from 'react-router-dom';
import { Dashboard } from '@/components/Dashboard';
import { ProjectDetail } from '@/components/ProjectDetail';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
    </Routes>
  );
}
