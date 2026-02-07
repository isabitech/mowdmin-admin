import RegisterForm from '../../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Admin Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Register for admin access to the dashboard
          </p>
        </div>
        <div className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
