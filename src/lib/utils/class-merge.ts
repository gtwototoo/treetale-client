import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const clm = (...args: Array<ClassValue>) => {
	return twMerge(clsx(args));
};
