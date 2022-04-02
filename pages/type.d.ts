type remoteCarInfo = {
  id: string;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  wheelPosition: {
    LF: THREE.Vector3;
    RF: THREE.Vector3;
    LB: THREE.Vector3;
    RB: THREE.Vector3;
  };
  wheelRotation: {
    LF: THREE.Quaternion;
    RF: THREE.Quaternion;
    LB: THREE.Quaternion;
    RB: THREE.Quaternion;
  };
  forwardVelocity: number;
  carType: string;
};

type Car = {
  id: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  wheelAngle: number;
  carType: string;
};
