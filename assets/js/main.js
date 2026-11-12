const drinkMatches = {
	energia: {
		name: 'Latte de la casa',
		description: 'Espresso doble y leche cremosa: el empujoncito perfecto para seguir con tu día.',
		icon: '☕'
	},
	calma: {
		name: 'Flat white',
		description: 'Espresso equilibrado con leche sedosa para disfrutar sin prisa.',
		icon: '♡'
	},
	fresco: {
		name: 'Cold brew',
		description: 'Café de extracción lenta, suave y refrescante para cambiar el ritmo.',
		icon: '❄'
	}
};

const moodButtons = document.querySelectorAll('.mood-button');
const matchResult = document.querySelector('#match-result');
const matchName = document.querySelector('#match-name');
const matchDescription = document.querySelector('#match-description');
const matchCup = document.querySelector('.match-cup');

moodButtons.forEach((button) => {
	button.addEventListener('click', () => {
		const recommendation = drinkMatches[button.dataset.mood];
		if (!recommendation) return;

		moodButtons.forEach((moodButton) => {
			moodButton.setAttribute('aria-pressed', String(moodButton === button));
		});

		matchName.textContent = recommendation.name;
		matchDescription.textContent = recommendation.description;
		matchCup.textContent = recommendation.icon;
		matchResult.classList.remove('is-updated');
		requestAnimationFrame(() => matchResult.classList.add('is-updated'));
	});
});
