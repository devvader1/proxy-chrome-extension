console.log('This is a popup!');

import { fetchXMLData } from "./fetchData.js";

function setProxy(IPAddress) {

    const config = {
        mode: "fixed_servers",
        rules: {
            singleProxy: {
                // use socks5 protocol
                scheme: "socks5",
                host: IPAddress.toString(),
            },
        }
    };

    chrome.proxy.settings.set(
        { value: config, scope: "regular" },
        () => {
            console.log(`Proxy settings updated with ip: ${IPAddress}`);
        }
    );
}

function resetProxy() {
    const config = {
        mode: "system",
    };
    chrome.proxy.settings.set(
        { value: config, scope: "regular" },
        () => {
            console.log("Proxy settings reset.");
        }
    );
}

const fetchURL = 'https://private-16d939-codingchallenge2020.apiary-mock.com/locations';
const availableConnectionDiv = document.getElementById('available-connection-section');
const connectedLocationSection = document.getElementById('connected-location-section');

const resetButton = document.createElement('button');
resetButton.innerText = 'RESET PROXY SETTINGS';
resetButton.addEventListener('click', () => {
    resetProxy();
})
resetButton.setAttribute('style', 'margin-bottom: 10px');
availableConnectionDiv.append(resetButton);

const refreshButton = document.createElement('button');
refreshButton.innerText = 'REFETCH SERVER LIST';
refreshButton.setAttribute('style', 'margin-bottom: 10px');
refreshButton.addEventListener('click', () => {

    fetchServerData(fetchURL);
})

availableConnectionDiv.append(refreshButton);


const fetchServerData = (url) => fetchXMLData(url)
    .then(responseText => {

        console.log(responseText);


        const parse = new DOMParser();
        const xmlDoc = parse.parseFromString(responseText, 'text/xml');
        const locations = xmlDoc.getElementsByTagName('location');

        for (const location of locations) {
            const locationName = location.getAttribute('name');
            const locationDiv = document.createElement('div');
            locationDiv.innerText = locationName;
            availableConnectionDiv.appendChild(locationDiv);

            const servers = location.getElementsByTagName('server');
            const serverList = document.createElement('ul');

            for (const server of servers) {
                let connected;

                const ip = server.getAttribute('ip');
                const serverIPDiv = document.createElement('li');
                const button = document.createElement('button');
                button.innerText = 'CONNECT';
                const connectFunction = () => {
                    setProxy(ip);
                }
                const disconnectFunction = () => {
                    resetProxy();
                }

                button.addEventListener('click', () => {
                    if (!connected) {
                        connectFunction();
                        connected = true;
                        button.innerText = 'DISCONNECT';
                        connectedLocationSection.innerText = locationName;
                    } else {
                        disconnectFunction();
                        connected = false;
                        button.innerText = 'CONNECT';
                        connectedLocationSection.innerText = 'Not connected to any location';
                    }
                });

                serverIPDiv.innerText = ip;
                serverIPDiv.appendChild(button);
                serverList.appendChild(serverIPDiv);
            }
            locationDiv.appendChild(serverList);
        }
    });

fetchServerData(fetchURL);
