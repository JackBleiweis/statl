import requests
from bs4 import BeautifulSoup
import json
import time

def format_player_url(player_name):
    # Convert player name to lowercase and split into parts
    name_parts = player_name.lower().split()
    # Take the first 5 letters of the last name, followed by the first 2 letters of the first name
    url_name = f"{name_parts[-1][:5]}{name_parts[0][:2]}01"
    return f"https://www.hockey-reference.com/players/{url_name[0]}/{url_name}.html"

def scrape_player(player_url, player, team):
    response = requests.get(player_url)
    print(response.status_code)
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
        # Try to find the '+/-' stat, if not available, use '0'
        plus_minus = row.find('td', {'data-stat': 'plus_minus'})
        player_data[player]['+/-'].append(plus_minus.text if plus_minus else '0')

    # Replace empty strings with None
    for stat in player_data[player]:
        player_data[player][stat] = [None if v == '' else v for v in player_data[player][stat]]

    # Check if the last element in the team column matches the team being passed
    if player_data[player]['Tm'][-1] != team:
        print(f"Last team for {player} does not match the team being passed. Returning None")
        print('Comparing: ', player_data[player]['Tm'][-1], ' and we had: ', team)
        return None
    
    return player_data


if __name__ == "__main__":
    nhl_players = [
#         ["Connor McDavid", "EDM"],
#   ["Auston Matthews", "TOR"],
#   ["Leon Draisaitl", "EDM"],
#   ["Nathan MacKinnon", "COL"],
#   ["David Pastrnak", "BOS"],
#   ["Mitch Marner", "TOR"],
#   ["Cale Makar", "COL"],
#   ["Sidney Crosby", "PIT"],
#   ["Alex Ovechkin", "WSH"],
#   ["Artemi Panarin", "NYR"],
#   ["Nikita Kucherov", "TBL"],
#   ["Mikko Rantanen", "COL"],
#   ["Brayden Point", "TBL"],
#   ["Kirill Kaprizov", "MIN"],
#   ["Matthew Tkachuk", "FLA"],
#   ["Patrick Kane", "NYR"],
#   ["Steven Stamkos", "TBL"],
#   ["Kyle Connor", "WPG"],
#   ["Johnny Gaudreau", "CBJ"],
#   ["Elias Pettersson", "VAN"],
#   ["Roope Hintz", "DAL"],
#   ["Aleksander Barkov", "FLA"],
#   ["Tim Stützle", "OTT"],
#   ["Gabriel Landeskog", "COL"],
#   ["Jake Guentzel", "PIT"],
#   ["Mark Scheifele", "WPG"],
#   ["Jonathan Huberdeau", "CGY"],
#   ["Miro Heiskanen", "DAL"],
#   ["Sebastian Aho", "CAR"],
#   ["William Nylander", "TOR"],
#   ["Patrice Bergeron", "BOS"],
#   ["Dylan Larkin", "DET"],
#   ["Adam Fox", "NYR"],
#   ["Brad Marchand", "BOS"],
#   ["Ryan Nugent-Hopkins", "EDM"],
#   ["Pierre-Luc Dubois", "LAK"],
#   ["Nazem Kadri", "CGY"],
#   ["Jordan Kyrou", "STL"],
#   ["Josh Morrissey", "WPG"],
#   ["Tomas Hertl", "SJS"],
#   ["Chris Kreider", "NYR"],
#   ["Andrei Svechnikov", "CAR"],
#   ["Robert Thomas", "STL"],
#   ["Trevor Zegras", "ANA"],
#   ["Mason McTavish", "ANA"],
#   ["Bo Horvat", "NYI"],
#   ["Vince Dunn", "SEA"],
#   ["Kevin Fiala", "LAK"],
#   ["Nick Suzuki", "MTL"],
#   ["Mathew Barzal", "NYI"],
#   ["Darnell Nurse", "EDM"],
#   ["Brady Tkachuk", "OTT"],
#   ["Elias Lindholm", "CGY"],
#   ["Erik Karlsson", "PIT"],
#   ["Drew Doughty", "LAK"],
#   ["Roman Josi", "NSH"],
#   ["Alex DeBrincat", "DET"],
#   ["Andrei Burakovsky", "SEA"],
#   ["Pavel Buchnevich", "STL"],
#   ["Morgan Rielly", "TOR"],
#   ["Anthony Cirelli", "TBL"],
#   ["Sam Reinhart", "FLA"],
#   ["Ryan O'Reilly", "NSH"],
#   ["Mark Stone", "VGK"],
#   ["Cole Caufield", "MTL"],
#   ["Jakob Chychrun", "OTT"],
#   ["Joel Eriksson Ek", "MIN"],
#   ["Tyler Bertuzzi", "TOR"],
#   ["Jonathan Marchessault", "VGK"],
#   ["Alexis Lafrenière", "NYR"],
#   ["Damon Severson", "CBJ"],
#   ["Matias Maccelli", "ARI"],
#   ["Brandon Hagel", "TBL"],
#   ["Connor Brown", "EDM"],
#   ["Troy Terry", "ANA"],
#   ["Evgeni Malkin", "PIT"],
#   ["Jakub Vrana", "STL"],
#   ["Lucas Raymond", "DET"],
#   ["Jack Eichel", "VGK"],
#   ["Jordan Eberle", "SEA"],
#   ["Jamie Benn", "DAL"],
#   ["Evgeny Kuznetsov", "WSH"],
#   ["Anders Lee", "NYI"],
#   ["David Perron", "DET"],
#   ["JT Miller", "VAN"],
#   ["Ryan Johansen", "COL"],
#   ["Jesper Bratt", "NJD"],
#   ["Andrew Mangiapane", "CGY"],
#   ["Reilly Smith", "PIT"],
#   ["Chandler Stephenson", "VGK"],
#   ["Nick Schmaltz", "ARI"],
#   ["Vladimir Tarasenko", "OTT"],
#   ["Brandon Saad", "STL"],
#   ["John Tavares", "TOR"],
#   ["Claude Giroux", "OTT"],
#   ["Tyler Seguin", "DAL"],
#   ["Sean Couturier", "PHI"],
#   ["Jared McCann", "SEA"],
#   ["Kirby Dach", "MTL"],
#   ["Kasperi Kapanen", "STL"],
#   ["Oliver Bjorkstrand", "SEA"],
#   ["Justin Faulk", "STL"],
#   ["Zach Hyman", "EDM"],
#   ["Brent Burns", "CAR"],
#   ["Ryan Hartman", "MIN"],
#   ["K'Andre Miller", "NYR"],
#   ["Jakob Silfverberg", "ANA"],
#   ["Cam Fowler", "ANA"],
#   ["Sam Bennett", "FLA"],
#   ["Brendan Gallagher", "MTL"],
#   ["Filip Forsberg", "NSH"],
#   ["J.T. Compher", "DET"],
#   ["Josh Anderson", "MTL"],
#   ["David Krejci", "BOS"],
#   ["Marco Rossi", "MIN"],
#   ["Barrett Hayton", "ARI"],
#   ["Dillon Dube", "CGY"],
#   ["Mikhail Sergachev", "TBL"],
#   ["Travis Konecny", "PHI"],
#   ["Torey Krug", "STL"],
#   ["Jamie Drysdale", "ANA"],
#   ["Rasmus Andersson", "CGY"],
#   ["Noah Dobson", "NYI"],
#   ["Tyson Barrie", "NSH"],
#   ["Kailer Yamamoto", "SEA"],
#   ["Viktor Arvidsson", "LAK"],
#   ["Yanni Gourde", "SEA"],
#   ["Colton Parayko", "STL"],
#   ["Dylan Strome", "WSH"],
#   ["Alex Killorn", "ANA"],
#   ["Calen Addison", "MIN"],
#   ["Barclay Goodrow", "NYR"],
#   ["Ivan Barbashev", "VGK"],
#   ["Logan Couture", "SJS"],
#   ["Jonathan Drouin", "COL"],
#   ["Mason Marchment", "DAL"],
#   ["Brayden Schenn", "STL"],
#   ["Brock Boeser", "VAN"],
#   ["Pius Suter", "VAN"],
#   ["Kevin Hayes", "STL"],
#   ["Radek Faksa", "DAL"],
#   ["Adam Henrique", "ANA"],
#   ["Tyler Motte", "TBL"],
#   ["Jason Robertson", "DAL"],
#   ["Pavel Zacha", "BOS"],
#   ["Jake Sanderson", "OTT"],
#   ["Bobby Brink", "PHI"],
#   ["Ross Colton", "COL"],
#   ["Klim Kostin", "DET"],
#   ["Martin Necas", "CAR"],
#   ["Michael Bunting", "CAR"],
#   ["Matias Ekholm", "EDM"],
#   ["Noah Hanifin", "CGY"],
#   ["Shayne Gostisbehere", "DET"],
#   ["Josh Bailey", "OTT"],
#   ["Carter Verhaeghe", "FLA"],
#   ["Seth Jarvis", "CAR"],
#   ["Adam Boqvist", "CBJ"],
#   ["Brock Nelson", "NYI"],
#   ["Alex Iafallo", "LAK"],
#   ["Dylan Holloway", "EDM"],
#   ["Kirill Marchenko", "CBJ"],
#   ["Frank Vatrano", "ANA"],
#   ["Jesperi Kotkaniemi", "CAR"],
#   ["Charlie Coyle", "BOS"],
#   ["Taylor Hall", "CHI"],
#   ["Max Domi", "TOR"],
#   ["Jaden Schwartz", "SEA"],
#   ["Connor Bedard", "CHI"],
#   ["Arber Xhekaj", "MTL"],
#   ["Matthew Boldy", "MIN"],
#   ["Ivan Provorov", "CBJ"],
#   ["Scott Laughton", "PHI"],
#   ["Jakub Zboril", "BOS"],
#   ["Kent Johnson", "CBJ"],
#   ["Brett Pesce", "CAR"],
        # ["William Karlsson", "VGK"]

    ]

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
            print(f"No player data found for {player[0]}")
        
        # Add a 2-second delay between requests
        time.sleep(2)

    # Save the updated data back to players.json
    with open('statl/src/players.json', 'w') as f:
        json.dump(all_player_data, f, indent=2)

    print("All player data has been saved to players.json")