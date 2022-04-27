import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Dispatch, SetStateAction } from "react";

export class GamePlayground {
  scene: THREE.Scene;
  world: CANNON.World;
  ballBody: CANNON.Body;
  ball: THREE.Mesh;
  pitchSize: { x: number; z: number; width: number; height: number };
  light: THREE.SpotLight;
  goalLeftSize: { x: number; z: number; width: number; height: number };
  goalRightSize: { x: number; z: number; width: number; height: number };
  setScore: Dispatch<SetStateAction<number[]>>;
  constructor(
    scene: THREE.Scene,
    world: CANNON.World,
    setScore: Dispatch<SetStateAction<number[]>>
  ) {
    this.scene = scene;
    this.world = world;
    this.pitchSize = {
      x: 48.8,
      z: 20.2,
      width: 97.6,
      height: 40.5
    };
    this.setScore = setScore;

    const ballGeometry = new THREE.SphereGeometry(1, 8, 6);
    this.ball = new THREE.Mesh(
      ballGeometry,
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        flatShading: true,
        roughness: 1
      })
    );
    this.ball.position.x = 0;
    this.ball.position.y = 10;
    this.ball.position.z = 0;
    this.ball.rotateX(Math.PI / 3.215);
    this.ball.castShadow = true;
    this.ball.receiveShadow = true;
    this.scene.add(this.ball);

    this.light = new THREE.SpotLight(0xffffff, 0.2);
    this.light.position.set(this.ball.position.x, 20, this.ball.position.z);
    this.light.castShadow = true;
    this.light.shadow.mapSize.width = 512;
    this.light.shadow.mapSize.height = 512;
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

    const goalGroupRight = new THREE.Group();
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

    goalGroupRight.add(poleMeshL);
    goalGroupRight.add(poleMeshR);
    goalGroupRight.add(poleMeshTop);
    goalGroupRight.add(goalMesh);
    goalGroupRight.position.x = -48.8;
    goalGroupRight.position.z = -8;
    const goalGroupLeft = goalGroupRight.clone();
    goalGroupRight.rotateY(Math.PI / 2);
    this.scene.add(goalGroupRight);

    this.goalRightSize = {
      x: goalGroupRight.position.x,
      z: goalGroupRight.position.z,
      width: 15.9,
      height: 5
    };

    goalGroupLeft.position.x = 48.8;
    goalGroupLeft.position.z = -8 + 15.9;
    goalGroupLeft.rotateY(-Math.PI / 2);

    this.goalLeftSize = {
      x: goalGroupLeft.position.x,
      z: -8,
      width: 15.9,
      height: 5
    };

    this.scene.add(goalGroupLeft);
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

  checkGoal = (postion: { x: number; z: number }) => {
    if (
      postion.x < this.goalRightSize.x &&
      postion.x > this.goalRightSize.x - this.goalRightSize.height &&
      postion.z > this.goalRightSize.z &&
      postion.z < this.goalRightSize.z + this.goalRightSize.width
    ) {
      return "goalRight";
    } else if (
      postion.x > this.goalLeftSize.x &&
      postion.x < this.goalLeftSize.x + this.goalLeftSize.height &&
      postion.z > this.goalLeftSize.z &&
      postion.z < this.goalLeftSize.z + this.goalLeftSize.width
    ) {
      return "goalLeft";
    } else {
      return false;
    }
  };

  resetBall = () => {
    this.ball.position.set(0, 19, 0);
    this.light.position.set(0, 20, 0);
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
  };

  updateBallPosition() {
    const outOfBound = this.checkOutOfPitch({
      x: this.ballBody.position.x,
      z: this.ballBody.position.z
    });

    const goal = this.checkGoal({
      x: this.ballBody.position.x,
      z: this.ballBody.position.z
    });

    if (goal !== false) {
      const teamIndex = goal === "goalRight" ? 1 : 0;
      this.setScore((preState) => {
        const newScore = [...preState];
        newScore[teamIndex] += 1;
        return newScore;
      });
      this.resetBall();
    } else if (!outOfBound) {
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
      this.resetBall();
    }
  }
}
