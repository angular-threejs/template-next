import { Component } from '@angular/core';
import { NgtCanvas, NgtCanvasContent } from 'angular-three/dom';
import { SceneGraph } from './experience/scene-graph';

@Component({
  selector: 'app-root',
  template: `
    <ngt-canvas>
      <app-scene-graph *canvasContent />
    </ngt-canvas>
  `,
  host: { class: 'block h-dvh w-full' },
  imports: [NgtCanvas, NgtCanvasContent, SceneGraph],
})
export class App {}
