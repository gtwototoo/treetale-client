<script>
	import { Button, FormSplit, Input, Textarea } from '$UI';
</script>

<div class="flex flex-col items-stretch gap-4 p-6">
	<Textarea placeholder="Описание" />
	<FormSplit>
		<Input placeholder="Вариант выбора" />
		<Button>Добавить вариант</Button>
	</FormSplit>
</div>
