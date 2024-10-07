import requests
from bs4 import BeautifulSoup
import json
import time

def format_player_url(player_name):
    # Convert player name to lowercase and split into parts
    name_parts = player_name.split()
    # Take the first 5 letters of the last name, followed by the first 2 letters of the first name
    url_name = f"{name_parts[1][:4]}{name_parts[0][:2]}00"
    return f"https://www.pro-football-reference.com/players/{url_name[0]}/{url_name}.htm"

def scrape_player(player_url, player, team, position):
    response = requests.get(player_url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Find the stats table with id "stats"
    if position == 'QB':
        stats_table = soup.find('table', {'id': 'passing'})
    elif position == 'RB' or position == "WR":
        stats_table = soup.find('table', {'id': 'receiving_and_rushing'})
    else:
        stats_table = soup.find('table', {'id': 'defense'})
    if not stats_table:
        print(f"No player data found for {player}, returning None")
        return None

    # Initialize player data dictionary based on position
    player_data = {player: {}}
    if position == 'QB':
        player_data[player] = {
            'Season': [], 'Tm': [], 'Lg': [], 'G': [], 'Yds': [], 'TD': [], 'Int': [], 'Rate': [], 'Cmp%': [], 'Pos': ['QB']
        }
    elif position == 'RB':
        player_data[player] = {
            'Season': [], 'Tm': [], 'Lg': [], 'G': [], 'RushYds': [], 'RushTD': [], 'RecYds': [], 'RecTD': [], 'Pos': ['RB']
        }
    elif position == 'WR' or position == 'TE':
        player_data[player] = {
            'Season': [], 'Tm': [], 'Lg': [], 'G': [], 'Tgt': [], 'Rec': [], 'Yds': [], 'Y/R': [], 'TD': [], 'Pos': ['WR']
        }
    elif position == 'D':
        player_data[player] = {
            'Season': [], 'Tm': [], 'Lg': [], 'G': [], 'Int': [], 'PD': [], 'FF': [], 'Comb': [], 'TFL': [], 'Pos': ['D']
        }
    else:
        print(f"Unknown position {position} for {player}, returning None")
        return None

    # Extract rows
    rows = stats_table.find('tbody').find_all('tr')
    for row in rows:
        # Extract common stats
        player_data[player]['Season'].append(row.find('th').text if row.find('th') else '0')
        player_data[player]['Tm'].append(row.find('td', {'data-stat': 'team_name_abbr'}).text if row.find('td', {'data-stat': 'team_name_abbr'}) else '0')
        player_data[player]['G'].append(row.find('td', {'data-stat': 'games'}).text if row.find('td', {'data-stat': 'games'}) else '0')
        player_data[player]['Lg'].append(row.find('td', {'data-stat': 'comp_name_abbr'}).text if row.find('td', {'data-stat': 'comp_name_abbr'}) else '0')

        # Extract position-specific stats
        if position == 'QB':
            player_data[player]['Yds'].append(row.find('td', {'data-stat': 'pass_yds'}).text if row.find('td', {'data-stat': 'pass_yds'}) else '0')
            player_data[player]['TD'].append(row.find('td', {'data-stat': 'pass_td'}).text if row.find('td', {'data-stat': 'pass_td'}) else '0')
            player_data[player]['Int'].append(row.find('td', {'data-stat': 'pass_int'}).text if row.find('td', {'data-stat': 'pass_int'}) else '0')
            player_data[player]['Rate'].append(row.find('td', {'data-stat': 'pass_rating'}).text if row.find('td', {'data-stat': 'pass_rating'}) else '0')
            player_data[player]['Cmp%'].append(row.find('td', {'data-stat': 'pass_cmp_pct'}).text if row.find('td', {'data-stat': 'pass_cmp_pct'}) else '0')
        elif position == 'RB':
            player_data[player]['RushYds'].append(row.find('td', {'data-stat': 'rush_yds'}).text if row.find('td', {'data-stat': 'rush_yds'}) else '0')
            player_data[player]['RushTD'].append(row.find('td', {'data-stat': 'rush_td'}).text if row.find('td', {'data-stat': 'rush_td'}) else '0')
            player_data[player]['RecYds'].append(row.find('td', {'data-stat': 'rec_yds'}).text if row.find('td', {'data-stat': 'rec_yds'}) else '0')
            player_data[player]['RecTD'].append(row.find('td', {'data-stat': 'rec_td'}).text if row.find('td', {'data-stat': 'rec_td'}) else '0')
        elif position == 'WR':
            player_data[player]['Tgt'].append(row.find('td', {'data-stat': 'targets'}).text if row.find('td', {'data-stat': 'targets'}) else '0')
            player_data[player]['Rec'].append(row.find('td', {'data-stat': 'rec'}).text if row.find('td', {'data-stat': 'rec'}) else '0')
            player_data[player]['Yds'].append(row.find('td', {'data-stat': 'rec_yds'}).text if row.find('td', {'data-stat': 'rec_yds'}) else '0')
            player_data[player]['Y/R'].append(row.find('td', {'data-stat': 'rec_yds_per_rec'}).text if row.find('td', {'data-stat': 'rec_yds_per_rec'}) else '0')
            player_data[player]['TD'].append(row.find('td', {'data-stat': 'rec_td'}).text if row.find('td', {'data-stat': 'rec_td'}) else '0')
        elif position == 'D':
            player_data[player]['Int'].append(row.find('td', {'data-stat': 'def_int'}).text if row.find('td', {'data-stat': 'def_int'}) else '0')
            player_data[player]['PD'].append(row.find('td', {'data-stat': 'pass_defended'}).text if row.find('td', {'data-stat': 'pass_defended'}) else '0')
            player_data[player]['FF'].append(row.find('td', {'data-stat': 'fumbles_forced'}).text if row.find('td', {'data-stat': 'fumbles_forced'}) else '0')
            player_data[player]['Comb'].append(row.find('td', {'data-stat': 'tackles_combined'}).text if row.find('td', {'data-stat': 'tackles_combined'}) else '0')
            player_data[player]['TFL'].append(row.find('td', {'data-stat': 'tackles_loss'}).text if row.find('td', {'data-stat': 'tackles_loss'}) else '0')

    # Replace empty strings with None
    for stat in player_data[player]:
        player_data[player][stat] = [None if v == '' else v for v in player_data[player][stat]]

    # Check if the last element in the team column matches the team being passed
    if player_data[player]['Tm'][-1] != team:
        print(f"Last team for {player} does not match the team being passed. Returning None")
        print(f"Last team on ref: {player_data[player]['Tm'][-1]}, Team being passed: {team}")
        return None
    
    return player_data


if __name__ == "__main__":
    nfl_players = [
    # ["Patrick Mahomes", "KAN", "QB"],
    # ["Josh Allen", "BUF", "QB"],
    # ["Justin Jefferson", "MIN", "WR"],
    # ["Tyreek Hill", "MIA", "WR"],
    # ["Nick Bosa", "SFO", "D"],
    # ["Micah Parsons", "DAL", "D"],
    # ["Ja'Marr Chase", "CIN", "WR"],
    # ["Jalen Hurts", "PHI", "QB"],
    # ["Joe Burrow", "CIN", "QB"],
    # ["T.J. Watt", "PIT", "D"],
    # ["Davante Adams", "LV", "WR"],
    # ["Christian McCaffrey", "SFO", "RB"],
    # ["Travis Kelce", "KAN", "TE"],
    # ["Stefon Diggs", "BUF", "WR"],
    # ["Cooper Kupp", "LAR", "WR"],
    # ["A.J. Brown", "PHI", "WR"],
    # ["Derrick Henry", "TEN", "RB"],
    # ["Aaron Donald", "LAR", "D"],
    # ["Sauce Gardner", "NYJ", "D"],
    # ["Fred Warner", "SFO", "D"],
    # ["Justin Herbert", "LAC", "QB"],
    # ["Tua Tagovailoa", "MIA", "QB"],
    # ["Saquon Barkley", "NYG", "RB"],
    # ["Amon-Ra St. Brown", "DET", "WR"],
    # ["Chris Jones", "KAN", "D"],
    # ["Maxx Crosby", "LV", "D"],
    # ["Myles Garrett", "CLE", "D"],
    # ["CeeDee Lamb", "DAL", "WR"],
    # ["Deebo Samuel", "SFO", "WR"],
    # ["Trevor Lawrence", "JAX", "QB"],
    # ["De'Vondre Campbell", "GNB", "D"],
    # ["Trent McDuffie", "KAN", "D"],
    # ["Bobby Wagner", "SEA", "D"],
    # ["Joey Bosa", "LAC", "D"],
    # ["Garrett Wilson", "NYJ", "WR"],
    # ["Dalvin Cook", "NYJ", "RB"],
    # ["Nick Chubb", "CLE", "RB"],
    # ["Terry McLaurin", "WAS", "WR"],
    # ["Jaylen Waddle", "MIA", "WR"],
    # ["Josh Jacobs", "LV", "RB"],
    # ["Matt Milano", "BUF", "D"],
    # ["Quinnen Williams", "NYJ", "D"],
    # ["Lamar Jackson", "BAL", "QB"],
    # ["Jaire Alexander", "GNB", "D"],
    # ["DeAndre Hopkins", "TEN", "WR"],
    # ["Tee Higgins", "CIN", "WR"],
    # ["Amari Cooper", "CLE", "WR"],
    # ["Brian Burns", "CAR", "D"],
    # ["Derwin James", "LAC", "D"],
    # ["Aidan Hutchinson", "DET", "D"],
    # ["Denzel Ward", "CLE", "D"],
    # ["Hassan Reddick", "PHI", "D"],
    # ["Kirk Cousins", "MIN", "QB"],
    # ["Marshon Lattimore", "NOR", "D"],
    # ["Christian Watson", "GNB", "WR"],
    # ["Brandon Aiyuk", "SFO", "WR"],
    # ["DK Metcalf", "SEA", "WR"],
    # ["DeMarcus Lawrence", "DAL", "D"],
    # ["Cameron Jordan", "NOR", "D"],
    # ["Roquan Smith", "BAL", "D"],
    # ["Mark Andrews", "BAL", "TE"],
    # ["Zay Flowers", "BAL", "WR"],
    # ["Jordan Love", "GNB", "QB"],
    # ["Kenneth Walker III", "SEA", "RB"],
    # ["Travis Etienne", "JAX", "RB"],
    # ["Javonte Williams", "DEN", "RB"],
    # ["Rachaad White", "TB", "RB"],
    # ["Trevon Diggs", "DAL", "D"],
    # ["Keenan Allen", "LAC", "WR"],
    # ["George Kittle", "SFO", "TE"],
    # ["Devin White", "TB", "D"],
    # ["Quay Walker", "GNB", "D"],
    # ["Patrick Surtain II", "DEN", "D"],
    # ["Darius Slay", "PHI", "D"],
    # ["James Bradberry", "PHI", "D"],
    # ["Jonathan Taylor", "IND", "RB"],
    # ["Jalen Ramsey", "MIA", "D"],
    # ["Tyson Campbell", "JAX", "D"],
    # ["Calvin Ridley", "JAX", "WR"],
    # ["DJ Moore", "CHI", "WR"],
    # ["Jared Goff", "DET", "QB"],
    # ["Bijan Robinson", "ATL", "RB"],
    # ["Tony Pollard", "DAL", "RB"],
    # ["T.J. Hockenson", "MIN", "TE"],
    # ["Hunter Renfrow", "LV", "WR"],
    # ["Breece Hall", "NYJ", "RB"],
    # ["Devin Lloyd", "JAX", "D"],
    # ["Shaquille Leonard", "IND", "D"],
    # ["Leonard Williams", "NYG", "D"],
    # ["Kayvon Thibodeaux", "NYG", "D"],
    # ["Demario Davis", "NOR", "D"],
    # ["Khalil Mack", "LAC", "D"],
    # ["Jordan Poyer", "MIA", "D"],
    # ["Jalen Carter", "PHI", "D"],
    # ["Isaiah Simmons", "NYG", "D"],
    # ["Kenny Pickett", "PIT", "QB"],
    # ["Daniel Jones", "NYG", "QB"],
    # ["James Conner", "ARI", "RB"],
    # ["Drake London", "ATL", "WR"],
    # ["Puka Nacua", "LAR", "WR"],
    # ["Michael Pittman Jr.", "IND", "WR"],
    # ["Quinn Meinerz", "DEN", "D"],
    # ["Adam Thielen", "CAR", "WR"],
    # ["Josh Downs", "IND", "WR"],
    # ["Treylon Burks", "TEN", "WR"],
    # ["DJ Chark", "CAR", "WR"],
    # ["Rashod Bateman", "BAL", "WR"],
    # ["Kenny Moore II", "IND", "D"],
    # ["Fred Warner", "SFO", "D"],
    # ["L'Jarius Sneed", "KAN", "D"],
    # ["Jalen Thompson", "ARI", "D"],
    # ["Jeremy Chinn", "WAS", "D"],
    # ["Jahmyr Gibbs", "DET", "RB"],
    # ["Jonathan Mingo", "CAR", "WR"],
    # ["Alexander Mattison", "LVR", "RB"],
    # ["Elijah Moore", "CLE", "WR"],
    # ["James Cook", "BUF", "RB"],
    # ["Chris Olave", "NOR", "WR"],
    # ["Miles Sanders", "CAR", "RB"],
    # ["Gabe Davis", "JAX", "WR"],
    # ["Rhamondre Stevenson", "NE", "RB"],
    # ["Christian Kirk", "JAX", "WR"],
    # ["Isiah Pacheco", "KC", "RB"],
    # ["Tyler Boyd", "TEN", "WR"],
    # ["Zach Charbonnet", "SEA", "RB"],
    # ["Jerry Jeudy", "DEN", "WR"],
    # ["Khalil Herbert", "CHI", "RB"],
    # ["JuJu Smith-Schuster", "KAN", "WR"],
    # ["AJ Dillon", "GB", "RB"],
    # ["Jordan Addison", "MIN", "WR"],
    # ["Jamaal Williams", "NO", "RB"],
    # ["Michael Gallup", "DAL", "WR"],
    # ["Antonio Gibson", "WSH", "RB"],
    # ["Rashid Shaheed", "NOR", "WR"],
    # ["Deon Jackson", "IND", "RB"],
    # ["Curtis Samuel", "BUF", "WR"],
    # ["Jerome Ford", "CLE", "RB"],
    # ["Darnell Mooney", "CHI", "WR"],
    # ["Samaje Perine", "DEN", "RB"],
    # ["Skyy Moore", "KC", "WR"],
    # ["Tyjae Spears", "TEN", "RB"],
    # ["Nico Collins", "HOU", "WR"]
    ["Brian Robinson Jr.", "WSH", "RB"],
    ["Marquise Brown", "BAL", "WR"],
    ["Kenneth Gainwell", "PHI", "RB"],
    ["Romeo Doubs", "GNB", "WR"],
    ["Tyler Allgeier", "ATL", "RB"],
    ["Odell Beckham Jr.", "BAL", "WR"],
    ["Devin Singletary", "HOU", "RB"],
    ["Allen Lazard", "NYJ", "WR"],
    ["Damien Harris", "BUF", "RB"],
    ["Robert Woods", "HOU", "WR"],
    ["Josh Palmer", "LAC", "WR"],
    ["Zonovan Knight", "DET", "RB"],
    ["Marvin Mims", "DEN", "WR"],
    ["Chuba Hubbard", "CAR", "RB"],
    ["Alec Pierce", "IND", "WR"],
    ["D'Onta Foreman", "CHI", "RB"],
    ["Van Jefferson", "LAR", "WR"],
    ["Cordarrelle Patterson", "ATL", "RB"],
    ["Donovan Peoples-Jones", "CLE", "WR"],
    ["Ezekiel Elliott", "DAL", "RB"],
    ["Tank Dell", "HOU", "WR"],
    ["Roschon Johnson", "CHI", "RB"],
    ["K.J. Osborn", "MIN", "WR"],
    ["Clyde Edwards-Helaire", "KAN", "RB"],
    ["Rondale Moore", "ARI", "WR"],
    ["Ty Chandler", "MIN", "RB"],
    ["Isaiah Hodgins", "NYG", "WR"],
    ["Dameon Pierce", "HOU", "RB"],
    ["Jaylen Warren", "PIT", "RB"],
    ["Rashod Bateman", "BAL", "WR"],
    ["Elijah Mitchell", "SFO", "RB"],
    ["Michael Thomas", "NOR", "WR"],
    ["Chase Brown", "CIN", "RB"],
    ["Kadarius Toney", "KAN", "WR"],
    ["Pierre Strong Jr.", "CLE", "RB"],
    ["Jalin Hyatt", "NYG", "WR"],
    ["Marvin Jones Jr.", "DET", "WR"],
    ["Rico Dowdle", "DAL", "RB"],
    ["Isaiah McKenzie", "IND", "WR"],
    ["Justice Hill", "BAL", "RB"],
    ["Jaxon Smith-Njigba", "SEA", "WR"],
    ["D'Ernest Johnson", "JAX", "RB"],
    ["Tre'Quan Smith", "NOR", "WR"],
    ["Kendre Miller", "NOR", "RB"],
    ["Parris Campbell", "NYG", "WR"],
    ]

    # Load existing player data
    try:
        with open('statl/src/players.json', 'r') as f:
            all_player_data = json.load(f)

    except FileNotFoundError:
        print('FileNotFoundError')
        all_player_data = {}

    for player in nfl_players:
        if player[0] in all_player_data:
            print(f"Player data for {player[0]} already exists in players.json. Skipping...")
            continue
        
        player_url = format_player_url(player[0])

        try:
            player_data = scrape_player(player_url, player[0], player[1], player[2])
            if player_data:
                # Update the all_player_data dictionary with the new player data
                all_player_data.update(player_data)
                print(f"Player data for {player[0]} has been scraped and will be added to players.json")
            else:
                print(f"No player data found for {player[0]}")
        except Exception as e:
            print(f"Error occurred while scraping data for {player[0]}: {str(e)}")
            print(f"Player {player[0]} will not be added to players.json")
        
        # Add a 2-second delay between requests
        time.sleep(2)

    # Save the updated data back to players.json
    with open('statl/src/players.json', 'w') as f:
        json.dump(all_player_data, f, indent=2)

    print("All player data has been saved to players.json")