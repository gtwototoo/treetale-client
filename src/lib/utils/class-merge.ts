import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const clm = (...classes: ClassValue[]) => {
	return twMerge(clsx(classes));
};
