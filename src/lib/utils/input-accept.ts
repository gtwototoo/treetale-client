interface FileData {
	name?: string;
	type: string;
}

export const validateMimeType = (file: FileData, acceptedFiles: Array<string> | string) => {
	if (file && acceptedFiles) {
		const acceptedFilesArray: Array<string> = Array.isArray(acceptedFiles)
			? acceptedFiles
			: acceptedFiles.split(',');
		const fileName = file.name || '';
		const mimeType = (file.type || '').toLowerCase();
		const baseMimeType = mimeType.replace(/\/.*$/, '');

		return acceptedFilesArray.some((type: string) => {
			const validType = type.trim().toLowerCase();
			if (validType.charAt(0) === '.') {
				return fileName.toLowerCase().endsWith(validType);
			} else if (validType.endsWith('/*')) {
				// This is something like a image/* mime type
				return baseMimeType === validType.replace(/\/.*$/, '');
			}
			return mimeType === validType;
		});
	}
	return true;
};
