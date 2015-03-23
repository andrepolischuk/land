
'use strict';

var land = require('andrepolischuk/land@1.2.0');

land('.land-opacity')
  .children('h4').opacity(0)
  .children('h2').opacity(0);

land('.land-x')
  .children('h4').x(-400)
  .children('h2').x(400);

land('.land-y')
  .children('h4').y(-400)
  .children('h2').y(600);

land('.land-rotate')
  .children('h4').rotate(180)
  .children('h2').rotate(-90);

land('.land-scale')
  .children('h4').scale(0.5)
  .children('h2').scale(0.5);

land('.land-all')
  .children('h4')
    .x(-400)
    .y(-400)
    .opacity(0)
    .scale(0.5)
  .children('h2')
    .x(400)
    .y(600)
    .opacity(0)
    .rotate(-90)
    .scale(0);

land('.land-github')
  .children('h2')
    .y(-400)
    .opacity(0);
