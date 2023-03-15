export function sendError(error: string): { props: { error: string } } {
	return { props: { error } };
}

export function forceLogin() {
	return { props: { forceLogin: true } };
}

