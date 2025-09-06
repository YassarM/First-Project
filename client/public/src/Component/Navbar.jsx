import { Link } from 'react-router-dom';

function Navbar({ LoginStatus, Role, username }) {
    return (
        <nav className="flex justify-between items-center px-8 py-4 bg-black text-white shadow-md">
            {/* Left: Event Name */}
            <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">👤</div>
                <h1>{username}</h1>
            </div>

            {/* Center: Menu */}
            <div className="flex space-x-6">
                <Link to="/" className="hover:text-orange-400 transition font-semibold">Home</Link>
                <Link to="/leaderboard" className="hover:text-orange-400 transition font-semibold">Leaderboard</Link>
                <Link to="/contact" className="hover:text-orange-400 transition font-semibold">Contact Us</Link>
            </div>

            {/* Right: Buttons */}
            <div className="flex items-center space-x-4">
                {LoginStatus ? (
                    <button className="bg-white hover:bg-gray-200 px-4 py-2 rounded-lg shadow transition cursor-pointer">
                        <Link to='/logout' className='text-red-600 font-bold'>
                            Log Out
                        </Link>
                    </button>

                ) : (
                    <>
                        <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow transition cursor-pointer">
                            <Link to='/login' className='text-gray-200 font-bold'>
                                Log In
                            </Link>
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
