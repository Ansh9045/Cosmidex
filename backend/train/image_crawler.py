import os
from icrawler.builtin import BingImageCrawler

output_dir = "train_images"

def get_pokemon_images(pokemon_list, num_img, output_dir):
    
    for pokemon in pokemon_list:
        pokemon_dir = os.path.join(output_dir, pokemon)
        os.makedirs(pokemon_dir, exist_ok=True)
        crawler = BingImageCrawler(storage={"root_dir": pokemon_dir})
        crawler.crawl(keyword=pokemon, max_num=num_img)

if __name__ == "__main__":
    pokemon_list = ["Bulbasaur", "Charmander", "Squirtle", "Pikachu","Jigglypuff"]
    num_img = 100
    get_pokemon_images(pokemon_list, num_img, output_dir)

