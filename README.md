# Deepfake-Recognition-using-AI-


Project Link - deepfake-detection-using-ai-ml-hash-it-out-2025-vvz4-hn7lh15no.vercel.app
### A Full-Stack Deepfake Detection Application developed FastAPI, Tensorflow, OpenCV, Next.js and Tailwind CSS

## Project description
This AI-powered deepfake recognition system detects manipulated images and videos by analyzing facial inconsistencies, unnatural movements, and pixel-level artifacts. Built with FastAPI, TensorFlow, OpenCV, and React.js, it leverages a deep CNN model to achieve high accuracy in identifying deepfakes.

   ### Model Structure
   * The deepfake detection model is a 10-layer Convolutional Neural Network (CNN) optimized for image and video classification.
   * It consists of 653k+ parameters with dropout regularization (0.5) to prevent overfitting by ensuring independent learning among neurons.
   * Initial convolution layers use a kernel size of 5 with 64 filters, followed by max-pooling, while later layers have fewer filters and a dilation rate of 2 to expand the receptive field.
   * Dilated convolutions are applied in the final three layers, enhancing feature extraction for detecting subtle deepfake artifacts..
   *The model performs binary classification with sigmoid activation to distinguish real from fake media.
   * The input image size is [224,224,3], ensuring optimal feature extraction.
   * The model achieves >99.9% training accuracy and >99% validation accuracy, demonstrating high effectiveness in detecting deepfakes.


## Architecture Diagram
#CNN + Vision Transformer Hybrid
![diagram-export-3-27-2025-1_07_05-PM](https://github.com/user-attachments/assets/d1f0d0c7-db94-48be-b6fa-cd9d03d49b6c)

#Temporal Inconsistency detector
![diagram-export-3-27-2025-1_08_53-PM](https://github.com/user-attachments/assets/2598a340-6ce2-4a6d-8324-2f4ead1c8283)

![diagram-export-3-27-2025-10_54_03-AM](https://github.com/user-attachments/assets/f699cec5-35e0-4471-ad4c-6a8819a9dd18)

![Screenshot 2025-03-27 155149](https://github.com/user-attachments/assets/793366e5-2497-4046-9363-d2c56312efc0)

![Screenshot 2025-03-27 155133](https://github.com/user-attachments/assets/37d4888e-ceee-476f-b0cb-a64ecf59af38)
![Screenshot 2025-03-27 155203](https://github.com/user-attachments/assets/7109e9a2-35f0-4b77-a087-58b644ed28b2)


