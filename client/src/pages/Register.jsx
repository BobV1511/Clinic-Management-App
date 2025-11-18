import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirm: "",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      setMsg("Passwords do not match");
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({ username: form.username, password: form.password })
    );

    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="bg-white w-[420px] shadow-2xl rounded-3xl p-10 border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Join us to access the full dashboard!
        </p>

        {msg && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-center mb-5 font-medium">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-gray-700 font-semibold">
            Username
          </label>
          <input
            type="text"
            name="username"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-5"
            onChange={handleChange}
            required
          />

          <label className="block mb-2 text-gray-700 font-semibold">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-5"
            onChange={handleChange}
            required
          />

          <label className="block mb-2 text-gray-700 font-semibold">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirm"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-8"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition"
          >
            Create Account
          </button>

          <div className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
