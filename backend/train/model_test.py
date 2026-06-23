from ultralytics import YOLO
import os

model = YOLO("best.tflite", task="classify")  

folder_path = "test_images"  

# results = model.predict(source=folder_path, save=True, stream=True)
results = model.predict(source="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png", save=True)

for r in results:
    filename = os.path.basename(r.path)
    top1_idx = r.probs.top1
    top1_name = r.names[top1_idx]
    top1_conf = r.probs.top1conf.item()
    print(f"📷 File: {filename} ---> Prediction: {top1_name} ({top1_conf:.2%})")
