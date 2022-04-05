// var ls = 200; // length segments
// var ws = 4; // width segments, tracks

// var lss = ls + 1;
// var wss = ws + 1;

// var faceCount = ls * ws * 2;
// var vertexCount = lss * wss;

// var g = new THREE.BufferGeometry();

// g.faceIndices = new Uint32Array(faceCount * 3);
// g.vertices = new Float32Array(vertexCount * 3);
// //g.normals = new Float32Array( vertexCount * 3 );
// //g.uvs = new Float32Array( vertexCount * 2 );

// g.setIndex(new THREE.BufferAttribute(g.faceIndices, 1));
// g.addAttribute(
//   "position",
//   new THREE.BufferAttribute(g.vertices, 3).setDynamic(true)
// );
// //g.addAttribute( 'normal', new THREE.BufferAttribute( g.normals, 3 ).setDynamic( true ) );
// //g.addAttribute( 'uv', new THREE.BufferAttribute( g.uvs, 2 ) );

// var idxCount = 0;

// for (var j = 0; j < ls; j++) {
//   for (var i = 0; i < ws; i++) {
//     // 2 faces / segment,  3 vertex indices
//     var a = wss * j + i;
//     var b1 = wss * (j + 1) + i; // right-bottom
//     var c1 = wss * (j + 1) + 1 + i;
//     var b2 = wss * (j + 1) + 1 + i; // left-top
//     var c2 = wss * j + 1 + i;

//     g.faceIndices[idxCount] = a; // right-bottom
//     g.faceIndices[idxCount + 1] = b1;
//     g.faceIndices[idxCount + 2] = c1;

//     g.faceIndices[idxCount + 3] = a; // left-top
//     (g.faceIndices[idxCount + 4] = b2), (g.faceIndices[idxCount + 5] = c2);

//     g.addGroup(idxCount, 6, i); // write groups for multi material

//     idxCount += 6;
//   }
// }

// const trackVectors = [
//   new THREE.Vector3(13.953763046680036, 0, 222.8946251874054),
//   new THREE.Vector3(10.445430978393555, 0, 250.4647495788574),
//   new THREE.Vector3(22.78802663955167, 0, 276.62332731128333),
//   new THREE.Vector3(46.305972829044705, 0, 258.8863491383492),
//   new THREE.Vector3(72.98213619695176, 0, 256.440252927699),
//   new THREE.Vector3(92.45219939291329, 0, 278.5996586643509),
//   new THREE.Vector3(122.3599739374642, 0, 276.7425643915155),
//   new THREE.Vector3(151.91864147338867, 0, 271.63976924743645),
//   new THREE.Vector3(181.29246698031918, 0, 265.53622673296104),
//   new THREE.Vector3(211.0305224221632, 0, 261.66871238737326),
//   new THREE.Vector3(241.0141017961145, 0, 261.42639017006485),
//   new THREE.Vector3(270.95473256713024, 0, 263.2348779400535),
//   new THREE.Vector3(300.9197765473244, 0, 262.85962242496896),
//   new THREE.Vector3(329.34784441674844, 0, 254.46264903226347),
//   new THREE.Vector3(338.6792887095916, 0, 226.83697565951582),
//   new THREE.Vector3(360.55986099972586, 0, 208.72682091703942),
//   new THREE.Vector3(390.54343303219747, 0, 208.64368175708984),
//   new THREE.Vector3(420.54218066870345, 0, 208.61472618687438),
//   new THREE.Vector3(450.53584359879903, 0, 208.641815445108),
//   new THREE.Vector3(480.5375264785757, 0, 208.71234357603439),
//   new THREE.Vector3(510.5445234848061, 0, 208.8137368701731),
//   new THREE.Vector3(540.5383007312118, 0, 208.93335588084446),
//   new THREE.Vector3(570.547809285288, 0, 209.0587586713815),
//   new THREE.Vector3(600.5386908150357, 0, 209.1772536143237),
//   new THREE.Vector3(630.5378928362516, 0, 209.23359940584027),
//   new THREE.Vector3(660.5411262014906, 0, 209.24481081561228),
//   new THREE.Vector3(690.5457310119629, 0, 209.4337786550903),
//   new THREE.Vector3(720.5329878384081, 0, 209.56412144924104),
//   new THREE.Vector3(750.5243949596287, 0, 209.25201764798783),
//   new THREE.Vector3(751.102964313876, 0, 188.28738791030017),
//   new THREE.Vector3(739.2061189201302, 0, 161.37572841420405),
//   new THREE.Vector3(752.4444451178897, 0, 135.60188616437756),
//   new THREE.Vector3(781.6022932126889, 0, 131.37507525388975),
//   new THREE.Vector3(811.5619176739056, 0, 132.62520447663837),
//   new THREE.Vector3(840.8277685968692, 0, 126.67231343383229),
//   new THREE.Vector3(866.5653479688525, 0, 111.50096555472729),
//   new THREE.Vector3(886.6189072709401, 0, 89.32587630713115),
//   new THREE.Vector3(901.6227713875642, 0, 63.35913120555976),
//   new THREE.Vector3(924.71599861828, 0, 48.66135804925929),
//   new THREE.Vector3(945.3843173553357, 0, 68.813970824682),
//   new THREE.Vector3(948.6539818333001, 0, 98.59455727804261),
//   new THREE.Vector3(949.5002107253172, 0, 128.57765862625712),
//   new THREE.Vector3(953.5253796813965, 0, 158.24117094223018),
//   new THREE.Vector3(975.3974149754589, 0, 175.81100549779626),
//   new THREE.Vector3(1003.8183246757508, 0, 168.77115133850094),
//   new THREE.Vector3(1020.1889723144532, 0, 144.5171511523437),
//   new THREE.Vector3(1017.6880579139074, 0, 114.97992676942351),
//   new THREE.Vector3(999.4554496359557, 0, 91.15355179876647),
//   new THREE.Vector3(981.3731932366209, 0, 67.21533590433778),
//   new THREE.Vector3(962.8723956061974, 0, 43.61300428780841),
//   new THREE.Vector3(943.0520777088788, 0, 21.128138686867892),
//   new THREE.Vector3(916.3747026718954, 0, 8.213058371204873),
//   new THREE.Vector3(886.692513000078, 0, 10.737656913259523),
//   new THREE.Vector3(857.5600015350259, 0, 17.85982998736292),
//   new THREE.Vector3(828.7725616186701, 0, 26.31998029853685),
//   new THREE.Vector3(800.0386582175901, 0, 34.94546125731229),
//   new THREE.Vector3(771.2441287708701, 0, 43.3281373352842),
//   new THREE.Vector3(742.5193247320948, 0, 52.00394533634919),
//   new THREE.Vector3(713.7931267822396, 0, 60.670621708233085),
//   new THREE.Vector3(684.9865875700982, 0, 69.04715276032267),
//   new THREE.Vector3(656.0207597444647, 0, 76.85252480200475),
//   new THREE.Vector3(626.2670227885209, 0, 80.23581097627351),
//   new THREE.Vector3(596.2813515537375, 0, 80.76037378784),
//   new THREE.Vector3(567.0842280554589, 0, 74.28918785903284),
//   new THREE.Vector3(551.6809192687988, 0, 95.51126172363277),
//   new THREE.Vector3(532.1857754286526, 0, 114.68442772032557),
//   new THREE.Vector3(503.55233365856355, 0, 123.6188884745056),
//   new THREE.Vector3(474.8638500421935, 0, 132.38538167521955),
//   new THREE.Vector3(446.13648573195917, 0, 141.03299682293203),
//   new THREE.Vector3(417.3864018802766, 0, 149.6108234181076),
//   new THREE.Vector3(388.62975963956217, 0, 158.1679509612108),
//   new THREE.Vector3(359.8827201622322, 0, 166.7534689527062),
//   new THREE.Vector3(331.1617112563695, 0, 175.4154447259764),
//   new THREE.Vector3(302.4034686398541, 0, 183.96798459731772),
//   new THREE.Vector3(273.6906422786879, 0, 192.62865367132116),
//   new THREE.Vector3(244.992311661053, 0, 201.3386133714496),
//   new THREE.Vector3(216.27758192280305, 0, 210.0391123322695),
//   new THREE.Vector3(187.54092657076671, 0, 218.6636359363244),
//   new THREE.Vector3(158.76412448600172, 0, 227.1495155344964),
//   new THREE.Vector3(129.9289545495657, 0, 235.4340824776676),
//   new THREE.Vector3(100.60308342466482, 0, 238.09847737703217),
//   new THREE.Vector3(73.89578411523232, 0, 224.56901162267891),
//   new THREE.Vector3(45.159844434964334, 0, 216.3880120900149),
//   new THREE.Vector3(16.06344348144511, 0, 221.29916565429684),
//   new THREE.Vector3(13.953763046680036, 0, 222.8946251874054)
// ];

// const scaledTrack = trackVectors.map((vector: THREE.Vector3) => {
//   return new THREE.Vector3((vector.x - 500) / 4, 0, (vector.z - 120) / 4);
// });
// var curve = new THREE.CatmullRomCurve3(scaledTrack);

// var points = curve.getPoints(ls);
// var curveGeometry = new THREE.BufferGeometry().setFromPoints(points);

// var tangent;
// var normal = new THREE.Vector3(0, 0, 0);
// var binormal = new THREE.Vector3(0, 1, 0);

// var x, y, z;
// var vIdx = 0; // vertex index
// var posIdx; // position  index

// for (var j = 0; j < lss; j++) {
//   // length

//   for (var i = 0; i < wss; i++) {
//     // width

//     // calculate here the coordinates according to your wishes

//     tangent = curve.getTangent(j / ls); //  .. / length segments

//     normal.cross(tangent, binormal);

//     binormal.cross(normal, tangent); // new binormal

//     normal.normalize().multiplyScalar(1);

//     x = points[j].x + (i - ws / 2) * normal.x;
//     y = points[j].y;
//     z = points[j].z + (i - ws / 2) * normal.z;

//     xyzSet();

//     vIdx++;
//   }
// }

// g.attributes.position.needsUpdate = true;
// //g.attributes.normal.needsUpdate = true;

// var material = [
//   new THREE.MeshBasicMaterial({
//     color: 0xffffff,
//     side: THREE.DoubleSide
//   }),
//   new THREE.MeshBasicMaterial({
//     color: 0xffffff,
//     side: THREE.DoubleSide
//   }),
//   new THREE.MeshBasicMaterial({
//     color: 0xffffff,
//     side: THREE.DoubleSide
//   }),
//   new THREE.MeshBasicMaterial({
//     color: 0xffffff,
//     side: THREE.DoubleSide
//   })
// ];

// var mesh = new THREE.Mesh(g, material);
// mesh.position.y = 0.2;
// this.scene.add(mesh);

// var curveMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
// var curveLine = new THREE.Line(curveGeometry, curveMaterial);
// this.scene.add(curveLine);

// function xyzSet() {
//   posIdx = vIdx * 3;

//   g.vertices[posIdx] = x;
//   g.vertices[posIdx + 1] = y;
//   g.vertices[posIdx + 2] = z;
// }
