import * as THREE from "three";
import * as CANNON from "cannon-es";

export class Car {
  car: THREE.Group;
  type: string;
  scene: THREE.Scene;
  world: CANNON.World;
  carBody: CANNON.Body;
  wheelLBMesh: THREE.Mesh;
  wheelRBMesh: THREE.Mesh;
  wheelLFMesh: THREE.Mesh;
  wheelRFMesh: THREE.Mesh;
  wheelLBBody: CANNON.Body | undefined;
  wheelRBBody: CANNON.Body | undefined;
  wheelLFBody: CANNON.Body | undefined;
  wheelRFBody: CANNON.Body | undefined;
  constraintLF: CANNON.HingeConstraint | undefined;
  constraintRF: CANNON.HingeConstraint | undefined;
  constraintLB: CANNON.HingeConstraint | undefined;
  constraintRB: CANNON.HingeConstraint | undefined;

  constructor(scene: THREE.Scene, world: CANNON.World, type: string) {
    this.car = new THREE.Group();
    this.scene = scene;
    this.world = world;
    this.type = type;
    const carBodyGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(1, 0.5, 2);
    const carBodyMesh: THREE.Mesh = new THREE.Mesh(
      carBodyGeometry,
      new THREE.MeshLambertMaterial({ color: 0xff0000 })
    );
    carBodyMesh.position.y = -0.25;
    carBodyMesh.castShadow = true;
    this.car.add(carBodyMesh);
    const carCabinMesh: THREE.Mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.4, 1),
      new THREE.MeshLambertMaterial({ color: 0xffffff })
    );
    carCabinMesh.position.y = 0.05;
    carCabinMesh.position.z = 0.4;
    carCabinMesh.castShadow = true;

    this.car.position.y = 4;
    this.car.add(carCabinMesh);
    this.scene.add(this.car);

    const carBodyShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 1));
    this.carBody = new CANNON.Body({ mass: 50 });
    this.carBody.addShape(carBodyShape);
    this.carBody.linearDamping = 0.05;
    this.carBody.position.x = this.car.position.x;
    this.carBody.position.y = this.car.position.y;
    this.carBody.position.z = this.car.position.z;
    this.world.addBody(this.carBody);

    //attach wheels
    const wheelMaterial = new CANNON.Material("wheelMaterial");
    wheelMaterial.friction = 0.25;
    wheelMaterial.restitution = 0.25;
    const wheelMeshMaterial = new THREE.MeshLambertMaterial({
      color: 0x000000
    });

    const wheelLFGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
      0.22,
      0.22,
      0.15,
      20
    );
    wheelLFGeometry.rotateZ(Math.PI / 2);
    this.wheelLFMesh = new THREE.Mesh(wheelLFGeometry, wheelMeshMaterial);
    this.wheelLFMesh.position.x = -3;
    this.wheelLFMesh.position.y = 1;
    this.wheelLFMesh.position.z = -0.5;
    this.wheelLFMesh.castShadow = true;
    this.scene.add(this.wheelLFMesh);

    // wheel geometries
    const wheelRFGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
      0.22,
      0.22,
      0.15,
      20
    );
    wheelRFGeometry.rotateZ(Math.PI / 2);
    this.wheelRFMesh = new THREE.Mesh(wheelRFGeometry, wheelMeshMaterial);
    this.wheelRFMesh.position.y = 3;
    this.wheelRFMesh.position.x = 0.5;
    this.wheelRFMesh.position.z = -0.5;
    this.wheelRFMesh.castShadow = true;
    this.scene.add(this.wheelRFMesh);
    const wheelLBGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
      0.22,
      0.22,
      0.2,
      20
    );
    wheelLBGeometry.rotateZ(Math.PI / 2);
    this.wheelLBMesh = new THREE.Mesh(wheelLBGeometry, wheelMeshMaterial);
    this.wheelLBMesh.position.y = 3;
    this.wheelLBMesh.position.x = -0.5;
    this.wheelLBMesh.position.z = 0.5;
    this.wheelLBMesh.castShadow = true;
    this.scene.add(this.wheelLBMesh);
    const wheelRBGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
      0.22,
      0.22,
      0.2,
      20
    );
    wheelRBGeometry.rotateZ(Math.PI / 2);
    this.wheelRBMesh = new THREE.Mesh(wheelRBGeometry, wheelMeshMaterial);
    this.wheelRBMesh.position.y = 3;
    this.wheelRBMesh.position.x = 0.5;
    this.wheelRBMesh.position.z = 0.5;
    this.wheelRBMesh.castShadow = true;
    this.scene.add(this.wheelRBMesh);

    // wheel bodies
    if (this.type === "host") {
      const wheelLFShape = new CANNON.Sphere(0.22);
      this.wheelLFBody = new CANNON.Body({ mass: 1, material: wheelMaterial });
      this.wheelLFBody.addShape(wheelLFShape);
      this.wheelLFBody.position.x = this.wheelLFMesh.position.x;
      this.wheelLFBody.position.y = this.wheelLFMesh.position.y;
      this.wheelLFBody.position.z = this.wheelLFMesh.position.z;
      this.world.addBody(this.wheelLFBody);

      const wheelRFShape = new CANNON.Sphere(0.22);
      this.wheelRFBody = new CANNON.Body({ mass: 1, material: wheelMaterial });
      this.wheelRFBody.addShape(wheelRFShape);
      this.wheelRFBody.position.x = this.wheelRFMesh.position.x;
      this.wheelRFBody.position.y = this.wheelRFMesh.position.y;
      this.wheelRFBody.position.z = this.wheelRFMesh.position.z;
      this.world.addBody(this.wheelRFBody);

      const wheelLBShape = new CANNON.Sphere(0.22);
      this.wheelLBBody = new CANNON.Body({ mass: 1, material: wheelMaterial });
      this.wheelLBBody.addShape(wheelLBShape);
      this.wheelLBBody.position.x = this.wheelLBMesh.position.x;
      this.wheelLBBody.position.y = this.wheelLBMesh.position.y;
      this.wheelLBBody.position.z = this.wheelLBMesh.position.z;
      this.world.addBody(this.wheelLBBody);

      const wheelRBShape = new CANNON.Sphere(0.22);
      this.wheelRBBody = new CANNON.Body({ mass: 1, material: wheelMaterial });
      this.wheelRBBody.addShape(wheelRBShape);
      this.wheelRBBody.position.x = this.wheelRBMesh.position.x;
      this.wheelRBBody.position.y = this.wheelRBMesh.position.y;
      this.wheelRBBody.position.z = this.wheelRBMesh.position.z;
      this.world.addBody(this.wheelRBBody);

      const leftFrontAxis = new CANNON.Vec3(1, 0, 0);
      const rightFrontAxis = new CANNON.Vec3(1, 0, 0);
      const leftBackAxis = new CANNON.Vec3(1, 0, 0);
      const rightBackAxis = new CANNON.Vec3(1, 0, 0);

      this.constraintLF = new CANNON.HingeConstraint(
        this.carBody,
        this.wheelLFBody,
        {
          pivotA: new CANNON.Vec3(-0.5, -0.5, -0.7),
          axisA: leftFrontAxis,
          maxForce: 1e6
        }
      );
      this.world.addConstraint(this.constraintLF);
      this.constraintRF = new CANNON.HingeConstraint(
        this.carBody,
        this.wheelRFBody,
        {
          pivotA: new CANNON.Vec3(0.5, -0.5, -0.7),
          axisA: rightFrontAxis,
          maxForce: 1e6
        }
      );
      this.world.addConstraint(this.constraintRF);
      this.constraintLB = new CANNON.HingeConstraint(
        this.carBody,
        this.wheelLBBody,
        {
          pivotA: new CANNON.Vec3(-0.5, -0.5, 0.7),
          axisA: leftBackAxis,
          maxForce: 1e6
        }
      );
      this.world.addConstraint(this.constraintLB);
      this.constraintRB = new CANNON.HingeConstraint(
        this.carBody,
        this.wheelRBBody,
        {
          pivotA: new CANNON.Vec3(0.5, -0.5, 0.7),
          axisA: rightBackAxis,
          maxForce: 1e6
        }
      );
      this.world.addConstraint(this.constraintRB);
      //rear wheel drive
      this.constraintLB.enableMotor();
      this.constraintRB.enableMotor();
    }
  }

  addChaseCam(chaseCam: THREE.Object3D) {
    this.car.add(chaseCam);
  }

  updateCarPosition(
    carPosition?: THREE.Vector3,
    carRotation?: THREE.Quaternion,
    wheelPosition?: {
      LF: THREE.Vector3;
      RF: THREE.Vector3;
      LB: THREE.Vector3;
      RB: THREE.Vector3;
    },
    wheelRotation?: {
      LF: THREE.Quaternion;
      RF: THREE.Quaternion;
      LB: THREE.Quaternion;
      RB: THREE.Quaternion;
    }
  ) {
    if (carPosition && carRotation && wheelPosition && wheelRotation) {
      if (this.car.position !== carPosition) {
        this.car.position.set(carPosition.x, carPosition.y, carPosition.z);
        this.car.quaternion.set(
          carRotation.x,
          carRotation.y,
          carRotation.z,
          carRotation.w
        );
        this.carBody.position.set(carPosition.x, carPosition.y, carPosition.z);
        this.carBody.quaternion.set(
          carRotation.x,
          carRotation.y,
          carRotation.z,
          carRotation.w
        );
        this.wheelLFMesh.position.set(
          wheelPosition.LF.x,
          wheelPosition.LF.y,
          wheelPosition.LF.z
        );
        this.wheelLFMesh.quaternion.set(
          wheelRotation.LF.x,
          wheelRotation.LF.y,
          wheelRotation.LF.z,
          wheelRotation.LF.w
        );
        this.wheelRFMesh.position.set(
          wheelPosition.RF.x,
          wheelPosition.RF.y,
          wheelPosition.RF.z
        );
        this.wheelRFMesh.quaternion.set(
          wheelRotation.RF.x,
          wheelRotation.RF.y,
          wheelRotation.RF.z,
          wheelRotation.RF.w
        );
        this.wheelLBMesh.position.set(
          wheelPosition.LB.x,
          wheelPosition.LB.y,
          wheelPosition.LB.z
        );
        this.wheelLBMesh.quaternion.set(
          wheelRotation.LB.x,
          wheelRotation.LB.y,
          wheelRotation.LB.z,
          wheelRotation.LB.w
        );
        this.wheelRBMesh.position.set(
          wheelPosition.RB.x,
          wheelPosition.RB.y,
          wheelPosition.RB.z
        );
        this.wheelRBMesh.quaternion.set(
          wheelRotation.RB.x,
          wheelRotation.RB.y,
          wheelRotation.RB.z,
          wheelRotation.RB.w
        );
        return true;
      } else {
        return false;
      }
    } else if (
      this.wheelLFBody &&
      this.wheelRFBody &&
      this.wheelLBBody &&
      this.wheelRBBody
    ) {
      if (
        this.car.position.x !== this.carBody.position.x &&
        this.car.position.y !== this.carBody.position.y &&
        this.car.position.z !== this.carBody.position.z
      ) {
        this.car.position.set(
          this.carBody.position.x,
          this.carBody.position.y,
          this.carBody.position.z
        );

        this.car.quaternion.set(
          this.carBody.quaternion.x,
          this.carBody.quaternion.y,
          this.carBody.quaternion.z,
          this.carBody.quaternion.w
        );

        this.car.quaternion.set(
          this.carBody.quaternion.x,
          this.carBody.quaternion.y,
          this.carBody.quaternion.z,
          this.carBody.quaternion.w
        );

        this.wheelLFMesh.position.set(
          this.wheelLFBody.position.x,
          this.wheelLFBody.position.y,
          this.wheelLFBody.position.z
        );
        this.wheelLFMesh.quaternion.set(
          this.wheelLFBody.quaternion.x,
          this.wheelLFBody.quaternion.y,
          this.wheelLFBody.quaternion.z,
          this.wheelLFBody.quaternion.w
        );

        this.wheelRFMesh.position.set(
          this.wheelRFBody.position.x,
          this.wheelRFBody.position.y,
          this.wheelRFBody.position.z
        );
        this.wheelRFMesh.quaternion.set(
          this.wheelRFBody.quaternion.x,
          this.wheelRFBody.quaternion.y,
          this.wheelRFBody.quaternion.z,
          this.wheelRFBody.quaternion.w
        );

        this.wheelLBMesh.position.set(
          this.wheelLBBody.position.x,
          this.wheelLBBody.position.y,
          this.wheelLBBody.position.z
        );
        this.wheelLBMesh.quaternion.set(
          this.wheelLBBody.quaternion.x,
          this.wheelLBBody.quaternion.y,
          this.wheelLBBody.quaternion.z,
          this.wheelLBBody.quaternion.w
        );

        this.wheelRBMesh.position.set(
          this.wheelRBBody.position.x,
          this.wheelRBBody.position.y,
          this.wheelRBBody.position.z
        );
        this.wheelRBMesh.quaternion.set(
          this.wheelRBBody.quaternion.x,
          this.wheelRBBody.quaternion.y,
          this.wheelRBBody.quaternion.z,
          this.wheelRBBody.quaternion.w
        );
        return true;
      } else {
        return false;
      }
    }
  }

  removeCar() {
    this.scene.remove(this.car);
    this.scene.remove(this.wheelLBMesh);
    this.scene.remove(this.wheelRBMesh);
    this.scene.remove(this.wheelLFMesh);
    this.scene.remove(this.wheelRFMesh);
    this.world.removeBody(this.carBody);
    if (this.wheelLBBody) this.world.removeBody(this.wheelLBBody);
    if (this.wheelRBBody) this.world.removeBody(this.wheelRBBody);
    if (this.wheelLFBody) this.world.removeBody(this.wheelLFBody);
    if (this.wheelRFBody) this.world.removeBody(this.wheelRFBody);
    if (this.constraintLF) this.world.removeConstraint(this.constraintLF);
    if (this.constraintRF) this.world.removeConstraint(this.constraintRF);
    if (this.constraintLB) this.world.removeConstraint(this.constraintLB);
    if (this.constraintRB) this.world.removeConstraint(this.constraintRB);
  }
}
