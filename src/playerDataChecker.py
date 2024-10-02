import json

# Define the enums as dictionaries
NHL = {
    "SEASON": "Season",
    "TEAM": "Tm",
    "GAMES_PLAYED": "GP",
    "GOALS": "G",
    "ASSISTS": "A",
    "POINTS": "PTS",
    "PENALTY_MINUTES": "PIM",
    "PLUS_MINUS": "+/-",
}

NBA = {
    "SEASON": "Season",
    "TEAM": "Tm",
    "GAMES_PLAYED": "G",
    "POINTS": "PTS",
    "ASSISTS": "AST",
    "REBOUNDS": "TRB",
    "STEALS": "STL",
    "BLOCKS": "BLK",
}

NFLQB = {
    "SEASON": "Season",
    "TEAM": "Tm",
    "GAMES_PLAYED": "G",
    "PASSING_YARDS": "Yds",
    "TOUCHDOWNS": "TD",
    "INTERCEPTIONS": "Int",
    "RATE": "Rate",
    "CMP": "Cmp%",
}

NFLRB = {
    "SEASON": "Season",
    "TEAM": "Tm",
    "GAMES_PLAYED": "G",
    "RUSHYDS": "RushYds",
    "RUSHTD": "RushTD",
    "RECYDS": "RecYds",
    "RECTD": "RecTD",
}

NFLWR = {
    "SEASON": "Season",
    "TEAM": "Tm",
    "GAMES_PLAYED": "G",
    "TARGETS": "Tgt",
    "RECEPTIONS": "Rec",
    "YARDS": "Yds",
    "YARDS_PER_RECEPTION": "Y/R",
    "TOUCHDOWNS": "TD",
}

NFLD = {
    "SEASON": "Season",
    "TEAM": "Tm",
    "GAMES_PLAYED": "G",
    "INTERCEPTIONS": "Int",
    "PASSES_DEFLECTED": "PD",
    "FUMBLES_FORCED": "FF",
    "COMBINED": "Comb",
    "TACKLES_FOR_LOSS": "TFL",
}

MLB = {
    "SEASON": "Season",
    "TEAM": "Tm",
    "GAMES_PLAYED": "G",
    "HITS": "H",
    "HOME_RUNS": "HR",
    "RBIS": "RBI",
    "STOLEN_BASE": "SB",
    "B_AVG": "BA",
}

def check_player_data(player_data, league_enum):
    # Rename 'Team' to 'Tm' if 'Tm' is missing and 'Team' exists
    if 'Tm' not in player_data and 'Team' in player_data:
        player_data['Tm'] = player_data.pop('Team')

    required_keys = set(league_enum.values())
    player_keys = set(player_data.keys())
    missing_keys = required_keys - player_keys
    return len(missing_keys) == 0, missing_keys

def main():
    with open('statl/src/players.json', 'r') as f:
        players = json.load(f)

    # Read the constants.js file
    with open('statl/src/constants.js', 'r') as f:
        constants_content = f.read()

    # Extract the players list from constants.js
    start = constants_content.index('[')
    end = constants_content.rindex(']')
    players_list = eval(constants_content[start:end+1])

    invalid_players = []
    renamed_players = []
    missing_from_constants = []

    # Check for case-sensitive duplicates in constants.js
    case_sensitive_duplicates = [player for player in set(players_list) if players_list.count(player) > 1]

    # Check for case-insensitive duplicates
    lowercase_players = [player.lower() for player in players_list]
    case_insensitive_duplicates = [players_list[i] for i, player in enumerate(lowercase_players) 
                                   if lowercase_players.count(player) > 1]

    for player_name, player_data in players.items():
        # Check if player is in constants.js (case-insensitive)
        if player_name.lower() not in lowercase_players:
            missing_from_constants.append(player_name)

        # Check and rename 'Team' to 'Tm' if necessary
        if 'Tm' not in player_data and 'Team' in player_data:
            player_data['Tm'] = player_data.pop('Team')
            renamed_players.append(player_name)

        league = player_data.get('Lg', [None])[0]
        position = player_data.get('Pos', [None])[0]
        
        if league is None:
            # Determine league based on position
            if position in ['QB', 'RB', 'WR', 'DE', 'DT', 'LB', 'CB', 'S']:
                league = 'NFL'
            elif position in ['C', 'PF', 'SF', 'SG', 'PG']:
                league = 'NBA'
            elif position in ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH']:
                league = 'MLB'
            else:
                league = 'NHL'  # Assume NHL for any other position

        if league == 'NHL':
            is_valid, missing_keys = check_player_data(player_data, NHL)
        elif league == 'NBA':
            is_valid, missing_keys = check_player_data(player_data, NBA)
        elif league == 'NFL':
            if position == 'QB':
                is_valid, missing_keys = check_player_data(player_data, NFLQB)
            elif position == 'RB':
                is_valid, missing_keys = check_player_data(player_data, NFLRB)
            elif position == 'WR':
                is_valid, missing_keys = check_player_data(player_data, NFLWR)
            elif position in ['DE', 'DT', 'LB', 'CB', 'S', 'RCB', 'FS', 'SS', 'LCB']:
                is_valid, missing_keys = check_player_data(player_data, NFLD)
            else:
                invalid_players.append((player_name, f"Unknown NFL position: {position}"))
                continue
        elif league in ['AL', 'NL', 'MLB']:
            is_valid, missing_keys = check_player_data(player_data, MLB)
        else:
            invalid_players.append((player_name, f"Unknown league: {league}"))
            continue

        if not is_valid:
            invalid_players.append((player_name, f"Missing keys: {', '.join(missing_keys)}"))

    if renamed_players:
        print("Players with 'Team' renamed to 'Tm':")
        for player in renamed_players:
            print(f"- {player}")
        print()

    if invalid_players:
        print("Invalid players found:")
        for player, reason in invalid_players:
            print(f"- {player}: {reason}")
    else:
        print("All players are valid.")
        print("There are a total of",len(players), "players.")

    if case_sensitive_duplicates:
        print("\nCase-sensitive duplicate players found in constants.js:")
        for player in case_sensitive_duplicates:
            print(f"- {player}")

    if case_insensitive_duplicates:
        print("\nCase-insensitive duplicate players found in constants.js:")
        for player in set(case_insensitive_duplicates):
            print(f"- {player}")

    if case_sensitive_duplicates or case_insensitive_duplicates:
        # Remove all duplicates (case-insensitive)
        unique_players = []
        seen = set()
        for player in players_list:
            if player.lower() not in seen:
                unique_players.append(player)
                seen.add(player.lower())
        players_list = unique_players
        print(f"\nRemoved {len(players_list) - len(unique_players)} duplicate(s) from constants.js")

    if missing_from_constants:
        print("\nPlayers missing from constants.js:")
        for player in missing_from_constants:
            print(f"- {player}")
        
        # Add missing players to constants.js
        players_list.extend(missing_from_constants)
        players_list.sort(key=str.lower)  # Sort the list alphabetically (case-insensitive)
        
        # Update constants.js file
        new_constants_content = constants_content[:start] + json.dumps(players_list, indent=2) + constants_content[end+1:]
        with open('statl/src/constants.js', 'w') as f:
            f.write(new_constants_content)
        
        print(f"\nAdded {len(missing_from_constants)} player(s) to constants.js")

    # Save the updated players data back to the file
    with open('statl/src/players.json', 'w') as f:
        json.dump(players, f, indent=2)


if __name__ == "__main__":
    main()
