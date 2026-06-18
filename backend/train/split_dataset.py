# Code for splitting the training and testing data

import os
import shutil
import splitfolders

def split_dataset(input_folder, output_folder, ratio=(0.8, 0.1, 0.1)):
    if not os.path.exists(input_folder):
        print(f"Input folder '{input_folder}' does not exist.")
        return
    print(f"Splitting dataset from '{input_folder}' into '{output_folder}' with ratio {ratio}...")
    splitfolders.ratio(
        input_folder,
        output=output_folder,
        ratio=ratio,
        group_prefix=None,
        move=False
    )
    print("Dataset split completed.")

if __name__ == "__main__":
    input_folder = "train_images"
    output_folder = "pokemon_dataset"
    split_dataset(input_folder, output_folder)