import { Header } from "../components/Header.jsx";
import { Grid } from "../components/Grid.jsx";
import { StatsSidebar } from "../components/StatsSidebar.jsx";
import { LiveFeedSidebar } from "../components/LiveFeedSidebar.jsx";

export const GridPage = ({ user, grid, capturedCount, statusMessage, liveFeed, onBlockClick, onLogout }) => {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary/30 min-h-screen flex flex-col">
      {/* Header */}
      <Header 
        onLogout={onLogout}
      />

      {/* Main Content Layout */}
      <main className="flex-grow pt-24 pb-12 px-6 flex flex-col lg:flex-row gap-8 max-w-[1600px] mx-auto w-full">
        {/* Left Sidebar - Stats */}
        <StatsSidebar 
          capturedCount={capturedCount}
          statusMessage={statusMessage}
        />

        {/* Center - Main Grid */}
        <Grid grid={grid} onBlockClick={onBlockClick} currentUserId={user.id} />

        {/* Right Sidebar - Live Feed */}
        <LiveFeedSidebar
          feedItems={liveFeed}
          currentUser={user}
        />
      </main>

    </div>
  );
};
