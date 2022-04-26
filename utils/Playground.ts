import * as THREE from "three";
import * as CANNON from "cannon-es";

export class Playground {
  scene: THREE.Scene;
  world: CANNON.World;
  ballBody: CANNON.Body;
  ball: THREE.Mesh;
  pitchSize: { x: number; z: number; width: number; height: number };
  light: THREE.SpotLight;
  constructor(scene: THREE.Scene, world: CANNON.World) {
    this.scene = scene;
    this.world = world;
    this.pitchSize = {
      x: -48.4,
      z: 84.7,
      width: 40.5,
      height: 97.6
    };

    const ballGeometry = new THREE.SphereGeometry(1, 8, 6);
    this.ball = new THREE.Mesh(
      ballGeometry,
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        flatShading: true,
        roughness: 1
      })
    );
    this.ball.position.x = -68.5;
    this.ball.position.y = 10;
    this.ball.position.z = 36.1;
    this.ball.rotateX(Math.PI / 3.215);
    this.ball.castShadow = true;
    this.ball.receiveShadow = true;
    this.scene.add(this.ball);

    this.light = new THREE.SpotLight(0xffffff, 0.2);
    this.light.position.set(this.ball.position.x, 20, this.ball.position.z);
    this.light.castShadow = true;
    this.light.shadow.mapSize.width = 2046;
    this.light.shadow.mapSize.height = 2046;
    this.light.shadow.camera.near = 0.5;
    this.light.shadow.camera.far = 21;
    this.light.shadow.camera.fov = 20;
    this.light.penumbra = 0.3;
    this.light.target = this.ball;
    this.scene.add(this.light);

    const ballBodyShape = new CANNON.Sphere(1);
    this.ballBody = new CANNON.Body({ mass: 10000 });
    this.ballBody.addShape(ballBodyShape);
    this.ballBody.linearDamping = 0;
    this.ballBody.position.x = this.ball.position.x;
    this.ballBody.position.y = this.ball.position.y;
    this.ballBody.position.z = this.ball.position.z;
    this.ballBody.quaternion.set(
      this.ball.quaternion.x,
      this.ball.quaternion.y,
      this.ball.quaternion.z,
      this.ball.quaternion.w
    );
    this.ballBody.fixedRotation = true;
    this.world.addBody(this.ballBody);

    const goalGroupBottom = new THREE.Group();
    const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3);
    const poleMeshL = new THREE.Mesh(
      poleGeometry,
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        flatShading: true,
        roughness: 1
      })
    );
    poleMeshL.position.y = 1.5;
    poleMeshL.castShadow = true;

    const poleMeshR = new THREE.Mesh(
      poleGeometry,
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        flatShading: true,
        roughness: 1
      })
    );
    poleMeshR.position.y = 1.5;
    poleMeshR.position.x = -15.9;
    poleMeshR.castShadow = true;
    const poleTopGeometry = new THREE.CylinderGeometry(0.2, 0.2, 15.9);
    const poleMeshTop = new THREE.Mesh(
      poleTopGeometry,
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        flatShading: true,
        roughness: 1
      })
    );
    poleMeshTop.rotateZ(Math.PI / 2);
    poleMeshTop.position.y = 3;
    poleMeshTop.position.x = -7.95;
    poleMeshTop.castShadow = true;

    const goalGeometry = new THREE.BoxGeometry(15.9, 3, 5, 15.9, 3, 5);
    const materialTransparent = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      wireframe: true,
      side: THREE.DoubleSide
    });
    const wireframeMaterial = new THREE.MeshStandardMaterial({
      color: 0xa9a9a9,
      wireframe: true,
      wireframeLinewidth: 0.1
    });

    const goalMesh = new THREE.Mesh(goalGeometry, [
      wireframeMaterial,

      wireframeMaterial,

      wireframeMaterial,
      materialTransparent,
      materialTransparent,
      wireframeMaterial
    ]);
    goalMesh.position.x = -7.95;
    goalMesh.position.y = 1.5;
    goalMesh.position.z = -2.5;
    goalMesh.castShadow = true;

    goalGroupBottom.add(poleMeshL);
    goalGroupBottom.add(poleMeshR);
    goalGroupBottom.add(poleMeshTop);
    goalGroupBottom.add(goalMesh);
    goalGroupBottom.position.x = -60.6;
    goalGroupBottom.position.z = -12.7;
    this.scene.add(goalGroupBottom);

    const goalGroupTop = goalGroupBottom.clone();
    goalGroupTop.rotateY(Math.PI);
    goalGroupTop.position.x = -76.5;
    goalGroupTop.position.z = 84.7;

    this.scene.add(goalGroupTop);
  }
  checkOutOfPitch = (postion: { x: number; z: number }) => {
    if (
      postion.x > this.pitchSize.x + 1 ||
      postion.x < this.pitchSize.x - this.pitchSize.width - 1
    ) {
      return true;
    } else if (
      postion.z > this.pitchSize.z + 1 ||
      postion.z < this.pitchSize.z - this.pitchSize.height - 1
    ) {
      return true;
    } else {
      return false;
    }
  };

  updateBallPosition() {
    const outOfBound = this.checkOutOfPitch({
      x: this.ballBody.position.x,
      z: this.ballBody.position.z
    });
    if (!outOfBound) {
      this.ball.position.set(
        this.ballBody.position.x,
        this.ballBody.position.y,
        this.ballBody.position.z
      );
      this.light.position.set(
        this.ballBody.position.x,
        20,
        this.ballBody.position.z
      );
      this.ball.quaternion.set(
        this.ballBody.quaternion.x,
        this.ballBody.quaternion.y,
        this.ballBody.quaternion.z,
        this.ballBody.quaternion.w
      );
    } else {
      this.ball.position.set(-68.5, 19, 36.1);
      this.light.position.set(-68.5, 20, 36.1);
      this.ballBody.inertia = new CANNON.Vec3(0, 0, 0);
      this.ballBody.force = new CANNON.Vec3(0, 0, 0);
      this.ballBody.angularVelocity = new CANNON.Vec3(0, 0, 0);
      this.ballBody.velocity = new CANNON.Vec3(0, 0, 0);
      this.ballBody.position.x = this.ball.position.x;
      this.ballBody.position.y = this.ball.position.y;
      this.ballBody.position.z = this.ball.position.z;
      this.ballBody.quaternion.set(
        this.ball.quaternion.x,
        this.ball.quaternion.y,
        this.ball.quaternion.z,
        this.ball.quaternion.w
      );
    }
  }
}
