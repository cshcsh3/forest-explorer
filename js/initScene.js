// The babylon engine
var engine;
// The current scene
var scene;
// The HTML canvas
var canvas;

// The function onload is loaded when the DOM has been loaded
document.addEventListener("DOMContentLoaded", function () {
    onload();
}, false);

// Resize the babylon engine when the window is resized
window.addEventListener("resize", function () {
	if (engine) {
		engine.resize();
	}
},false);

/**
 * Onload function : creates the babylon engine and the scene
 */
var onload = function () {
	// Engine creation
    canvas = document.getElementById("renderCanvas");
	engine = new BABYLON.Engine(canvas, true);

    // Scene creation
	initScene();

    // The render function
	engine.runRenderLoop(function () {
        scene.render();
	});

};

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

var initScene = function() {
    scene = new BABYLON.Scene(engine);

    // Update the scene background color
    scene.clearColor = new BABYLON.Color3(0.8,0.8,0.8);

    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    scene.fogDensity = 0.003;
    scene.fogColor = new BABYLON.Color3(0.8,0.83,0.8);

    /*** CAMERA - START ***/
    // Camera attached to the canvas
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
    var hemiLight = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, -1), scene);

    // Shape to follow
    var shape = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
    shape.position.y = 1;

    // Set target for camera
    camera.lockedTarget = shape;

    createSkybox();

    // Generate trees
    var trees = new TreeGenerator(scene);

    // Ground
    var ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 1, scene);
    ground.material = new BABYLON.StandardMaterial("ground", scene);
    ground.material.diffuseColor = BABYLON.Color3.FromInts(193, 181, 151);
    ground.material.specularColor = BABYLON.Color3.Black();

    ground.receiveShadows = true;

    /*** KEYBOARD INPUT - START ***/
    var inputMap = {};
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {								
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {								
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

    // To be used when animation is implemented
    var animating = false;

    // Game/Render loop
    scene.onBeforeRenderObservable.add(()=>{
        var keydown = false;

        if (inputMap["w"] || inputMap["ArrowUp"]){
            shape.position.z += 0.1
            shape.rotation.y = 0
            keydown = true;
        }

        if(inputMap["a"] || inputMap["ArrowLeft"]){
            shape.position.x -= 0.1
            shape.rotation.y = 3*Math.PI/2
            keydown = true;
        }

        if(inputMap["s"] || inputMap["ArrowDown"]){
            shape.position.z -= 0.1
            shape.rotation.y = 2*Math.PI/2
            keydown=true;
        }

        if(inputMap["d"] || inputMap["ArrowRight"]){
            shape.position.x += 0.1
            shape.rotation.y = Math.PI/2
            keydown = true;
        }

        if (keydown){
            if (!animating){
                animating = true;
                // scene.beginAnimation(skeleton, walkRange.from, walkRange.to, true);
            }
        }else{
            animating = false;
            // scene.stopAnimation(skeleton)
        }
    })
    /*** KEYBOARD INPUT - END ***/
}
