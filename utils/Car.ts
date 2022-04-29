import * as THREE from "three";
import * as CANNON from "cannon-es";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

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
  labelBox: HTMLDivElement;
  label: HTMLDivElement;
  messageTimeout: NodeJS.Timeout | null | undefined;
  carType: string;
  userName: string | null;
  constructor(
    scene: THREE.Scene,
    world: CANNON.World,
    type: string,
    carType: string,
    loaderManager: THREE.LoadingManager,
    userName: string | null,
    carPosition?: THREE.Vector3
  ) {
    this.carType = carType;
    let carBodyColor: number;
    let carMass: number;
    let carBodyHeight: number;
    let wheelConstraintHeight: number;
    let bodyHeightOffset: number;
    this.userName = userName !== "unknown" ? userName : null;
    switch (this.carType) {
      case "pickup":
        carBodyColor = 0xffbd00;
        carMass = 700;
        carBodyHeight = 0.4;
        wheelConstraintHeight = -0.5;
        bodyHeightOffset = -0.2;
        break;
      case "sedan":
        carBodyColor = 0xfefefe;
        carMass = 500;
        carBodyHeight = 0.3;
        wheelConstraintHeight = -0.4;
        bodyHeightOffset = -0.2;
        break;
      case "jeep":
        carBodyColor = 0x68cbf8;
        carMass = 800;
        carBodyHeight = 0.5;
        wheelConstraintHeight = -0.6;
        bodyHeightOffset = -0.35;
        break;
      default:
        carBodyColor = 0x9e0059;
        carMass = 500;
        carBodyHeight = 0.4;
        wheelConstraintHeight = -0.5;
        bodyHeightOffset = -0.2;
    }

    this.car = new THREE.Group();
    const loader = new OBJLoader(loaderManager);

    loader.load(`/models/${this.carType}.obj`, (obj) => {
      obj.children.forEach((mesh) => {
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        if (mesh.name.includes("body"))
          // @ts-ignore
          mesh.material = new THREE.MeshPhysicalMaterial({
            metalness: 0,
            roughness: 1,
            reflectivity: 0.2,
            color: carBodyColor
          });
        if (mesh.name.includes("wheel"))
          // @ts-ignore
          mesh.material = new THREE.MeshLambertMaterial({
            color: 0x000000
          });
        if (mesh.name.includes("headlight"))
          // @ts-ignore
          mesh.material = new THREE.MeshLambertMaterial({
            color: 0xfafd0f
          });
        if (mesh.name.includes("taillight"))
          // @ts-ignore
          mesh.material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        if (mesh.name.includes("bumper"))
          // @ts-ignore
          mesh.material = new THREE.MeshStandardMaterial({ color: 0xffffff });

        if (mesh.name.includes("window"))
          // @ts-ignore
          mesh.material = new THREE.MeshPhysicalMaterial({
            metalness: 0,
            roughness: 0.1,
            transmission: 1,
            reflectivity: 0.5,
            envMapIntensity: 1,
            clearcoat: 0.2,
            clearcoatRoughness: 0.1,
            color: 0xffffff
          });
      });
      obj.position.y = bodyHeightOffset;
      this.car.add(obj);
    });

    this.scene = scene;
    this.world = world;
    this.type = type;
    this.labelBox = document.createElement("div");
    this.label = document.createElement("div");
    // const carBodyGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(1, 0.5, 2);
    // const carBodyMesh: THREE.Mesh = new THREE.Mesh(
    //   carBodyGeometry,
    //   new THREE.MeshLambertMaterial({ color: 0xff0000 })
    // );
    // carBodyMesh.position.y = -0.25;
    // carBodyMesh.castShadow = true;
    // carBodyMesh.receiveShadow = true;
    // this.car.add(carBodyMesh);
    // const carCabinMesh: THREE.Mesh = new THREE.Mesh(
    //   new THREE.BoxGeometry(0.9, 0.4, 1),
    //   new THREE.MeshLambertMaterial({ color: 0xffffff })
    // );
    // carCabinMesh.position.y = 0.05;
    // carCabinMesh.position.z = 0.4;
    // carCabinMesh.castShadow = true;
    this.car.layers.enableAll();
    this.labelBox.className = "labelBox";
    this.labelBox.appendChild(this.label);
    this.label.textContent = "";
    this.label.className = "label";

    const label = new CSS2DObject(this.labelBox);
    label.position.set(0, 0, 0);
    this.car.add(label);
    label.layers.set(0);

    if (carPosition) {
      this.car.position.copy(carPosition);
    } else {
      this.car.position.y = 0.5;
      this.car.position.x = Math.floor(Math.random() * 20) - 10;
      this.car.position.z = Math.floor(Math.random() * 20) - 10;
    }

    // heade lights
    const headlightL = new THREE.SpotLight(0xffffff, 0.5);
    const headlightLChaseL = new THREE.Object3D();
    headlightLChaseL.position.set(-0.5, -0.3, -100);
    headlightL.position.set(-0.5, -0.2, -0.5);
    headlightL.target = headlightLChaseL;
    headlightL.shadow.mapSize.width = 512;
    headlightL.shadow.mapSize.height = 512;
    headlightL.shadow.camera.near = 0.5;
    headlightL.shadow.camera.far = 20;
    headlightL.shadow.camera.fov = 5;
    headlightL.shadow.blurSamples = 10;
    headlightL.angle = Math.PI / 5;
    headlightL.decay = 0.5;
    headlightL.penumbra = 0.5;
    headlightL.intensity = 0.5;
    this.car.add(headlightL);
    this.car.add(headlightL.target);
    // const spotLightHelperL = new THREE.SpotLightHelper(headlightL);
    // this.scene.add(spotLightHelperL);

    const headlightR = new THREE.SpotLight(0xffffff, 0.5);
    const headlightLChaseR = new THREE.Object3D();
    headlightLChaseR.position.set(0.5, -0.3, -100);
    headlightR.position.set(0.5, -0.2, -0.5);
    headlightR.target = headlightLChaseR;
    headlightR.shadow.mapSize.width = 512;
    headlightR.shadow.mapSize.height = 512;
    headlightR.shadow.camera.near = 0.5;
    headlightR.shadow.camera.far = 20;
    headlightR.shadow.camera.fov = 5;
    headlightR.shadow.blurSamples = 10;
    headlightR.angle = Math.PI / 6;
    headlightR.decay = 0.5;
    headlightR.penumbra = 0.5;
    headlightR.intensity = 0.5;
    this.car.add(headlightR);
    this.car.add(headlightR.target);
    // const spotLightHelper = new THREE.SpotLightHelper(headlightR);
    // this.scene.add(spotLightHelper);

    // this.car.add(carCabinMesh);

    this.scene.add(this.car);

    const carBodyShape = new CANNON.Box(new CANNON.Vec3(0.6, carBodyHeight, 1));
    this.carBody = new CANNON.Body({ mass: carMass });
    this.carBody.addShape(carBodyShape);
    this.carBody.linearDamping = 0;
    this.carBody.position.x = this.car.position.x;
    this.carBody.position.y = this.car.position.y;
    this.carBody.position.z = this.car.position.z;
    this.world.addBody(this.carBody);

    //attach wheels
    const wheelMaterial = new CANNON.Material("wheelMaterial");
    wheelMaterial.friction = 0.5;
    wheelMaterial.restitution = 0.5;
    const wheelMeshMaterial = new THREE.MeshLambertMaterial({
      color: 0x000000
    });
    const wheelLFGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
      0.22,
      0.22,
      0.2,
      20
    );
    wheelLFGeometry.rotateZ(Math.PI / 2);
    this.wheelLFMesh = new THREE.Mesh(wheelLFGeometry, wheelMeshMaterial);
    if (type === "remote") {
      this.wheelLFMesh.position.x = -0.5;
      this.wheelLFMesh.position.y = -0.5;
      this.wheelLFMesh.position.z = -0.6;
    } else {
      this.wheelLFMesh.position.x = this.car.position.x - 0.5;
      this.wheelLFMesh.position.y = 0.5;
      this.wheelLFMesh.position.z = this.car.position.z - 0.6;
    }
    this.wheelLFMesh.castShadow = true;
    // wheel geometries
    const wheelRFGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
      0.22,
      0.22,
      0.2,
      20
    );
    wheelRFGeometry.rotateZ(Math.PI / 2);
    this.wheelRFMesh = new THREE.Mesh(wheelRFGeometry, wheelMeshMaterial);
    if (type === "remote") {
      this.wheelRFMesh.position.x = 0.5;
      this.wheelRFMesh.position.y = -0.5;
      this.wheelRFMesh.position.z = -0.6;
    } else {
      this.wheelRFMesh.position.x = this.car.position.x + 0.5;
      this.wheelRFMesh.position.y = 0.5;
      this.wheelRFMesh.position.z = this.car.position.z - 0.6;
    }
    this.wheelRFMesh.castShadow = true;
    const wheelLBGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
      0.22,
      0.22,
      0.25,
      20
    );
    wheelLBGeometry.rotateZ(Math.PI / 2);
    this.wheelLBMesh = new THREE.Mesh(wheelLBGeometry, wheelMeshMaterial);
    if (type === "remote") {
      this.wheelLBMesh.position.x = -0.5;
      this.wheelLBMesh.position.y = -0.5;
      this.wheelLBMesh.position.z = 0.6;
    } else {
      this.wheelLBMesh.position.x = this.car.position.x - 0.5;
      this.wheelLBMesh.position.y = 0.5;
      this.wheelLBMesh.position.z = this.car.position.z + 0.6;
    }
    this.wheelLBMesh.castShadow = true;
    const wheelRBGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
      0.22,
      0.22,
      0.25,
      20
    );
    wheelRBGeometry.rotateZ(Math.PI / 2);
    this.wheelRBMesh = new THREE.Mesh(wheelRBGeometry, wheelMeshMaterial);
    if (type === "remote") {
      this.wheelRBMesh.position.x = 0.5;
      this.wheelRBMesh.position.y = -0.5;
      this.wheelRBMesh.position.z = 0.6;
    } else {
      this.wheelRBMesh.position.x = this.car.position.x + 0.5;
      this.wheelRBMesh.position.y = 0.5;
      this.wheelRBMesh.position.z = this.car.position.z + 0.6;
    }
    this.wheelRBMesh.castShadow = true;

    if (type === "host") {
      this.scene.add(this.wheelRFMesh);
      this.scene.add(this.wheelLFMesh);
      this.scene.add(this.wheelRBMesh);
      this.scene.add(this.wheelLBMesh);
    } else {
      this.car.add(this.wheelRFMesh);
      this.car.add(this.wheelLFMesh);
      this.car.add(this.wheelRBMesh);
      this.car.add(this.wheelLBMesh);
    }

    // wheel bodies
    if (type === "host") {
      const wheelLFShape = new CANNON.Sphere(0.22);
      this.wheelLFBody = new CANNON.Body({
        mass: 500,
        material: wheelMaterial
      });
      this.wheelLFBody.addShape(wheelLFShape);
      this.wheelLFBody.position.x = this.wheelLFMesh.position.x;
      this.wheelLFBody.position.y = this.wheelLFMesh.position.y;
      this.wheelLFBody.position.z = this.wheelLFMesh.position.z;
      this.world.addBody(this.wheelLFBody);

      const wheelRFShape = new CANNON.Sphere(0.22);
      this.wheelRFBody = new CANNON.Body({
        mass: 500,
        material: wheelMaterial
      });
      this.wheelRFBody.addShape(wheelRFShape);
      this.wheelRFBody.position.x = this.wheelRFMesh.position.x;
      this.wheelRFBody.position.y = this.wheelRFMesh.position.y;
      this.wheelRFBody.position.z = this.wheelRFMesh.position.z;
      this.world.addBody(this.wheelRFBody);

      const wheelLBShape = new CANNON.Sphere(0.22);
      this.wheelLBBody = new CANNON.Body({
        mass: 600,
        material: wheelMaterial
      });
      this.wheelLBBody.addShape(wheelLBShape);
      this.wheelLBBody.position.x = this.wheelLBMesh.position.x;
      this.wheelLBBody.position.y = this.wheelLBMesh.position.y;
      this.wheelLBBody.position.z = this.wheelLBMesh.position.z;
      this.world.addBody(this.wheelLBBody);

      const wheelRBShape = new CANNON.Sphere(0.22);
      this.wheelRBBody = new CANNON.Body({
        mass: 600,
        material: wheelMaterial
      });
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
          pivotA: new CANNON.Vec3(-0.5, wheelConstraintHeight, -0.6),
          axisA: leftFrontAxis,
          maxForce: 1e6
        }
      );
      this.world.addConstraint(this.constraintLF);
      this.constraintRF = new CANNON.HingeConstraint(
        this.carBody,
        this.wheelRFBody,
        {
          pivotA: new CANNON.Vec3(0.5, wheelConstraintHeight, -0.6),
          axisA: rightFrontAxis,
          maxForce: 1e6
        }
      );
      this.world.addConstraint(this.constraintRF);
      this.constraintLB = new CANNON.HingeConstraint(
        this.carBody,
        this.wheelLBBody,
        {
          pivotA: new CANNON.Vec3(-0.5, wheelConstraintHeight, 0.6),
          axisA: leftBackAxis,
          maxForce: 1e6
        }
      );
      this.world.addConstraint(this.constraintLB);
      this.constraintRB = new CANNON.HingeConstraint(
        this.carBody,
        this.wheelRBBody,
        {
          pivotA: new CANNON.Vec3(0.5, wheelConstraintHeight, 0.6),
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

  addMessage(msg: string) {
    this.label.textContent = msg;
    this.labelBox.classList.add("show");
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
    this.messageTimeout = setTimeout(
      () => {
        this.label.textContent = "";
        this.labelBox.classList.remove("show");
      },
      msg.length < 5 ? 5000 : msg.length * 1000
    );
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
      this.car.position.lerp(carPosition, 0.1);
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
    } else if (
      this.wheelLFBody &&
      this.wheelRFBody &&
      this.wheelLBBody &&
      this.wheelRBBody
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
