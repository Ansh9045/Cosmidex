# This is a test bot made with selenium, it has nothing to do with the pokedex, it is just so that I can learn about selenium and use it to scrape images

# My First selenium bot

# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.common.keys import Keys
# import time

# driver= webdriver.Chrome()

# try:
#     driver.get("https://google.com")

#     search = driver.find_element(By.NAME, "q")
#     search.send_keys("Pokedex")
#     search.send_keys(Keys.ENTER)
#     time.sleep(30)
# finally:
#     driver.quit()

# I want to run the bot headless because my laptop is not very powerful and I don't want to open a browser window every time I run the bot but I am not sure how will I verify captchas if I run it headless.

# First headless bot (without captcha verification)
# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.common.keys import Keys
# from selenium.webdriver.chrome.options import Options
# import time

# options = Options()
# options.add_argument("--headless")

# driver= webdriver.Chrome(options= options)

# try:
#     driver.get("https://google.com")

#     search = driver.find_element(By.NAME, "q")
#     search.send_keys("Pokedex")
#     search.send_keys(Keys.ENTER)
#     time.sleep(30)
#     # print(driver.page_source) This made my computer crash i didnt realise that it will download the entire google source page.
#     search_results = driver.find_elements(By.ID, "search")
#     if len(search_results)>0:
#         print("Search results found")
#     else:
#         print("Captcha detected, no search results found")
#         driver.save_screenshot("blocked.png")
#         print("Screenshot saved as blocked.png")
# finally:
#     driver.quit()

# This is still encountering a captcha. I will try using undetected_chromedriver.

# import undetected_chromedriver as uc
# import time

# from selenium.webdriver.common.by import By
# from selenium.webdriver.common.keys import Keys

# options = uc.ChromeOptions()
# options.add_argument("--window-size=1920,1080")
# options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36") # The scraper was still being flagged as a bot so I am using this common user string and using a larger window size because smaller windows are more likely to be flagged

# driver = uc.Chrome(options = options, headless=True)

# try:
#     time.sleep(0.5)
#     driver.get("https://google.com")

#     search = driver.find_element(By.NAME, "q")
#     time.sleep(2)
#     search.send_keys("Pokedex")
#     time.sleep(0.5)
#     search.send_keys(Keys.ENTER)
#     time.sleep(20)
#     search_results = driver.find_elements(By.ID, "search")
#     if len(search_results)>0:
#         print("Search results found")
#         driver.save_screenshot("search_results.png")
#         print("Screenshot saved as search_results.png")
#     else:
#         print("Captcha detected, no search results found")
#         driver.save_screenshot("blocked.png")
#         print("Screenshot saved as blocked.png")
# finally:
#     driver.quit()

# This code is not encountering a captcha but it is still flagging it as blocked even though it is not, I think it is because it checks for the search element too early when it might not be present. Instead of a hardcoded sleep, I am going to use WebDriverWait.

# import undetected_chromedriver as uc
# import time

# from selenium.webdriver.common.by import By
# from selenium.webdriver.common.keys import Keys
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from selenium.common.exceptions import TimeoutException
# from random import uniform

# options = uc.ChromeOptions()
# options.add_argument("--window-size=1920,1080")
# options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

# driver = uc.Chrome(options = options, headless=True)


# try:
#     driver.get("https://google.com")
#     search = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.NAME,"q")))

#     for character in "Pokedex":
#         search.send_keys(character)
#         time.sleep(uniform(0.1, 0.2))
#     search.send_keys(Keys.ENTER)

#     try:
#         WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME,"h3")))
#         print("Search results found")
#         results = driver.find_elements(By.TAG_NAME,"h3")
#         for r in results:
#             print(r.text)
#         driver.save_screenshot("success.png")
#         print("Screenshot saved as success.png")
#     except TimeoutException:
#         print("Element not found or Captcha detected")
#         driver.save_screenshot("blocked.png")
#         print("Screenshot saved as blocked.png")


# finally:
#     driver.quit()

# It is finally working, it got a list of website headers and saved the results as a screenshot. I am feeling soooo good. I will now try to scrape images from images.google.com.

# import undetected_chromedriver as uc
# import time
# import base64
# import urllib.request
# import os
# from selenium.webdriver.common.by import By
# from selenium.webdriver.common.keys import Keys
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from selenium.common.exceptions import TimeoutException
# from random import uniform

# os.makedirs("pokedex_images", exist_ok=True)

# options = uc.ChromeOptions()
# options.add_argument("--window-size=1920,1080")
# options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

# driver = uc.Chrome(options= options, headless=True)

# try:
#     driver.get("https://images.google.com")
#     search = WebDriverWait(driver,10).until(EC.element_to_be_clickable((By.NAME,"q")))
#     for character in "Pokedex":
#         search.send_keys(character)
#         time.sleep(uniform(0.1, 0.2))
#     search.send_keys(Keys.ENTER)
#     try:
#         WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME,"img")))
#         print("Search results found")

#         images = driver.find_elements(By.TAG_NAME, "img")
#         count = 0
#         for img in images:
#             # I want to run a test batch of 10 images 
#             if count >=10: 
#                 break
#             try: 
#                 src = img.get_attribute("src")

#                 if src:
#                     # I noticed that most of the images on google images have a src that is base 64 encoded and starts with "data:image", so i will handle those first, decode them and save them
#                     # example of encoded src: data:image/jpeg;base64,9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUUE.... (It is really big)
#                     # There is a header (data:image/jpeg;base64) and the encoded img data seperated by ',' i will split them.
#                     if src.startswith("data:image"):
#                         header, encoded_data = src.split(",", 1)
#                         image_data = base64.b64decode(encoded_data)

#                         filename = f"pokedex_images/00000{count}.jpg"
#                         with open(filename, "wb") as f:
#                             f.write(image_data)
#                             print(f"image stored as {filename}")
#                             count+=1
#                     elif src.startswith("http"):
#                         filename = f"pokedex_images/00000{count}.jpg"
#                         urllib.request.urlretrieve(src, filename)
#                         print(f"image downloaded as {filename}")
#                         count +=1
#             except Exception as e:
#                 continue




    
#     except TimeoutException:
#         print("Element not found or Captcha detected")
#         driver.save_screenshot("blocked.png")
#         print("Screenshot saved as blocked.png")
# finally:
#     driver.quit()

# The image scraping code is working, it has downloaded 10 images of the pokedex and saved them in the pokedex_images folder. I will use the final code as a template to make a pokemon image scraping function that will take a pokemon name and number of images to scrape. I will also add infinite scrolling and skip the google logo which is the first img.

# Test bot for infinite scrolling:

# import undetected_chromedriver as uc
# import time
# import os
# import base64
# import urllib.request
# from selenium.webdriver.common.by import By
# from selenium.webdriver.common.keys import Keys
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from selenium.common.exceptions import TimeoutException, NoSuchElementException
# from random import uniform

# os.makedirs("pokedex_images", exist_ok=True)

# options = uc.ChromeOptions()
# options.add_argument("--window-size=1920,1080")
# options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36")
# # options.add_argument("--headless-new")

# driver = uc.Chrome(options= options)

# target_num = 100

# try:
#     driver.get("https://images.google.com")
#     search = WebDriverWait(driver,10).until(EC.element_to_be_clickable((By.NAME,"q")))
#     for character in "Pokedex":
#         search.send_keys(character)
#         time.sleep(uniform(0.1, 0.3))
#     search.send_keys(Keys.ENTER)

#     try:
#         WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "img")))
#         print("Search results found")

#         last_height = driver.execute_script("return document.body.scrollHeight")
#         while True:
#             driver.execute_script("window.scrollTo(0, document.body.scrollHeight); ")
#             time.sleep(uniform(1.5, 2.0))
#             try:
#                 show_more = driver.find_element(By.XPATH, "//input[@type='button' and @value='Show more results'] | //button[contains(., 'Show more results')] | //input[@type='button' and @value='Next'] | //button[contains(., 'Next')]")
#                 if show_more.is_displayed():
#                     show_more.click()
#                     time.sleep(uniform(1.5, 2.0))
#             except NoSuchElementException:
#                 pass
#             current_imgs = driver.find_elements(By.TAG_NAME, "img")
#             if len(current_imgs)>target_num:
#                 print(f"Found {len(current_imgs)} images, target is {target_num}, stopping scroll")
#                 break
#             new_height = driver.execute_script("return document.body.scrollHeight")
#             if new_height == last_height:
#                 print("Reached the end of the page, no more images")
#                 break
#             last_height = new_height
        
#         images = driver.find_elements(By.TAG_NAME, "img")
#         count = 0
#         driver.save_screenshot("results.png")
#         for image in images:
#             if count == 0:
#                 count +=1
#                 continue
#             if count > target_num:
#                 break
#             try:
#                 src = image.get_attribute("src")
#                 if src:
#                     file_name = f"pokedex_images/{str(count).zfill(6)}.jpg"
#                     if src.startswith("data:image"):
#                         header, encoded = src.split(",", 1)
#                         data = base64.b64decode(encoded)
#                         with open(file_name, "wb") as f:
#                             f.write(data)
#                             print(f"image stored as {file_name}")
#                             count +=1
#                     elif src.startswith("http"):
#                         urllib.request.urlretrieve(src, file_name)
#                         print(f"image downloaded as {file_name}")
#                         count +=1
#             except Exception as e:
#                 continue
#         print(f"Scraped {count-1} images")

            

#     except TimeoutException:
#         print("Element not found or Captcha detected")
#         driver.save_screenshot("blocked.png")
#         print("Screenshot saved as blocked.png")









# finally:
#     driver.quit()

# This code is scraping 100 images and is implementing infinite scrolling but it is not skipping the google logo and is downloading junk images like website icons and probably spacers. Also the image quality is very bad, I will try to click on each image and get the high quality version that appears on the right side of the page. I will also add a check to skip images that are smaller than 100x100 pixels because those are most likely to be icons or spacers.nstead of using all img tags, that is causing the junk images to be downloaded, i will use xpath to point towards the images inside the div with role of listing items. 


# import undetected_chromedriver as uc
# import time
# import os
# import base64
# import urllib.request
# from selenium.webdriver.common.by import By
# from selenium.webdriver.common.keys import Keys
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from selenium.common.exceptions import TimeoutException, NoSuchElementException
# from random import uniform

# os.makedirs("pokedex_images", exist_ok=True)

# options = uc.ChromeOptions()
# options.add_argument("--window-size=1920,1080")
# options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36")
# # options.add_argument("--headless-new")

# driver = uc.Chrome(options= options)

# target_num = 100

# def get_valid_images(elements):
#     valid_count = 0
#     for img in elements:
#         try:
#             width = int(driver.execute_script("return arguments[0].naturalWidth;", img))
#             height = int(driver.execute_script("return arguments[0].naturalHeight;", img))
#             if width >= 100 and height >= 100:
#                 valid_count += 1
#         except Exception as e:
#             continue
#     return valid_count

# try:
#     driver.get("https://images.google.com")
#     search = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.NAME, "q")))
#     for character in "Bulbasaur":
#         search.send_keys(character)
#         time.sleep(uniform(0.1, 0.3))
#     search.send_keys(Keys.ENTER)

#     try:
#         WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, "//div[@role='main']//img[@data-deferred or @src]")))
#         print("Search results found")
        
#         last_height = driver.execute_script("return document.body.scrollHeight")
#         while True:
#             driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
#             time.sleep(uniform(2.5, 4.0))

#             try:
#                 show_more = driver.find_element(By.XPATH, "//input[@type='button' and @value='Show more results'] | //button[contains(., 'Show more results')] | //input[@type='button' and @value='Next'] | //button[contains(., 'Next')]")
#                 if show_more.is_displayed():
#                     show_more.click()
#                     time.sleep(uniform(1.5, 2.0))
#             except NoSuchElementException:
#                 pass
            
#             current_imgs = driver.find_elements(By.XPATH, "//div[@role='main']//img[@data-deferred or @src]")
#             valid_imgs = get_valid_images(current_imgs)

#             if valid_imgs >= target_num:
#                 print(f"Found {valid_imgs} valid images, target is {target_num}, stopping scroll....")
#                 break
#             new_height = driver.execute_script("return document.body.scrollHeight")
#             if new_height == last_height:
#                 print("Reached the end of the page, no more images")
#                 print(f"Found {valid_imgs} valid images, target is {target_num}, stopping scroll....")
#                 break
#             last_height = new_height
#         time.sleep(uniform(4.0,5.0)) # Wait for the images to fully load
#         images = driver.find_elements(By.XPATH, "//div[@role='main']//img[@data-deferred or @src]")
#         count = 0
#         driver.save_screenshot("results.png")
#         for image in images:
#             if count >= target_num:
#                 break
#             width = int(driver.execute_script("return arguments[0].naturalWidth;", image))
#             height = int(driver.execute_script("return arguments[0].naturalHeight;", image))
#             if width<100 or height<100:
#                 continue

#             try:
#                 src = image.get_attribute("src")
#                 if src:
#                     if src.startswith("data:image"):
#                         header, encoded = src.split(",", 1)
#                         data = base64.b64decode(encoded)

#                         filename = f"pokedex_images/{str(count).zfill(6)}.jpg" #filename would be like 000001.jpg, 000002.jpg, 000003.jpg etc
#                         with open(filename, "wb") as f:
#                             f.write(data)
#                             print(f"image stored as {filename}")
#                             count += 1
#                     elif src.startswith("http"):
                        
#                         filename = f"pokedex_images/{str(count).zfill(6)}.jpg"
#                         urllib.request.urlretrieve(src,filename)
#                         print(f"image downloaded as {filename}")
#                         count += 1
#             except Exception as e:
#                 continue
#     except TimeoutException:
#         print("Element not found or Captcha detected")
#         driver.save_screenshot("blocked.png")
#         print("Screenshot saved as blocked.png")




# finally:
#     driver.quit()


# This code is working perfectly, I am getting images from the img tags inside the div with role of main, I made a function using this code a template in selenium_scraer.py and the only thing i changed was using requests library instead of urllib because after some images it started to hang. I ran a test batch for 10 pokemons of 100 imgs each i got 1000 images in total and the quality is really good, I am so happy with the results.
# I am also pivoting from object detection to classification. While 15,100 look good for a dataset, there would be 151 classes too and images per class would be too low for a good model. I will now try to scrape 500 images per pokemon and train a classification model. Instead of just one simple search of [pokemon name] pokemon, I will use 5 targetted searches.


# The final code for the Scraper that I am using to scrape images, I already ran it on 2 pokemons and it worked perfectly giving me  1000 images.

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

search_queries= [
    "single official artwork",
    "anime screenshot",
    "3D model render",
    "official card",
    "plush toy"
]

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


def scrape_pokemon_images(pokemon_query, pokemon_name, target_num=100):
    
    os.makedirs(f"train_images/{pokemon_name}", exist_ok=True)
    os.makedirs("all_pokemon_images", exist_ok=True)
    
    options = uc.ChromeOptions()
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36")
    options.add_argument("--headless-new")

    driver = uc.Chrome(options=options)
    X_PATH = "//div[@role='main']//img[@data-deferred or @src]"

    try:
        driver.get("https://images.google.com")
        search_box = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "q")))
        for char in f"{pokemon_query} pokemon":
            search_box.send_keys(char)
            time.sleep(uniform(0.1, 0.3))
        search_box.send_keys(Keys.ENTER)

        try:
            WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH, X_PATH)))
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
            return

    finally:
        driver.quit()

if __name__ == "__main__":
    pokemon_str = """Bulbasaur\n#0001\nBulbasaur\nGrass · Poison\nIvysaur\n#0002\nIvysaur\nGrass · Poison\nVenusaur\n#0003\nVenusaur\nGrass · Poison\nCharmander\n#0004\nCharmander\nFire\nCharmeleon\n#0005\nCharmeleon\nFire\nCharizard\n#0006\nCharizard\nFire · Flying\nSquirtle\n#0007\nSquirtle\nWater\nWartortle\n#0008\nWartortle\nWater\nBlastoise\n#0009\nBlastoise\nWater\nCaterpie\n#0010\nCaterpie\nBug\nMetapod\n#0011\nMetapod\nBug\nButterfree\n#0012\nButterfree\nBug · Flying\nWeedle\n#0013\nWeedle\nBug · Poison\nKakuna\n#0014\nKakuna\nBug · Poison\nBeedrill\n#0015\nBeedrill\nBug · Poison\nPidgey\n#0016\nPidgey\nNormal · Flying\nPidgeotto\n#0017\nPidgeotto\nNormal · Flying\nPidgeot\n#0018\nPidgeot\nNormal · Flying\nRattata\n#0019\nRattata\nNormal\nRaticate\n#0020\nRaticate\nNormal\nSpearow\n#0021\nSpearow\nNormal · Flying\nFearow\n#0022\nFearow\nNormal · Flying\nEkans\n#0023\nEkans\nPoison\nArbok\n#0024\nArbok\nPoison\nPikachu\n#0025\nPikachu\nElectric\nRaichu\n#0026\nRaichu\nElectric\nSandshrew\n#0027\nSandshrew\nGround\nSandslash\n#0028\nSandslash\nGround\nNidoran♀\n#0029\nNidoran♀\nPoison\nNidorina\n#0030\nNidorina\nPoison\nNidoqueen\n#0031\nNidoqueen\nPoison · Ground\nNidoran♂\n#0032\nNidoran♂\nPoison\nNidorino\n#0033\nNidorino\nPoison\nNidoking\n#0034\nNidoking\nPoison · Ground\nClefairy\n#0035\nClefairy\nFairy\nClefable\n#0036\nClefable\nFairy\nVulpix\n#0037\nVulpix\nFire\nNinetales\n#0038\nNinetales\nFire\nJigglypuff\n#0039\nJigglypuff\nNormal · Fairy\nWigglytuff\n#0040\nWigglytuff\nNormal · Fairy\nZubat\n#0041\nZubat\nPoison · Flying\nGolbat\n#0042\nGolbat\nPoison · Flying\nOddish\n#0043\nOddish\nGrass · Poison\nGloom\n#0044\nGloom\nGrass · Poison\nVileplume\n#0045\nVileplume\nGrass · Poison\nParas\n#0046\nParas\nBug · Grass\nParasect\n#0047\nParasect\nBug · Grass\nVenonat\n#0048\nVenonat\nBug · Poison\nVenomoth\n#0049\nVenomoth\nBug · Poison\nDiglett\n#0050\nDiglett\nGround\nDugtrio\n#0051\nDugtrio\nGround\nMeowth\n#0052\nMeowth\nNormal\nPersian\n#0053\nPersian\nNormal\nPsyduck\n#0054\nPsyduck\nWater\nGolduck\n#0055\nGolduck\nWater\nMankey\n#0056\nMankey\nFighting\nPrimeape\n#0057\nPrimeape\nFighting\nGrowlithe\n#0058\nGrowlithe\nFire\nArcanine\n#0059\nArcanine\nFire\nPoliwag\n#0060\nPoliwag\nWater\nPoliwhirl\n#0061\nPoliwhirl\nWater\nPoliwrath\n#0062\nPoliwrath\nWater · Fighting\nAbra\n#0063\nAbra\nPsychic\nKadabra\n#0064\nKadabra\nPsychic\nAlakazam\n#0065\nAlakazam\nPsychic\nMachop\n#0066\nMachop\nFighting\nMachoke\n#0067\nMachoke\nFighting\nMachamp\n#0068\nMachamp\nFighting\nBellsprout\n#0069\nBellsprout\nGrass · Poison\nWeepinbell\n#0070\nWeepinbell\nGrass · Poison\nVictreebel\n#0071\nVictreebel\nGrass · Poison\nTentacool\n#0072\nTentacool\nWater · Poison\nTentacruel\n#0073\nTentacruel\nWater · Poison\nGeodude\n#0074\nGeodude\nRock · Ground\nGraveler\n#0075\nGraveler\nRock · Ground\nGolem\n#0076\nGolem\nRock · Ground\nPonyta\n#0077\nPonyta\nFire\nRapidash\n#0078\nRapidash\nFire\nSlowpoke\n#0079\nSlowpoke\nWater · Psychic\nSlowbro\n#0080\nSlowbro\nWater · Psychic\nMagnemite\n#0081\nMagnemite\nElectric · Steel\nMagneton\n#0082\nMagneton\nElectric · Steel\nFarfetch'd\n#0083\nFarfetch'd\nNormal · Flying\nDoduo\n#0084\nDoduo\nNormal · Flying\nDodrio\n#0085\nDodrio\nNormal · Flying\nSeel\n#0086\nSeel\nWater\nDewgong\n#0087\nDewgong\nWater · Ice\nGrimer\n#0088\nGrimer\nPoison\nMuk\n#0089\nMuk\nPoison\nShellder\n#0090\nShellder\nWater\nCloyster\n#0091\nCloyster\nWater · Ice\nGastly\n#0092\nGastly\nGhost · Poison\nHaunter\n#0093\nHaunter\nGhost · Poison\nGengar\n#0094\nGengar\nGhost · Poison\nOnix\n#0095\nOnix\nRock · Ground\nDrowzee\n#0096\nDrowzee\nPsychic\nHypno\n#0097\nHypno\nPsychic\nKrabby\n#0098\nKrabby\nWater\nKingler\n#0099\nKingler\nWater\nVoltorb\n#0100\nVoltorb\nElectric\nElectrode\n#0101\nElectrode\nElectric\nExeggcute\n#0102\nExeggcute\nGrass · Psychic\nExeggutor\n#0103\nExeggutor\nGrass · Psychic\nCubone\n#0104\nCubone\nGround\nMarowak\n#0105\nMarowak\nGround\nHitmonlee\n#0106\nHitmonlee\nFighting\nHitmonchan\n#0107\nHitmonchan\nFighting\nLickitung\n#0108\nLickitung\nNormal\nKoffing\n#0109\nKoffing\nPoison\nWeezing\n#0110\nWeezing\nPoison\nRhyhorn\n#0111\nRhyhorn\nGround · Rock\nRhydon\n#0112\nRhydon\nGround · Rock\nChansey\n#0113\nChansey\nNormal\nTangela\n#0114\nTangela\nGrass\nKangaskhan\n#0115\nKangaskhan\nNormal\nHorsea\n#0116\nHorsea\nWater\nSeadra\n#0117\nSeadra\nWater\nGoldeen\n#0118\nGoldeen\nWater\nSeaking\n#0119\nSeaking\nWater\nStaryu\n#0120\nStaryu\nWater\nStarmie\n#0121\nStarmie\nWater · Psychic\nMr. Mime\n#0122\nMr. Mime\nPsychic · Fairy\nScyther\n#0123\nScyther\nBug · Flying\nJynx\n#0124\nJynx\nIce · Psychic\nElectabuzz\n#0125\nElectabuzz\nElectric\nMagmar\n#0126\nMagmar\nFire\nPinsir\n#0127\nPinsir\nBug\nTauros\n#0128\nTauros\nNormal\nMagikarp\n#0129\nMagikarp\nWater\nGyarados\n#0130\nGyarados\nWater · Flying\nLapras\n#0131\nLapras\nWater · Ice\nDitto\n#0132\nDitto\nNormal\nEevee\n#0133\nEevee\nNormal\nVaporeon\n#0134\nVaporeon\nWater\nJolteon\n#0135\nJolteon\nElectric\nFlareon\n#0136\nFlareon\nFire\nPorygon\n#0137\nPorygon\nNormal\nOmanyte\n#0138\nOmanyte\nRock · Water\nOmastar\n#0139\nOmastar\nRock · Water\nKabuto\n#0140\nKabuto\nRock · Water\nKabutops\n#0141\nKabutops\nRock · Water\nAerodactyl\n#0142\nAerodactyl\nRock · Flying\nSnorlax\n#0143\nSnorlax\nNormal\nArticuno\n#0144\nArticuno\nIce · Flying\nZapdos\n#0145\nZapdos\nElectric · Flying\nMoltres\n#0146\nMoltres\nFire · Flying\nDratini\n#0147\nDratini\nDragon\nDragonair\n#0148\nDragonair\nDragon\nDragonite\n#0149\nDragonite\nDragon · Flying\nMewtwo\n#0150\nMewtwo\nPsychic\nMew\n#0151\nMew\nPsychic"""
    pokemon_list, _ = parse_pokemon_list(pokemon_str)
    # pokemon_list = ["bulbasaur", "zubat"] # Just a test batch
    print(f"Total number of pokemon to scrape: {len(pokemon_list)}")
    for pokemon in pokemon_list:
        print(f"Scraping images for {pokemon}...")
        for query in search_queries:
            scrape_pokemon_images(f"{pokemon} {query}", pokemon, target_num=100)
            