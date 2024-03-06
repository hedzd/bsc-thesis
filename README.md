# Bachelor's Thesis: Skeleton-based Human Action Recognition 

This project delves into human action recognition by utilizing skeletal data. The focus was on training and evaluating two prominent graph convolutional networks: [ST-GCN](https://github.com/yysijie/st-gcn) and [MST-GCN](https://github.com/czhaneva/mst-gcn). 
These networks process skeletal data sequences to extract features and classify human actions effectively. 
Our workflow started with the extraction of skeletal data from video inputs using MediaPipe. 
Following data preparation, we focused on training and fine-tuning the models for optimal performance. 
The project also provides a user-friendly interface allowing users to upload videos and receive both the visualized skeletal data and the predicted actions from our trained models.

## Dataset and Model Training
Skeletal data was extracted with the lightweight OpenPose pre-trained model and MediaPipe, offering a robust foundation for action recognition tasks. 
The GCN-based models were trained and tested on a skeleton dataset compiled from the Kinetics 400 video dataset, which is a large-scale, high-variety benchmark for action recognition algorithms.
The skeletal data was extracted using the [Light weight OpenPose](https://github.com/Daniil-Osokin/lightweight-human-pose-estimation.pytorch) pre-trained model and [MediaPipe](https://github.com/google/mediapipe). 
Due to computational limitations, we selectively trained our models on a subset of the Kinetics 400 video dataset, focusing on 38 out of the available 400 classes. These classes represent a balanced mix of actions, providing a comprehensive overview of human activity. 
Examples include "archery," "high jump," and "playing ukulele," among others. This targeted selection allows us to demonstrate the robustness of the ST-GCN and MST-GCN networks across a diverse range of actions.

## Results and Contributions

This thesis demonstrates the power of graph convolutional networks in interpreting and analyzing human skeletal movements. 
The comparative study between ST-GCN and MST-GCN with different hyperparameter settings offers insights into their respective capabilities and applications in real-world scenarios.

*For more information on the methodology, experimental setup, and detailed results, please consult the full thesis report (in Persian).*

## User Interface Demo

Here is a demo of our user interface in action:
![User Interface Demo](https://github.com/hedzd/bsc-thesis/blob/main/interface-demo.gif)
