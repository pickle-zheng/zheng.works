import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Light } from "three";
export class ExperienceBlock {
  scene: THREE.Scene;
  world: CANNON.World;
  dimension: { x: number; y: number; z: number };
  blockGroup: THREE.Group;
  supportBody: CANNON.Body;
  constructor(
    scene: THREE.Scene,
    world: CANNON.World,
    position: { x: number; z: number },
    dimension: { x: number; y: number; z: number },
    experience: string,
    loaderManager: THREE.LoadingManager
  ) {
    this.scene = scene;
    this.world = world;
    this.dimension = dimension;
    this.blockGroup = new THREE.Group();
    this.blockGroup.position.set(
      position.x,
      this.dimension.y / 2 + 0.01,
      position.z
    );
    const blockMaterial = new THREE.MeshPhongMaterial({
      color: 0xe6e6e6,
      flatShading: true
    });

    const block: THREE.BoxGeometry = new THREE.BoxGeometry(
      this.dimension.x,
      this.dimension.y,
      this.dimension.z
    );
    const blockMesh: THREE.Mesh = new THREE.Mesh(block, blockMaterial);
    blockMesh.castShadow = true;
    blockMesh.receiveShadow = true;
    blockMesh.position.set(0, 0, 0);
    this.blockGroup.add(blockMesh);
    const supportShape = new CANNON.Box(
      new CANNON.Vec3(
        this.dimension.x / 2,
        this.dimension.y / 2,
        this.dimension.z / 2
      )
    );
    const supportBody = new CANNON.Body({ mass: 1000000 });
    supportBody.addShape(supportShape);
    supportBody.linearDamping = 0;
    supportBody.position.x = this.blockGroup.position.x;
    supportBody.position.y = this.blockGroup.position.y;
    supportBody.position.z = this.blockGroup.position.z;
    this.supportBody = supportBody;
    this.world.addBody(supportBody);

    const experiencePlane = new THREE.PlaneGeometry(
      this.dimension.x,
      this.dimension.z
    );
    const experiencePlaneMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader(loaderManager).load(experience),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1
    });
    const experiencePlaneMesh: THREE.Mesh = new THREE.Mesh(
      experiencePlane,
      experiencePlaneMaterial
    );

    experiencePlaneMesh.receiveShadow = true;
    experiencePlaneMesh.position.set(0, this.dimension.y / 2 + 0.02, 0);
    experiencePlaneMesh.rotateX(Math.PI / 2);
    experiencePlaneMesh.rotateY(Math.PI);
    this.blockGroup.add(experiencePlaneMesh);

    const light = new THREE.SpotLight(0xffffff, 0.3);
    light.position.set(0, 10 + this.dimension.y, 0);
    light.castShadow = true;
    light.shadow.mapSize.width = 2046;
    light.shadow.mapSize.height = 2046;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 30;
    light.shadow.camera.fov = 30;
    light.penumbra = 0.3;
    light.target = experiencePlaneMesh;
    this.blockGroup.add(light);
    this.scene.add(this.blockGroup);
  }
  updatePosition() {
    this.blockGroup.position.set(
      this.supportBody.position.x,
      this.supportBody.position.y,
      this.supportBody.position.z
    );

    this.blockGroup.quaternion.set(
      this.supportBody.quaternion.x,
      this.supportBody.quaternion.y,
      this.supportBody.quaternion.z,
      this.supportBody.quaternion.w
    );
  }
}
