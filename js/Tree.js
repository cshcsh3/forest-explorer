Tree = function(sizeBranch, sizeTrunk, radius, scene) {

  var tree = new BABYLON.Mesh("tree", scene);
  tree.isVisible = false;

  var leaves = new BABYLON.Mesh("leaves", scene);

  //var vertexData = BABYLON.VertexData.CreateSphere(2,sizeBranch); //this line for BABYLONJS2.2 or earlier
  var vertexData = BABYLON.VertexData.CreateSphere({segments:2, diameter:sizeBranch}); //this line for BABYLONJS2.3 or later

  vertexData.applyToMesh(leaves, false);

  var positions = leaves.getVerticesData(BABYLON.VertexBuffer.PositionKind);
  var indices = leaves.getIndices();
  var numberOfPoints = positions.length/3;

  var map = [];

  // The higher point in the sphere
  var v3 = BABYLON.Vector3;
  var max = [];

  for (var i=0; i<numberOfPoints; i++) {
      var p = new v3(positions[i*3], positions[i*3+1], positions[i*3+2]);

      if (p.y >= sizeBranch/2) {
          max.push(p);
      }

      var found = false;
      for (var index=0; index<map.length&&!found; index++) {
          var array = map[index];
          var p0 = array[0];
          if (p0.equals (p) || (p0.subtract(p)).lengthSquared() < 0.01){
              array.push(i*3);
              found = true;
          }
      }
      if (!found) {
          var array = [];
          array.push(p, i*3);
          map.push(array);
      }

  }
  var randomNumber = function (min, max) {
      if (min == max) {
          return (min);
      }
      var random = Math.random();
      return ((random * (max - min)) + min);
  };

  map.forEach(function(array) {
      var index, min = -sizeBranch/10, max = sizeBranch/10;
      var rx = randomNumber(min,max);
      var ry = randomNumber(min,max);
      var rz = randomNumber(min,max);

      for (index = 1; index<array.length; index++) {
          var i = array[index];
          positions[i] += rx;
          positions[i+1] += ry;
          positions[i+2] += rz;
      }
  });

  var leavesColor = randomColor({ hue: 'green', luminosity: 'darl', format: 'rgbArray' });
  var trunkColor = randomColor({ hue: 'orange', luminosity: 'dark', format: 'rgbArray' });

  leaves.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
  var normals = [];
  BABYLON.VertexData.ComputeNormals(positions, indices, normals);
  leaves.setVerticesData(BABYLON.VertexBuffer.NormalKind, normals);
  leaves.convertToFlatShadedMesh();

  leaves.material = new BABYLON.StandardMaterial("mat", scene);
  leaves.material.diffuseColor = BABYLON.Color3.FromInts(leavesColor[0], leavesColor[1], leavesColor[2]);
  leaves.material.specularColor = BABYLON.Color3.Black();
  leaves.position.y = sizeTrunk + sizeBranch / 2 - 2;

  var trunk = BABYLON.Mesh.CreateCylinder("trunk", sizeTrunk, radius-2<1?1:radius-2, radius, 10, 2, scene );
  trunk.material = new BABYLON.StandardMaterial("trunk", scene);
  trunk.material.diffuseColor = BABYLON.Color3.FromInts(trunkColor[0], trunkColor[1], trunkColor[2]);
  trunk.material.specularColor = BABYLON.Color3.Black();

  trunk.position.y = (sizeBranch/2+2)-sizeTrunk/2;
  trunk.convertToFlatShadedMesh();

  leaves.parent = tree;
  trunk.parent = tree;
  return tree;
}