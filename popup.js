console.log('This is a popup!');

function setProxy(IPAddress) {
    console.log(IPAddress.toString());

    const config = {
        mode: "system",
        rules: {
            singleProxy: {
                scheme: "https",
                host: IPAddress.toString(),
                port: 8080
            },
            bypassList: ["foobar.com"]
        }
    };

    chrome.proxy.settings.set(
        { value: config, scope: "regular" },
        () => {
            console.log($`Proxy settings updated with ip: ${IPAddress}`);
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


const availableConnectionDiv = document.getElementById('available-connection-section');
const button = document.createElement('button');
button.innerText = 'RESET PROXY SETTINGS';
button.addEventListener('click', () => {
    setProxy('sdfs');
})
availableConnectionDiv.append(button);

try {
    fetch('https://private-16d939-codingchallenge2020.apiary-mock.com/locations').then(res => {
        return res.text();
    }).then(data => {
        responseText = data;

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

                const ip = server.getAttribute('ip');
                const serverIPDiv = document.createElement('li');

                const button = document.createElement('button');

                button.innerText = 'CONNECT';

                button.addEventListener('click', () => {
                    setProxy('sdfs');

                })


                serverIPDiv.innerText = ip
                serverIPDiv.appendChild(button);
                serverList.appendChild(serverIPDiv);
            }
            locationDiv.appendChild(serverList);
        }
    });


} catch (err) {
    // no -op

}
