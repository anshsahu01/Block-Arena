export const Header = ({ onLogout }) => {
  return (
    <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 z-50 bg-[#060e20]/70 backdrop-blur-xl shadow-header">
      {/* Left Section - Logo & Nav */}
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-bold tracking-tighter text-cyan-500 bg-clip-text font-headline">Block Arena</h1>
        <nav className="hidden md:flex items-center space-x-6">
          <a className="text-cyan-400 border-b-2 border-cyan-500 pb-1 font-headline tracking-tight text-sm" href="#">Home</a>
        </nav>
      </div>

      {/* Right Section - Logout */}
      <div className="flex items-center">
        <button
          onClick={onLogout}
          className="text-[#a3aac4] hover:text-white group transition-colors text-xs font-bold uppercase tracking-tighter"
        >
          Logout
        </button>
      </div>
    </header>
  );
};
