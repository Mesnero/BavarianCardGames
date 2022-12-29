import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent {
  // Declare a variable to hold the index of the currently displayed image
  currentIndex = 0;
  // Declare an array to hold the list of images to be displayed in the slider
  images = ['assets/gamemodes/Arschloch.png', 'assets/gamemodes/Paris.png'];

  @Output() currentIndexChanged = new EventEmitter<number>();

  constructor() { }




  // Method to go to the previous image in the slider
  previous() {
    // Decrement the index by 1, unless we are already at the first image, in which case we will go to the last image
    this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.images.length - 1;
    this.currentIndexChanged.emit(this.currentIndex);
  }

  // Method to go to the next image in the slider
  next() {
    // Increment the index by 1, unless we are already at the last image, in which case we will go back to the first image
    this.currentIndex = (this.currentIndex < this.images.length - 1) ? this.currentIndex + 1 : 0;
    this.currentIndexChanged.emit(this.currentIndex);
  }

  removeClass() {
    // Get a reference to the img element
    const imgElement = document.querySelector('.slider img');
    // Check if the img element exists
    if (imgElement) {
      // Remove the fade-out class from the element
      imgElement.classList.remove('fade-out');
    }
  }
}
