
export class MetriApiError extends Error {

    constructor(message: string) {
        super(message)
        this.message = message
    }

    public getMessage() {
        return `Call to metriApi failed with message: ${this.message}`
    }
}