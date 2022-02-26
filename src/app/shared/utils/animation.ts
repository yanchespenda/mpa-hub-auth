import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

export const loadingAnimation = [
  trigger('loadingAnimation', [
    state('in', style({
      opacity: 1
    })),
    transition(':enter', [
      style({
        opacity: 0
      }),
      animate(150)
    ]),
    transition(':leave',
      animate(150, style({
        opacity: 0
      })))
  ])
];
