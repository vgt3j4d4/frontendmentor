# Frontend Mentor - Product preview card component solution

This is a solution to the [Product preview card component challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/product-preview-card-component-GO7UmttRfa). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshots](#screenshots)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- View the optimal layout depending on their device's screen size
- See hover and focus states for interactive elements

### Screenshots

![Desktop](./screenshot-desktop.png)
![Mobile](./screenshot-mobile.png)


### Links

- [Solution URL](https://your-solution-url.com) 
- [Live Site URL](https://frontendmentor-gonzalotejada.netlify.app/product-preview-card/)

## My process

### Built with

- Semantic HTML5 markup
- Flexbox
- Mobile-first workflow

### What I learned

- How to use the `<picture>` and `<img>` elements to display an image on different screen sizes
- How to use the `<hgroup>` element
- How to use the `<s>` element
- Accessibility solution for the strike-through text (original price)

### Continued development

- Responsive images

### Useful resources

- [Responsive images](https://web.dev/learn/design/responsive-images) 
- [The picture element](https://web.dev/learn/design/picture-element)

## Author

- Frontend Mentor - [@vgt3j4d4](https://www.frontendmentor.io/profile/vgt3j4d4)

## Acknowledgments

I was struggling with an issue where the `<img>` elements are being "unexpectedly" resized. I know I have some medias queries there but I'm also using `<picture>` and `<source>` to display different images on different screen sizes. The deal is that while a breakpoint is being hit, and the images are not yet loaded, the browser I believe uses a different dimensions for the image. While trying to figure out what's going on, I found [this](https://fedmentor.dev/posts/html-plan-product-preview/#prices) on the Frontend Mentor discord. It helped me fix the issue and helped me finding out about `<hgroup>` and `<s>` elements. Also, I found a11y solution for the strike-through text (original price) using the `<s>` element.
