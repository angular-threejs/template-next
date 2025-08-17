import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  Directive,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { beforeRender, extend, getInstanceState, objectEvents } from 'angular-three';
import { NgtsPerspectiveCamera } from 'angular-three-soba/cameras';
import { NgtsOrbitControls } from 'angular-three-soba/controls';
import { BoxGeometry, GridHelper, Mesh, MeshBasicMaterial } from 'three';

@Directive({ selector: '[cursorPointer]' })
export class CursorPointer {
  constructor() {
    const document = inject(DOCUMENT);
    const hostElement = inject<ElementRef<Mesh>>(ElementRef);
    const mesh = hostElement.nativeElement;

    const localState = getInstanceState(mesh);
    if (!localState) return;

    objectEvents(() => mesh, {
      pointerover: () => void (document.body.style.cursor = 'pointer'),
      pointerout: () => void (document.body.style.cursor = 'default'),
    });
  }
}

@Component({
  selector: 'app-scene-graph',
  template: `
    <ngts-perspective-camera [options]="{ makeDefault: true, position: [-3, 5, 5] }" />

    <ngt-mesh
      #mesh
      cursorPointer
      (click)="clicked.set(!clicked())"
      (pointerover)="hovered.set(true)"
      (pointerout)="hovered.set(false)"
      [scale]="clicked() ? 1.5 : 1"
    >
      <ngt-box-geometry />
      <ngt-mesh-basic-material [color]="hovered() ? 'hotpink' : 'orange'" />
    </ngt-mesh>

    <ngt-grid-helper />

    <ngts-orbit-controls />
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CursorPointer, NgtsOrbitControls, NgtsPerspectiveCamera],
})
export class SceneGraph {
  private meshRef = viewChild.required<ElementRef<Mesh>>('mesh');

  protected hovered = signal(false);
  protected clicked = signal(false);

  constructor() {
    extend({ Mesh, BoxGeometry, MeshBasicMaterial, GridHelper });
    beforeRender(({ delta }) => {
      const mesh = this.meshRef().nativeElement;
      mesh.rotation.x += delta;
      mesh.rotation.y += delta;
    });
  }
}
