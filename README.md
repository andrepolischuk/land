# land

  > Landing page effects

## Install

```sh
npm install --save land
```

```sh
component install andrepolischuk/land
```

## Usage

```js
var land = require('land');

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

  Create section

```js
land('.section-first');
land(document.querySelector('.section-first'));
```

### .children(element)

  Create section children

```js
land('.section-first')
  .children('h2')
```

### .set(prop, val)

  Set transform start value

```js
land('.section-first')
  .children('h2')
    .set('scale', 0.5);
```

  or transform function

```js
land('.section-first')
  .children('h2')
    .set('opacity', function(progress) {
      return 1 - progress;
    });
```

### .opacity(val)

  Set opacity (0..1)

```js
land('.section-first')
  .children('h2')
    .opacity(0.5);
```

### .x(val)

  Set horizontal movement

```js
land('.section-first')
  .children('h2').x(-250);
```

### .y(val)

  Set vertical movement

```js
land('.section-first')
  .children('h2').y(-100);
```

### .scale(val)

  Set rescaling (0..2)

```js
land('.section-first')
  .children('h2')
    .scale(0.75);
```

### .rotate(val)

  Set rotation (0..360)

```js
land('.section-first')
  .children('h2')
    .rotate(45);
```

### .delay(val)

  Set transform delay (0..1)

```js
land('.section-first')
  .children('h2')
    .delay(0.25);
```

### land.on(event, fn)

  Set events handler

```js
land.on('change', function(cur) {

});
```

## Support

* Chrome
* Safari
* Firefox
* Opera
* IE 9+

## License

  MIT
