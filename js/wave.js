function wavelengthRedShift(travelSpeed, wavelength, lightSpeed){
    var beta = travelSpeed / lightSpeed;

    var z = Math.sqrt((1 + beta) / (1 - beta));


    return z * wavelength;
}

function boundWavelengthVisible(wavelength) {
	if(wavelength < 400){ //Blue
		return 400;
	}else if(wavelength > 700){ //Red
		return 700;
	}

	return wavelength;
}

function waveLengthToRGB(wavelength){
    var Gamma = 0.80;
    var IntensityMax = 255;

    var factor = 0.0;
    var r = 0.0;
    var g = 0.0;
    var b = 0.0;

    if((wavelength >= 380) && (wavelength<440)){
        r = -(wavelength - 440) / (440 - 380);
        g = 0.0;
        b = 1.0;
    }else if((wavelength >= 440) && (wavelength<490)){
        r = 0.0;
        g = (wavelength - 440) / (490 - 440);
        b = 1.0;
    }else if((wavelength >= 490) && (wavelength<510)){
        r = 0.0;
        g = 1.0;
        b = -(wavelength - 510) / (510 - 490);
    }else if((wavelength >= 510) && (wavelength<580)){
        r = (wavelength - 510) / (580 - 510);
        g = 1.0;
        b = 0.0;
    }else if((wavelength >= 580) && (wavelength<645)){
        r = 1.0;
        g = -(wavelength - 645) / (645 - 580);
        b = 0.0;
    }else if((wavelength >= 645) && (wavelength<781)){
        r = 1.0;
        g = 0.0;
        b = 0.0;
    }else{
        r = 0.0;
        g = 0.0;
        b = 0.0;
    }

    if((wavelength >= 380) && (wavelength<420)){
        factor = 0.3 + 0.7*(wavelength - 380) / (420 - 380);
    }else if((wavelength >= 420) && (wavelength<701)){
        factor = 1.0;
    }else if((wavelength >= 701) && (wavelength<781)){
        factor = 0.3 + 0.7*(780 - wavelength) / (780 - 700);
    }else{
        factor = 0.0;
    }


    var rgb = [0, 0, 0];

    rgb[0] = Math.abs(r) < 0.00001 ? 0 : Math.round(IntensityMax * Math.pow(r * factor, Gamma));
    rgb[1] = Math.abs(g) < 0.00001 ? 0 : Math.round(IntensityMax * Math.pow(g * factor, Gamma));
    rgb[2] = Math.abs(b) < 0.00001 ? 0 : Math.round(IntensityMax * Math.pow(b * factor, Gamma));

    return rgb;
}