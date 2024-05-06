import { fetchXMLData } from "./fetchData";
console.log("This is a popup!");

function setProxy(IPAddress: string): void {
  const config = {
    mode: "fixed_servers",
    rules: {
      singleProxy: {
        scheme: "socks5",
        host: IPAddress,
      },
    },
  };

  chrome.proxy.settings.set({ value: config, scope: "regular" }, () => {
    console.log(`Proxy settings updated with IP: ${IPAddress}`);
  });
}

function resetProxy(): void {
  const config = { mode: "system" };
  chrome.proxy.settings.set({ value: config, scope: "regular" }, () => {
    console.log("Proxy settings reset.");
  });
}

const fetchURL =
  "https://private-16d939-codingchallenge2020.apiary-mock.com/locations";
const availableConnectionDiv = document.getElementById(
  "available-connection-section"
);
const connectedLocationSection = document.getElementById(
  "connected-location-section"
);

if (availableConnectionDiv && connectedLocationSection) {
  function createButton(
    text: string,
    className: string,
    onClick: () => void
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.innerText = text;
    button.className = className;
    button.addEventListener("click", onClick);
    return button;
  }

  availableConnectionDiv.append(
    createButton("RESET PROXY SETTINGS", "reset-button", resetProxy)
  );
  availableConnectionDiv.append(
    createButton("REFETCH SERVER LIST", "refresh-button", () =>
      fetchServerData(fetchURL)
    )
  );

  function setConnectedState(
    button: HTMLButtonElement,
    isConnected: boolean,
    locationName: string
  ) {
    button.innerText = isConnected ? "DISCONNECT" : "CONNECT";
    connectedLocationSection!.innerText = isConnected
      ? locationName
      : "Not connected to any location";
  }

  async function fetchServerData(url: string): Promise<void> {
    try {
      const responseText = await fetchXMLData(url);
      console.log(responseText);

      const parse = new DOMParser();
      const xmlDoc = parse.parseFromString(responseText, "text/xml");
      const locations = xmlDoc.getElementsByTagName("location");

      for (const location of Array.from(locations)) {
        const locationName = location.getAttribute("name");
        if (!locationName) continue;

        const locationDiv = document.createElement("div");
        locationDiv.innerText = locationName;

        const servers = location.getElementsByTagName("server");
        const serverList = document.createElement("ul");

        for (const server of Array.from(servers)) {
          const ip = server.getAttribute("ip");
          if (!ip) continue;

          let connected = false;
          const serverIPDiv = document.createElement("li");

          const button = createButton("CONNECT", "connect-button", () => {
            if (!connected) {
              setProxy(ip);
            } else {
              resetProxy();
            }
            connected = !connected;
            setConnectedState(button, connected, locationName);
          });

          serverIPDiv.innerText = ip;
          serverIPDiv.appendChild(button);
          serverList.appendChild(serverIPDiv);
        }

        locationDiv.appendChild(serverList);
        availableConnectionDiv!.appendChild(locationDiv);
      }
    } catch (error) {
      console.error("Fetching server data failed:", error);
    }
  }

  fetchServerData(fetchURL);
} else {
  console.error("Required DOM elements not found");
}
