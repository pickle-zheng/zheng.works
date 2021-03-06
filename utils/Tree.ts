import * as THREE from "three";
import * as CANNON from "cannon-es";
export class Tree {
  tree: THREE.Group;
  scene: THREE.Scene;
  world: CANNON.World;
  type: string;
  // treeBody: CANNON.Body;
  constructor(
    scene: THREE.Scene,
    world: CANNON.World,
    type: string,
    position: { x: number; z: number }
  ) {
    this.tree = new THREE.Group();
    this.scene = scene;
    this.world = world;
    this.type = type;
    const treeMaterial = new THREE.MeshPhongMaterial({
      color: 0x34b334,
      flatShading: true
    });

    const treeTopGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(
      0.4,
      6,
      6
    );
    const treeTopGeometryMesh: THREE.Mesh = new THREE.Mesh(
      treeTopGeometry,
      treeMaterial
    );
    treeTopGeometryMesh.position.y = Math.random() + 1.5;
    treeTopGeometryMesh.position.x = Math.random() * 2 - 1;
    treeTopGeometryMesh.position.z = Math.random() * 2 - 1;
    treeTopGeometryMesh.rotateY(Math.PI / Math.random());
    treeTopGeometryMesh.castShadow = true;
    this.tree.add(treeTopGeometryMesh);

    const treeMidGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(
      0.6,
      6,
      68
    );
    const treeMidGeometryMesh: THREE.Mesh = new THREE.Mesh(
      treeMidGeometry,
      treeMaterial
    );
    treeMidGeometryMesh.position.y = Math.random() + 1.2;
    treeMidGeometryMesh.position.x = Math.random() * 2 - 1;
    treeMidGeometryMesh.position.z = Math.random() * 2 - 1;
    treeMidGeometryMesh.rotateY(Math.PI / Math.random());
    treeMidGeometryMesh.castShadow = true;
    this.tree.add(treeMidGeometryMesh);

    const treeLowerGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(
      0.87,
      6,
      6
    );
    const treeLowerGeometryMesh: THREE.Mesh = new THREE.Mesh(
      treeLowerGeometry,
      treeMaterial
    );
    treeLowerGeometryMesh.position.y = Math.random() + 0.5;
    treeLowerGeometryMesh.position.x = Math.random() * 1 - 0.5;
    treeLowerGeometryMesh.position.z = Math.random() * 1 - 0.5;
    treeLowerGeometryMesh.rotateY(Math.PI / Math.random());
    treeLowerGeometryMesh.castShadow = true;
    this.tree.add(treeLowerGeometryMesh);

    const treeTrunkGeometry: THREE.CylinderGeometry =
      new THREE.CylinderGeometry(0.2, 0.2, 4);
    const treeTrunkGeometryMesh: THREE.Mesh = new THREE.Mesh(
      treeTrunkGeometry,
      new THREE.MeshPhongMaterial({
        color: 0x725c42,
        flatShading: true
      })
    );
    treeTrunkGeometryMesh.position.y = 0;
    treeTrunkGeometryMesh.castShadow = true;
    this.tree.add(treeTrunkGeometryMesh);

    this.tree.position.x = position.x;
    this.tree.position.y = 1.6;
    this.tree.position.z = position.z;

    this.scene.add(this.tree);

    // const treeBodyShape = new CANNON.Cylinder(0.2, 0.4, 3);
    // this.treeBody = new CANNON.Body({ mass: 600 });
    // this.treeBody.addShape(treeBodyShape);
    // this.treeBody.fixedRotation = true;
    // this.treeBody.linearDamping = 0;
    // this.treeBody.position.x = this.tree.position.x;
    // this.treeBody.position.y = this.tree.position.y;
    // this.treeBody.position.z = this.tree.position.z;
    // this.world.addBody(this.treeBody);
  }
}
