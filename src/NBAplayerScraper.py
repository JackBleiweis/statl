import requests
from bs4 import BeautifulSoup
import json

def format_player_url(player_name):
    # Convert player name to lowercase and split into parts
    name_parts = player_name.lower().split()
    # Take the first 5 letters of the last name, followed by the first 2 letters of the first name
    url_name = f"{name_parts[-1][:5]}{name_parts[0][:2]}01"
    return f"https://www.basketball-reference.com/players/{url_name[0]}/{url_name}.html"

def scrape_player(player_url, player, team):
    response = requests.get(player_url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Find the stats table with id "per_game"
    stats_table = soup.find('table', {'id': 'per_game'})
    # input(stats_table)
    if not stats_table:
        print(f"No player data found for {player}, returning None")
        return None

    # Initialize player data dictionary
    player_data = {player: {
        'Season': [], 'Tm': [], 'Lg': [], 'Age': [], 'G': [], 'PTS': [], 'AST': [], 'TRB': [], 'STL': [], 'BLK': []
    }}
    
    # Extract rows
    rows = stats_table.find('tbody').find_all('tr', class_='full_table')
    for row in rows:
        # Extract only the required stats
        player_data[player]['Season'].append(row.find('th', {'data-stat': 'season'}).text)
        player_data[player]['Tm'].append(row.find('td', {'data-stat': 'team_id'}).text)
        player_data[player]['Lg'].append(row.find('td', {'data-stat': 'lg_id'}).text)
        player_data[player]['Age'].append(row.find('td', {'data-stat': 'age'}).text)
        player_data[player]['G'].append(row.find('td', {'data-stat': 'g'}).text)
        player_data[player]['PTS'].append(row.find('td', {'data-stat': 'pts_per_g'}).text)
        player_data[player]['AST'].append(row.find('td', {'data-stat': 'ast_per_g'}).text)
        player_data[player]['TRB'].append(row.find('td', {'data-stat': 'trb_per_g'}).text)
        player_data[player]['STL'].append(row.find('td', {'data-stat': 'stl_per_g'}).text)
        player_data[player]['BLK'].append(row.find('td', {'data-stat': 'blk_per_g'}).text)

    # Replace empty strings with None
    for stat in player_data[player]:
        player_data[player][stat] = [None if v == '' else v for v in player_data[player][stat]]

    # Check if the last element in the team column matches the team being passed
    if player_data[player]['Tm'][-1] != team:
        print(f"Last team for {player} does not match the team being passed. Returning None")
        return None
    return player_data


if __name__ == "__main__":
    nhl_players = [['Lebron James', 'LAL'], ['Anthony Davis', 'LAL'], ['Russell Westbrook', 'LAC'], ['Nikola Jokic', 'DEN']]
    
    # Load existing player data
    try:
        with open('statl/src/players.json', 'r') as f:
            all_player_data = json.load(f)

    except FileNotFoundError:
        print('FileNotFoundError')
        all_player_data = {}

    for player in nhl_players:
        if player[0] in all_player_data:
            print(f"Player data for {player[0]} already exists in players.json. Skipping...")
            continue
        
        player_url = format_player_url(player[0])
        player_data = scrape_player(player_url, player[0], player[1])
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