import LoginForm from '../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your admin account
          </p>
        </div>
        <div className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}