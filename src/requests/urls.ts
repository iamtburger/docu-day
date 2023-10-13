class URLs {
	base: string = "";

	constructor(base: string | undefined) {
		this.base = `${base}/api`;
	}

	get CATEGORIES() {
		return `${this.base}/categories`;
	}

	get GENERATE_URL() {
		return `${this.base}/generate`;
	}

	get DOCUMENT() {
		return `${this.base}/document`;
	}

	get DOCUMENTS() {
		return `${this.base}/documents`;
	}

	get EVENT() {
		return `${this.base}/event`;
	}

	get EVENTS() {
		return `${this.base}/events`;
	}

	get LOGIN() {
		return `${this.base}/auth/login`;
	}

	get LOGOUT() {
		return `${this.base}/auth/logout`;
	}
}

export const apiEndpoints = new URLs(process.env.BASE_URL);
