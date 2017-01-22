var speedTarget = maxShipSpeed;
var barTarget = 0;
var objects = {};

var myShipName = "ship1";
var otherShipName = "ship2";

var constantAI = function (myName, my) {
    var otherShip = getShip(myShipName);

    if(!baseEvasion(my, otherShip) || !baseEntry(my, otherShip)){
        return;
    }

    autoPilotSpeed(myName, my);
};

var strangeAI = function (myName, my) {

    var otherShip = getShip(myShipName);

    if(!baseEvasion(my, otherShip) || !baseEntry(my, otherShip)){
        return;
    }


    var distance = vecDistance(getShip(myShipName).position, my.position);


    var goodSpeed = otherShip.speed.z / speedOfLight;
    var otherSpeed = (my.speed.z / speedOfLight);

    if((distance < 20 || getShip(myShipName).position.z > my.position.z) && (goodSpeed > otherSpeed || distance < 10)){
        speedTarget = goodSpeed + 0.08;
        if(distance < 10){
            speedShip(myName, speedTarget + 0.08);
            otherSpeed = speedTarget + 0.08;
        }
    }else if(distance > 240 && goodSpeed < otherSpeed){
        speedTarget = goodSpeed - 0.08;
    }else if (distance > 20 && distance < 200 && Math.random() < 0.05 && speedTarget === null){
        speedTarget = maxShipSpeed * ((1 - Math.sqrt(Math.random())) * 2 - 1);
    }

    if(autoPilotSpeed(myName, my)){
        speedTarget = null;
    }
};

var variableAI = function (myName, my) {

    var otherShip = getShip(myShipName);

    if(!baseEvasion(my, otherShip) || !baseEntry(my, otherShip)){
        return;
    }


    var distance = vecDistance(getShip(myShipName).position, my.position);


    var goodSpeed = otherShip.speed.z / speedOfLight;
    var otherSpeed = (my.speed.z / speedOfLight);

    if((distance < 20 || getShip(myShipName).position.z > my.position.z) && (goodSpeed > otherSpeed || distance < 10)){
        speedTarget = goodSpeed + 0.08;
        if(distance < 10){
            speedShip(myName, speedTarget + 0.08);
            otherSpeed = speedTarget + 0.08;
        }
    }else if(distance > 240 && goodSpeed < otherSpeed){
        speedTarget = goodSpeed - 0.08;
    }else if (distance > 20 && distance < 200 && Math.random() < 0.05 && speedTarget === null){
        speedTarget = maxShipSpeed * ((1 - Math.sqrt(Math.random())) * 2 - 1);
    }

    if(barTarget === null && Math.random() < 0.01){
        barTarget = randomWavelength(450, 680);
    }

    if(autoPilotSpeed(myName, my)){
        speedTarget = null;
    }

    if(autoControlW(my)){
        barTarget = null;
    }
};

var currentEnemyEntry = 0;
var enemyEntries = [
    [10, 200, maxShipSpeed * 0.3, 550, constantAI],
    [10, 70, maxShipSpeed * 0.6, 550, constantAI],
    [10, 100, maxShipSpeed * 0.6, 620, constantAI],
    [20, 150, maxShipSpeed * 0.8, 650, constantAI],
    [20, 150, maxShipSpeed * 0.3, randomWavelength(500, 600), constantAI],
    [20, 100, maxShipSpeed * 0.6, randomWavelength(500, 600), constantAI],
    [20, 200, maxShipSpeed * 0.3, randomWavelength(500, 600), strangeAI],
    [50, 100, maxShipSpeed, randomWavelength(500, 600), strangeAI],
    [80, 100, maxShipSpeed, randomWavelength(500, 600), strangeAI],
    [100, 70, maxShipSpeed, randomWavelength(430, 650), strangeAI],
    [150, 70, maxShipSpeed, randomWavelength(430, 650), strangeAI],
    [200, 70, maxShipSpeed, randomWavelength(430, 650), strangeAI],
    [200, 70, maxShipSpeed, randomWavelength(430, 650), variableAI],
];

function loadAssets(callback) {
    var music = new BABYLON.Sound("Music", "/assets/sound/all.mp3", scene, null, { loop: true, autoplay: true });
    music.setVolume(0.4);

    BABYLON.SceneLoader.ImportMesh("", "/assets/newship/", "turbo.obj", scene, function (meshes) {

        var turbo = BABYLON.Mesh.MergeMeshes(meshes);
        /*
         diffuseTexture: BaseTexture;
         ambientTexture: BaseTexture;
         opacityTexture: BaseTexture;
         reflectionTexture: BaseTexture;
         emissiveTexture: BaseTexture;
         specularTexture: BaseTexture;
         bumpTexture: BaseTexture;
         lightmapTexture: BaseTexture;
         */
        turbo.material = new BABYLON.StandardMaterial("texture1", scene);
        turbo.speed = new BABYLON.Vector3(0, 0, 0);
        turbo.position = new BABYLON.Vector3(0, 0, -100000);
        turbo.scaling.x = 10;
        turbo.scaling.y = 10;
        turbo.scaling.z = 11;
        turbo.rotation.y = Math.PI/2;
        objects["Turbo"] = turbo.clone("Turbo", turbo.parent);

        BABYLON.SceneLoader.ImportMesh("", "/assets/newship/", "Ship2.obj", scene, function (meshes) {

            var ship = BABYLON.Mesh.MergeMeshes(meshes);
            /*
             diffuseTexture: BaseTexture;
             ambientTexture: BaseTexture;
             opacityTexture: BaseTexture;
             reflectionTexture: BaseTexture;
             emissiveTexture: BaseTexture;
             specularTexture: BaseTexture;
             bumpTexture: BaseTexture;
             lightmapTexture: BaseTexture;
             */
            ship.material = new BABYLON.StandardMaterial("texture1", scene);
            ship.material.diffuseTexture = new BABYLON.Texture("/assets/newship/ShipDiffColorRed.png", scene);
            ship.material.ambientTexture = new BABYLON.Texture("/assets/newship/ShipAmbOcc.jpg", scene);
            ship.speed = new BABYLON.Vector3(0, 0, 0);
            ship.position = new BABYLON.Vector3(0, 0, -100000);
            ship.scaling.x = 20;
            ship.scaling.y = 20;
            ship.scaling.z = 20;
            ship.rotation.y = Math.PI/2;
            objects["BigShip"] = ship.clone("BigShip", ship.parent);

            ship.scaling.x = 10;
            ship.scaling.y = 10;
            ship.scaling.z = 10;
            ship.material = new BABYLON.StandardMaterial("texture1", scene);
            ship.material.diffuseTexture = new BABYLON.Texture("/assets/newship/ShipDiffColorBlue.png", scene);
            ship.material.ambientTexture = new BABYLON.Texture("/assets/newship/ShipAmbOcc.jpg", scene);
            objects["SmallShip"] = ship.clone("SmallShip", ship.parent);

            callback();

        });

    });
}

function autoPilotSpeed(myName, my) {
    var speed = my.speed.z / speedOfLight;
    if(speedTarget !== null){
        if(Math.abs(speed - speedTarget) < 0.02){
            //speedTarget = null;
            return true;
        }else{
            if(my.speed.z < speedTarget){
                speedShip(myName, speed + shipAcceleration);
            }else{
                speedShip(myName, speed - shipAcceleration);
            }

        }
        return false;
    }

    return true;
}

function autoControlW(my) {
    if(barTarget !== null){
        if(Math.abs(my.hitWavelength - barTarget) < 1){
            return true;
        }else{
            if(my.hitWavelength < barTarget){
                my.hitWavelength += 0.3;
            }else{
                my.hitWavelength -= 0.3;
            }

        }
        return false;
    }

    return true;
}

function createNextEnemy(){
    if(enemyEntries[currentEnemyEntry] !== undefined){
        otherShipName = "ship_enemy" + currentEnemyEntry;
        var entry = enemyEntries[currentEnemyEntry];
        createEnemyShip(otherShipName, entry[0], entry[1], entry[3], entry[4]);
        speedShip(otherShipName, entry[2]);
        speedTarget = entry[2];
        barTarget = entry[3];
        ++currentEnemyEntry;
    }else{

        otherShipName = "ship_enemy" + currentEnemyEntry;
        var entry = enemyEntries[currentEnemyEntry];
        createEnemyShip(otherShipName, currentEnemyEntry * 10, randomWavelength(40, 200), randomWavelength(430, 650), variableAI);
        speedShip(otherShipName, maxShipSpeed * Math.random());
        speedTarget = maxShipSpeed * Math.random();
        barTarget = randomWavelength(430, 650);

        ++currentEnemyEntry;
        //window.location.reload();
    }
}

function baseEntry(my, otherShip) {
    if(my.position.x !== otherShip.position.x || my.position.y !== otherShip.position.y){
        my.position.x += (otherShip.position.x - my.position.x) * 0.04;
        my.position.y += (otherShip.position.y - my.position.y) * 0.04;

        if(Math.abs(otherShip.position.x - my.position.x) < 0.5 && Math.abs(otherShip.position.y - my.position.y) < 0.5){
            my.position.x = otherShip.position.x;
            my.position.y = otherShip.position.y;
        }else{
            return false;
        }
    }

    return true;
}

function baseEvasion(my, otherShip) {
    drawEnemyHue(my.realWavelength);

    var distance = vecDistance(my.position, otherShip.position);
    if(distance < 10){
        my.position.y += (otherShip.position.y + 6 - my.position.y) * 0.04;

        if((my.position.z + 2) < otherShip.position.z){
            my.speed.z = otherShip.speed.z + 0.01;
        }
        return false;
    }

    return true;
}

function createShips() {
    createMyShip(20);
    createNextEnemy();

    speedShip(myShipName, 0.2);
}

function createMyShip(health){
    var ship = objects["SmallShip"].clone(myShipName, objects["SmallShip"].parent);
    ship.wavelength = 400;
    ship.health = health;
    ship.position = new BABYLON.Vector3(0, 0, 0);
    ship.ai = function () {

    };
    myObjects[myShipName] = ship;

    var turbo = objects["Turbo"].clone(myShipName + "_turbo", objects["Turbo"].parent);
    turbo.ai = function (myName, my) {
        my.position = getShip(myShipName).position.clone();
        var speed = getShip(myShipName).speed;
        my.position.z += 0.4;

        return;
        if(speed.z <= 0){
            if(my.rotation.z < Math.PI){
                my.rotation.z += 0.1;
            }else{
                my.rotation.z = Math.PI;
            }
        }else if(speed.z > 0){
            if(my.rotation.z > 0){
                my.rotation.z -= 0.1;
            }else{
                my.rotation.z = 0;
            }
        }
    };
    myObjects[myShipName + "_turbo"] = turbo;

    var particleSystem = new BABYLON.ParticleSystem("particles_" + myShipName, 2000, scene);
    particleSystem.particleTexture = new BABYLON.Texture("/assets/flare.png", scene);
    particleSystem.textureMask = new BABYLON.Color4(0.1, 0.8, 0.8, 1.0);
    particleSystem.emitter = ship;
    particleSystem.minEmitBox = new BABYLON.Vector3(0.05, 0.04, -0.23); // Starting all From
    particleSystem.maxEmitBox = new BABYLON.Vector3(0.05, 0.06, -0.25); // To...
    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
    particleSystem.minSize = 0.05;
    particleSystem.maxSize = 0.1;
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 1.5;
    particleSystem.emitRate = 800;
    particleSystem.direction1 = new BABYLON.Vector3(-0.1, -0.1, -0.1);
    particleSystem.direction2 = new BABYLON.Vector3(0.1, 0.1, 0.1);
    particleSystem.start();



    var particleSystem2 = new BABYLON.ParticleSystem("particles2_" + myShipName, 2000, scene);
    particleSystem2.particleTexture = new BABYLON.Texture("/assets/flare.png", scene);
    particleSystem2.textureMask = new BABYLON.Color4(0.1, 0.8, 0.8, 1.0);
    particleSystem2.emitter = ship;
    particleSystem2.minEmitBox = new BABYLON.Vector3(0.05, 0.04, 0.23); // Starting all From
    particleSystem2.maxEmitBox = new BABYLON.Vector3(0.05, 0.06, 0.25); // To...
    particleSystem2.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem2.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem2.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
    particleSystem2.minSize = 0.05;
    particleSystem2.maxSize = 0.1;
    particleSystem2.minLifeTime = 0.3;
    particleSystem2.maxLifeTime = 1.5;
    particleSystem2.emitRate = 800;
    particleSystem2.direction1 = new BABYLON.Vector3(-0.1, -0.1, -0.1);
    particleSystem2.direction2 = new BABYLON.Vector3(0.1, 0.1, 0.1);
    particleSystem2.start();

    ship.particleSystem = particleSystem;
    ship.particleSystem2 = particleSystem2;
}

function randomWavelength(min, max){
    return min + (Math.random() * ((max - min) + 1));
}

function createEnemyShip(name, health, distance, wavelength, ai){
    var ship = objects["BigShip"].clone(name, objects["BigShip"].parent);
    ship.wavelength = 400;
    ship.hitWavelength = wavelength;
    ship.health = health;
    ship.position = new BABYLON.Vector3((Math.random() - 0.5) * 250, (Math.random() - 0.5) * 250, getShip(myShipName).position.z + distance);
    ship.ai = ai;
    myObjects[name] = ship;

    var particleSystem = new BABYLON.ParticleSystem("particles_" + name, 8000, scene);
    particleSystem.particleTexture = new BABYLON.Texture("/assets/flare.png", scene);
    particleSystem.textureMask = new BABYLON.Color4(0.1, 0.8, 0.8, 1.0);
    particleSystem.emitter = ship;
    particleSystem.minEmitBox = new BABYLON.Vector3(0.1, 0.03, -0.03); // Starting all From
    particleSystem.maxEmitBox = new BABYLON.Vector3(0.1, 0.07, 0.03); // To...
    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
    particleSystem.minSize = 0.05;
    particleSystem.maxSize = 0.1;
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 1.5;
    particleSystem.emitRate = 2000;
    particleSystem.direction1 = new BABYLON.Vector3(-0.2, 0, -0.2);
    particleSystem.direction2 = new BABYLON.Vector3(0.2, 0.2, 0.2);
    particleSystem.start();
    
    var explosions = new BABYLON.ParticleSystem("particles_" + name, 4000, scene);
    explosions.particleTexture = new BABYLON.Texture("/assets/flare.png", scene);
    explosions.textureMask = new BABYLON.Color4(1, 1, 1, 1.0);
    explosions.emitter = ship;
    explosions.minEmitBox = new BABYLON.Vector3(0.1, 0.05, 0); // Starting all From
    explosions.maxEmitBox = new BABYLON.Vector3(0.1, 0.05, 0); // To...
    explosions.color1 = new BABYLON.Color4(1, 0, 0, 1.0);
    explosions.color2 = new BABYLON.Color4(1, 1, 0, 1.0);
    explosions.colorDead = new BABYLON.Color4(0.2, 0.2, 0.2, 0.0);
    explosions.minSize = 0.5;
    explosions.maxSize = 0.9;
    explosions.minLifeTime = 0.3;
    explosions.maxLifeTime = 1.5;
    explosions.manualEmitCount = 300;
    explosions.direction1 = new BABYLON.Vector3(-1, -1, -1);
    explosions.direction2 = new BABYLON.Vector3(1, 1, 1);

    ship.particleSystem = particleSystem;
    ship.explosions = explosions;

}


function getLaserParticle(name, forceNew){
    if(!(name in myObjects) && forceNew === true){
        var p;
        if(!(name in myObjects)){
            //p = objects["Wave"].clone(name, objects["Wave"].parent);
            p = BABYLON.Mesh.CreateCylinder(name, 4, 0.2, 0.2, 16, 16, scene)
        }else{
            p = myObjects[name];
        }
        p.material = new BABYLON.StandardMaterial("texture1", scene);
        p.material.alpha = 0.7;
        p.speed = new BABYLON.Vector3(0, 0, speedOfLight);
        p.wavelength = shootingWavelength;
        myObjects[name] = p;
    }

    return myObjects[name];
}

function shootLaserParticle(shipName) {
    var ship = getShip(shipName);
    var name = shipName + "_laser" + (new Date()).getSeconds() + "_" + Math.round((new Date()).getMilliseconds() / 100);
    if(!(name in myObjects)){
        var p = getLaserParticle(name, true);
        p.position = ship.position.clone();
        p.position.z += 10;
        p.wavelength = shootingWavelength;
        modLaserParticle(name, ship.speed.z);
    }
}

function modLaserParticle(name, speed){
    var p = getLaserParticle(name);
    if(p === null || typeof p === 'undefined'){
        return null;
    }

    p.wavelength = wavelengthRedShift(-speed, p.wavelength, speedOfLight);
    var wavelength = boundWavelengthVisible(p.wavelength);

    var rgb = waveLengthToRGB(wavelength);

    p.material.emissiveColor = p.material.ambientColor = p.material.diffuseColor = new BABYLON.Color3(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);

    return p;
}

function getShip(name){
    if(!(name in myObjects)){
        var ship = BABYLON.Mesh.CreateSphere(name, 16, 2, scene);
        ship.material = new BABYLON.StandardMaterial("texture1", scene);
        ship.speed = new BABYLON.Vector3(0, 0, 0);
        ship.wavelength = 400;
        ship.health = 20;
        ship.ai = function () {

        };
        myObjects[name] = ship;
    }

    return myObjects[name];
}

function moveShip(name, position){
    var ship = getShip(name);
    ship.position = position;
}

function speedShip(name, z){
    var ship = getShip(name);

    var speed = z;

    if(speed > maxShipSpeed){
        speed = maxShipSpeed;
    }else if(speed < -maxShipSpeed){
        speed = -maxShipSpeed;
    }

    speed *= speedOfLight;

    ship.speed = new BABYLON.Vector3(0, 0, speed);

    modShip(name, ship.speed.z);

}

function slideObject(key, ob){
    ob.position.x += ob.speed.x;
    ob.position.y += ob.speed.y;
    ob.position.z += ob.speed.z;


    var enemy = getShip(otherShipName);

    if(enemy !== ob && key !== myShipName && key !== (myShipName + "_turbo") && Math.abs(enemy.position.z - ob.position.z) < 3 && vecDistance(enemy.position, ob.position) < 3){ //¯\_(ツ)_/¯
        collideObject(key, ob, enemy);
        ob.dispose();
        ob = null;
        delete myObjects[key];
    }
}

function collideObject(obKey, ob, to){

    modLaserParticle(obKey, -to.speed.z);

    var damage = Math.min(10, 1 / Math.sqrt(Math.abs(ob.wavelength - to.hitWavelength)));

    if(damage > 0.2){
        if(currentEnemyEntry >= 3){
            speedTarget = (to.speed.x / speedOfLight) * (Math.random() - 0.5) * 0.2;
        }
        flashEnemyHealth();
        to.health -= damage;
        if(to.health <= 0){
            to.explosions.manualEmitCount = 1000;
            to.explosions.start();
            onEnemyKilled();
        }else{
            to.explosions.manualEmitCount = 100 * damage;
            to.explosions.start();
        }
    }
}

function onEnemyKilled(){
    var ship = getShip(otherShipName);
    ship.ai = function (myName, my) {

    };

    extraObjectPoll[otherShipName] = ship;

    delete myObjects[otherShipName];

    setTimeout(function () {
        delete extraObjectPoll[ship.name];
        ship.dispose();
        ship = null;
        objectToTrack = null;
        //objectToTrack = null;
    }, 2000);

    createNextEnemy();
}

function modShip(name, speed){
    var ship = getShip(name);

    var realWavelength = wavelengthRedShift(-speed, shootingWavelength, speedOfLight);
    var wavelength = boundWavelengthVisible(realWavelength);

    var rgb = waveLengthToRGB(wavelength);

    ship.wavelength = wavelength;

    ship.realWavelength = realWavelength;

    if(ship.hasOwnProperty("particleSystem")){
        ship.particleSystem.color2 = ship.particleSystem.color1 = new BABYLON.Color4(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, 1.0);
    }
    if(ship.hasOwnProperty("particleSystem2")){
        ship.particleSystem2.color2 = ship.particleSystem2.color1 = new BABYLON.Color4(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, 1.0);
    }

    if(name === myShipName){
        var turbo = getShip(myShipName + "_turbo");
        turbo.material.emissiveColor = turbo.material.ambientColor = turbo.material.diffuseColor = new BABYLON.Color3(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
    }

    //ship.material.emissiveColor = ship.material.ambientColor = ship.material.diffuseColor = new BABYLON.Color3(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);

    return ship;
}