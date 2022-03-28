import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";

// import { GUI } from "dat.gui";
import * as CANNON from "cannon-es";
import CannonDebugRenderer from "./cannonDebugRenderer";
import { RefObject } from "react";
import { Car } from "./Car";

export class CarPool {
  scene: THREE.Scene;
  activeCars: { id: any; carObj: Car; body: CANNON.Body }[] = [];
  socketId: string | undefined;
  world: CANNON.World;
  constructor(canvasRef: RefObject<HTMLCanvasElement>, socket: any) {
    this.socketId = socket.id;
    if (!canvasRef.current) {
      throw Error("Canvas ref is not defined");
    }
    this.scene = new THREE.Scene();

    const light = new THREE.DirectionalLight();
    light.position.set(50, 100, 25);
    light.castShadow = true;
    light.shadow.mapSize.width = 16384;
    light.shadow.mapSize.height = 16384;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;
    let d = 120;
    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;

    this.scene.fog = new THREE.FogExp2(0xdaa520, 0.008);

    this.scene.add(light);

    const HemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.1);
    this.scene.add(HemisphereLight);

    // const helper = new THREE.CameraHelper(light.shadow.camera);
    // this.scene.add(helper);

    const camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const chaseCam = new THREE.Object3D();
    chaseCam.position.set(0, 100, 0);
    chaseCam.name = "chaseCam";
    const chaseCamPivot = new THREE.Object3D();
    chaseCamPivot.position.set(0, 0, 0);
    chaseCamPivot.name = "chaseCamPivot";
    chaseCam.add(chaseCamPivot);
    this.scene.add(chaseCam);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    this.world = new CANNON.World();
    this.world.gravity.set(0, -60, 0);

    const groundMaterial = new CANNON.Material("groundMaterial");
    groundMaterial.friction = 0.35;
    groundMaterial.restitution = 0.25;

    const wheelMaterial = new CANNON.Material("wheelMaterial");
    wheelMaterial.friction = 0.35;
    wheelMaterial.restitution = 0.35;

    //ground
    const groundGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(
      500,
      500
    );
    const getImage = (): THREE.MeshBasicMaterial => {
      var loader = new THREE.TextureLoader();
      var texture = loader.load("info.jpeg");
      var material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        opacity: 1
      });
      return material;
    };
    const imageMaterial = getImage();
    const shadowMaterial = new THREE.ShadowMaterial();
    shadowMaterial.opacity = 0.5;
    const groundMesh: THREE.Mesh = new THREE.Mesh(
      groundGeometry,
      shadowMaterial
    );
    groundMesh.rotateX(-Math.PI / 2);
    groundMesh.position.x = 0;
    groundMesh.position.y = 0.1;
    groundMesh.position.z = 0;
    groundMesh.receiveShadow = true;
    this.scene.add(groundMesh);
    const groundShape = new CANNON.Box(new CANNON.Vec3(500, 1, 500));
    const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
    groundBody.addShape(groundShape);
    groundBody.position.set(0, -1, 0);
    this.world.addBody(groundBody);

    const groundGeometry2: THREE.PlaneGeometry = new THREE.PlaneGeometry(
      500,
      500
    );
    const groundMesh2: THREE.Mesh = new THREE.Mesh(
      groundGeometry2,
      imageMaterial
    );
    groundMesh2.rotateX(-Math.PI / 2);
    groundMesh2.position.x = 0;
    groundMesh2.position.y = 0;
    groundMesh2.position.z = 0;
    this.scene.add(groundMesh2);

    //jumps
    // for (let i = 0; i < 100; i++) {
    //   const jump = new THREE.Mesh(
    //     new THREE.CylinderGeometry(0, 1, 0.5, 5),
    //     phongMaterial
    //   );
    //   jump.position.x = Math.random() * 100 - 50;
    //   jump.position.y = 0.5;
    //   jump.position.z = Math.random() * 100 - 50;
    //   this.scene.add(jump);

    //   const cylinderShape = new CANNON.Cylinder(0.01, 1, 0.5, 5);
    //   const cylinderBody = new CANNON.Body({ mass: 0 });
    //   cylinderBody.addShape(cylinderShape, new CANNON.Vec3());
    //   cylinderBody.position.x = jump.position.x;
    //   cylinderBody.position.y = jump.position.y;
    //   cylinderBody.position.z = jump.position.z;
    //   this.world.addBody(cylinderBody);
    // }

    const hostCar = new Car(this.scene, this.world, "host");
    hostCar.addChaseCam(chaseCam);

    const keyMap: { [id: string]: boolean } = {};
    const onDocumentKey = (e: KeyboardEvent) => {
      keyMap[e.key] = e.type === "keydown";
    };

    let forwardVelocity = 0;
    let rightVelocity = 0;

    document.addEventListener("keydown", onDocumentKey, false);
    document.addEventListener("keyup", onDocumentKey, false);

    window.addEventListener("resize", onWindowResize, false);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      render();
    }

    const stats = Stats();
    document.body.appendChild(stats.dom);

    // const gui = new GUI();
    // const physicsFolder = gui.addFolder("Physics");
    // physicsFolder.add(world.gravity, "x", -10.0, 10.0, 0.1);
    // physicsFolder.add(world.gravity, "y", -20.0, 10.0, 0.1);
    // physicsFolder.add(world.gravity, "z", -10.0, 10.0, 0.1);
    // physicsFolder.open();

    const clock = new THREE.Clock();
    let delta;

    // const cannonDebugRenderer = new CannonDebugRenderer(this.scene, this.world);

    const v = new THREE.Vector3();
    let thrusting = false;
    let turning = false;

    const animate = () => {
      requestAnimationFrame(animate);

      // helper.update();

      delta = Math.min(clock.getDelta(), 0.1);
      this.world.step(delta);

      // cannonDebugRenderer.update();

      // Copy coordinates from Cannon to Three.js
      hostCar.updateCarPosition();

      socket.emit("car-position-change", {
        id: socket.id,
        position: hostCar.carBody.position,
        quaternion: hostCar.carBody.quaternion,
        wheelPosition: {
          LF: hostCar.wheelLFMesh.position,
          RF: hostCar.wheelRFMesh.position,
          LB: hostCar.wheelLBMesh.position,
          RB: hostCar.wheelRBMesh.position
        },
        wheelRotation: {
          LF: hostCar.wheelLFMesh.quaternion,
          RF: hostCar.wheelRFMesh.quaternion,
          LB: hostCar.wheelLBMesh.quaternion,
          RB: hostCar.wheelRBMesh.quaternion
        },
        forwardVelocity: forwardVelocity
      });

      thrusting = false;
      turning = false;
      if (keyMap["w"] || keyMap["ArrowUp"]) {
        if (forwardVelocity < 80.0) forwardVelocity += 0.5;
        thrusting = true;
      }
      if (keyMap["s"] || keyMap["ArrowDown"]) {
        if (forwardVelocity > -15.0) forwardVelocity -= 0.5;
        thrusting = true;
      }
      if (keyMap["a"] || keyMap["ArrowLeft"]) {
        if (rightVelocity > -1.0) rightVelocity -= 0.1;
        turning = true;
      }
      if (keyMap["d"] || keyMap["ArrowRight"]) {
        if (rightVelocity < 1.0) rightVelocity += 0.1;
        turning = true;
      }
      if (keyMap[" "]) {
        if (forwardVelocity > 0) {
          forwardVelocity -= 1;
        }
        if (forwardVelocity < 0) {
          forwardVelocity += 1;
        }
      }

      if (!thrusting) {
        //not going forward or backwards so gradually slow down
        if (forwardVelocity > 0) {
          forwardVelocity -= 0.5;
        }
        if (forwardVelocity < 0) {
          forwardVelocity += 0.25;
        }
      }
      if (!turning) {
        if (rightVelocity > 0.2) {
          rightVelocity -= 0.05;
        } else if (rightVelocity < -0.2) {
          rightVelocity += 0.05;
        } else {
          rightVelocity = 0;
        }
      }

      if (
        hostCar.constraintLB &&
        hostCar.constraintRB &&
        hostCar.constraintLF &&
        hostCar.constraintRF
      ) {
        hostCar.constraintLB.setMotorSpeed(forwardVelocity);
        hostCar.constraintRB.setMotorSpeed(forwardVelocity);
        hostCar.constraintLF.axisA.z = rightVelocity;
        hostCar.constraintRF.axisA.z = rightVelocity;
      }

      camera.lookAt(hostCar.car.position);
      camera.up.set(0, 0, 1);

      chaseCamPivot.getWorldPosition(v);
      if (v.y < 40) {
        v.y = 40;
      }
      // camera.position.set(v.x, v.y, v.z);
      camera.position.lerpVectors(camera.position, v, 0.01);

      render();

      stats.update();
    };

    const render = () => {
      renderer.render(this.scene, camera);
    };

    animate();
  }

  addCar(id: string) {
    const newRemoteCar = new Car(this.scene, this.world, "remote");
    this.activeCars.push({
      id: id,
      carObj: newRemoteCar,
      body: newRemoteCar.carBody
    });
    return { remoteCarObj: newRemoteCar, body: newRemoteCar.carBody };
  }

  removeCar(id: string) {
    console.log("car disconnected");
    this.activeCars.forEach((car: any, index: number) => {
      if (car.id === id) {
        car.carObj.removeCar();
        this.activeCars.splice(index, 1);
      }
    });
  }

  updateCarsPosition(cars: remoteCarInfo[]) {
    const otherCars = cars.filter(
      (car: { id: string }) => car.id !== this.socketId
    );
    otherCars.forEach((car: remoteCarInfo) => {
      const activeCarIndex = this.activeCars.findIndex(
        (activeCar) => activeCar.id === car.id
      );
      if (activeCarIndex !== -1) {
        this.activeCars[activeCarIndex].carObj.updateCarPosition(
          car.position,
          car.quaternion,
          car.wheelPosition,
          car.wheelRotation
        );
      } else {
        const newCar = this.addCar(car.id);
        newCar.remoteCarObj.updateCarPosition(
          new THREE.Vector3(car.position.x, car.position.y, car.position.z),
          new THREE.Quaternion(
            car.quaternion.x,
            car.quaternion.y,
            car.quaternion.z,
            car.quaternion.w
          ),
          {
            LF: car.wheelPosition.LF,
            RF: car.wheelPosition.RF,
            LB: car.wheelPosition.LB,
            RB: car.wheelPosition.RB
          },
          {
            LF: car.wheelRotation.LF,
            RF: car.wheelRotation.RF,
            LB: car.wheelRotation.LB,
            RB: car.wheelRotation.RB
          }
        );
      }
    });
  }
}
