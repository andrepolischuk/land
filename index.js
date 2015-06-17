
import land from 'land';

land('.section-opacity')
  .children('h2').opacity(0);

land('.section-x')
  .children('h2').x(-400);

land('.section-y')
  .children('h2').y(-400);

land('.section-rotate')
  .children('h2').rotate(180);

land('.section-scale')
  .children('h2').scale(0.5);

land('.section-all')
  .children('h2')
    .x(-400)
    .y(-400)
    .opacity(0)
    .rotate(90)
    .scale(0.5);
