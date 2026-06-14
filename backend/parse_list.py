# Paste a list of pokemon from https://pokemondb.net/pokedex/national and parse it into a list of pokemon names to be used in the image crawler.

# Sample list:  Bulbasaur \n#0001 \nBulbasaur \nGrass · Poison \nIvysaur \n#0002 \nIvysaur \nGrass · Poison \nVenusaur \n#0003 \nVenusaur \nGrass · Poison \nCharmander \n#0004 \nCharmander \nFire \nCharmeleon \n#0005 \nCharmeleon \nFire \nCharizard \n#0006 \nCharizard \nFire · Flying \nSquirtle \n#0007 \nSquirtle \nWater \nWartortle \n#0008 \nWartortle \nWater \nBlastoise \n#0009 \nBlastoise \nWater \nCaterpie \n#0010 \nCaterpie \nBug \nMetapod \n#0011 \nMetapod \nBug \nButterfree \n#0012 \nButterfree \nBug · Flying \nWeedle \n#0013 \nWeedle \nBug · Poison \nKakuna \n#0014 \nKakuna \nBug · Poison \nBeedrill \n#0015 \nBeedrill \nBug · Poison \nPidgey \n#0016 \nPidgey \nNormal · Flying \nPidgeotto \n#0017 \nPidgeotto \nNormal · Flying \nPidgeot \n#0018 \nPidgeot \nNormal · Flying \nRattata \n#0019 \nRattata \nNormal \nRaticate \n#0020 \nRaticate \nNormal \nSpearow \n#0021 \nSpearow \nNormal · Flying \nFearow \n#0022 \nFearow \nNormal · Flying \nEkans \n#0023 \nEkans \nPoison \nArbok \n#0024 \nArbok \nPoison

def parse_pokemon_list(pokemon_str):
    pokemon_data_list = []
    pokemon_list = []
    lines = pokemon_str.split("\n")
    for i in range(0,len(lines), 4):
        pokemon_name = lines[i].strip()
        pokemon_id = lines[i+1].strip()
        pokemon_type = lines[i+3].strip()
        pokemon_data = {
            "name": pokemon_name,
            "id": pokemon_id,
            "type": pokemon_type
        }
        pokemon_data_list.append(pokemon_data)  
        pokemon_list.append(pokemon_name)
    return pokemon_list,  pokemon_data_list

if __name__ == "__main__":
    pokemon_str = """Bulbasaur \n#0001 \nBulbasaur \nGrass · Poison \nIvysaur \n#0002 \nIvysaur \nGrass · Poison \nVenusaur \n#0003 \nVenusaur \nGrass · Poison \nCharmander \n#0004 \nCharmander \nFire \nCharmeleon \n#0005 \nCharmeleon \nFire \nCharizard \n#0006 \nCharizard \nFire · Flying \nSquirtle \n#0007 \nSquirtle \nWater \nWartortle \n#0008 \nWartortle \nWater \nBlastoise \n#0009 \nBlastoise \nWater \nCaterpie \n#0010 \nCaterpie \nBug \nMetapod \n#0011 \nMetapod \nBug \nButterfree \n#0012 \nButterfree \nBug · Flying \nWeedle \n#0013 \nWeedle \nBug · Poison \nKakuna \n#0014 \nKakuna \nBug · Poison \nBeedrill \n#0015 \nBeedrill \nBug · Poison \nPidgey \n#0016 \nPidgey \nNormal · Flying \nPidgeotto \n#0017 \nPidgeotto \nNormal · Flying \nPidgeot \n#0018 \nPidgeot \nNormal · Flying \nRattata \n#0019 \nRattata \nNormal \nRaticate \n#0020 \nRaticate \nNormal \nSpearow \n#0021 \nSpearow \nNormal · Flying \nFearow \n#0022 \nFearow \nNormal · Flying \nEkans \n#0023 \nEkans \nPoison \nArbok \n#0024 \nArbok \nPoison"""
    pokemon_list, pokemon_data_list = parse_pokemon_list(pokemon_str)
    print(pokemon_list)
    print(pokemon_data_list)