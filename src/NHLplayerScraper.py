import requests
from bs4 import BeautifulSoup
import json

def format_player_url(player_name):
    # Convert player name to lowercase and split into parts
    name_parts = player_name.lower().split()
    # Take the first 5 letters of the last name, followed by the first 2 letters of the first name
    url_name = f"{name_parts[-1][:5]}{name_parts[0][:2]}01"
    return f"https://www.hockey-reference.com/players/{url_name[0]}/{url_name}.html"

def scrape_player(player_url, player):
    response = requests.get(player_url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Find the stats table with id "player_stats"
    stats_table = soup.find('table', {'id': 'player_stats'})
    if not stats_table:
        print(f"No player data found for {player}, returning None")
        return None

    # Initialize player data dictionary
    player_data = {player: {
        'Season': [], 'Tm': [], 'Lg': [], 'Age': [], 'GP': [], 'G': [], 'A': [], 'PTS': [], 'PIM': [], '+/-': []
    }}
    
    # Extract rows
    rows = stats_table.find('tbody').find_all('tr')
    for row in rows:
        # Extract only the required stats
        player_data[player]['Season'].append(row.find('th').text)
        player_data[player]['Tm'].append(row.find('td', {'data-stat': 'team_name_abbr'}).text)
        player_data[player]['Lg'].append(row.find('td', {'data-stat': 'comp_name_abbr'}).text)
        player_data[player]['Age'].append(row.find('td', {'data-stat': 'age'}).text)
        player_data[player]['GP'].append(row.find('td', {'data-stat': 'games'}).text)
        player_data[player]['G'].append(row.find('td', {'data-stat': 'goals'}).text)
        player_data[player]['A'].append(row.find('td', {'data-stat': 'assists'}).text)
        player_data[player]['PTS'].append(row.find('td', {'data-stat': 'points'}).text)
        player_data[player]['PIM'].append(row.find('td', {'data-stat': 'pen_min'}).text)
        player_data[player]['+/-'].append(row.find('td', {'data-stat': 'plus_minus'}).text)

    # Replace empty strings with None
    for stat in player_data[player]:
        player_data[player][stat] = [None if v == '' else v for v in player_data[player][stat]]

    return player_data


if __name__ == "__main__":
    nhl_players = ['Sidney Crosby', 'Connor McDavid', 'Leon Draisaitl', 'Auston Matthews']
    
    # Load existing player data
    try:
        with open('statl/src/players.json', 'r') as f:
            all_player_data = json.load(f)

    except FileNotFoundError:
        print('FileNotFoundError')
        all_player_data = {}

    for player in nhl_players:
        if player in all_player_data:
            print(f"Player data for {player} already exists in players.json. Skipping...")
            continue
        
        player_url = format_player_url(player)
        player_data = scrape_player(player_url, player)
        if player_data:
            # Update the all_player_data dictionary with the new player data
            all_player_data.update(player_data)
            print(f"Player data for {player} has been scraped and added to players.json")
        else:
            print(f"No player data found for {player}")

    # Save the updated data back to players.json
    with open('statl/src/players.json', 'w') as f:
        json.dump(all_player_data, f, indent=2)

    print("All player data has been saved to players.json")