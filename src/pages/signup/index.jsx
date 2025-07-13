import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const { error } = await signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      alert('Check your email for the login link!');
      navigate('/login');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#0a0a0a]">
      <form onSubmit={handleSignup} className="w-full max-w-sm p-8 rounded shadow-md bg-[#202020]">
        <h2 className="text-2xl font-bold mb-4 text-white">Sign Up</h2>
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
            Sign Up
          </button>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-white">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-gray-400 hover:text-gray-200">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}