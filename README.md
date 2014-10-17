# Landing

  Landing page effects & scroll spy script

## Instalation

  Via script tag in page sources:

```html
<script src="/static/js/landing.min.js"></script>
```

  Set landing sections classes:

```html
<body data-landing=".landing-section" data-landing-nav=".landing-nav">
```

* `data-landing` - landing sections class
* `data-landing-nav` - scroll spy navigation class

## Options

Options defining through setting element attributes with start value.

### data-landing-opacity

  Opacity (0..1)

```html
<h2 data-landing-opacity="0">...</h2>
```

### data-landing-x

  Horizontal movement

```html
<h2 data-landing-x="-350px">...</h2>
```

### data-landing-y

  Vertical movement

```html
<h2 data-landing-y="-200px">...</h2>
```

### data-landing-rotation

  Rotation

```html
<h2 data-landing-rotation="60deg">...</h2>
```

### data-landing-scale

  Rescaling (0..2)

```html
<h2 data-landing-scale="0.5">...</h2>
```

### data-landing-delay

  Delay of action (0..1)

```html
<h2 data-landing-opacity="0">...</h2>
<h2 data-landing-opacity="0" data-landing-delay="0.5">...</h2>
```

## API

### landing.sections

  Landing section elements array

### landing.nav

  Landing nav element

### landing.on(event, callback)

  Set function called by change current section

```js
landing.on('change', function(cur) {
  console.log(cur);
});
```

## Support

* Chrome
* Safari
* Firefox
* Opera
* Internet Explorer 9+
