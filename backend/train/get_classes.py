from ultralytics import YOLO

model = YOLO("best.pt")

class_names = model.names
print(class_names)
print("------------------")
list_of_classes = list(class_names.values())
print(list_of_classes)