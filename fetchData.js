class ResponseError extends Error {
    constructor(message, res) {
        super(message);
        this.response = res;
    }
}

export async function fetchXMLData(url) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        const text = await response.text();

        if (!response.ok) {
            throw new ResponseError('Bad fetch response', response);
        }

        return text;
    } catch (error) {
        if (error instanceof ResponseError) {
            switch (error.response.status) {
                case 403:
                    return "The API returned error code 403.";
                // Include other cases as necessary
                default:
                    return "An unknown error happened.";
            }
        } else if (error.name === 'AbortError') {
            return "The request timed out.";
        } else {
            return "An unknown error happened.";
        }
    }
}
