var canvas = document.getElementById("renderCanvas");

var createSkybox = function() {
    // The box creation
    var skybox = BABYLON.Mesh.CreateSphere("skyBox", 100, 1000, scene);

    // The sky creation
    BABYLON.Engine.ShadersRepository = "shaders/";

    var shader = new BABYLON.ShaderMaterial("gradient", scene, "gradient", {});
    shader.setFloat("offset", 10);
    shader.setColor3("topColor", BABYLON.Color3.FromInts(0,119,255));
    shader.setColor3("bottomColor", BABYLON.Color3.FromInts(240,240, 255));

    shader.backFaceCulling = false;

    // box + sky = skybox !
    skybox.material = shader;
};

var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    scene.actionManager = new BABYLON.ActionManager(scene);

    // Update the scene background color
    scene.clearColor=new BABYLON.Color3(0.8,0.8,0.8);

    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    scene.fogDensity = 0.003;
    scene.fogColor = new BABYLON.Color3(0.8,0.83,0.8);

    /*** CAMERA - START ***/
    // This creates and initially positions a follow camera 	
    var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 10, -10), scene);

    //The goal distance of camera from target
    camera.radius = 10;

    // The goal height of camera above local origin (centre) of target
    camera.heightOffset = 5;

    // The goal rotation of camera around local origin (centre) of target in x y plane
    camera.rotationOffset = 0;

    //Acceleration of camera in moving from current to goal position
    camera.cameraAcceleration = 0.01

    //The speed at which acceleration is halted 
    camera.maxCameraSpeed = 10

    //camera.target is set after the target's creation

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    /*** CAMERA - END ***/

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Shape to follow
    var box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
    box.position = new BABYLON.Vector3(20, 1, 10);

    // Set target for camera
    camera.lockedTarget = box;

    createSkybox();

    // Ground
    var ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 1, scene);
    ground.material = new BABYLON.StandardMaterial("ground", scene);
    ground.material.diffuseColor = BABYLON.Color3.FromInts(193, 181, 151);
    ground.material.specularColor = BABYLON.Color3.Black();

    ground.receiveShadows = true;

    /*** KEYBOARD INPUT - START ***/
    scene.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
            {
                trigger: BABYLON.ActionManager.OnKeyDownTrigger,
                parameter: 'w'
            },
            function () { console.log('up'); box.position.z += 2; }
        )
    );
    /*** KEYBOARD INPUT - END ***/

    return scene;
};

var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
var scene = createScene();

engine.runRenderLoop(function () {
    if (scene) {
        scene.render();
    }
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});