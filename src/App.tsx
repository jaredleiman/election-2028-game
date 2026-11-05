import { useReducer, useState } from 'react';
import TopBar from '@/components/layout/TopBar';
import ScreenNav from '@/components/layout/ScreenNav';
import MapScreen from '@/screens/MapScreen';
import AllocateScreen from '@/screens/AllocateScreen';
import DebateScreen from '@/screens/DebateScreen';
import WeekReportScreen from '@/screens/WeekReportScreen';
import FundraisingScreen from '@/screens/FundraisingScreen';
import ElectionNightScreen from '@/screens/ElectionNightScreen';
import { campaignReducer, createInitialGame } from '@/game/campaign';
import type { Investment, ScreenId } from '@/types';

function App() {
  const [game, dispatch] = useReducer(campaignReducer, undefined, createInitialGame);
  const [screen, setScreen] = useState<ScreenId>('map');

  const invest = (investment: Investment) => dispatch({ type: 'invest', investment });
  const endWeek = () => dispatch({ type: 'endWeek' });

  return (
    <div className="min-h-screen bg-navy-950 pb-28 text-slate-100">
      <TopBar game={game} />
      <main key={screen} className="animate-fade-in">
        {screen === 'map' && <MapScreen game={game} onInvest={invest} onEndWeek={endWeek} />}
        {screen === 'allocate' && <AllocateScreen game={game} onInvest={invest} />}
        {screen === 'debate' && <DebateScreen game={game} onInvest={invest} />}
        {screen === 'report' && <WeekReportScreen game={game} />}
        {screen === 'fundraising' && <FundraisingScreen game={game} onInvest={invest} />}
        {screen === 'night' && <ElectionNightScreen game={game} />}
      </main>
      <ScreenNav active={screen} onChange={setScreen} />
    </div>
  );
}

export default App;
