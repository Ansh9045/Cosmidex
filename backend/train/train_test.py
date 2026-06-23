from ultralytics import YOLO
import time
start_time = time.time()
model = YOLO("yolov8n-cls.pt") 
results = model.train(data="pokemon_dataset", epochs=1, imgsz=640)
end_time = time.time()
print(f"Training completed in {end_time - start_time} seconds or { (end_time - start_time) / 60 } minutes")