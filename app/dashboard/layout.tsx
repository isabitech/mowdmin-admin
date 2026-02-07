import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Sidebar from '../../components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Sidebar>
        {children}
      </Sidebar>
    </ProtectedRoute>
  );
}