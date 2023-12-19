import torch
from torchvision import transforms, models

class GrayscaleMobileNetV3:
    def __init__(self):
        # Load the pre-trained MobileNetV3 model
        self.model = models.mobilenet_v3_small(pretrained=True)

        # Modify the first convolutional layer
        first_layer = self.model.features[0][0]
        self.model.features[0][0] = torch.nn.Conv2d(1, first_layer.out_channels,
                                                    kernel_size=first_layer.kernel_size,
                                                    stride=first_layer.stride,
                                                    padding=first_layer.padding,
                                                    bias=False)

        # Average the weights for the new single channel
        with torch.no_grad():
            first_layer_weights = first_layer.weight.mean(dim=1, keepdim=True)
            self.model.features[0][0].weight = torch.nn.Parameter(first_layer_weights)

        # Define transforms for grayscale images
        self.transform = transforms.Compose([
            transforms.Grayscale(num_output_channels=1),
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485], std=[0.229])
        ])

    def preprocess(self, image):
        """
        Preprocess a grayscale image for the model.
        """
        return self.transform(image).unsqueeze(0)  # Add batch dimension

    def forward(self, x):
        """
        Perform a forward pass on an input tensor.
        """
        return self.model(x)
