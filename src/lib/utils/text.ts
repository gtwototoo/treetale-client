import type { IVariable } from '$lib/types';

export const correctWhitespace = (text: string) => {
	if (!text) return text;

	const triggers = {
		metrics: 'мм|см|м|км|г|кг|б|кб|мб|гб|dpi|px',
		shortages: 'г|гр|тов|пос|c|ул|д|пер|м|зам|см',
		money: 'руб.|долл.|евро|у.е.',
		counts: 'млн.|тыс.',
		prepos:
			'а|в|во|вне|и|или|к|о|с|у|о|со|об|обо|от|ото|то|на|не|ни|но|из|изо|за|уж|на|по|под|подо|пред|предо|про|над|надо|как|без|безо|что|да|для|до|там|ещё|их|или|ко|меж|между|перед|передо|около|через|сквозь|для|при|я',
		abbr: 'ООО|ОАО|ЗАО|ЧП|ИП|НПФ|НИИ'
	};
	const prepositions = Object.values(triggers).join('|').split('|');

	return text.replace(
		/(\S+?)( )/g,
		(_, p) => p + (prepositions.includes(p.toLowerCase()) ? '\u00A0' : ' ')
	);
};

export const variableReplace = (text: string, vars: IVariable[]) => {
	if (!vars) return text;

	for (const variable of vars) {
		text = text.replace(`{${variable.name}}`, variable.value);
	}

	return text;
};

export const correctVariableReplace = (text: string | undefined, vars: IVariable[]) => {
	if (!text) return '';

	return correctWhitespace(variableReplace(text, vars));
};

export const cutText = (text: string, vars: IVariable[], maxLength = 200) => {
	const newText = variableReplace(text, vars);

	if (newText.length < maxLength) {
		return correctWhitespace(newText);
	} else {
		const lastWord = newText.substring(maxLength).split(' ')[0];

		return correctWhitespace(`${newText.substring(0, maxLength)}${lastWord}...`);
	}
};

export const pluralize = (
	number: number,
	gen: string,
	nom: string,
	plu: string,
	emptyText = true
) => {
	if (!number && emptyText) return ['Нет', gen].join(' ');

	const n = String(number);

	return [n, n.match(/(0|[5-9]|1[0-9])$/) ? gen : n.match(/1$/) ? nom : plu].join(' ');
};
