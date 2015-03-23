# Land

  Landing page effects

## Instalation

  Browser:

```html
<script src="https://cdn.rawgit.com/andrepolischuk/land/1.1.0/land.min.js"></script>
```

  Component(1):

```sh
$ component install andrepolischuk/land
```

  Npm:

```sh
$ npm install land
```

## Example

```js
land('.section')
  .children('h2')
    .y(-50)
    .opacity(0)
    .scale(0.5)
  .children('img')
    .x(50)
    .scale(0.5)
    .rotate(10);
```

## API

### land(element)

  Return [section](#section)

```js
land('.section-first')
land(document.querySelector('.section-first'))
```

### land.sections

  Return sections array

### land.on(event, fn)

  Set events handler

```js
land.on('change', function(cur) {

})
```

### Section

#### Section#element

  Section DOM element

#### Section#childrens

  Array of sections childrens

#### Section#current

  If `true`, this section is current

#### Section#children(element)

  Return section [children](#children)

```js
land('.section-first')
  .children('h2')
```

### Children

#### Children#element

  Children DOM element

#### Children#section

  Parent section

#### Children#set(prop, val)

  Set transform start value

```js
land('.section-first')
  .children('h2')
    .scale(0.5);
```

  or transform function

```js
land('.section-first')
  .children('h2')
    .opacity(function(progress) {
      return 1 - progress;
    });
```

#### Children#opacity(val)

  Set opacity (0..1)

#### Children#x(val)

  Set horizontal movement

#### Children#y(val)

  Set vertical movement

#### Children#scale(val)

  Set rescaling (0..2)

#### Children#rotate(val)

  Set rotation (0..360)

#### Children#delay(val)

  Set transform delay (0..1)

#### Children#children(element)

  Return parent section children

## Data attributes

  Define landing via `data-*` attributes

### Sections

  Sections defining via `data-land`:

```html
<body data-land=".land-section">
```

## Transforms

  Transforms defining via setting element attributes with start value

### data-land-opacity

  Opacity

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

  Rescaling

```html
<h2 data-land-scale="0.5">...</h2>
```

### data-land-delay

  Delay of action (0..1)

```html
<h2 data-land-opacity="0">...</h2>
<h2 data-land-opacity="0" data-land-delay="0.5">...</h2>
```

## Support

* Chrome
* Safari
* Firefox
* Opera
* Internet Explorer 9+

## License

  MIT
