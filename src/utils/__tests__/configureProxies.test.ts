import { isValidIpAddress } from "../configureProxies";

describe("isValidIpAddress", () => {
  test.each([
    ["192.168.1.1", true],
    ["255.255.255.255", true],
    ["0.0.0.0", true],
    ["1234:", false],
    ["", false],
    ["abcd", false],
  ])("should return %s for IP address %s", (ip, expected) => {
    expect(isValidIpAddress(ip)).toBe(expected);
  });
});
