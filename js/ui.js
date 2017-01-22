var startWave = 380;
var endWave = 740;
var stepWave = (endWave - startWave) / 100;

function createUi(){
    var current = endWave;

    var base = document.getElementById("myHue");

    for(var i = 0; i < 1000; ++i){
        var element = document.createElement("span");
        element.className = "hueBar";
        var rgb = waveLengthToRGB(current);
        element.style = "background-color: rgb("+rgb[0]+", "+rgb[1]+", "+rgb[2]+");";

        current -= stepWave / 10;
        base.appendChild(element);
    }

    current = endWave;

    base = document.getElementById("otherHue");

    for(i = 0; i < 1000; ++i){
        element = document.createElement("span");
        element.className = "hueBar";
        rgb = waveLengthToRGB(current);
        element.style = "background-color: rgb("+rgb[0]+", "+rgb[1]+", "+rgb[2]+");";

        current -= stepWave / 10;
        base.appendChild(element);
    }
}

function drawCurrentHue(currentHue, c) {
    var bar = document.getElementById("currentHueBar");
    bar.style = "right: "+ ((currentHue - startWave) / stepWave ) +"%;";

    var cc = document.getElementById("currentCBar");
    cc.innerHTML = "<i>c</i> "+ (Math.round(c * 100) / 100) + " | <i>&lambda;</i> " + Math.round(currentHue) + "nm";
    var rgb = waveLengthToRGB(boundWavelengthVisible(currentHue));
    document.getElementById("waveInfo").style = "background-color: rgb("+rgb[0]+", "+rgb[1]+", "+rgb[2]+");";
}

function drawEnemyHue(currentHue) {
    var bar = document.getElementById("enemyHueBar");
    bar.style = "right: "+ ((currentHue - startWave) / stepWave ) +"%;";
}

function drawEnemyHit(currentHue) {
    var bar = document.getElementById("hitHueBar");
    bar.style = "right: "+ ((currentHue - startWave) / stepWave ) +"%;";
}

function drawEnemyDamage(currentHue) {
    var bar = document.getElementById("damageHueBar");
    bar.style = "right: "+ ((currentHue - startWave) / stepWave ) +"%;";
}

function drawEnemyHealth(n, health) {
    document.getElementById("enemyHealthNumber").innerHTML = "#" + n + " ~ " + Math.round(health) + "hp";
}

function flashEnemyHealth() {
    document.getElementById("enemyHealth").style = "background: pink;";
    setTimeout(function () {
        document.getElementById("enemyHealth").style = "";
    }, 100);
}

function showWindow(title, message) {

}