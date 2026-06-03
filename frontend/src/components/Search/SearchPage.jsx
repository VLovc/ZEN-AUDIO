import Sidebar from '../Layout/Sidebar';
import SearchHeader from './SearchHeader';
import SearchBar from './SearchBar';
import BentoGrid from './BentoGrid';
import PlayerBarStudio from '../Layout/PlayerBarStudio';

const SearchPage = () => (
    <div className="flex bg-surface min-h-screen">
        <Sidebar />
        <main className="ml-64 pt-24 pb-32 px-10 h-screen overflow-y-auto dotted-grid flex-1">
            <div className="max-w-[1440px] mx-auto">    
                <SearchHeader />
                <SearchBar />
                <BentoGrid />
            </div>
        </main>
        <PlayerBarStudio />
    </div>
);
export default SearchPage;