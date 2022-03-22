import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";

import { GUI } from "dat.gui";
import * as CANNON from "cannon-es";
import CannonDebugRenderer from "./cannonDebugRenderer";
import { RefObject } from "react";
import background from "../assets/info.jpeg";

export const physics = (canvasRef: RefObject<HTMLCanvasElement>) => {
  if (!canvasRef.current) {
    throw Error("Canvas ref is not defined");
  }
  const scene = new THREE.Scene();

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

  scene.fog = new THREE.FogExp2(0xdaa520, 0.03);

  scene.add(light);

  const HemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.1);
  scene.add(HemisphereLight);

  // const helper = new THREE.CameraHelper(light.shadow.camera);
  // scene.add(helper);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const chaseCam = new THREE.Object3D();
  chaseCam.position.set(0, 15, 1);
  const chaseCamPivot = new THREE.Object3D();
  chaseCamPivot.position.set(0, 10, 1);
  chaseCam.add(chaseCamPivot);
  scene.add(chaseCam);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.current,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  const phongMaterial = new THREE.MeshPhongMaterial();

  const world = new CANNON.World();
  world.gravity.set(0, -20, 0);

  const groundMaterial = new CANNON.Material("groundMaterial");
  groundMaterial.friction = 0.25;
  groundMaterial.restitution = 0.25;

  const wheelMaterial = new CANNON.Material("wheelMaterial");
  wheelMaterial.friction = 0.25;
  wheelMaterial.restitution = 0.25;

  //ground
  const groundGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(
    2000,
    2000
  );
  const getImage = (): THREE.MeshBasicMaterial => {
    var loader = new THREE.TextureLoader();
    var texture = loader.load(background);
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
  const groundMesh: THREE.Mesh = new THREE.Mesh(groundGeometry, shadowMaterial);
  groundMesh.rotateX(-Math.PI / 2);
  groundMesh.position.x = 0;
  groundMesh.position.y = 0.1;
  groundMesh.position.z = 0;
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);
  const groundShape = new CANNON.Box(new CANNON.Vec3(2000, 1, 2000));
  const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
  groundBody.addShape(groundShape);
  groundBody.position.set(0, -1, 0);
  world.addBody(groundBody);

  const groundGeometry2: THREE.PlaneGeometry = new THREE.PlaneGeometry(
    2000,
    2000
  );
  const groundMesh2: THREE.Mesh = new THREE.Mesh(
    groundGeometry2,
    imageMaterial
  );
  groundMesh2.rotateX(-Math.PI / 2);
  groundMesh2.position.x = 0;
  groundMesh2.position.y = 0;
  groundMesh2.position.z = 0;
  scene.add(groundMesh2);

  //jumps
  for (let i = 0; i < 100; i++) {
    const jump = new THREE.Mesh(
      new THREE.CylinderGeometry(0, 1, 0.5, 5),
      phongMaterial
    );
    jump.position.x = Math.random() * 100 - 50;
    jump.position.y = 0.5;
    jump.position.z = Math.random() * 100 - 50;
    scene.add(jump);

    const cylinderShape = new CANNON.Cylinder(0.01, 1, 0.5, 5);
    const cylinderBody = new CANNON.Body({ mass: 0 });
    cylinderBody.addShape(cylinderShape, new CANNON.Vec3());
    cylinderBody.position.x = jump.position.x;
    cylinderBody.position.y = jump.position.y;
    cylinderBody.position.z = jump.position.z;
    world.addBody(cylinderBody);
  }

  const car = new THREE.Group();
  const carBodyGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(1, 0.5, 2);
  const carBodyMesh: THREE.Mesh = new THREE.Mesh(
    carBodyGeometry,
    new THREE.MeshLambertMaterial({ color: 0xff0000 })
  );
  carBodyMesh.position.y = -0.25;
  carBodyMesh.castShadow = true;
  car.add(carBodyMesh);

  const carCabinMesh: THREE.Mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.4, 1),
    new THREE.MeshLambertMaterial({ color: 0xffffff })
  );
  carCabinMesh.position.y = 0.05;
  carCabinMesh.position.z = 0.4;
  carCabinMesh.castShadow = true;

  car.position.y = 4;

  car.add(carCabinMesh);

  scene.add(car);
  car.add(chaseCam);

  const carBodyShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 1));
  const carBody = new CANNON.Body({ mass: 10 });
  carBody.addShape(carBodyShape);
  carBody.position.x = car.position.x;
  carBody.position.y = car.position.y;
  carBody.position.z = car.position.z;
  world.addBody(carBody);

  //front left wheel
  const wheelMeshMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });

  const wheelLFGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
    0.22,
    0.22,
    0.15,
    20
  );
  wheelLFGeometry.rotateZ(Math.PI / 2);
  const wheelLFMesh: THREE.Mesh = new THREE.Mesh(
    wheelLFGeometry,
    wheelMeshMaterial
  );
  wheelLFMesh.position.x = -3;
  wheelLFMesh.position.y = 1;
  wheelLFMesh.position.z = -0.5;
  wheelLFMesh.castShadow = true;
  scene.add(wheelLFMesh);
  const wheelLFShape = new CANNON.Sphere(0.22);
  const wheelLFBody = new CANNON.Body({ mass: 1, material: wheelMaterial });
  wheelLFBody.addShape(wheelLFShape);
  wheelLFBody.position.x = wheelLFMesh.position.x;
  wheelLFBody.position.y = wheelLFMesh.position.y;
  wheelLFBody.position.z = wheelLFMesh.position.z;
  world.addBody(wheelLFBody);

  //front right wheel
  const wheelRFGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
    0.22,
    0.22,
    0.15,
    20
  );
  wheelRFGeometry.rotateZ(Math.PI / 2);
  const wheelRFMesh: THREE.Mesh = new THREE.Mesh(
    wheelRFGeometry,
    wheelMeshMaterial
  );
  wheelRFMesh.position.y = 3;
  wheelRFMesh.position.x = 0.5;
  wheelRFMesh.position.z = -0.5;
  wheelRFMesh.castShadow = true;
  scene.add(wheelRFMesh);
  const wheelRFShape = new CANNON.Sphere(0.22);
  const wheelRFBody = new CANNON.Body({ mass: 1, material: wheelMaterial });
  wheelRFBody.addShape(wheelRFShape);
  wheelRFBody.position.x = wheelRFMesh.position.x;
  wheelRFBody.position.y = wheelRFMesh.position.y;
  wheelRFBody.position.z = wheelRFMesh.position.z;
  world.addBody(wheelRFBody);

  //back left wheel
  const wheelLBGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
    0.22,
    0.22,
    0.2,
    20
  );
  wheelLBGeometry.rotateZ(Math.PI / 2);
  const wheelLBMesh: THREE.Mesh = new THREE.Mesh(
    wheelLBGeometry,
    wheelMeshMaterial
  );
  wheelLBMesh.position.y = 3;
  wheelLBMesh.position.x = -0.5;
  wheelLBMesh.position.z = 0.5;
  wheelLBMesh.castShadow = true;
  scene.add(wheelLBMesh);
  const wheelLBShape = new CANNON.Sphere(0.22);
  const wheelLBBody = new CANNON.Body({ mass: 1, material: wheelMaterial });
  wheelLBBody.addShape(wheelLBShape);
  wheelLBBody.position.x = wheelLBMesh.position.x;
  wheelLBBody.position.y = wheelLBMesh.position.y;
  wheelLBBody.position.z = wheelLBMesh.position.z;
  world.addBody(wheelLBBody);

  //back right wheel
  const wheelRBGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
    0.22,
    0.22,
    0.2,
    20
  );
  wheelRBGeometry.rotateZ(Math.PI / 2);
  const wheelRBMesh: THREE.Mesh = new THREE.Mesh(
    wheelRBGeometry,
    wheelMeshMaterial
  );
  wheelRBMesh.position.y = 3;
  wheelRBMesh.position.x = 0.5;
  wheelRBMesh.position.z = 0.5;
  wheelRBMesh.castShadow = true;
  scene.add(wheelRBMesh);
  const wheelRBShape = new CANNON.Sphere(0.22);
  const wheelRBBody = new CANNON.Body({ mass: 1, material: wheelMaterial });
  wheelRBBody.addShape(wheelRBShape);
  wheelRBBody.position.x = wheelRBMesh.position.x;
  wheelRBBody.position.y = wheelRBMesh.position.y;
  wheelRBBody.position.z = wheelRBMesh.position.z;
  world.addBody(wheelRBBody);

  const leftFrontAxis = new CANNON.Vec3(1, 0, 0);
  const rightFrontAxis = new CANNON.Vec3(1, 0, 0);
  const leftBackAxis = new CANNON.Vec3(1, 0, 0);
  const rightBackAxis = new CANNON.Vec3(1, 0, 0);

  const constraintLF = new CANNON.HingeConstraint(carBody, wheelLFBody, {
    pivotA: new CANNON.Vec3(-0.5, -0.5, -0.7),
    axisA: leftFrontAxis,
    maxForce: 1e6
  });
  world.addConstraint(constraintLF);
  const constraintRF = new CANNON.HingeConstraint(carBody, wheelRFBody, {
    pivotA: new CANNON.Vec3(0.5, -0.5, -0.7),
    axisA: rightFrontAxis,
    maxForce: 1e6
  });
  world.addConstraint(constraintRF);
  const constraintLB = new CANNON.HingeConstraint(carBody, wheelLBBody, {
    pivotA: new CANNON.Vec3(-0.5, -0.5, 0.7),
    axisA: leftBackAxis,
    maxForce: 1e6
  });
  world.addConstraint(constraintLB);
  const constraintRB = new CANNON.HingeConstraint(carBody, wheelRBBody, {
    pivotA: new CANNON.Vec3(0.5, -0.5, 0.7),
    axisA: rightBackAxis,
    maxForce: 1e6
  });
  world.addConstraint(constraintRB);

  //rear wheel drive
  constraintLB.enableMotor();
  constraintRB.enableMotor();

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

  const gui = new GUI();
  const physicsFolder = gui.addFolder("Physics");
  physicsFolder.add(world.gravity, "x", -10.0, 10.0, 0.1);
  physicsFolder.add(world.gravity, "y", -20.0, 10.0, 0.1);
  physicsFolder.add(world.gravity, "z", -10.0, 10.0, 0.1);
  physicsFolder.open();

  const clock = new THREE.Clock();
  let delta;

  // const cannonDebugRenderer = new CannonDebugRenderer(scene, world);

  const v = new THREE.Vector3();
  let thrusting = false;
  let turning = false;

  function animate() {
    requestAnimationFrame(animate);

    // helper.update();

    delta = Math.min(clock.getDelta(), 0.1);
    world.step(delta);

    // cannonDebugRenderer.update();

    // Copy coordinates from Cannon to Three.js
    car.position.set(
      carBody.position.x,
      carBody.position.y,
      carBody.position.z
    );
    car.quaternion.set(
      carBody.quaternion.x,
      carBody.quaternion.y,
      carBody.quaternion.z,
      carBody.quaternion.w
    );

    wheelLFMesh.position.set(
      wheelLFBody.position.x,
      wheelLFBody.position.y,
      wheelLFBody.position.z
    );
    wheelLFMesh.quaternion.set(
      wheelLFBody.quaternion.x,
      wheelLFBody.quaternion.y,
      wheelLFBody.quaternion.z,
      wheelLFBody.quaternion.w
    );

    wheelRFMesh.position.set(
      wheelRFBody.position.x,
      wheelRFBody.position.y,
      wheelRFBody.position.z
    );
    wheelRFMesh.quaternion.set(
      wheelRFBody.quaternion.x,
      wheelRFBody.quaternion.y,
      wheelRFBody.quaternion.z,
      wheelRFBody.quaternion.w
    );

    wheelLBMesh.position.set(
      wheelLBBody.position.x,
      wheelLBBody.position.y,
      wheelLBBody.position.z
    );
    wheelLBMesh.quaternion.set(
      wheelLBBody.quaternion.x,
      wheelLBBody.quaternion.y,
      wheelLBBody.quaternion.z,
      wheelLBBody.quaternion.w
    );

    wheelRBMesh.position.set(
      wheelRBBody.position.x,
      wheelRBBody.position.y,
      wheelRBBody.position.z
    );
    wheelRBMesh.quaternion.set(
      wheelRBBody.quaternion.x,
      wheelRBBody.quaternion.y,
      wheelRBBody.quaternion.z,
      wheelRBBody.quaternion.w
    );

    thrusting = false;
    turning = false;
    if (keyMap["w"] || keyMap["ArrowUp"]) {
      if (forwardVelocity < 50.0) forwardVelocity += 0.5;
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
        forwardVelocity -= 0.25;
      }
      if (forwardVelocity < 0) {
        forwardVelocity += 0.25;
      }
    }
    if (!turning) {
      if (rightVelocity > 0.2) {
        rightVelocity -= 0.1;
      } else if (rightVelocity < -0.2) {
        rightVelocity += 0.1;
      } else {
        rightVelocity = 0;
      }
    }

    constraintLB.setMotorSpeed(forwardVelocity);
    constraintRB.setMotorSpeed(forwardVelocity);
    constraintLF.axisA.z = rightVelocity;
    constraintRF.axisA.z = rightVelocity;

    camera.lookAt(car.position);

    chaseCamPivot.getWorldPosition(v);
    // if (v.y < 1) {
    //   v.y = 1;
    // }
    camera.position.lerpVectors(camera.position, v, 0.05);

    render();

    stats.update();
  }

  function render() {
    renderer.render(scene, camera);
  }

  animate();
};
