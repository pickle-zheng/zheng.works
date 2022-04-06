import * as THREE from "three";
import * as CANNON from "cannon-es";

import curbs from "./FloorData/curbs.json";

export class FloorPlan {
  scene: THREE.Scene;
  world: CANNON.World;
  constructor(scene: THREE.Scene, world: CANNON.World) {
    this.scene = scene;
    this.world = world;
    const buildingMaterial = new THREE.MeshPhongMaterial({
      color: 0x424242,
      flatShading: true
    });

    const curbGeometries = curbs.features.map((curb) => {
      const shape = new THREE.Shape();
      console.log(curb);

      curb.geometry.coordinates.forEach((coordinate, i) => {
        console.log(coordinate);
        if (i === 0) {
          shape.moveTo(
            (coordinate[0] - 121.43937) * 90000,
            (coordinate[1] - 31.21319) * 90000
          );
        } else {
          shape.lineTo(
            (coordinate[0] - 121.43937) * 90000,
            (coordinate[1] - 31.21319) * 90000
          );
        }
      });
      shape.lineTo(
        (curb.geometry.coordinates[0][0] - 121.43937) * 90000,
        (curb.geometry.coordinates[0][1] - 31.21319) * 90000
      );

      const extrudeSettings = {
        steps: 1,
        depth: 0.2,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 1
      };

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const mesh = new THREE.Mesh(geometry, buildingMaterial);
      mesh.rotateX(Math.PI / 2);
      mesh.position.y = 0;
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      scene.add(mesh);
      return mesh;
    });
    console.log(curbGeometries);
  }
}
// RAMP Support
//     const rampSupport: THREE.BoxGeometry = new THREE.BoxGeometry(5, 1, 1);
//     const rampSupportGeometryMesh: THREE.Mesh = new THREE.Mesh(
//       rampSupport,
//       rampMaterial
//     );
//     rampSupportGeometryMesh.castShadow = true;
//     rampSupportGeometryMesh.position.x = position.x;
//     rampSupportGeometryMesh.position.y = 0.55;
//     rampSupportGeometryMesh.position.z = position.z + 4.5;
//     this.scene.add(rampSupportGeometryMesh);
//     const supportShape = new CANNON.Box(new CANNON.Vec3(2.5, 0.5, 0.5));

//     const supportBody = new CANNON.Body({ mass: 10000 });
//     supportBody.addShape(supportShape);
//     supportBody.linearDamping = 0;
//     supportBody.position.x = rampSupportGeometryMesh.position.x;
//     supportBody.position.y = rampSupportGeometryMesh.position.y;
//     supportBody.position.z = rampSupportGeometryMesh.position.z;
//     this.world.addBody(supportBody);

//     // RAMP

//     this.ramp.position.x = position.x;
//     this.ramp.position.y = 0.1;
//     this.ramp.position.z = position.z;

//     const rampGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(5, 0.2, 10);
//     const rampGeometryMesh: THREE.Mesh = new THREE.Mesh(
//       rampGeometry,
//       rampMaterial
//     );
//     rampGeometryMesh.position.y = 0;
//     rampGeometryMesh.castShadow = true;
//     rampGeometryMesh.receiveShadow = true;
//     this.ramp.add(rampGeometryMesh);

//     this.ramp.position.x = position.x;
//     this.ramp.position.y = 3;
//     this.ramp.position.z = position.z;
//     this.ramp.rotateX(-Math.PI / 5);

//     this.scene.add(this.ramp);

//     const rampBodyShape = new CANNON.Box(new CANNON.Vec3(2.5, 0.01, 5));
//     this.rampBody = new CANNON.Body({ mass: 10000 });
//     this.rampBody.addShape(rampBodyShape);
//     this.rampBody.linearDamping = 0;
//     this.rampBody.position.x = this.ramp.position.x;
//     this.rampBody.position.y = this.ramp.position.y;
//     this.rampBody.position.z = this.ramp.position.z;
//     this.rampBody.quaternion.set(
//       this.ramp.quaternion.x,
//       this.ramp.quaternion.y,
//       this.ramp.quaternion.z,
//       this.ramp.quaternion.w
//     );
//     this.rampBody.fixedRotation = true;
//     this.world.addBody(this.rampBody);
//   }
