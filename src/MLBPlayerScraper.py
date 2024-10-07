import requests
from bs4 import BeautifulSoup
import json
import time
import unicodedata

def remove_accents(input_str):
    nfkd_form = unicodedata.normalize('NFKD', input_str)
    return ''.join([c for c in nfkd_form if not unicodedata.combining(c)])

def format_player_url(player_name):
    # Remove accents
    player_name = remove_accents(player_name)
    # Convert player name to lowercase and split into parts
    name_parts = player_name.lower().split()
    # Take the first 5 letters of the last name, followed by the first 2 letters of the first name
    url_name = f"{name_parts[-1][:5]}{name_parts[0][:2]}01"
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
    if last_team != team:
        print(f"Last team in the team column does not match the team being passed: {last_team} vs {team}")
        return None
    
    # Replace empty strings with None
    for stat in player_data[player]:
        player_data[player][stat] = [None if v == '' else v for v in player_data[player][stat]]

    return player_data


if __name__ == "__main__":
    mlb_players = [
    {"name": "Shohei Ohtani", "team": "LAD"},  # as a hitter only
    {"name": "Aaron Judge", "team": "NYY"},
    {"name": "Mookie Betts", "team": "LAD"},
    {"name": "Freddie Freeman", "team": "LAD"},
    {"name": "Juan Soto", "team": "SDP"},
    {"name": "Ronald Acuña Jr.", "team": "ATL"},
    {"name": "Fernando Tatis Jr.", "team": "SDP"},
    {"name": "José Ramírez", "team": "CLE"},
    {"name": "Julio Rodríguez", "team": "SEA"},
    {"name": "Yordan Alvarez", "team": "HOU"},
    {"name": "Corey Seager", "team": "TEX"},
    {"name": "Bo Bichette", "team": "TOR"},
    {"name": "Vladimir Guerrero Jr.", "team": "TOR"},
    {"name": "Matt Olson", "team": "ATL"},
    {"name": "Paul Goldschmidt", "team": "STL"},
    {"name": "Kyle Tucker", "team": "HOU"},
    {"name": "Rafael Devers", "team": "BOS"},
    {"name": "Manny Machado", "team": "SDP"},
    {"name": "Trea Turner", "team": "PHI"},
    {"name": "Francisco Lindor", "team": "NYM"},
    {"name": "Xander Bogaerts", "team": "SDP"},
    {"name": "Luis Robert Jr.", "team": "CHW"},
    {"name": "Marcus Semien", "team": "TEX"},
    {"name": "Adley Rutschman", "team": "BAL"},
    {"name": "Austin Riley", "team": "ATL"},
    {"name": "Wander Franco", "team": "TBR"},
    {"name": "Michael Harris II", "team": "ATL"},
    {"name": "Bobby Witt Jr.", "team": "KC"},
    {"name": "Dansby Swanson", "team": "CHC"},
    {"name": "Randy Arozarena", "team": "TBR"},
    {"name": "Pete Alonso", "team": "NYM"},
    {"name": "Bryce Harper", "team": "PHI"},
    {"name": "José Altuve", "team": "HOU"},
    {"name": "Anthony Rizzo", "team": "NYY"},
    {"name": "Jeremy Peña", "team": "HOU"},
    {"name": "Alex Bregman", "team": "HOU"},
    {"name": "Salvador Perez", "team": "KC"},
    {"name": "Will Smith", "team": "LAD"},
    {"name": "Cody Bellinger", "team": "CHC"},
    {"name": "Christian Yelich", "team": "MIL"},
    {"name": "Nolan Arenado", "team": "STL"},
    {"name": "Brandon Lowe", "team": "TBR"},
    {"name": "Ozzie Albies", "team": "ATL"},
    {"name": "Jordan Walker", "team": "STL"},
    {"name": "Teoscar Hernandez", "team": "SEA"},
    {"name": "Amed Rosario", "team": "LAD"},
    {"name": "Josh Jung", "team": "TEX"},
    {"name": "Bryan Reynolds", "team": "PIT"},
    {"name": "Ketel Marte", "team": "ARI"},
    {"name": "Ha-Seong Kim", "team": "SDP"},
    {"name": "Jake Cronenworth", "team": "SDP"},
    {"name": "Gunnar Henderson", "team": "BAL"},
    {"name": "Eloy Jiménez", "team": "CHW"},
    {"name": "Triston Casas", "team": "BOS"},
    {"name": "Joey Meneses", "team": "WSN"},
    {"name": "Alejandro Kirk", "team": "TOR"},
    {"name": "Steven Kwan", "team": "CLE"},
    {"name": "Ty France", "team": "SEA"},
    {"name": "Starling Marte", "team": "NYM"},
    {"name": "Miguel Vargas", "team": "LAD"},
    {"name": "Mike Trout", "team": "LAA"},
    {"name": "Lourdes Gurriel Jr.", "team": "ARI"},
    {"name": "Jonathan India", "team": "CIN"},
    {"name": "Brandon Nimmo", "team": "NYM"},
    {"name": "Daulton Varsho", "team": "TOR"},
    {"name": "Josh Bell", "team": "MIA"},
    {"name": "Christian Walker", "team": "ARI"},
    {"name": "Seiya Suzuki", "team": "CHC"},
    {"name": "Ke'Bryan Hayes", "team": "PIT"},
    {"name": "Spencer Torkelson", "team": "DET"},
    {"name": "J.D. Martinez", "team": "LAD"},
    {"name": "Jorge Polanco", "team": "MIN"},
    {"name": "Anthony Volpe", "team": "NYY"},
    {"name": "Tommy Edman", "team": "STL"},
    {"name": "Hunter Renfroe", "team": "LAA"},
    {"name": "Eugenio Suárez", "team": "SEA"},
    {"name": "Luis Arraez", "team": "MIA"},
    {"name": "Gleyber Torres", "team": "NYY"},
    {"name": "Javier Báez", "team": "DET"},
    {"name": "Andrew Benintendi", "team": "CHW"},
    {"name": "Yandy Díaz", "team": "TBR"},
    {"name": "Nick Castellanos", "team": "PHI"},
    {"name": "Alex Verdugo", "team": "BOS"},
    {"name": "Brandon Drury", "team": "LAA"},
    {"name": "Rowdy Tellez", "team": "MIL"},
    {"name": "Nico Hoerner", "team": "CHC"},
    {"name": "Alec Bohm", "team": "PHI"},
    {"name": "Andrew Vaughn", "team": "CHW"},
    {"name": "Luis Rengifo", "team": "LAA"},
    {"name": "Jeimer Candelario", "team": "CHC"},
    {"name": "Max Muncy", "team": "LAD"},
    {"name": "Joc Pederson", "team": "SF"},
    {"name": "Brent Rooker", "team": "OAK"},
    {"name": "Ryan Mountcastle", "team": "BAL"},
    {"name": "Kris Bryant", "team": "COL"},
    {"name": "Charlie Blackmon", "team": "COL"},
    {"name": "Isaac Paredes", "team": "TBR"},
    {"name": "Willson Contreras", "team": "STL"},
    {"name": "Ezequiel Tovar", "team": "COL"},
    {"name": "Christopher Morel", "team": "CHC"},
    {"name": "Luke Voit", "team": "MIL"},
    {"name": "Trevor Story", "team": "BOS"},
    {"name": "Orlando Arcia", "team": "ATL"},
    {"name": "Brett Baty", "team": "NYM"},
    {"name": "Matt Chapman", "team": "TOR"},
    {"name": "David Peralta", "team": "LAD"},
    {"name": "Oscar Gonzalez", "team": "CLE"},
    {"name": "Brice Turang", "team": "MIL"},
    {"name": "Esteury Ruiz", "team": "OAK"},
    {"name": "Leody Taveras", "team": "TEX"},
    {"name": "Chas McCormick", "team": "HOU"},
    {"name": "Josh Naylor", "team": "CLE"},
    {"name": "Riley Greene", "team": "DET"},
    {"name": "George Springer", "team": "TOR"},
    {"name": "Patrick Wisdom", "team": "CHC"},
    {"name": "CJ Abrams", "team": "WSN"},
    {"name": "Vinnie Pasquantino", "team": "KC"},
    {"name": "Miguel Andújar", "team": "PIT"},
    {"name": "Jake McCarthy", "team": "ARI"},
    {"name": "Nick Senzel", "team": "CIN"},
    {"name": "Trent Grisham", "team": "SDP"},
    {"name": "Tyler O'Neill", "team": "STL"},
    {"name": "Yonathan Daza", "team": "COL"},
    {"name": "Myles Straw", "team": "CLE"},
    {"name": "Josh Rojas", "team": "SEA"},
    {"name": "Tommy Pham", "team": "ARI"},
    {"name": "Nolan Jones", "team": "COL"},
    {"name": "Jesus Aguilar", "team": "OAK"},
    {"name": "Avisail Garcia", "team": "MIA"},
    {"name": "Evan Longoria", "team": "ARI"},
    {"name": "Lane Thomas", "team": "WSN"},
    {"name": "José Siri", "team": "TBR"},
    {"name": "Wilmer Flores", "team": "SF"},
    {"name": "Matt Carpenter", "team": "SDP"},
    {"name": "Shea Langeliers", "team": "OAK"},
    {"name": "Maikel Garcia", "team": "KC"},
    {"name": "Edward Olivares", "team": "KC"},
    {"name": "Dylan Carlson", "team": "STL"},
    {"name": "Michael Conforto", "team": "SF"},
    {"name": "Yuli Gurriel", "team": "MIA"},
    {"name": "Harold Ramirez", "team": "TBR"},
    {"name": "Corey Dickerson", "team": "WSN"},
    {"name": "Jarren Duran", "team": "BOS"},
    {"name": "Dominic Smith", "team": "WSN"},
    {"name": "Jason Heyward", "team": "LAD"},
    {"name": "Rodolfo Castro", "team": "PIT"}
]


    
    # Load existing player data
    try:
        with open('statl/src/players.json', 'r') as f:
            all_player_data = json.load(f)
    except FileNotFoundError:
        print('FileNotFoundError')
        input('Press Enter to continue...')
        all_player_data = {}

    for player in mlb_players:
        if player['name'] in all_player_data:
            print(f"Player data for {player['name']} already exists in players.json. Skipping...")
            continue
        
        player_url = format_player_url(player['name'])
        try:
            player_data = scrape_player(player_url, player['name'], player['team'])
            if player_data:
                # Update the all_player_data dictionary with the new player data
                all_player_data.update(player_data)
                print(f"Player data for {player['name']} has been scraped and added to players.json")
            else:
                print(f"No player data found for {player['name']}")
        except Exception as error:
            print(f"Skipping player {player['name']}, {error}")
            continue

        # Add a 2-second delay between requests
        time.sleep(2)

    # Save the updated data back to players.json
    with open('statl/src/players.json', 'w') as f:
        json.dump(all_player_data, f, indent=2)

    print("All player data has been saved to players.json")