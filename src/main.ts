import './style.scss';
import Alpine from 'alpinejs';
import Panzoom, { PanzoomObject } from '@panzoom/panzoom';
import config from './config.json';
import { createCancelableClick } from './utils/cancelable-click';

document.addEventListener('alpine:init', () => {
  Alpine.data('triFold', () => ({
    config,
    guide: null as boolean | null,
    panzoom: null as PanzoomObject | null,
    stepDirection: 'forward',

    get maxStep() {
      return 4;
    },
    _currentStep: 0,
    get currentStep() {
      return this._currentStep;
    },
    set currentStep(value: number) {
      const minStep = 0;
      const maxStep = this.maxStep;
      switch (value) {
        case minStep - 1:
          this._currentStep = maxStep;
          break;
        case maxStep + 1:
          this._currentStep = minStep;
          break;
        default:
          this._currentStep = value;
          break;
      }
    },

    bookOnPointerDown: (_: PointerEvent) => { },
    bookOnPointerUp: (_: PointerEvent) => { },

    nextStep() {
      this.stepDirection = 'forward';
      this.currentStep++;
    },
    prevStep() {
      this.stepDirection = 'backward';
      this.currentStep--;
    },

    init() {
      const app = this.$refs.app;
      const viewport = this.$refs.viewport;
      const { down: bookOnPointerDown, up: bookOnPointerUp } = createCancelableClick(() => {
        this.guide = false;
        this.nextStep();
      });
      this.bookOnPointerDown = bookOnPointerDown;
      this.bookOnPointerUp = bookOnPointerUp;

      document.addEventListener('alpine:initialized', () => {
        this.panzoom = Panzoom(viewport, {
          contain: 'outside',
          maxScale: 4,
          minScale: 1,
          startX: (app.clientWidth - viewport.clientWidth) / 2,
          startY: Infinity,
        });
        app.addEventListener('wheel', this.panzoom.zoomWithWheel);
      });

      setTimeout(() => {
        if (this.guide === null) {
          this.guide = true;
        }
      }, 3000);
    }
  }));
});

Alpine.start();
