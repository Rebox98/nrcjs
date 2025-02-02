const net = require('net');

class NrcDevice {
    constructor(config) {
        const [ip, port, username, password] = config;
        this.ip = ip;
        this.port = port??23;
        this.username = username??'admin';
        this.password = password??'admin';
        this.socket = new net.Socket();
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.socket.connect(this.port, this.ip, resolve);
            this.socket.on('error', reject);
        });
    }

    disconnect() {
        this.socket.destroy();
    }

    send(command) {
        return new Promise((resolve, reject) => {
            this.socket.write(command, 'utf8');
            this.socket.once('data', (data) => resolve(data.toString()));
            this.socket.once('error', reject);
        });
    }

    async login() {
        const response = await this.send(`${this.username}:${this.password}`);
        return response.trim() === "Successful Login";
    }

    relayContact(relayCode, delayMs = null) {
        let cmd = `%RCT${relayCode}`;
        if (delayMs !== null) {
            cmd += `:${delayMs}`;
        }
        return this.send(cmd);
    }

    relayOn(relayCode) {
        return this.send(`%RON${relayCode}`);
    }

    relayOff(relayCode) {
        return this.send(`%ROF${relayCode}`);
    }

    getBit(num, index) {
        return (num >> index) & 1;
    }

    async getRelaysValues() {
        const response = await this.send("%RST");
        if (response.endsWith("h")) {
            return parseInt(response.slice(0, -1), 16);
        }
        throw new Error("Invalid Response! Response must end with 'h'");
    }

    async getRelayValue(relayCode) {
        return this.getBit(await this.getRelaysValues(), relayCode - 1);
    }

    async getSwInputsValues() {
        const response = await this.send("%ISW");
        if (response === "Error") {
            throw new Error("Device does not support feature!");
        }
        if (response.endsWith("h")) {
            return parseInt(response.slice(0, -1), 16);
        }
        throw new Error("Invalid Response! Response must end with 'h'");
    }

    async getSwInputValue(inputCode) {
        return this.getBit(await this.getSwInputsValues(), inputCode - 1);
    }

    async getHvInputsValues() {
        const response = await this.send("%IHV");
        if (response === "Error") {
            throw new Error("Device does not support feature!");
        }
        if (response.endsWith("h")) {
            return parseInt(response.slice(0, -1), 16);
        }
        throw new Error("Invalid Response! Response must end with 'h'");
    }

    async getHvInputValue(inputCode) {
        return this.getBit(await this.getHvInputsValues(), inputCode - 1);
    }
}

module.exports = NrcDevice;
