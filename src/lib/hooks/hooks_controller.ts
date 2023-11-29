export const enableControl = <T>(
	node: T,
	{
		f,
		enabled
	}: {
		f: (node: T) => {
			destroy?: () => void;
		};
		enabled: boolean;
	}
) => {
	let activeFunction: {
		destroy?: () => void;
	} | null = null;

	if (enabled) activeFunction = f(node);

	return {
		update: ({ enabled }: { enabled: boolean }) => {
			if (enabled) {
				activeFunction = f(node);
			} else {
				if (!activeFunction) return;

				if (activeFunction.destroy) activeFunction.destroy();
				activeFunction = null;
			}
		},
		destroy: () => {
			if (!activeFunction) return;

			if (activeFunction.destroy) activeFunction.destroy();
		}
	};
};
