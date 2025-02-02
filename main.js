const NrcDevice = require('./nrcjs');

const ip = '192.168.1.201';
const port = 23;
const username = "admin";
const password = "admin";

(async () => {
    const nrc = new NrcDevice([ip, port, username, password]);
    
    try {
        await nrc.connect();
        
        if (await nrc.login()) {
            await nrc.relayContact(1, 500);
            await nrc.relayContact(2, 1000);
            await nrc.relayOff(1);
            await nrc.relayOn(2);
            
            console.log("Relays Status (hex):", await nrc.getRelaysValues());
            console.log("Relay 1 Status:", await nrc.getRelayValue(1));
            console.log("Relay 2 Status:", await nrc.getRelayValue(2));
            
            try {
                console.log("SW Inputs Status (hex):", await nrc.getSwInputsValues());
                console.log("SW 1 Status:", await nrc.getSwInputValue(1));
                console.log("SW 2 Status:", await nrc.getSwInputValue(2));
                console.log("SW 3 Status:", await nrc.getSwInputValue(3));
            } catch (e) {
                console.log("Error:", e);
            }
            
            try {
                console.log("HV Inputs Status (hex):", await nrc.getHvInputsValues());
                console.log("HV 1 Status:", await nrc.getHvInputValue(1));
                console.log("HV 2 Status:", await nrc.getHvInputValue(2));
                console.log("HV 3 Status:", await nrc.getHvInputValue(3));
            } catch (e) {
                console.log("Error:", e);
            }
        } else {
            console.log("Error in login");
        }
    } catch (e) {
        console.error("Connection error:", e);
    } finally {
        nrc.disconnect();
    }
})();
