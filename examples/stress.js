// Stress test

function main() {

  var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
  var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
  var overlappingPairCache = new Ammo.btDbvtBroadphase();
  var solver = new Ammo.btSequentialImpulseConstraintSolver();
  var dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
  dynamicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));

  var groundShape = new Ammo.btBoxShape(new Ammo.btVector3(50, 50, 50));

  var bodies = [];

  var groundTransform = new Ammo.btTransform();
  groundTransform.setIdentity();
  groundTransform.setOrigin(new Ammo.btVector3(0, -56, 0));

  (function() {
    var mass = 0;
    var localInertia = new Ammo.btVector3(0, 0, 0);
    var myMotionState = new Ammo.btDefaultMotionState(groundTransform);
    var rbInfo = new Ammo.btRigidBodyConstructionInfo(0, myMotionState, groundShape, localInertia);
    var body = new Ammo.btRigidBody(rbInfo);

    dynamicsWorld.addRigidBody(body);
    bodies.push(body);
  })();

  var sphereShape = new Ammo.btSphereShape(1);
  var boxShape = new Ammo.btBoxShape(new Ammo.btVector3(1, 1, 1));
  var coneShape = new Ammo.btConeShape(1, 1); // XXX TODO: add cylindershape too

  [sphereShape, boxShape, coneShape, boxShape, sphereShape, coneShape].forEach(function(shape, i) {
    print('creating dynamic shape ' + i);

    var startTransform = new Ammo.btTransform();
    startTransform.setIdentity();
    var mass = 1;
    var localInertia = new Ammo.btVector3(0, 0, 0);
    shape.calculateLocalInertia(mass,localInertia);

    startTransform.setOrigin(new Ammo.btVector3(2+i*0.01, 10+i*2.1, 0));
  
    var myMotionState = new Ammo.btDefaultMotionState(startTransform);
    var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, shape, localInertia);
    var body = new Ammo.btRigidBody(rbInfo);

    dynamicsWorld.addRigidBody(body);
    bodies.push(body);
  });

  var trans = new Ammo.btTransform(); // taking this out of the loop below us reduces the leaking

  var startTime = Date.now();

  for (var i = 0; i < 450; i++) {
    //print('statictop: ' + Qa); // TODO: Add check that we do not allocate memory
    dynamicsWorld.stepSimulation(1/60, 10);
    
    bodies.forEach(function(body, i) {
      if (body.getMotionState()) {
        body.getMotionState().getWorldTransform(trans);
        print(i + ' : ' + [trans.getOrigin().x().toFixed(2), trans.getOrigin().y().toFixed(2), trans.getOrigin().z().toFixed(2)]);
      }
    });
  }

  print('total time: ' + ((Date.now()-startTime)/1000).toFixed(3));
}

main();

