function createGame(canvas){
	loadScript("init.js", function(){
        loadScript("ui.js", function () {
            loadScript("wave.js", function () {
                loadScript("ship.js", function () {
                    initGame(canvas);
                });
            });
        });

	});
}

function loadScript(src, callback){
	var script = document.createElement('script');
	script.src = "js/" + src + "?" + Math.random().toString(36);
	console.log("Loading script \""+script.src+"\"");
	if(typeof callback !== 'undefined'){
		script.onload = callback;
	}

	document.head.appendChild(script);
}
