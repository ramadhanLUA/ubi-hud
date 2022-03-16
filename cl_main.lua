
-- FOR ESX BASE --
Citizen.CreateThread(function()
    local oxygenMultiplier = 10
    while true do
        TriggerEvent('esx_status:getStatus', 'hunger', function(hunger)
            TriggerEvent('esx_status:getStatus', 'thirst', function(thirst)
                TriggerEvent('esx_status:getStatus','stress',function(stress)
                    local ped = PlayerPedId()
                    local data = {
                        stamina = 100 - GetPlayerSprintStaminaRemaining(PlayerId()), -- stamina run speed --
                        diving = GetPlayerUnderwaterTimeRemaining(PlayerId()) * 10, -- underwater oxygen --
                        health = (GetEntityHealth(ped) - 100), -- player health --
                        armor = GetPedArmour(ped), -- player armor --
                        hunger = hunger.getPercent(), -- status hungger esx_status --
                        thirst = thirst.getPercent(), -- status thirst esx_status --
                        stress = stress.getPercent() -- status stress esx_status --
                    }
                    SendNUIMessage({
                        ["action"] = "show"
                    })
                    SendNUIMessage({
                        ["action"] = "update",
                        ["data"] = data
                    })
                end)
            end)
        end)
        Citizen.Wait(500)
    end
end)

-- RADIO RED COLOR TALKING --
RegisterNetEvent("hud:voice:transmitting")
AddEventHandler("hud:voice:transmitting", function (transmitting)
    Citizen.Wait(100)
	SendNUIMessage({type = "transmittingStatus", is_transmitting = transmitting})
end)

-- VOICE RANGE HUD --
RegisterNetEvent("ubi-hud:changeRange")
AddEventHandler("ubi-hud:changeRange", function(val)
    SendNUIMessage({action = "voice_level", voicelevel = val})
end)

-- RADIO VOICE ICON --
RegisterNetEvent("hud:voice:iconradi")
AddEventHandler("hud:voice:iconradi", function (icon)
    Citizen.Wait(100)
	SendNUIMessage({type = "voiceIcon", voiceIcon = icon})
end)


 -- NORNAL TALKING --
local currentValues = {
	["is_talking"] = false
}

Citizen.CreateThread(function ()
	while true do
		local isTalking = NetworkIsPlayerTalking(PlayerId())

		if isTalking and not currentValues["is_talking"] then
			SendNUIMessage({type = "talkingStatus", is_talking = true})
		elseif not isTalking and currentValues["is_talking"] then
			SendNUIMessage({type = "talkingStatus", is_talking = false})
		end
		currentValues["is_talking"] = isTalking
		Citizen.Wait(0)
	end
end)

-- DEVMODE DEBUG --
RegisterNetEvent('ubi:devmode')
AddEventHandler('ubi:devmode', function()
    SendNUIMessage({action = "devmode"})
end, false)       


-- TOGGLE COMMAND /HUD --
-- local toggle = false;
-- RegisterCommand("hud", function()
--     toggle = not toggle;
--     SendNUIMessage({toggle = toggle});
--     SetNuiFocus(toggle, toggle);
-- end)

-- RegisterNUICallback("Close", function(data)
--     toggle = false
--     SendNUIMessage({toggle = toggle});
--     SetNuiFocus(toggle, toggle);
-- end)

