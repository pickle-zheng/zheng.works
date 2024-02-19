import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { GUI } from "dat.gui";
import * as CANNON from "cannon-es";
import CannonDebugRenderer from "./cannonDebugRenderer";
import { RefObject } from "react";
import { Car } from "./Car";
import { Tree } from "./Tree";
import { Ramp } from "./Ramp";
import { SpeedNet } from "./SpeedNet";

export class CarPool {
  scene: THREE.Scene;
  activeCars: { id: any; carObj: Car; body: CANNON.Body }[] = [];
  socketId: string | undefined;
  world: CANNON.World;
  hostCar: Car;
  hostCarTypeIndex: number;
  hostCarPosition: { x: number; y: number; z: number };
  typingStatus: boolean = false;
  speedNetPosition: { x: number; z: number; width: number };
  carTypes = ["pickup", "sedan", "jeep"];
  groundSize: { x: number; y: number };
  loaderManager: THREE.LoadingManager;
  constructor(canvasRef: RefObject<HTMLCanvasElement>, socket: any) {
    this.hostCarPosition = { x: 0, y: 0, z: 0 };
    this.socketId = socket.id;
    if (!canvasRef.current) {
      throw Error("Canvas ref is not defined");
    }
    const manager = new THREE.LoadingManager();

    this.loaderManager = manager;
    this.scene = new THREE.Scene();

    const light = new THREE.DirectionalLight(0xff0054, 0.8);
    light.position.set(30, 35, 15);
    light.castShadow = true;
    light.shadow.mapSize.width = 16384 / 2;
    light.shadow.mapSize.height = 16384 / 2;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 100;
    let d = 250;
    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;

    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.position.set(-30, 50, -15);
    light2.castShadow = true;
    light2.shadow.mapSize.width = 16384 / 2;
    light2.shadow.mapSize.height = 16384 / 2;
    light2.shadow.camera.near = 0.5;
    light2.shadow.camera.far = 100;
    light2.shadow.camera.left = -d;
    light2.shadow.camera.right = d;
    light2.shadow.camera.top = d;
    light2.shadow.camera.bottom = -d;

    // this.scene.fog = new THREE.FogExp2(0xf0dba6, 0.005);

    this.hostCarTypeIndex = 0;
    this.scene.add(light);
    this.scene.add(light2);

    // const HemisphereLight = new THREE.HemisphereLight(0xffffbb, 0xdaa520, 0.3);
    // this.scene.add(HemisphereLight);

    // const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    // this.scene.add(ambientLight);

    // const helper = new THREE.CameraHelper(light.shadow.camera);
    // this.scene.add(helper);

    const camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(1, 10, -10);

    // const chaseCam = new THREE.Object3D();
    // chaseCam.position.set(0, 100, 0);
    // chaseCam.name = "chaseCam";
    // const chaseCamPivot = new THREE.Object3D();
    // chaseCamPivot.position.set(0, 0, 0);
    // chaseCamPivot.name = "chaseCamPivot";
    // chaseCam.add(chaseCamPivot);
    // this.scene.add(chaseCam);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.update();

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0px";
    document.body.appendChild(labelRenderer.domElement);

    this.world = new CANNON.World();
    this.world.gravity.set(0, -50, 0);

    const groundBodyMaterial = new CANNON.Material("groundMaterial");
    groundBodyMaterial.friction = 0.6;
    groundBodyMaterial.restitution = 0.6;

    //ground
    this.groundSize = { x: 500, y: 500 };

    const groundGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(
      this.groundSize.x,
      this.groundSize.y
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
    const whiteMaterial = new THREE.MeshPhongMaterial({
      color: 0x18181a
    });

    // const shadowMaterial = new THREE.ShadowMaterial();
    // shadowMaterial.opacity = 0.5;
    // const groundMesh: THREE.Mesh = new THREE.Mesh(
    //   groundGeometry,
    //   shadowMaterial
    // );
    // groundMesh.rotateX(-Math.PI / 2);
    // groundMesh.position.x = 0;
    // groundMesh.position.y = 0.1;
    // groundMesh.position.z = 0;
    // groundMesh.receiveShadow = true;
    // this.scene.add(groundMesh);
    const groundShape = new CANNON.Box(
      new CANNON.Vec3(this.groundSize.x / 2, 1, this.groundSize.y / 2)
    );
    const groundBody = new CANNON.Body({
      mass: 0,
      material: groundBodyMaterial
    });
    groundBody.addShape(groundShape);
    groundBody.position.set(0, -1, 0);
    this.world.addBody(groundBody);

    const groundGeometry2: THREE.PlaneGeometry = new THREE.PlaneGeometry(
      500,
      500
    );

    const groundMaterial = new THREE.MeshPhysicalMaterial({
      metalness: 0,
      roughness: 0.5,
      reflectivity: 0.2,
      clearcoat: 0.5,
      clearcoatRoughness: 0.5,
      color: 0xff0054
    });

    // const groundMaterial = new THREE.MeshBasicMaterial({
    //   color: 0xff0054
    // });
    const groundMesh2: THREE.Mesh = new THREE.Mesh(
      groundGeometry2,
      whiteMaterial
    );
    groundMesh2.rotateX(-Math.PI / 2);
    groundMesh2.position.x = 0;
    groundMesh2.position.y = 0;
    groundMesh2.position.z = 0;
    groundMesh2.receiveShadow = true;
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

    let hostCar = new Car(
      this.scene,
      this.world,
      "host",
      this.carTypes[this.hostCarTypeIndex],
      this.loaderManager,
      null
    );
    // hostCar.addChaseCam(chaseCam);
    this.hostCar = hostCar;

    const treeArray: any[] = Array.apply(
      { x: 0, y: 0 },
      Array(
        Math.floor(
          (groundGeometry.parameters.height / 60) *
            (groundGeometry.parameters.width / 60)
        )
      )
    );
    const treePositions = treeArray.map(() => {
      const x: number =
        (Math.random() * groundGeometry.parameters.height) / 4 -
        groundGeometry.parameters.height / 8;
      const z: number =
        (Math.random() * groundGeometry.parameters.width) / 4 -
        groundGeometry.parameters.width / 8;
      return { x: x, z: z };
    });
    console.log(treePositions.length + " trees generated");

    const trees = treePositions.map(
      (treePosition: { x: number; z: number }) =>
        new Tree(this.scene, this.world, "normal", {
          x: treePosition.x,
          z: treePosition.z
        })
    );

    // const ramp = new Ramp(this.scene, this.world, "normal", {
    //   x: 15,
    //   z: 15
    // });

    const speedNet = new SpeedNet(this.scene);
    this.speedNetPosition = {
      x: speedNet.netGroup.position.x,
      z: speedNet.netGroup.position.z,
      width: 5
    };

    const keyMap: { [id: string]: boolean } = {};
    const keyDownMap: { [id: string]: boolean } = {};
    const onDocumentKey = (e: KeyboardEvent) => {
      if (this.typingStatus !== true) keyMap[e.key] = e.type === "keydown";
      if (this.typingStatus !== true) keyDownMap[e.key] = e.type === "keyup";
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
      labelRenderer.setSize(window.innerWidth, window.innerHeight);
      render();
    }

    // const stats = Stats();
    // document.body.appendChild(stats.dom);

    // const gui = new GUI();
    // const physicsFolder = gui.addFolder("addCarPhysics");
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

      // ramp.updateRampPosition();

      if (
        Math.abs(this.hostCarPosition.x - hostCar.carBody.position.x) >= 0.1 ||
        Math.abs(this.hostCarPosition.z - hostCar.carBody.position.z) >= 0.1
      ) {
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
          carType: this.carTypes[this.hostCarTypeIndex]
        });
        this.hostCarPosition = { ...hostCar.carBody.position };
      }

      thrusting = false;
      turning = false;

      const getPerformance = (type: string) => {
        switch (type) {
          case "pickup":
            return { maxVelocity: 60, turning: 0.25 };
          case "sedan":
            return { maxVelocity: 80, turning: 0.2 };
          case "jeep":
            return { maxVelocity: 50, turning: 0.35 };
          default:
            return { maxVelocity: 60, turning: 0.2 };
        }
      };

      if (keyMap["w"] || keyMap["ArrowUp"]) {
        if (forwardVelocity < 0) forwardVelocity = 0;
        if (
          forwardVelocity < getPerformance(hostCar.carType).maxVelocity &&
          forwardVelocity >= 0
        )
          forwardVelocity += 0.5;
        thrusting = true;
      }
      if (keyMap["s"] || keyMap["ArrowDown"]) {
        if (forwardVelocity > 0) forwardVelocity = 0;
        if (forwardVelocity > -40.0 && forwardVelocity <= 0)
          forwardVelocity -= 0.5;
        thrusting = true;
      }
      if (keyMap["a"] || keyMap["ArrowLeft"]) {
        if (rightVelocity > -getPerformance(hostCar.carType).turning)
          rightVelocity -= 0.1;
        turning = true;
      }
      if (keyMap["d"] || keyMap["ArrowRight"]) {
        if (rightVelocity < getPerformance(hostCar.carType).turning)
          rightVelocity += 0.1;
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
      if (keyDownMap["r"]) {
        hostCar.removeCar();
        hostCar = new Car(
          this.scene,
          this.world,
          "host",
          this.carTypes[this.hostCarTypeIndex],
          this.loaderManager,
          null
        );
        camera.position.set(0, 100, -1);
        forwardVelocity = 0;
        rightVelocity = 0;
        keyDownMap["r"] = false;
      }

      if (keyDownMap["Tab"]) {
        hostCar.removeCar();
        this.hostCarTypeIndex =
          this.hostCarTypeIndex >= this.carTypes.length - 1
            ? 0
            : this.hostCarTypeIndex + 1;
        hostCar = new Car(
          this.scene,
          this.world,
          "host",
          this.carTypes[this.hostCarTypeIndex],
          this.loaderManager,
          null
        );
        forwardVelocity = 0;
        rightVelocity = 0;
        camera.position.lerpVectors(new THREE.Vector3(0, 100, 0), v, 0.02);
        keyDownMap["Tab"] = false;
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
        if (rightVelocity > getPerformance(hostCar.carType).turning) {
          rightVelocity -= 0.05;
        } else if (rightVelocity < -getPerformance(hostCar.carType).turning) {
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

      hostCar.car.getWorldPosition(v);
      v.y = 100;
      camera.position.lerpVectors(camera.position, v, 0.02);

      render();
      // controls.update();
      // composer.render();
      // stats.update();
    };

    const render = () => {
      renderer.render(this.scene, camera);
      ``;
      labelRenderer.render(this.scene, camera);
    };

    animate();
  }

  updateTypingStatus(typingStatus: boolean) {
    this.typingStatus = typingStatus;
  }

  addCar(id: string, carType: string) {
    console.log("addCar");
    const newRemoteCar = new Car(
      this.scene,
      this.world,
      "remote",
      carType,
      this.loaderManager,
      null
    );
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

  addMessage(msg: { message: string; id: string }) {
    if (msg.id === this.socketId) {
      this.hostCar.addMessage(msg.message);
    } else {
      const activeCarIndex = this.activeCars.findIndex(
        (activeCar) => activeCar.id === msg.id
      );
      if (activeCarIndex !== -1) {
        this.activeCars[activeCarIndex].carObj.addMessage(msg.message);
      }
    }
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
        if (this.activeCars[activeCarIndex].carObj.carType != car.carType) {
          this.removeCar(car.id);
          const newCar = this.addCar(car.id, car.carType);
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
        } else {
          this.activeCars[activeCarIndex].carObj.updateCarPosition(
            car.position,
            car.quaternion,
            car.wheelPosition,
            car.wheelRotation
          );
        }
      } else {
        const newCar = this.addCar(car.id, car.carType);
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
