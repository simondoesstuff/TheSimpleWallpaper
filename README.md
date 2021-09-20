# The Simple Wallpaper

The **simplex**st wallpaper around! A fun, interactive visualization of coherent noise.

---

## How It Works

Two noise layers are calculated to make up the image each frame. The first layer acts as an offset to the inputs of the second layer creating an effect analagous to refraction of light. Each noise layer can be scaled, twisted, and animated separately.

The "bubbling" effect is produced by applying 3D noise to the screen where the the third dimension is time. Imagine taking slices off a block of cheese repeatedly.

## The Future

### Visual Features

These additions may or may not be added.

- [ ] Custom gradient coloring
  - [ ] Third gradient color
- [ ] Dropdown control to change either of the nosie algorithms (cellular would be awesome)

### UI Enhancements

- [ ] Navbar Improvements
  - [ ] The slider bars are a little janky when raised to the inline section.
- [ ] GitHub Repo Link Icon
- [ ] Box to type in exact values for slider bars

### Performance Updates

The **pixelation** is put in intentionally to increase performance. The pixelation allows for multiple pixels to be computed with a single noise computation step. I hope to improve the performance to the point where the pixelation can be removed entirely without any performance degredation.

- [ ] Install WASM for noise computation
- [ ] Break into chunks with service workers
