export function isValidIpAddress(ip: string) {
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
}

export function setProxy(IPAddress: string): void {
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

export function resetProxy(): void {
  const config = { mode: "system" };
  chrome.proxy.settings.set({ value: config, scope: "regular" }, () => {
    console.log("Proxy settings reset.");
  });
}
