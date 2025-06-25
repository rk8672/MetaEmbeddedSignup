import React, { useState, useEffect, useMemo, useRef, useCallback, createContext, useContext, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Simulate API
const fakeAPI = {
  getUsers: () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Alice', age: 25 },
          { id: 2, name: 'Bob', age: 30 },
          { id: 3, name: 'Charlie', age: 35 },
        ]);
      }, 1000);
    }),
};

// Context Example
const ThemeContext = createContext();

const LazyAbout = lazy(() => import('../src/Pages/Home/Home'));

function App() {
  const [theme, setTheme] = useState('');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <BrowserRouter>
        <nav className="p-4 bg-gray-100">
          <Link to="/" className="mr-4">Home</Link>
          <Link to="/users" className="mr-4">Users</Link>
          <Link to="/about">About (Lazy)</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/about" element={<Suspense fallback={<div>Loading...</div>}><LazyAbout /></Suspense>} />
        </Routes>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}

function Home() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className="m-4">
      <h1 className="text-xl font-bold">Welcome to React Interview Practice</h1>
      <p className="mb-2">Current theme: {theme}</p>
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="bg-indigo-500 text-white px-2 py-1"
      >
        Toggle Theme
      </button>
    </div>
  );
}

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', age: '' });
  const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const inputRef = useRef(null);
//   const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fakeAPI.getUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));
  }, [search, users]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('Searching for:', search);
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Heartbeat every 3s');
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const paginatedUsers = useMemo(() => filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ), [currentPage, filteredUsers]);

  useEffect(() => {
    sessionStorage.setItem('lastVisited', '/users');
    localStorage.setItem('usersCount', users.length);
    document.cookie = `userSession=active;path=/`;
  }, [users]);

  const handleAdd = useCallback(() => {
    const newUser = {
      id: users.length + 1,
      name: form.name,
      age: parseInt(form.age),
    };
    setUsers([...users, newUser]);
    setForm({ name: '', age: '' });
    inputRef.current.focus();
  }, [form, users]);

  const handleDelete = useCallback((id) => {
    setUsers(users.filter((user) => user.id !== id));
  }, [users]);

  const handleUpdate = useCallback((id) => {
    const updated = users.map((user) =>
      user.id === id ? { ...user, name: form.name, age: parseInt(form.age) } : user
    );
    setUsers(updated);
    setForm({ name: '', age: '' });
  }, [form, users]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">User Management</h2>
      <input
        ref={inputRef}
        className="border p-1 mr-2"
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="my-4">
        <input
          className="border p-1 mr-2"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border p-1 mr-2"
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />
        <button onClick={handleAdd} className="bg-green-500 text-white px-2 py-1 mr-2">Add</button>
        <button onClick={() => handleUpdate(1)} className="bg-yellow-500 text-white px-2 py-1">Update ID 1</button>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="table-auto border w-full">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Age</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id}>
                <td className="border px-4 py-2">{user.id}</td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.age}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-2 py-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4">
        {Array.from({ length: Math.ceil(filteredUsers.length / itemsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-2 py-1 border ${currentPage === i + 1 ? 'bg-blue-500 text-white' : ''}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
