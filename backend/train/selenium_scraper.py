# Selenium based image scraper from google

import undetected_chromedriver as uc
import time
import os
import base64
import urllib.request
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from random import uniform
import requests
from parse_list import parse_pokemon_list
import csv
import itertools

search_queries= [
    "single official artwork",
    "anime screenshot",
    "3D model render",
    "official card",
    "plush toy"
]
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
]
ua_iterator = itertools.cycle(USER_AGENTS)

not_searched_queries = []

def get_valid_images(driver, elements):
    valid_count = 0
    for img in elements:
        try:
            width = int(driver.execute_script("return arguments[0].naturalWidth;", img))
            height = int(driver.execute_script("return arguments[0].naturalHeight;", img))
            if width >= 100 and height >= 100:
                valid_count += 1
        except Exception as e:
            continue
    return valid_count


def scrape_pokemon_images(driver, pokemon_query, pokemon_name, target_num=100):
    os.makedirs(f"train_images/{pokemon_name}", exist_ok=True)
    os.makedirs("all_pokemon_images", exist_ok=True)

    ua_string = next(ua_iterator)
    
    ua_string = next(ua_iterator)
    driver.execute_cdp_cmd("Network.setUserAgentOverride", {"userAgent": ua_string})
    
    X_PATH = "//div[@role='main']//img[@data-deferred or @src]"

    try:
        driver.get("https://images.google.com")
        search_box = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "q")))
        for char in f"{pokemon_query} pokemon":
            search_box.send_keys(char)
            time.sleep(uniform(0.1, 0.3))
        search_box.send_keys(Keys.ENTER)

        try:
            WebDriverWait(driver,30).until(EC.presence_of_element_located((By.XPATH, X_PATH)))
            print(f"Search results loaded for {pokemon_query}")
            last_height = driver.execute_script("return document.body.scrollHeight")

            while True:
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(uniform(2.5,4.0))
                try:
                    show_more = driver.find_element(By.XPATH, "//input[@type='button' and @value='Show more results'] | //button[contains(., 'Show more results')] | //input[@type='button' and @value='Next'] | //button[contains(., 'Next')]")
                    if show_more.is_displayed():
                        show_more.click()
                        time.sleep(uniform(1.5, 2.0))
                except NoSuchElementException:
                    pass
                current_images = driver.find_elements(By.XPATH, X_PATH)
                valid_images = get_valid_images(driver, current_images)
                if valid_images >= target_num:
                    print(f"Found {valid_images} valid images, target is {target_num}, stopping scroll...."
                    )
                    break
                new_height = driver.execute_script("return document.body.scrollHeight")
                if new_height == last_height:
                    print("Reached the end of the page, no more images")
                    print(f"Found {valid_images} valid images, target is {target_num}, stopping scroll....")
                    break
                last_height = new_height
            
            time.sleep(uniform(4.0, 5.0)) # Wait for the images to fully load
            
            images = driver.find_elements(By.XPATH, X_PATH)
            count = 0
            for image in images:
                if count >= target_num:
                    break
                width = int(driver.execute_script("return arguments[0].naturalWidth;", image))
                height = int(driver.execute_script("return arguments[0].naturalHeight;", image))
                if width<100 or height<100:
                    continue
                try:
                    src= image.get_attribute("src")
                    
                    
                    if src:
                        filename_1 = f"train_images/{pokemon_name}/{pokemon_query}_{str(count +1).zfill(6)}.jpg"
                        filename_2 = f"all_pokemon_images/{pokemon_query}_{str(count+ 1).zfill(6)}.jpg"
                        if src.startswith("data:image"):
                            header, encoded = src.split(",", 1)
                            data = base64.b64decode(encoded)
                            with open(filename_2, "wb") as f:#save all pokemon images in a separate folder
                                f.write(data)
                            with open(filename_1, "wb") as f:
                                f.write(data)
                                print(f"image stored as {filename_1}")
                                count += 1
                        elif src.startswith("http"):
                            try:
                                headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
                                response = requests.get(src, headers=headers, timeout=5, stream=True)
                                if response.status_code == 200:
                                    with open(filename_2, "wb") as f1, open(filename_1, "wb") as f2:
                                        for chunk in response.iter_content(1024):
                                            f1.write(chunk)
                                            f2.write(chunk)
                                    print(f"image downloaded as {filename_1}")
                                    count += 1
                                else:
                                    print(f"Failed to download image, status code: {response.status_code}")
                            except Exception as e:
                                print(f"Failed to download image: {e}")
                                continue
                except Exception as e:
                    continue

        except TimeoutException:
            print(f"Timed out waiting for search results to load for {pokemon_query}")
            not_searched_queries.append({"pokemon_name": pokemon_name, "query": pokemon_query})
            os.makedirs("timeouts", exist_ok=True)
            driver.save_screenshot(f"timeouts/{pokemon_query.replace(' ', '_')}_timeout.png")
            print(f"Used ua string ({ua_string}) for {pokemon_query}")
            return

    except Exception as e:
        print(f"Error processing query {pokemon_query}: {e}")
def load_pokemon_from_csv(filepath):
    if not os.path.exists(filepath):
        with open(filepath, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['pokemon_name'])
        return []
    
    with open(filepath, 'r', newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader, None) # Skip header row
        return [row[0].strip() for row in reader if row and row[0].strip()]
    
def remove_pokemon_from_csv(filepath, pokemon_to_remove):
    """Rewrites the CSV file, excluding the completed Pokémon."""
    all_pokemon = load_pokemon_from_csv(filepath)
    updated_list = [p for p in all_pokemon if p.lower() != pokemon_to_remove.lower()]
    
    with open(filepath, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['pokemon_name'])
        for pokemon in updated_list:
            writer.writerow([pokemon])

if __name__ == "__main__":
    CSV_FILEPATH = "pokemon_names.csv"
    
    pokemon_list = load_pokemon_from_csv(CSV_FILEPATH)
    print(f"Total remaining pokemon to scrape from CSV: {len(pokemon_list)}")
    
    # if not pokemon_list:
    #     print(f"No Pokémon found in {CSV_FILEPATH}. Please add them under a 'pokemon_name' header.")
    #     exit()

    options = uc.ChromeOptions()
    options.add_argument("--window-size=1920,1080")
    # options.add_argument("--headless-new")
    
    print("Launching global browser instance...")
    driver = uc.Chrome(options=options, version_main=149)
    
    try:
        # for pokemon in list(pokemon_list):
        #     print(f"\n--- Starting {pokemon} ---")
            
        #     for query in search_queries:
        #         scrape_pokemon_images(driver, f"{pokemon} {query}", pokemon, target_num=100)
            
        #     print(f"Finished downloading all categories for {pokemon}. Removing from CSV...")
        #     remove_pokemon_from_csv(CSV_FILEPATH, pokemon)
        scrape_pokemon_images(driver, "Beedrill single official artwork", "Beedrill", target_num=100)
            
    finally:
        print("Closing browser instance...")
        driver.quit()

    if len(not_searched_queries) > 0:
        print("The following queries could not be searched:")
        for query in not_searched_queries:
            print(f" - {query['query']} (for {query['pokemon_name']})")
        headers = ['pokemon_name', 'query']
        with open('not_searched_queries.csv', 'w', newline='', encoding='utf-8') as file:
            writer = csv.DictWriter(file, fieldnames=headers)
            writer.writeheader()
            writer.writerows(not_searched_queries)