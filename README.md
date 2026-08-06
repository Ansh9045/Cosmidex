# Cosmidex
A real life Pokedex app(android + web) that can classify generation 1 pokemon with their images and show their stats. 

## Web Preview
<img width="683" height="340" alt="Screenshot_20260729_213620" src="https://github.com/user-attachments/assets/2120ee31-e6a0-4f39-8e75-7da681260b00" />

## Android Preview
<img width="240" height="488" alt="WhatsApp Image 2026-08-02 at 11 26 58 AM" src="https://github.com/user-attachments/assets/76b83433-92c7-44e9-8c98-be4ad2e467d2" />

---
## Tutorial: 
1. Open the app in web or install the apk file.
2. Choose between: 
   - Use Camera: Use your device's camera to capture a image of a pokemon, identify it and look at it's stats
   - Upload Image: Identify a pokemon using an image inside your gallery and get its stats.
   - All Pokemon: Browse all 151 pokemon in generation 1, click on any individual pokemon to look at it's stats.
3. Use the tab bar at the bottom to navigate.
4. When viewing a pokemon page, shake your phone to open tab.
5. If the confidence is low, select between the top 5 predictions of the model or try again with a different image.

> 
> Try it now:  
> Web: https://pokedex-murex-five-84.vercel.app/ 
> Android: coming soon

## How it Works

### 1. Image Acquisition
   - The user either uploads the image or captures it using their camera.
### 2. Image Pre-processing
   - The image is then cropped and resized to 224 x 224 px to match the model's image size.
   - The raw pixel data of the image is converted into rgb, then its values are normalised to 0-1 and is used as an input tensor for the model.
### 3. Prediction
   - Using the input tensor, the model (tflite on the mobile and tfjs on the web), outputs a probability for each of the 151 pokemon classes in generation I.
   - If the class with the best probability has a confidence value more than 0.4 on web and 0.5 on mobile, it is selected as the pokemon class and the app shows the stats for that pokemon.
   - Otherwise the app falls back to a not confident page that displays top 5 probabilities out of which the user can select one.
### 4. Catch
   - Whenever a user successfully predicts a pokemon using the camera, upload or notconfident page, the pokemon is caught and a catch toast is displayed. 
   - The caught pokemon is stored to local Storage.
### 5. Medal
   - If the user successfully catches all 151 pokemon, the user receives a medal and the caught pokemons stored in local storage are reset to 0.
### 6. The Pokemon Page
   - The pokemon page displays crucial information about the pokemon like it's pokedex summary (flavor text), it's types, height, weight, base stats and evolutions.
   - The page gets this data from the pokeAPI.
### 7. The All Pokemon Page
   - This page displays a list of 151 pokemon by default, each pokemon has their image, types, names and pokedex ids displayed. 
   - The page also displays the medal and pokemon caught count of the user.
   - The user can search a pokemon by its name using the search bar.
   - The user can also select to display all it's caught pokemon.
### 8. Backgrounds 
   - This is probably my favourite part, all the backgrounds used in the app are sourced from NASA image Gallery.
   - The app is inside an app background container that allows to dynamically change the background.
   - Each page has a separate background.
   - Each pokemon type has a separate background, matching their aesthetics. 


## Credits
### 1. Background Images - [NASA Image and Video library](https://images.nasa.gov/)
### 2. Home Icon - [Dave Gandy - FLATICON](https://www.flaticon.com/authors/dave-gandy)
### 3. Gallery Icon - [Superndre - FLATICON](https://www.flaticon.com/authors/superndre)
### 4. Camera Icon - [Saepul Nahwan - FLATICON](https://www.flaticon.com/authors/saepul-nahwan)
### 5. Pokeball Icon - [Mayor Icons - FLATICON](https://www.flaticon.com/authors/mayor-icons)
### 6. Cosmidex Logo - AI Generated using [ChatGPT](https://chatgpt.com)