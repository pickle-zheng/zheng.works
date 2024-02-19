import * as THREE from "three";

export class SpeedNet {
  netGroup: THREE.Group;
  scene: THREE.Scene;
  netMesh: THREE.Mesh;
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.netGroup = new THREE.Group();
    this.netGroup.position.set(0, 0, 0);
    const netMaterial = new THREE.MeshPhysicalMaterial({
      metalness: 0,
      roughness: 0,
      transmission: 1,
      reflectivity: 0.5,
      envMapIntensity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.3,
      color: 0xffffff
    });
    const net: THREE.BoxGeometry = new THREE.BoxGeometry(5, 5, 0.01);
    this.netMesh = new THREE.Mesh(net, netMaterial);
    this.netMesh.castShadow = false;
    this.netMesh.receiveShadow = true;
    this.netGroup.add(this.netMesh);

    const pole = new THREE.MeshPhongMaterial({
      color: 0xe6e6e6,
      flatShading: true
    });
    const poleGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
      0.1,
      0.1,
      5
    );
    const leftPoleMesh: THREE.Mesh = new THREE.Mesh(poleGeometry, pole);
    leftPoleMesh.position.set(2.5, 0, 0);
    leftPoleMesh.castShadow = true;
    leftPoleMesh.receiveShadow = true;
    this.netGroup.add(leftPoleMesh);

    const rightPoleMesh: THREE.Mesh = new THREE.Mesh(poleGeometry, pole);
    rightPoleMesh.position.set(-2.5, 0, 0);
    rightPoleMesh.castShadow = true;
    rightPoleMesh.receiveShadow = true;
    this.netGroup.add(rightPoleMesh);

    this.scene.add(this.netGroup);
  }
}
