import requests
from bs4 import BeautifulSoup
import json

def format_player_url(player_name):
    # Convert player name to lowercase and split into parts
    name_parts = player_name.lower().split()
    # Take the first 5 letters of the last name, followed by the first 2 letters of the first name
    url_name = f"{name_parts[-1][:5]}{name_parts[0][:2]}01"
    print(url_name);
    return f"https://www.baseball-reference.com/players/{url_name[0]}/{url_name}.shtml"

def scrape_player(player_url, player, team):
    response = requests.get(player_url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Find the stats table with id "player_stats"
    stats_table = soup.find('table', {'id': 'batting_standard'})
    if not stats_table:
        print(f"No player data found for {player}, returning None")
        return None

    # Initialize player data dictionary
    player_data = {player: {
        'Season': [], 'Tm': [], 'Lg': [], 'Age': [], 'G': [], 'H': [], 'HR': [], 'RBI': [], 'SB': [], 'BA': []
    }}
    
    # Extract rows
    rows = stats_table.find('tbody').find_all('tr')
    for row in rows:
        league = row.find('td', {'data-stat': 'lg_ID'}).text
        if league not in ['AL', 'NL']:
            continue
        # Extract only the required stats
        player_data[player]['Season'].append(row.find('th').text)
        player_data[player]['Tm'].append(row.find('td', {'data-stat': 'team_ID'}).text)
        player_data[player]['Lg'].append(row.find('td', {'data-stat': 'lg_ID'}).text)
        player_data[player]['Age'].append(row.find('td', {'data-stat': 'age'}).text)
        player_data[player]['G'].append(row.find('td', {'data-stat': 'G'}).text)
        player_data[player]['H'].append(row.find('td', {'data-stat': 'H'}).text)
        player_data[player]['HR'].append(row.find('td', {'data-stat': 'HR'}).text)
        player_data[player]['RBI'].append(row.find('td', {'data-stat': 'RBI'}).text)
        player_data[player]['SB'].append(row.find('td', {'data-stat': 'SB'}).text)
        player_data[player]['BA'].append(row.find('td', {'data-stat': 'batting_avg'}).text)

    last_team = player_data[player]['Tm'][-1]
    if last_team != player:
        print(f"Last team in the team column does not match the team being passed: {last_team} vs {player}")
        return None
    
    # Replace empty strings with None
    for stat in player_data[player]:
        player_data[player][stat] = [None if v == '' else v for v in player_data[player][stat]]

    return player_data


if __name__ == "__main__":
    nhl_players = [{"name": 'Vladimir Guerrero', "team": "TOR"}]
    
    # Load existing player data
    try:
        with open('./src/players.json', 'r') as f:
            all_player_data = json.load(f)

    except FileNotFoundError:
        print('FileNotFoundError')
        all_player_data = {}

    for player in nhl_players:
        if player['name'] in all_player_data:
            print(f"Player data for {player} already exists in players.json. Skipping...")
            continue
        
        player_url = format_player_url(player['name'])
        player_data = scrape_player(player_url, player['name'], player['team'])
        if player_data:
            # Update the all_player_data dictionary with the new player data
            all_player_data.update(player_data)
            print(f"Player data for {player} has been scraped and added to players.json")
        else:
            print(f"No player data found for {player}")

    # Save the updated data back to players.json
    with open('./src/players.json', 'w') as f:
        json.dump(all_player_data, f, indent=2)

    print("All player data has been saved to players.json")