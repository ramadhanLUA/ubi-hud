local pedinVeh, beltOn = false, false

Citizen.CreateThread(function()
    while true do
        local ped = PlayerPedId();
        local vehicle = GetVehiclePedIsIn(ped);
        local speed = math.floor(GetEntitySpeed(vehicle) * 2.23694);
        local vehhash = GetEntityModel(vehicle);
        local maxspeed = GetVehicleModelMaxSpeed(vehhash) * 3.6;

        if IsPedInAnyVehicle(ped) then
            SendNUIMessage({
                VehicleUI = true
            })
            SendNUIMessage({speed = speed + 1, maxspeed = maxspeed});
            SetRadarBigmapEnabled(false, false);
            HideMinimapInteriorMapThisFrame();
            DisplayRadar(true);
        else
            SendNUIMessage({
                VehicleUI = false
            })

            DisplayRadar(false);
        end
        Citizen.Wait(150);
    end
end)


local seatbeltOn = false;
CreateThread(function()
    while true do
        Wait(0);
        if IsPedInAnyVehicle(PlayerPedId()) then
            if IsControlJustPressed(0, 29) then
                seatbeltOn = not seatbeltOn;
                TriggerEvent("ubi-hud:client:toggleSeatBelt", seatbeltOn);
            end
        end
    end
end)


RegisterNetEvent("ubi-hud:client:toggleSeatBelt", function(toggle)
    local finished = 0
    if toggle then
         finished = exports["np-taskbar"]:taskBar(1000,"Putting on Harness",true)
        if (finished == 100) then
        SendNUIMessage({
            ["action"] = "seatbeltOn", 
           
            })  
        exports['mythic_notify']:SendAlert('success', 'Seatbelt: Enabled')
        TriggerServerEvent('InteractSound_SV:PlayWithinDistance', 10.0, 'seatbelt', 0.4)
        seatbelt = true;
    end
    else
        finished = exports["np-taskbar"]:taskBar(1000,"Taking off Harness",true)
        if (finished == 100) then
        SendNUIMessage({
            action  = "seatbeltOff", 
        })  
        exports['mythic_notify']:SendAlert('error', 'Seatbelt: Disabled')
        TriggerServerEvent('InteractSound_SV:PlayWithinDistance', 10.0, 'seatbeltoff', 0.4)
        seatbelt = false;
    end
end
end)


CreateThread(function()
    while true do
        Wait(0)
        if seatbelt then
            DisableControlAction(0, 75, true)
            DisableControlAction(27, 75, true)
        else
            EnableControlAction(0, 75, true)
            EnableControlAction(27, 75, true)
        end
    end
end)

CreateThread(function()
    while true do
        Wait(500);
        local ped = GetPlayerPed(-1);
        if IsPedInAnyVehicle(ped, true) then
			fuel = exports['LegacyFuel']:GetFuel(GetVehiclePedIsIn(GetPlayerPed(-1)))
			SendNUIMessage({action = "update_fuel", key = "gas", value = fuel})
        end
    end
end)

function SetFuel(vehicle, fuel)
	if type(fuel) == 'number' and fuel >= 0 and fuel <= 100 then
        exports["Legacyfuel"]:SetFuel(vehicle, fuel);
	end
end
exports("SetFuel", SetFuel)


-- MINIMAP --
local x = -0.025
local y = -0.015

Citizen.CreateThread(function()

    RequestStreamedTextureDict("circlemap", false)
		
    while not HasStreamedTextureDictLoaded("circlemap") do
	Wait(100)
    end

    AddReplaceTexture("platform:/textures/graphics", "radarmasksm", "circlemap", "radarmasksm")

    SetMinimapClipType(1)
    SetMinimapComponentPosition('minimap', 'L', 'B', -0.022, -0.026, 0.16, 0.245)
    SetMinimapComponentPosition('minimap_mask', 'L', 'B', x + 0.21, y + 0.09, 0.071, 0.164)
    SetMinimapComponentPosition('minimap_blur', 'L', 'B', -0.032, -0.04, 0.18, 0.22)
    
    local minimap = RequestScaleformMovie("minimap")
    SetRadarBigmapEnabled(true, false)
    Wait(200)
    SetRadarBigmapEnabled(false, false)

    while true do
        Wait(200)
        BeginScaleformMovieMethod(minimap, "SETUP_HEALTH_ARMOUR")
        ScaleformMovieMethodAddParamInt(3)
        EndScaleformMovieMethod()
    end
end)