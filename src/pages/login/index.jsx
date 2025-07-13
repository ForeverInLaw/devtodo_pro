import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await signIn({ email, password });
    if (error) {
      alert(error.message);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#0a0a0a]">
      <form onSubmit={handleLogin} className="w-full max-w-sm p-8 rounded shadow-md bg-[#202020]">
        <h2 className="text-2xl font-bold mb-4 text-white">Login</h2>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#333333] border-[#555555] text-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#777777] placeholder-gray-400"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#333333] border-[#555555] text-white mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-[#777777] placeholder-gray-400"
            id="password"
            type="password"
            placeholder="******************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-white hover:bg-gray-200 text-black font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            type="submit"
          >
            Sign In
          </button>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-white">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-gray-400 hover:text-gray-200">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}