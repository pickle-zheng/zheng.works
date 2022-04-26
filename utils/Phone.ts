import * as THREE from "three";
import * as CANNON from "cannon-es";

export class Phone {
  scene: THREE.Scene;
  world: CANNON.World;
  video: HTMLVideoElement;
  PhoneGroup: THREE.Group;
  constructor(
    videoSource: string,
    scene: THREE.Scene,
    world: CANNON.World,
    position: { x: number; z: number },
    size?: { x: number; y: number; z: number }
  ) {
    this.scene = scene;
    this.world = world;
    this.PhoneGroup = new THREE.Group();

    const iphoneGeo = createBoxWithRoundedEdges(
      size?.x ? size.x + 2 : 13,
      2,
      size?.z ? size.z + 2 : 26.2,
      1,
      16
    );
    const whiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xefefef,
      roughness: 1
    });
    const phoneMesh = new THREE.Mesh(iphoneGeo, whiteMaterial);
    phoneMesh.castShadow = true;
    this.PhoneGroup.add(phoneMesh);
    this.video = document.createElement("video");
    this.video.src = videoSource; // transform gif to mp4
    this.video.loop = true;
    // Load video texture
    let videoTexture = new THREE.VideoTexture(this.video);
    videoTexture.format = THREE.RGBAFormat;
    videoTexture.minFilter = THREE.NearestFilter;
    videoTexture.magFilter = THREE.NearestFilter;
    videoTexture.generateMipmaps = false;

    // Create mesh
    var geometry = new THREE.BoxGeometry(
      size?.x ? size.x : 11,
      size?.y ? size.y : 0.1,
      size?.z ? size.z : 24
    );
    var material = new THREE.MeshStandardMaterial({ map: videoTexture });
    const mesh = new THREE.Mesh(geometry, material);
    this.PhoneGroup.add(mesh);
    mesh.position.set(0, 0.97, 0);

    this.PhoneGroup.rotateY(Math.PI);

    const light = new THREE.SpotLight(0xffffff, 0.15);
    light.position.set(0, 50, 0);
    light.castShadow = true;
    light.shadow.mapSize.width = 2046;
    light.shadow.mapSize.height = 2046;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 50;
    light.shadow.camera.fov = 30;
    light.penumbra = 0.3;
    light.target = mesh;
    this.PhoneGroup.add(light);

    this.PhoneGroup.position.set(position.x, 0, position.z);

    this.scene.add(this.PhoneGroup);

    // const supportBody = new CANNON.Body({ mass: 1000000 });
    // const supportShape = new CANNON.Box(new CANNON.Vec3(13, 2, 26.2));
    // supportBody.addShape(supportShape);
    // supportBody.linearDamping = 0;
    // supportBody.position.x = this.IphoneGroup.position.x;
    // supportBody.position.y = this.IphoneGroup.position.y;
    // supportBody.position.z = this.IphoneGroup.position.z;
    // this.supportBody = supportBody;
    // this.world.addBody(supportBody);
  }
}

const createBoxWithRoundedEdges = (
  width: number,
  height: number,
  depth: number,
  radius0: number,
  smoothness: number
) => {
  let shape = new THREE.Shape();
  let eps = 0.00001;
  let radius = radius0 - eps;
  shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
  shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true);
  shape.absarc(
    width - radius * 2,
    height - radius * 2,
    eps,
    Math.PI / 2,
    0,
    true
  );
  shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true);
  let geometry = new THREE.ExtrudeBufferGeometry(shape, {
    depth: depth - radius0 * 2,
    bevelEnabled: true,
    bevelSegments: smoothness * 2,
    steps: 1,
    bevelSize: radius,
    bevelThickness: radius0,
    curveSegments: smoothness
  });

  geometry.center();

  return geometry;
};
