from ultralytics import YOLO

model = YOLO("best.pt")

success = model.export(format="tfjs", imgsz=224)
# success = model.export(format="tflite", imgsz=224) # To convert model to tflite format, uncomment this line and comment the previous one