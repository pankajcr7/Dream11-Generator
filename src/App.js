import React, { useState, useEffect } from 'react';

const players = [
  { name: "R Gurbaz", role: "WK", team: "AFG", selectionPct: 96.35, points: 407 },
{ name: "L Das", role: "WK", team: "BAN", selectionPct: 30.21, points: 194 },
{ name: "J Ali", role: "WK", team: "BAN", selectionPct: 2.72, points: 64 },
{ name: "I Zadran", role: "BAT", team: "AFG", selectionPct: 83.01, points: 303 },
{ name: "G Naib", role: "BAT", team: "AFG", selectionPct: 82.28, points: 333 },
{ name: "N Hossain Shanto", role: "BAT", team: "BAN", selectionPct: 46.07, points: 173 },
{ name: "T Hridoy", role: "BAT", team: "BAN", selectionPct: 39.37, points: 220 },
  { name: "T Hasan", role: "BAT", team: "BAN", selectionPct: 10, points: 25 },
  { name: "R Hossain", role: "ALL", team: "BAN", selectionPct: 90.91, points: 421 },
{ name: "S Al Hasan", role: "ALL", team: "BAN", selectionPct: 85.49, points: 260 },
{ name: "A Omarzai", role: "ALL", team: "AFG", selectionPct: 62.72, points: 226 },
{ name: "M Nabi ", role: "ALL", team: "AFG", selectionPct: 51.15, points: 201 },
{ name: "Mahmudullah", role: "ALL", team: "BAN", selectionPct: 15.96, points: 161 },
{ name: "K Janat", role: "ALL", team: "AFG", selectionPct: 3.38, points: 72 },
{ name: "N Kharote", role: "ALL", team: "AFG", selectionPct: 1.34, points: 5 },
{ name: "Rashid Khan", role: "BOWL", team: "AFG", selectionPct: 95.64, points: 435 },
{ name: "F Farooqi", role: "BOWL", team: "AFG", selectionPct: 87.28, points: 494 },
{ name: "T Sakib", role: "BOWL", team: "BAN", selectionPct: 86.88, points: 430 },
{ name: "Naveen-ul-Haq", role: "BOWL", team: "AFG", selectionPct: 68.69, points: 314 },
  { name: "M Rahman", role: "BOWL", team: "BAN", selectionPct: 37, points: 246 },
  { name: "N Ahmad", role: "BOWL", team: "AFG", selectionPct: 8, points: 100 },
  { name: "M Hasan", role: "BOWL", team: "BAN", selectionPct: 6, points: 18 },
];

const createTeams = (numTeams, pitchType, leagueType, minWk, maxWk, minBat, maxBat, minAll, maxAll, minBowl, maxBowl, fixedPlayers, chosenCaptains, chosenViceCaptains) => {
  const rolesOrder = {
    bowling: ["BOWL", "ALL", "BAT", "WK"],
    batting: ["BAT", "ALL", "BOWL", "WK"],
    balanced: ["ALL", "BAT", "BOWL", "WK"],
  }[pitchType];

  const generateTeam = () => {
    const team = { WK: [], BAT: [], ALL: [], BOWL: [] };
    const shuffledPlayers = players.sort(() => Math.random() - 0.5);

    // First, add fixed players to the team
    fixedPlayers.forEach((player) => {
      team[player.role].push(player);
    });

    // Function to add players of a specific role
    const addPlayersOfRole = (role, min, max) => {
      const rolePlayers = shuffledPlayers.filter((player) => player.role === role && !fixedPlayers.includes(player));
      const currentCount = team[role].length;
      const toAdd = Math.min(Math.max(min - currentCount, 0), Math.min(max - currentCount, rolePlayers.length));
      team[role].push(...rolePlayers.slice(0, toAdd));
    };

    // Add players for each role
    addPlayersOfRole("WK", minWk, maxWk);
    addPlayersOfRole("BAT", minBat, maxBat);
    addPlayersOfRole("ALL", minAll, maxAll);
    addPlayersOfRole("BOWL", minBowl, maxBowl);

    // Calculate total players
    const totalPlayers = Object.values(team).flat().length;

    // If we have less than 11 players, add more
    if (totalPlayers < 11) {
      const remainingSlots = 11 - totalPlayers;
      const remainingPlayers = shuffledPlayers.filter((player) => !Object.values(team).flat().includes(player));
      
      for (let i = 0; i < remainingSlots && remainingPlayers.length > 0; i++) {
        const player = remainingPlayers.pop();
        team[player.role].push(player);
      }
    }

    // If we have more than 11 players, remove extras
    if (totalPlayers > 11) {
      const excessPlayers = totalPlayers - 11;
      for (let i = 0; i < excessPlayers; i++) {
        const roleToRemoveFrom = rolesOrder.find((role) => team[role].length > (role === "WK" ? minWk : role === "BAT" ? minBat : role === "ALL" ? minAll : minBowl));
        if (roleToRemoveFrom) {
          team[roleToRemoveFrom].pop();
        }
      }
    }

    const allPlayers = Object.values(team).flat();
    
    // Select captain from the team, prioritizing chosen captains
    const availableCaptains = chosenCaptains.filter(player => allPlayers.includes(player));
    const captain = availableCaptains.length > 0 
      ? availableCaptains[Math.floor(Math.random() * availableCaptains.length)] 
      : allPlayers[Math.floor(Math.random() * allPlayers.length)];

    // Select vice-captain from the team, prioritizing chosen vice-captains
    const availableViceCaptains = chosenViceCaptains.filter(player => allPlayers.includes(player) && player !== captain);
    let viceCaptain = availableViceCaptains.length > 0 
      ? availableViceCaptains[Math.floor(Math.random() * availableViceCaptains.length)] 
      : allPlayers.find(player => player !== captain);

    // Ensure vice-captain is different from captain
    while (viceCaptain === captain) {
      viceCaptain = allPlayers[Math.floor(Math.random() * allPlayers.length)];
    }

    return { ...team, captain, viceCaptain };
  };

  const teams = [];
  const generatedTeamSignatures = new Set();

  while (teams.length < numTeams) {
    const team = generateTeam();
    const teamSignature = JSON.stringify(Object.values(team).flat().map((player) => player.name).sort());

    if (!generatedTeamSignatures.has(teamSignature)) {
      generatedTeamSignatures.add(teamSignature);
      teams.push(team);
    }
  }

  return teams;
};
const PlayerCard = ({ player, isCaptain, isViceCaptain }) => {
  const [imageUrl, setImageUrl] = useState('/api/placeholder/80/80');

  useEffect(() => {
    setImageUrl(`https://ui-avatars.com/api/?name=${player.name}&background=random&size=80`);
  }, [player.name]);

  return (
    <div className="relative text-center">
      <img src={imageUrl} alt={player.name} className="w-12 h-12 mx-auto rounded-full" />
      <p className="font-bold text-xs mt-1">{player.name}</p>
      {isCaptain && (
        <div className="absolute -top-1 -left-1 bg-yellow-400 rounded-full w-4 h-4 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xs">C</span>
        </div>
      )}
      {isViceCaptain && (
        <div className="absolute -top-1 -right-1 bg-blue-400 rounded-full w-4 h-4 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xs">VC</span>
        </div>
      )}
    </div>
  );
};

const RoleSection = ({ title, players, captain, viceCaptain }) => (
  <div className="mb-2">
    <h4 className="text-xs font-bold text-white mb-1">{title}</h4>
    <div className="flex flex-wrap justify-center gap-2">
      {players.map((player) => (
        <PlayerCard
          key={player.name}
          player={player}
          isCaptain={captain === player}
          isViceCaptain={viceCaptain === player}
        />
      ))}
    </div>
  </div>
);

const TeamDisplay = ({ team, index }) => {
  return (
    <div className="bg-gradient-to-br from-green-800 to-green-450 rounded-lg p-3 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-field-pattern opacity-10"></div>
      <h3 className="text-lg font-bold mb-2 text-white">Team {index + 1}</h3>
      <RoleSection title="WICKET-KEEPERS" players={team.WK} captain={team.captain} viceCaptain={team.viceCaptain} />
      <RoleSection title="BATTERS" players={team.BAT} captain={team.captain} viceCaptain={team.viceCaptain} />
      <RoleSection title="ALL-ROUNDERS" players={team.ALL} captain={team.captain} viceCaptain={team.viceCaptain} />
      <RoleSection title="BOWLERS" players={team.BOWL} captain={team.captain} viceCaptain={team.viceCaptain} />
      <div className="absolute bottom-1 right-1 bg-gray-900 bg-opacity-50 rounded-lg p-1">
        <p className="text-xs font-bold text-white">C: {team.captain.name}</p>
        <p className="text-xs font-bold text-white">VC: {team.viceCaptain.name}</p>
      </div>
    </div>
  );
};

const PlayerSelectionModal = ({ title, players, selectedPlayers, onSelectPlayer, onClose }) => (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
    <div className="bg-white rounded-lg p-4 w-80 max-h-full overflow-y-auto">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="flex flex-wrap justify-start gap-2">
        {players.map((player) => (
          <button
            key={player.name}
            className={`p-2 rounded ${selectedPlayers.includes(player) ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            onClick={() => onSelectPlayer(player)}
          >
            {player.name}
          </button>
        ))}
      </div>
      <button className="mt-4 p-2 bg-red-500 text-white rounded" onClick={onClose}>
        Close
      </button>
    </div>
  </div>
);

const App = () => {
  const [teams, setTeams] = useState([]);
  const [pitchType, setPitchType] = useState("balanced");
  const [leagueType, setLeagueType] = useState("Grand League");
  const [numTeams, setNumTeams] = useState(1);
  const [minWk, setMinWk] = useState(1);
  const [maxWk, setMaxWk] = useState(2);
  const [minBat, setMinBat] = useState(3);
  const [maxBat, setMaxBat] = useState(5);
  const [minAll, setMinAll] = useState(1);
  const [maxAll, setMaxAll] = useState(3);
  const [minBowl, setMinBowl] = useState(3);
  const [maxBowl, setMaxBowl] = useState(5);
  const [fixedPlayers, setFixedPlayers] = useState([]);
  const [chosenCaptains, setChosenCaptains] = useState([]);
  const [chosenViceCaptains, setChosenViceCaptains] = useState([]);
  const [showCaptainModal, setShowCaptainModal] = useState(false);
  const [showViceCaptainModal, setShowViceCaptainModal] = useState(false);

  const handleSelectCaptain = (player) => {
    setChosenCaptains((prevCaptains) => {
      if (prevCaptains.includes(player)) {
        return prevCaptains.filter((captain) => captain !== player);
      } else {
        return [...prevCaptains, player];
      }
    });
  };

  const handleSelectViceCaptain = (player) => {
    setChosenViceCaptains((prevViceCaptains) => {
      if (prevViceCaptains.includes(player)) {
        return prevViceCaptains.filter((viceCaptain) => viceCaptain !== player);
      } else {
        return [...prevViceCaptains, player];
      }
    });
  };

  const handleGenerateTeams = () => {
    const generatedTeams = createTeams(
      numTeams,
      pitchType,
      leagueType,
      minWk,
      maxWk,
      minBat,
      maxBat,
      minAll,
      maxAll,
      minBowl,
      maxBowl,
      fixedPlayers,
      chosenCaptains,
      chosenViceCaptains
    );
    setTeams(generatedTeams);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Team Generator</h1>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Number of Teams</label>
        <input
          type="number"
          value={numTeams}
          onChange={(e) => setNumTeams(parseInt(e.target.value))}
          className="border rounded w-full py-2 px-3"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Pitch Type</label>
        <select value={pitchType} onChange={(e) => setPitchType(e.target.value)} className="border rounded w-full py-2 px-3">
          <option value="bowling">Bowling</option>
          <option value="batting">Batting</option>
          <option value="balanced">Balanced</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">League Type</label>
        <select value={leagueType} onChange={(e) => setLeagueType(e.target.value)} className="border rounded w-full py-2 px-3">
          <option value="Small League">Normal</option>
          <option value="Grand League">Tournament</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Wicket-Keepers (Min-Max)</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={minWk}
            onChange={(e) => setMinWk(parseInt(e.target.value))}
            className="border rounded w-full py-2 px-3"
          />
          <input
            type="number"
            value={maxWk}
            onChange={(e) => setMaxWk(parseInt(e.target.value))}
            className="border rounded w-full py-2 px-3"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Batters (Min-Max)</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={minBat}
            onChange={(e) => setMinBat(parseInt(e.target.value))}
            className="border rounded w-full py-2 px-3"
          />
          <input
            type="number"
            value={maxBat}
            onChange={(e) => setMaxBat(parseInt(e.target.value))}
            className="border rounded w-full py-2 px-3"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">All-Rounders (Min-Max)</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={minAll}
            onChange={(e) => setMinAll(parseInt(e.target.value))}
            className="border rounded w-full py-2 px-3"
          />
          <input
            type="number"
            value={maxAll}
            onChange={(e) => setMaxAll(parseInt(e.target.value))}
            className="border rounded w-full py-2 px-3"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Bowlers (Min-Max)</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={minBowl}
            onChange={(e) => setMinBowl(parseInt(e.target.value))}
            className="border rounded w-full py-2 px-3"
          />
          <input
            type="number"
            value={maxBowl}
            onChange={(e) => setMaxBowl(parseInt(e.target.value))}
            className="border rounded w-full py-2 px-3"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Fixed Players</label>
        <div className="flex flex-wrap gap-2">
          {players.map((player) => (
            <button
              key={player.name}
              className={`p-2 rounded ${fixedPlayers.includes(player) ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
              onClick={() => {
                setFixedPlayers((prevFixedPlayers) => {
                  if (prevFixedPlayers.includes(player)) {
                    return prevFixedPlayers.filter((p) => p !== player);
                  } else {
                    return [...prevFixedPlayers, player];
                  }
                });
              }}
            >
              {player.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        <button className="bg-green-500 text-white py-2 px-4 rounded" onClick={handleGenerateTeams}>
          Generate Teams
        </button>
        <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => setShowCaptainModal(true)}>
          Select Captains
        </button>
        <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => setShowViceCaptainModal(true)}>
          Select Vice-Captains
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 mt-4">
        {teams.map((team, index) => (
          <TeamDisplay key={index} team={team} index={index} />
        ))}
      </div>

      {showCaptainModal && (
        <PlayerSelectionModal
          title="Select Captains"
          players={players}
          selectedPlayers={chosenCaptains}
          onSelectPlayer={handleSelectCaptain}
          onClose={() => setShowCaptainModal(false)}
        />
      )}

      {showViceCaptainModal && (
        <PlayerSelectionModal
          title="Select Vice-Captains"
          players={players}
          selectedPlayers={chosenViceCaptains}
          onSelectPlayer={handleSelectViceCaptain}
          onClose={() => setShowViceCaptainModal(false)}
        />
      )}
    </div>
  );
};

export default App;
