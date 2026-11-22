export function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const paddedHours = String(hours).padStart(2, "0");
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}

export function getApiErrorMessage(error: unknown): string {
    if (error && typeof error === "object" && "response" in error) {
        const response = error.response;

        if (response && typeof response === "object" && "data" in response) {
            const data = response.data;

            if (typeof data === "string" && data.trim()) {
                return data;
            }

            if (data && typeof data === "object") {
                const message =
                    "message" in data
                        ? data.message
                        : "error" in data
                          ? data.error
                          : undefined;

                if (typeof message === "string" && message.trim()) {
                    return message;
                }
            }
        }
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return "Tente novamente em alguns instantes.";
}
