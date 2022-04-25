import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Phone } from "./Phone";

export class CATSection {
  scene: THREE.Scene;
  world: CANNON.World;
  textureVid: HTMLVideoElement[];
  constructor(scene: THREE.Scene, world: CANNON.World) {
    this.scene = scene;
    this.world = world;
    this.textureVid = [];
    // Create video and play
    const sample1Video = new Phone(
      "videos/sample1.mp4",
      this.scene,
      this.world,
      { x: -11.2, z: -53.35 }
    );
    this.textureVid.push(sample1Video.video);

    const sample2Video = new Phone(
      "videos/sample2.mp4",
      this.scene,
      this.world,
      { x: -31.2, z: -53.35 }
    );
    this.textureVid.push(sample2Video.video);

    const desktopVideo = new Phone(
      "videos/cat-desktop.mp4",
      this.scene,
      this.world,
      { x: -69.1, z: -53.35 },
      { x: 29.4, y: 2, z: 19.4 }
    );
    this.textureVid.push(desktopVideo.video);
  }

  play() {
    this.textureVid.forEach((video) => {
      video.play();
    });
  }
}
