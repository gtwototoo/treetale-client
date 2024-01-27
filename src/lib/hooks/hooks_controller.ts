export const enableControl = <T>(
	node: T,
	{
		enabled,
		f
	}: {
		enabled: boolean;
		f: (node: T) => {
			destroy?: () => void;
		};
	}
) => {
	let activeFunction: {
		destroy?: () => void;
	} | null = null;

	if (enabled) activeFunction = f(node);

	return {
		destroy: () => {
			if (!activeFunction) return;

			if (activeFunction.destroy) activeFunction.destroy();
		},
		update: ({ enabled }: { enabled: boolean }) => {
			if (enabled) {
				activeFunction = f(node);
			} else {
				if (!activeFunction) return;

				if (activeFunction.destroy) activeFunction.destroy();
				activeFunction = null;
			}
		}
	};
};
