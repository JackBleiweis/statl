import requests
from bs4 import BeautifulSoup
import json
import time

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
    nba_players = [
  ["LeBron James", "LAL"],
  ["Stephen Curry", "GSW"],
  ["Kevin Durant", "PHX"],
  ["Giannis Antetokounmpo", "MIL"],
  ["Nikola Jokic", "DEN"],
  ["Joel Embiid", "PHI"],
  ["Luka Doncic", "DAL"],
  ["Jayson Tatum", "BOS"],
  ["Anthony Davis", "LAL"],
  ["Jimmy Butler", "MIA"],
  ["Devin Booker", "PHX"],
  ["Kawhi Leonard", "LAC"],
  ["Ja Morant", "MEM"],
  ["James Harden", "PHI"],
  ["Damian Lillard", "MIL"],
  ["Shai Gilgeous-Alexander", "OKC"],
  ["Donovan Mitchell", "CLE"],
  ["Paul George", "LAC"],
  ["Jaylen Brown", "BOS"],
  ["Zion Williamson", "NOP"],
  ["Tyrese Haliburton", "IND"],
  ["Bam Adebayo", "MIA"],
  ["Karl-Anthony Towns", "MIN"],
  ["Jamal Murray", "DEN"],
  ["De'Aaron Fox", "SAC"],
  ["Brandon Ingram", "NOP"],
  ["Trae Young", "ATL"],
  ["Rudy Gobert", "MIN"],
  ["Pascal Siakam", "TOR"],
  ["Kyrie Irving", "DAL"],
  ["LaMelo Ball", "CHA"],
  ["Andrew Wiggins", "GSW"],
  ["Desmond Bane", "MEM"],
  ["Jrue Holiday", "BOS"],
  ["CJ McCollum", "NOP"],
  ["Draymond Green", "GSW"],
  ["Dejounte Murray", "ATL"],
  ["Fred VanVleet", "HOU"],
  ["Khris Middleton", "MIL"],
  ["Mikal Bridges", "BKN"],
  ["Domantas Sabonis", "SAC"],
  ["Tyler Herro", "MIA"],
  ["Franz Wagner", "ORL"],
  ["Jaren Jackson Jr.", "MEM"],
  ["Brook Lopez", "MIL"],
  ["OG Anunoby", "TOR"],
  ["Miles Bridges", "CHA"],
  ["Michael Porter Jr.", "DEN"],
  ["Jalen Brunson", "NYK"],
  ["Aaron Gordon", "DEN"],
  ["Marcus Smart", "MEM"],
  ["D'Angelo Russell", "LAL"],
  ["John Collins", "UTA"],
  ["Jordan Poole", "WAS"],
  ["Julius Randle", "NYK"],
  ["Tyrese Maxey", "PHI"],
  ["RJ Barrett", "NYK"],
  ["Buddy Hield", "IND"],
  ["Tobias Harris", "PHI"],
  ["Malcolm Brogdon", "POR"],
  ["Alperen Sengun", "HOU"],
  ["Al Horford", "BOS"],
  ["Nikola Vucevic", "CHI"],
  ["Paolo Banchero", "ORL"],
  ["Ben Simmons", "BKN"],
  ["Christian Wood", "LAL"],
  ["Josh Giddey", "OKC"],
  ["Cade Cunningham", "DET"],
  ["Collin Sexton", "UTA"],
  ["Bojan Bogdanovic", "DET"],
  ["Tyus Jones", "WAS"],
  ["Victor Wembanyama", "SAS"],
  ["Walker Kessler", "UTA"],
  ["Kyle Kuzma", "WAS"],
  ["Keldon Johnson", "SAS"],
  ["Chris Paul", "GSW"],
  ["Robert Williams III", "POR"],
  ["Jonas Valanciunas", "NOP"],
  ["Steven Adams", "MEM"],
  ["Spencer Dinwiddie", "BKN"],
  ["Anfernee Simons", "POR"],
  ["Jabari Smith Jr.", "HOU"],
  ["Deandre Ayton", "POR"],
  ["Josh Hart", "NYK"],
  ["Terry Rozier", "CHA"],
  ["Jeremy Sochan", "SAS"],
  ["Markelle Fultz", "ORL"],
  ["Mo Bamba", "PHI"],
  ["Jaden Ivey", "DET"],
  ["Naz Reid", "MIN"],
  ["Patrick Williams", "CHI"],
  ["Gary Trent Jr.", "TOR"],
  ["Lonzo Ball", "CHI"],
  ["Onyeka Okongwu", "ATL"],
  ["Isaiah Stewart", "DET"],
  ["Jarrett Allen", "CLE"],
  ["P.J. Washington", "CHA"],
  ["Jaxson Hayes", "LAL"],
  ["Dillon Brooks", "HOU"],
  ["Davion Mitchell", "SAC"],
  ["Herbert Jones", "NOP"],
  ["Kelly Oubre Jr.", "PHI"],
  ["Grayson Allen", "PHX"],
  ["Mitchell Robinson", "NYK"],
  ["Caris LeVert", "CLE"],
  ["Jonathan Kuminga", "GSW"],
  ["Quentin Grimes", "NYK"],
  ["Kevin Huerter", "SAC"],
  ["Luguentz Dort", "OKC"],
  ["Keegan Murray", "SAC"],
  ["Bruce Brown", "IND"],
  ["Jaden McDaniels", "MIN"],
  ["Austin Reaves", "LAL"],
  ["Cam Johnson", "BKN"],
  ["Jabari Walker", "POR"],
  ["Saddiq Bey", "ATL"],
  ["Chris Duarte", "SAC"],
  ["Bol Bol", "PHX"],
  ["Joe Harris", "DET"],
  ["Immanuel Quickley", "NYK"],
  ["Jalen Green", "HOU"],
  ["Delon Wright", "WAS"],
  ["Jusuf Nurkic", "PHX"],
  ["Dennis Schroder", "TOR"],
  ["Obi Toppin", "IND"],
  ["Tari Eason", "HOU"],
  ["Rui Hachimura", "LAL"],
  ["Tre Jones", "SAS"],
  ["Jalen Duren", "DET"],
  ["Luke Kennard", "MEM"],
  ["Kyle Anderson", "MIN"],
  ["Monte Morris", "DET"],
  ["Patrick Beverley", "PHI"],
  ["Cameron Payne", "MIL"],
  ["Torrey Craig", "CHI"],
  ["Malik Monk", "SAC"],
  ["Payton Pritchard", "BOS"],
  ["Zach Collins", "SAS"],
  ["Jalen Johnson", "ATL"],
  ["Aleksej Pokusevski", "OKC"],
  ["Lauri Markkanen", "UTA"],
  ["Terance Mann", "LAC"],
  ["Ziaire Williams", "MEM"],
  ["Precious Achiuwa", "TOR"],
  ["Davonte' Graham", "SAS"],
  ["Trendon Watford", "BKN"],
  ["Jalen Suggs", "ORL"],
  ["Corey Kispert", "WAS"],
  ["Daniel Gafford", "WAS"],
  ["Deni Avdija", "WAS"],
  ["Coby White", "CHI"],
  ["Kenyon Martin Jr.", "LAC"],
  ["De'Andre Hunter", "ATL"],
  ["Richaun Holmes", "DAL"],
  ["Shaedon Sharpe", "POR"],
  ["Max Strus", "CLE"],
  ["Kevin Love", "MIA"],
  ["T.J. McConnell", "IND"],
  ["Jaylen Nowell", "MIN"],
  ["Jerami Grant", "POR"],
  ["Ivica Zubac", "LAC"],
  ["Nick Richards", "CHA"],
  ["Joe Ingles", "ORL"],
  ["Landry Shamet", "WAS"],
  ["Jonathan Isaac", "ORL"],
  ["Lonnie Walker IV", "BKN"],
  ["Oshae Brissett", "BOS"],
  ["Thaddeus Young", "TOR"],
  ["Justin Holiday", "DEN"],
  ["Aaron Nesmith", "IND"],
  ["JaVale McGee", "SAC"],
  ["Shake Milton", "MIN"],
  ["Dean Wade", "CLE"],
  ["Blake Griffin", "BOS"],
  ["Naji Marshall", "NOP"],
  ["Jevon Carter", "CHI"],
  ["Donte DiVincenzo", "NYK"],
  ["Isaac Okoro", "CLE"],
  ["Nickeil Alexander-Walker", "MIN"],
  ["Austin Rivers", "MIN"],
  ["Andre Drummond", "CHI"],
  ["Derrick White", "BOS"],
  ["Gabe Vincent", "LAL"],
  ["Kelly Olynyk", "UTA"],
  ["Maxi Kleber", "DAL"],
  ["Damion Lee", "PHX"],
  ["Kenrich Williams", "OKC"],
  ["Zeke Nnaji", "DEN"],
  ["Omer Yurtseven", "UTA"],
  ["Chimezie Metu", "SAC"],
  ["Danilo Gallinari", "WAS"],
  ["Talen Horton-Tucker", "UTA"],
  ["Gorgui Dieng", "SAS"],
  ["Isaiah Hartenstein", "NYK"],
  ["Andre Iguodala", "GSW"],
  ["Blake Wesley", "SAS"],
  ["Tre Mann", "OKC"],
  ["Dwight Powell", "DAL"],
  ["Santi Aldama", "MEM"],
  ["Dario Saric", "GSW"],
]

    # Load existing player data
    try:
        with open('statl/src/players.json', 'r') as f:
            all_player_data = json.load(f)
    except FileNotFoundError:
        print('FileNotFoundError')
        all_player_data = {}

    for player in nba_players:
        if player[0] in all_player_data:
            print(f"Player data for {player[0]} already exists in players.json. Skipping...")
            continue
        
        player_url = format_player_url(player[0])
        try:
            player_data = scrape_player(player_url, player[0], player[1])
            if player_data:
                # Update the all_player_data dictionary with the new player data
                all_player_data.update(player_data)
                print(f"Player data for {player} has been scraped and added to players.json")
            else:
                print(f"No player data found for {player}")
        except Exception as error:
            print(f"Skipping player {player[0]}, {error}")
            continue

        # Add a 2-second delay between requests
        time.sleep(2)

    # Save the updated data back to players.json
    with open('statl/src/players.json', 'w') as f:
        json.dump(all_player_data, f, indent=2)

    print("All player data has been saved to players.json")