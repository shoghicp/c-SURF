var speedOfLight = 4;
var maxShipSpeed = 0.35;
var shipAcceleration = 0.004;
var shootingWavelength = 530;
var scene = null;
var engine = null;
var camera = null;
var myObjects = {};
var extraObjectPoll = {};
var space = false;
var forward = false;
var backward = false;
var objectToTrack = null;

function initGame(canvas){
	createUi();

	engine = createEngine(canvas);
	window.addEventListener('resize', function() {
		engine.resize();
	});
		
	scene = createScene(engine, canvas);

	loadAssets(function () {
		createShips();
		runGame();
    });
	
}

function runGame() {

    document.onkeydown = function(evt) {
        evt = evt || window.event;
        if (evt.keyCode == 32) { //Space
            shootLaserParticle(myShipName);
            space = true;
        }else if(evt.keyCode == 87){ //W
            forward = true;
        }else if(evt.keyCode == 83){ //S
            backward = true;
        }
        document.getElementById("window").style = "display:none;";
    };

    document.onkeyup = function(evt) {
        evt = evt || window.event;
        if (evt.keyCode == 32) { //Space
            space = false;
        }else if(evt.keyCode == 87){ //W
            forward = false;
        }else if(evt.keyCode == 83){ //S
            backward = false;
        }
    };

    createStars();

    engine.runRenderLoop(function() {

        pollControls();

        for (var key in myObjects) {
            if (myObjects.hasOwnProperty(key)) {
            	var ob = myObjects[key];
            	if(ob.hasOwnProperty("ai")){
            		ob.ai(key, ob);
				}
                slideObject(key, ob);
            }
        }

        for (key in extraObjectPoll) {
            if (extraObjectPoll.hasOwnProperty(key)) {
                ob = extraObjectPoll[key];
                if(ob.hasOwnProperty("ai")){
                    ob.ai(key, ob);
                }
                slideObject(key, ob);
            }
        }


        drawEnemyHealth(currentEnemyEntry, getShip(otherShipName).health);
        drawRandomBars();

        if(objectToTrack === null){
            objectToTrack = getShip(otherShipName);
        }

        if(objectToTrack.name !== ""){
            focusCamera(getShip(myShipName).position, objectToTrack.position);
        }


        scene.render();
    });
}

function createStars(){

    var starSystem = new BABYLON.ParticleSystem("stars", 30000, scene);
    starSystem.particleTexture = new BABYLON.Texture("assets/flare.png", scene);
    starSystem.textureMask = new BABYLON.Color4(1, 1, 1, 1.0);
    starSystem.emitter = getShip(myShipName);
    starSystem.minEmitBox = new BABYLON.Vector3(-80, -80, -80); // Starting all From
    starSystem.maxEmitBox = new BABYLON.Vector3(80, 80, 80); // To...
    starSystem.color1 = new BABYLON.Color4(1, 0.8, 0.8, 0.7);
    starSystem.color2 = new BABYLON.Color4(1, 1, 1, 1.0);
    starSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
    starSystem.minSize = 1.2;
    starSystem.maxSize = 2.3;
    starSystem.minLifeTime = 15;
    starSystem.maxLifeTime = 30;
    starSystem.emitRate = 1000;
    starSystem.direction1 = new BABYLON.Vector3(0, 0, 0.01);
    starSystem.direction2 = new BABYLON.Vector3(0, 0, 0.05);
    starSystem.start();
}

function pollControls(){

    if(space){
        shootLaserParticle(myShipName);
    }

	var currentSpeed = getShip(myShipName).speed.z;
	if(forward && !backward){
		currentSpeed += (speedOfLight * shipAcceleration);
	}else if(!forward && backward){
        currentSpeed -= (speedOfLight * shipAcceleration);
    }else{
		return;
	}


    if(currentSpeed > (speedOfLight * maxShipSpeed)){
		currentSpeed = speedOfLight * maxShipSpeed;
	}else if(currentSpeed < -(speedOfLight * maxShipSpeed)){
        currentSpeed = -speedOfLight * maxShipSpeed;
    }

    speedShip(myShipName, currentSpeed / speedOfLight);

	drawCurrentHue(getShip(myShipName).realWavelength, currentSpeed / speedOfLight);

}

function drawRandomBars() {
    var wavelength = wavelengthRedShift(-getShip(myShipName).speed.z, shootingWavelength, speedOfLight);
    wavelength = wavelengthRedShift(getShip(otherShipName).speed.z, wavelength, speedOfLight);
    wavelength = boundWavelengthVisible(wavelength);

    drawEnemyHit(getShip(otherShipName).hitWavelength);
    drawEnemyDamage(wavelength);
}

function createEngine(canvas){
	var engine = new BABYLON.Engine(canvas, true);
	
	return engine;
}

function vecDistance(pos1, pos2){
	return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2) + Math.pow(pos1.z - pos2.z, 2));
}

function focusCamera(pos1, pos2){
	var distance = vecDistance(pos1, pos2);
	var basePos = new BABYLON.Vector3(pos1.x, pos1.y, pos1.z);
	basePos.y += Math.min(Math.max(15 - Math.sqrt(distance), 5), 15);

	//if((pos1.z - 7) < pos2.z){
        if(Math.abs(pos1.x - pos2.x) < Math.abs(pos1.z - pos2.z)){
            basePos.z += -Math.max(12, Math.min(30, 30 - Math.sqrt(distance)));
        }else{
            basePos.x += -Math.max(12, Math.min(30, 30 - Math.sqrt(distance)));
        }
    //}else{
    //    if(Math.abs(pos1.x - pos2.x) < Math.abs(pos1.z - pos2.z)){
    //        basePos.z -= -Math.max(12, Math.min(30, 30 - Math.sqrt(distance)));
    //    }else{
    //        basePos.x -= -Math.max(12, Math.min(30, 30 - Math.sqrt(distance)));
    //    }
    //}

    var goPos = new BABYLON.Vector3((camera.position.x * 4 + basePos.x) / 5, (camera.position.y * 4 + basePos.y) / 5, (camera.position.z * 4 + basePos.z) / 5);

	camera.position = basePos;
    var goTo = new BABYLON.Vector3(0, (pos1.y * 4 + pos2.y) / 5, (pos1.z * 4 + pos2.z) / 5);
    goTo = new BABYLON.Vector3((camera.getTarget().x * 4 + goTo.x), (camera.getTarget().y * 4 + goTo.y) / 5, (camera.getTarget().z * 4 + goTo.z) / 5);
    camera.setTarget(goTo);

}


function createScene(engine, canvas){
    // create a basic BJS Scene object
    scene = new BABYLON.Scene(engine);

    scene.clearColor = new BABYLON.Color3(0, 0, 0.1                        );

    // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
    camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5,-10), scene);
    scene.activeCamera = camera;
    //camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 20, -20), scene);
    //scene.activeCamera = camera;
    //camera.radius = 10; // how far from the object to follow
    //camera.heightOffset = 8; // how high above the object to place the camera
    //camera.rotationOffset = 90; // the viewing angle
    //camera.cameraAcceleration = 0.02; // how fast to move
    //camera.maxCameraSpeed = 20; // speed limit

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    var light = new BABYLON.DirectionalLight('light1', new BABYLON.Vector3(0,-1,0.5), scene);
    //light.diffuse = new BABYLON.Color3(1, 0, 0);
    //light.specular = new BABYLON.Color3(1, 1, 1);

    // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
    //var ground = BABYLON.Mesh.CreateGround('ground1', 60000, 60000, 2, scene);

    // return the created scene

    BABYLON.Effect.ShadersStore["bwPixelShader"] =
        "precision highp float;" +
        "varying vec2 vUV;" +
        "uniform sampler2D textureSampler;" +
        "uniform sampler2D scene0Sampler;" +
        "uniform sampler2D scene1Sampler;" +
        "void main(void)" +
        "{" +
        "	gl_FragColor = texture2D(textureSampler, vUV) * 0.5 + texture2D(scene0Sampler, vUV) * 0.25 + texture2D(scene1Sampler, vUV) * 0.25;" +
        "}";

    var copies = [];
    copies.push(new BABYLON.PassPostProcess("Scene copy#1", 1.0, camera));
    copies.push(new BABYLON.PassPostProcess("Scene copy#2", 1.0, camera));
    copies.push(new BABYLON.PassPostProcess("Scene copy#3", 1.0, camera));
    var current = 1;

    camera.detachPostProcess(copies[1]);
    camera.detachPostProcess(copies[2]);

    var postProcess1 = new BABYLON.PostProcess("BW", "bw", ["time"], ["scene0Sampler", "scene1Sampler"], 1.0, camera, BABYLON.Texture.BILINEAR_SAMPLINGMODE);
    postProcess1.onApply = function (effect) {
        var next = current + 1;

        if (next === copies.length) {
            next = 0;
        }
        effect.setTextureFromPostProcess("scene0Sampler", copies[current]);
        effect.setTextureFromPostProcess("scene1Sampler", copies[next]);
    };

    // Switch
    scene.registerAfterRender(function () {
        var prev = current - 1;

        if (prev < 0) {
            prev = copies.length - 1;
        }

        camera.detachPostProcess(copies[prev]);

        current++;

        if (current == copies.length) {
            current = 0;
        }

        prev = current - 1;

        if (prev < 0) {
            prev = copies.length - 1;
        }
        camera.attachPostProcess(copies[prev], 0);
    });



    return scene;
}
