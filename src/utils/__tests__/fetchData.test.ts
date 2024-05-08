import { fetchXMLData } from "../fetchData";
global.fetch = jest.fn();

describe("fetchXMLData", () => {
  it("should return data successfully", async () => {
    const xml = "<example>data</example>";
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(xml),
    });

    const url = "https://example.com/data.xml";
    const result = await fetchXMLData(url);
    expect(result).toEqual(xml);
  });

  it("should throw a ResponseError for non-200 response", async () => {
    const response = {
      ok: false,
      status: 403,
      text: () => Promise.resolve("Forbidden"),
    };
    (fetch as jest.Mock).mockResolvedValueOnce(response);

    const url = "https://example.com/forbidden.xml";
    const result = await fetchXMLData(url);
    expect(result).toEqual("The API returned error code 403.");
  });

  it("should return a timeout error if the request takes too long", async () => {
    (fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((_, reject) => {
          const error = new Error("The request was aborted.");
          error.name = "AbortError";
          reject(error);
        })
    );

    const url = "https://example.com/slow.xml";
    const result = await fetchXMLData(url);
    expect(result).toEqual("The request timed out.");
  });

  it("should handle other types of errors", async () => {
    const errorMessage = "Network Error";
    (fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const url = "https://example.com/error.xml";
    const result = await fetchXMLData(url);
    expect(result).toEqual("An unknown error happened.");
  });
});
