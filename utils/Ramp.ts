import * as THREE from "three";
import * as CANNON from "cannon-es";
export class Ramp {
  ramp: THREE.Group;
  scene: THREE.Scene;
  world: CANNON.World;
  type: string;
  rampBody: CANNON.Body;
  constructor(
    scene: THREE.Scene,
    world: CANNON.World,
    type: string,
    position: { x: number; z: number }
  ) {
    this.ramp = new THREE.Group();
    this.scene = scene;
    this.world = world;
    this.type = type;
    const rampMaterial = new THREE.MeshPhongMaterial({
      color: 0xe6e6e6,
      flatShading: true
    });

    // RAMP Support
    const rampSupport: THREE.BoxGeometry = new THREE.BoxGeometry(5, 1, 1);
    const rampSupportGeometryMesh: THREE.Mesh = new THREE.Mesh(
      rampSupport,
      rampMaterial
    );
    rampSupportGeometryMesh.castShadow = true;
    rampSupportGeometryMesh.position.x = position.x;
    rampSupportGeometryMesh.position.y = 0.55;
    rampSupportGeometryMesh.position.z = position.z + 4.5;
    this.scene.add(rampSupportGeometryMesh);
    const supportShape = new CANNON.Box(new CANNON.Vec3(2.5, 0.5, 0.5));

    const supportBody = new CANNON.Body({ mass: 600 });
    supportBody.addShape(supportShape);
    supportBody.linearDamping = 0;
    supportBody.position.x = rampSupportGeometryMesh.position.x;
    supportBody.position.y = rampSupportGeometryMesh.position.y;
    supportBody.position.z = rampSupportGeometryMesh.position.z;
    this.world.addBody(supportBody);

    // RAMP

    this.ramp.position.x = position.x;
    this.ramp.position.y = 0.1;
    this.ramp.position.z = position.z;

    const rampGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(5, 0.2, 10);
    const rampGeometryMesh: THREE.Mesh = new THREE.Mesh(
      rampGeometry,
      rampMaterial
    );
    rampGeometryMesh.position.y = 0;
    rampGeometryMesh.castShadow = true;
    rampGeometryMesh.receiveShadow = true;
    this.ramp.add(rampGeometryMesh);

    this.ramp.position.x = position.x;
    this.ramp.position.y = 3;
    this.ramp.position.z = position.z;
    this.ramp.rotateX(-Math.PI / 6);

    this.scene.add(this.ramp);

    const rampBodyShape = new CANNON.Box(new CANNON.Vec3(2.5, 0.01, 5));
    this.rampBody = new CANNON.Body({ mass: 600 });
    this.rampBody.addShape(rampBodyShape);
    this.rampBody.linearDamping = 0;
    this.rampBody.position.x = this.ramp.position.x;
    this.rampBody.position.y = this.ramp.position.y;
    this.rampBody.position.z = this.ramp.position.z;
    this.rampBody.quaternion.set(
      this.ramp.quaternion.x,
      this.ramp.quaternion.y,
      this.ramp.quaternion.z,
      this.ramp.quaternion.w
    );
    this.rampBody.fixedRotation = true;
    this.world.addBody(this.rampBody);
  }

  updateRampPosition() {
    this.ramp.position.set(
      this.rampBody.position.x,
      this.rampBody.position.y,
      this.rampBody.position.z
    );

    this.ramp.quaternion.set(
      this.rampBody.quaternion.x,
      this.rampBody.quaternion.y,
      this.rampBody.quaternion.z,
      this.rampBody.quaternion.w
    );
  }
}
