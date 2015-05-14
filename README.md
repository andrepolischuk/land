# land

  > Landing page effects

## Instalation

```sh
$ npm install --save land
$ component install andrepolischuk/land
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

  Return [section](#section)

```js
land('.section-first');
land(document.querySelector('.section-first'));
```

### land.sections

  Return sections array

### land.on(event, fn)

  Set events handler

```js
land.on('change', function(cur) {

});
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

#### Children#opacity(val)

  Set opacity (0..1)

```js
land('.section-first')
  .children('h2')
    .opacity(0.5);
```

#### Children#x(val)

  Set horizontal movement

```js
land('.section-first')
  .children('h2').x(-250);
```

#### Children#y(val)

  Set vertical movement

```js
land('.section-first')
  .children('h2').y(-100);
```

#### Children#scale(val)

  Set rescaling (0..2)

```js
land('.section-first')
  .children('h2')
    .scale(0.75);
```

#### Children#rotate(val)

  Set rotation (0..360)

```js
land('.section-first')
  .children('h2')
    .rotate(45);
```

#### Children#delay(val)

  Set transform delay (0..1)

```js
land('.section-first')
  .children('h2')
    .delay(0.25);
```

#### Children#children(element)

  Return parent section children

## Support

* Chrome
* Safari
* Firefox
* Opera
* IE 9+

## License

  MIT
