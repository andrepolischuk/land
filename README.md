# Land

  Landing page effects

## Instalation

  Via script tag in page sources:

```html
<script src="https://cdn.rawgit.com/andrepolischuk/land/1.1.0/land.min.js"></script>
```

  Set landing sections classes via `data-land` attribute:

```html
<body data-land=".land-section">
```

## Options

Options defining through setting element attributes with start value.

### data-land-opacity

  Opacity (0..1)

```html
<h2 data-land-opacity="0">...</h2>
```

### data-land-x

  Horizontal movement

```html
<h2 data-land-x="-350px">...</h2>
```

### data-land-y

  Vertical movement

```html
<h2 data-land-y="-200px">...</h2>
```

### data-land-rotation

  Rotation

```html
<h2 data-land-rotation="60deg">...</h2>
```

### data-land-scale

  Rescaling (0..2)

```html
<h2 data-land-scale="0.5">...</h2>
```

### data-land-delay

  Delay of action (0..1)

```html
<h2 data-land-opacity="0">...</h2>
<h2 data-land-opacity="0" data-land-delay="0.5">...</h2>
```

## API

### land.sections

  Landing section elements array

### land.on(event, callback)

  Set function called by change current section

```js
land.on('change', function(cur) {
  console.log(cur);
});
```

## Support

* Chrome
* Safari
* Firefox
* Opera
* Internet Explorer 9+
