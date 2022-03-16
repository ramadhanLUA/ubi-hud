let currentElements = {};

currentElements["hud"] = {
    health: 95,
    armor: 95,
    hunger: 95,
    thirst: 95,
    stress: 100,
    stamina: 95,
    diving: 95,
}

currentElements["show"] = {
    health: true,
    armor: true,
    hunger: true,
    thirst: true,
    stress: true,
    stamina: true,
    diving: true,
}


$(document).ready(() => {
    Speedometer = new ProgressBar.Circle("#SpeedGauge", {
        color: "#235157",
        trailColor: "#ffffff",
        strokeWidth: 8,
        duration: 100,
        trailWidth: 8,
        easing: "easeInOut",
    });
});

window.addEventListener("message", (event) => {
     if (event.data.type == "voiceIcon") {
        var element = document.getElementById("Voiceicon");
        if (event.data.voiceIcon) {
            element.classList.add("fa-headset");
        } else {
            element.classList.add("fa-microphone"); 
        }
    }
});

$("#developericon").hide()

window.addEventListener("message", (event) => {
    if (event.data.type == "talkingStatus") {
        if (event.data.is_talking == true) {
            $("#voice").css("stroke", "yellow")
            $(".complete.voice").css("fill", "yellow", "opacity", "0.35");
        } else  if (event.data.is_talking == false) {
            $("#voice").css("stroke", "white")
        $(".complete.voice").css("fill", "white", "opacity", "0.35")
        }
    } else if (event.data.type == "transmittingStatus") {
        var element = document.getElementById("voice");
        var backelement = document.getElementById("backvoice");
        if (event.data.is_transmitting) {
            element.classList.add("transmitting");
            backelement.classList.add("transmitting2");
        } else {
            element.classList.remove("transmitting");
            backelement.classList.remove("transmitting2");  
        }
}
});

window.addEventListener("message", (event) => {
    let data = event.data;

	// if (data["toggle"] === true) {
	// 	$("#settings-container").slideDown();
	// } else if (data["toggle"] === false){
	// 	$("#settings-container").slideUp();
	// }

	if (data["action"] == "hide") {
		$(".hud-container").fadeOut();
	}
    
	if (data["action"] == "show") {
		$(".hud-container").fadeIn();
	} else if (data["action"] == "update") {
		for (const all in data.data) {
            if (data.data[all] > currentElements["hud"][all] || !currentElements["show"][all]) {
                $(`.${all}`).fadeOut();
            } else {
                $(`.${all}`).fadeIn();
            }
        }
        setMetaData("health", data.data.health)
        setMetaData("armor", data.data.armor)
        setMetaData("hunger", data.data.hunger)
        setMetaData("thirst", data.data.thirst)
		setMetaData("stamina", data.data.stamina)
        setMetaData("diving", data.data.diving) 
        setMetaData("stress", data.data.stress)
        
	} 
	     if (data["action"] == "voice_level"){
            switch (data.voicelevel) {
                case 1:
                  data.voicelevel = 70;
                  break;
                case 2:
                  data.voicelevel = 33;
                  break;
                case 3:
                  data.voicelevel = 0;
                  break;
                default:
                  data.voicelevel = 70;
                  break;
              }
        $("#voice").animate({'stroke-dashoffset': data["voicelevel"]}, 500);
    }

    if (data.action == "devmode") {
        $("#developericon").fadeToggle()
      }

    if (data.speed > 0) {
        $(".Speed_Meter").text(data.speed);
        let multiplier = data.maxspeed * 0.1;
        let SpeedoLimit = data.maxspeed + multiplier;
        setProgressSpeed(data.speed,'.Speed_Meter');
    } else if (data.speed == 0) {
        $(".Speed_Meter").text("0");
    }

    if (data["VehicleUI"] == true) {
        $(".vehicle-container").fadeIn(250);
        $(".seatbelt").fadeIn(250);
    } else if (data["VehicleUI"] == false) {
        $(".vehicle-container").fadeOut(250);
        $(".seatbelt").fadeOut(250);
    }

    if(data["action"] == "seatbeltOn"){
        $("#seatbelt").animate({'stroke-dashoffset': "0"}, 500)
        // $("#seatbelt").fadeOut(250);
	} else if(data.action == "seatbeltOff"){
        $("#seatbelt").animate({'stroke-dashoffset': "100"}, 500)
        // $("#seatbelt").fadeIn(250);
	}



    if (data["action"] == "update_fuel") {
        setProgressFuel(data["value"],'.Gas_gauge');
    }

})





$(document).ready(() => {
    $("#health-val").val(currentElements["hud"]["health"]);
    $("#armor-val").val(currentElements["hud"]["armor"]);
    $("#hunger-val").val(currentElements["hud"]["hunger"]);
    $("#thirst-val").val(currentElements["hud"]["thirst"]);
    $("#stamina-val").val(currentElements["hud"]["stamina"]);
    $("#diving-val").val(currentElements["hud"]["diving"]);
    $("#stress-val").val(currentElements["hud"]["stress"]);

    
    $("#health").checked = currentElements["show"]["health"];
    $("#armor").checked = currentElements["show"]["armor"];
    $("#hunger").checked = currentElements["show"]["hunger"];
    $("#thirst").checked = currentElements["show"]["thirst"];
    $("#stamina").checked = currentElements["show"]["stamina"];
    $("#diving").checked = currentElements["show"]["diving"];
    $("#stress").checked = currentElements["show"]["stress"];

    
});

$("#btn-save").on("click", () => {
	
    let tempSettings = {
        hunger: $("#hunger-val").val(),
        thirst: $("#thirst-val").val(),
        stress: $("#stress-val").val(),
        armor: $("#armor-val").val(),
        health: $("#health-val").val(),
        stamina: $("#stamina-val").val(),   
        diving: $("#diving-val").val(),

    }

    let tempShowSettings = {
        hunger: $("#hunger").is(":checked"),
        thirst: $("#thirst").is(":checked"),
        stress: $("#stress").is(":checked"),
        armor: $("#armor").is(":checked"),
        health: $("#health").is(":checked"),
        stamina: $("#stamina").is(":checked"),
        diving: $("#diving").is(":checked"),


    }

    for (const set in tempSettings) {
        if (tempSettings[set] != "") {
            currentElements["hud"][set] = parseInt(tempSettings[set]);
        }
    }

    for (const showSet in tempShowSettings) {
        currentElements["show"][showSet] = tempShowSettings[showSet];
    }

    for (const showSet in currentElements["show"]) {
        if (currentElements["show"][showSet]) {
            $(`.${showSet}`).fadeIn();
        } else {
            $(`.${showSet}`).fadeOut();
        }
    }
})


document.onkeyup = function(event) {
    if (event.keyCode == 27) {
        $.post(`https://${GetParentResourceName()}/Close`);
    }
}

function setMetaData(type,percent){
    let radius = $(`.radial-progress.${type}`).find($('circle.incomplete')).attr('r');
    let circumference = 2 * Math.PI * radius;
    let strokeDashOffset = circumference - ((percent * circumference) / 100);
    $(`.radial-progress.${type}`).find($('circle.incomplete')).animate({'stroke-dashoffset': strokeDashOffset}, 500);
}

function CloseUi() {
    fetch(`https://${GetParentResourceName()}/Close`, {method: "POST", headers: {"Content-Type": "application/json; charset=UTF-8"}, body: JSON.stringify({})});
}

function setProgressSpeed(value, element){
    var circle = document.querySelector(element);
    var radius = circle.r.baseVal.value;
    var circumference = radius * 2 * Math.PI;
    var html = $(element).parent().parent().find('span');
    var percent = value*100/220;
  
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;
  
    const offset = circumference - ((-percent*73)/100) / 100 * circumference;
    circle.style.strokeDashoffset = -offset;
  
    var predkosc = Math.floor(value * 1.8)
    if (predkosc == 81 || predkosc == 131) {
      predkosc = predkosc - 1
    }
  
    html.text(predkosc);
}

function setProgressFuel(percent, element){
    var circle = document.querySelector(element);
    var radius = circle.r.baseVal.value;
    var circumference = radius * 2 * Math.PI;
    var html = $(element).parent().parent().find('span');
  
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;
  
    const offset = circumference - ((-percent*73)/100) / 100 * circumference;
    circle.style.strokeDashoffset = -offset;
  
    html.text(Math.round(percent));
}