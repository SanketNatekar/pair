import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 text-gray-800">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-indigo-600">ChessMate</h1>
        <nav>
          <Link to="/login" className="text-indigo-600 font-semibold mr-4 hover:underline">Login</Link>
          <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Sign Up</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center justify-between px-8 py-20 max-w-7xl mx-auto">
        <div className="md:w-1/2">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-gray-900">
            Run Chess Tournaments <br className="hidden md:inline" />
            <span className="text-indigo-600">Effortlessly</span>
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Manage players, pair rounds, track scores, and generate leaderboards — all in one place.
          </p>
          <Link to="/signup" className="bg-indigo-600 text-white px-6 py-3 rounded text-lg font-medium hover:bg-indigo-700">
            Get Started
          </Link>
        </div>
        <div className="mt-10 md:mt-0 md:w-1/2">
          <img 
            src="https://www.chess-chivalry.com/cdn/shop/files/Grace-chess-pieces-title-slider.webp?v=1674932529&width=2000" 
            alt="Chess illustration" 
            className="w-full max-w-md mx-auto rounded-lg" 
          />
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-10 text-gray-800">Why Choose ChessMate?</h3>
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <h4 className="text-xl font-semibold mb-3 text-indigo-600">Swiss-style Pairings</h4>
              <p className="text-gray-600">Automatic round pairing system with color balancing and no-repeat matchups.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-3 text-indigo-600">Real-time Leaderboard</h4>
              <p className="text-gray-600">Always stay up-to-date with real-time results and rankings.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-3 text-indigo-600">Simple & Fast UI</h4>
              <p className="text-gray-600">Designed for speed and clarity — even under tournament pressure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} ChessMate. Built with 💙 by Sanket.
      </footer>
    </div>
  );
};

export default Home;
