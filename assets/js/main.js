const smoresVideoFrame = document.querySelector('[data-smores-video]');

if (smoresVideoFrame) {
	const smoresVideo = smoresVideoFrame.querySelector('video');
	if (smoresVideo) {
		smoresVideo.loop = true;
		smoresVideo.addEventListener('ended', () => {
			smoresVideo.currentTime = 0;
			const replay = smoresVideo.play();
			if (replay) replay.catch((error) => console.error('No se pudo reiniciar el video de S’mores:', error));
		});
	}
}

if (smoresVideoFrame && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
	smoresVideoFrame.classList.add('is-reveal-pending');
	const smoresVideoObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;
			entry.target.classList.add('is-visible');
			observer.unobserve(entry.target);
		});
	}, { threshold: 0.15 });
	smoresVideoObserver.observe(smoresVideoFrame);
}

const chatbotFaq = {
	ubicacion: {
		keywords: ['ubicacion', 'direccion', 'donde', 'llegar', 'mapa', 'coordenada'],
		answer: 'Estamos en C. San Luis Potosí 132, Unidad Nacional, 89410 Cd. Madero, Tamaulipas. El pin es aproximado: 22.271717, -97.847779.',
		linkLabel: 'Cómo llegar en Google Maps',
		linkUrl: 'https://www.google.com/maps/dir/?api=1&destination=C.%20San%20Luis%20Potos%C3%AD%20132%2C%20Unidad%20Nacional%2C%2089410%20Cd.%20Madero%2C%20Tamps.%2C%20M%C3%A9xico'
	},
	horarios: {
		keywords: ['horario', 'hora', 'abren', 'abierto', 'cierran', 'cerrado', 'lunes', 'sabado', 'domingo'],
		answer: 'Abrimos de lunes a viernes de 8:00 a 19:00, y sábados y domingos de 9:00 a 17:00.'
	},
	menu: {
		keywords: ['menu', 'carta', 'bebidas', 'productos', 'precio', 'cuanto cuesta', 'cuanto vale', 'que venden', 'que tienen', 'sabor', 'sabores', 'cafe', 'cafes', 'coffee', 'frappe', 'frappes', 'specials', 'no sugar', 'sin azucar', 'bakery', 'combo', 'others', 'americano', 'capuchino', 'macchiato', 'iced coffee', 'caramel', 'vainilla', 'moka', 'churro', 'smores', 'latte', 'strawberry', 'nutella', 'mazapan', 'red velvet', 'french', 'fresa', 'oreo', 'gansito', 'picarita', 'chachamango', 'matcha', 'taro', 'coco', 'durazno', 'chai', 'negro', 'cinnamon', 'protein', 'muffin', 'zanahoria', 'platano', 'concha', 'cheesecake', 'tortuga', 'croissant', 'dessert', 'pay', 'hot', 'almendras', 'crema batida', 'shot espresso', 'cold foam', 'chachiato'],
		answer: 'Tenemos COFFEE & LATTE (desde $45), FRAPPE (todos $79), SPECIALS, NO SUGAR, BAKERY, COMBOS y OTHERS. Algunos favoritos: Americano $45, Matcha $79, Concha $40 y Hot Combo $99. En el menú puedes ver todas las opciones y precios.',
		linkLabel: 'Ver menú completo',
		linkUrl: document.querySelector('.menu-grid') ? '#menu' : 'pages/menu.html'
	}
};

const chatbotFallback = 'Puedo ayudarte con horarios, menú o ubicación. Prueba con una de esas opciones.';

const drinkMatches = {
	energia: {
		name: 'Americano · $45',
		description: 'Un clásico de COFFEE & LATTE para seguir con tu día.',
		icon: '☕'
	},
	calma: {
		name: 'Latte · $69',
		description: 'Una opción cremosa del menú para disfrutar tu pausa con calma.',
		icon: '♡'
	},
	fresco: {
		name: 'Iced Coffee Vainilla · $69',
		description: 'Café frío con vainilla, ideal cuando se te antoja algo fresco.',
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

document.querySelectorAll('.topbar').forEach((header) => {
	const navToggle = header.querySelector('.nav-toggle');
	const navLinks = header.querySelector('.nav-links');
	const navToggleIcon = navToggle.querySelector('.nav-toggle-icon');

	const setNavigationOpen = (isOpen) => {
		navLinks.classList.toggle('is-open', isOpen);
		navToggle.setAttribute('aria-expanded', String(isOpen));
		navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
		navToggleIcon.textContent = isOpen ? '×' : '☰';
	};

	navToggle.addEventListener('click', () => {
		setNavigationOpen(navToggle.getAttribute('aria-expanded') !== 'true');
	});

	navLinks.querySelectorAll('a').forEach((link) => {
		link.addEventListener('click', () => setNavigationOpen(false));
	});

	header.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
			setNavigationOpen(false);
			navToggle.focus();
		}
	});
});

const chatbot = document.querySelector('[data-chatbot]');

if (chatbot) {
	const chatbotPanel = chatbot.querySelector('.chatbot-panel');
	const chatbotToggle = chatbot.querySelector('.chatbot-toggle');
	const chatbotClose = chatbot.querySelector('.chatbot-close');
	const chatbotForm = chatbot.querySelector('.chatbot-form');
	const chatbotInput = chatbot.querySelector('#chatbot-input');
	const chatbotMessages = chatbot.querySelector('.chatbot-messages');
	const menuCategoryAliases = {
		'coffee-latte': ['coffee & latte', 'coffee latte'],
		frappe: ['frappe', 'frappes'],
		specials: ['specials'],
		'no-sugar': ['no sugar', 'sin azucar'],
		bakery: ['bakery', 'panaderia'],
		combos: ['combos', 'combo'],
		others: ['others', 'extras', 'extra']
	};

	const normalizeChatText = (text) => text.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9\s]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

	const appendMessage = (text, sender, linkLabel, linkUrl) => {
		const message = document.createElement('p');
		message.className = `chatbot-message chatbot-message--${sender}`;
		message.textContent = text;
		chatbotMessages.append(message);

		if (linkLabel && linkUrl) {
			const link = document.createElement('a');
			link.className = 'chatbot-message-link';
			link.href = linkUrl;
			link.textContent = linkLabel;
			if (linkUrl.startsWith('https://')) {
				link.target = '_blank';
				link.rel = 'noopener noreferrer';
			}
			chatbotMessages.append(link);
		}

		chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
	};

	const findTopic = (question) => {
		const normalizedQuestion = normalizeChatText(question);
		return Object.entries(chatbotFaq).find(([, topic]) =>
			topic.keywords.some((keyword) => keyword.includes(' ')
				? normalizedQuestion.includes(keyword)
				: normalizedQuestion.split(' ').includes(keyword))
		);
	};

	const findMenuResponse = (question) => {
		const categories = [...document.querySelectorAll('[data-menu-category]')];
		if (!categories.length) return null;

		const normalizedQuestion = normalizeChatText(question);
		const category = categories.find((section) => {
			const categoryId = section.dataset.menuCategory;
			const title = normalizeChatText(section.querySelector('h2').textContent);
			const aliases = menuCategoryAliases[categoryId] || [];
			return normalizedQuestion.includes(title) || aliases.some((alias) =>
				normalizedQuestion.includes(normalizeChatText(alias))
			);
		});

		const makeMenuResponse = (answer) => ({
			answer,
			linkLabel: chatbotFaq.menu.linkLabel,
			linkUrl: chatbotFaq.menu.linkUrl
		});

		if (category) {
			const title = category.querySelector('h2').textContent;
			const items = [...category.querySelectorAll('.menu-item')].map((item) =>
				`${item.querySelector('.menu-item-name').textContent} ${item.querySelector('.menu-item-price').textContent}`
			);
			return makeMenuResponse(`${title}: ${items.join(', ')}.`);
		}

		const questionWords = normalizedQuestion.split(' ');
		const menuItems = categories.flatMap((section) => {
			const categoryTitle = section.querySelector('h2').textContent;
			return [...section.querySelectorAll('.menu-item')].map((item) => {
				const name = item.querySelector('.menu-item-name').textContent;
				return {
					name,
					normalizedName: normalizeChatText(name),
					price: item.querySelector('.menu-item-price').textContent,
					categoryTitle
				};
			});
		});
		const exactMatches = menuItems.filter((item) => normalizedQuestion.includes(item.normalizedName));
		const mostSpecificMatchLength = exactMatches.reduce((maxLength, item) =>
			Math.max(maxLength, item.normalizedName.split(' ').length), 0);
		const matchingItems = exactMatches.length
			? exactMatches.filter((item) => item.normalizedName.split(' ').length === mostSpecificMatchLength)
			: menuItems.filter((item) =>
				item.normalizedName.split(' ').some((word) => word.length > 3 && questionWords.includes(word))
			);

		return matchingItems.length
			? makeMenuResponse(`${matchingItems.map((item) =>
				`${item.name} ${item.price} (${item.categoryTitle})`
			).join('; ')}.`)
			: null;
	};

	const answerQuestion = (question, selectedTopic) => {
		const topic = selectedTopic
			? chatbotFaq[selectedTopic]
			: findMenuResponse(question) || (findTopic(question) || [null, null])[1];
		appendMessage(question, 'user');
		appendMessage(
			topic ? topic.answer : chatbotFallback,
			'bot',
			topic && topic.linkLabel,
			topic && topic.linkUrl
		);
	};

	const setChatbotOpen = (isOpen) => {
		chatbotPanel.hidden = !isOpen;
		chatbotToggle.setAttribute('aria-expanded', String(isOpen));
		chatbotToggle.setAttribute('aria-label', isOpen ? 'Cerrar asistente' : 'Abrir asistente');
		if (isOpen) chatbotInput.focus();
		else chatbotToggle.focus();
	};

	chatbotToggle.addEventListener('click', () => {
		setChatbotOpen(chatbotPanel.hidden);
	});

	chatbotClose.addEventListener('click', () => setChatbotOpen(false));

	chatbot.addEventListener('click', (event) => {
		const quickQuestion = event.target.closest('[data-chat-topic]');
		if (!quickQuestion) return;
		answerQuestion(quickQuestion.textContent, quickQuestion.dataset.chatTopic);
	});

	chatbotForm.addEventListener('submit', (event) => {
		event.preventDefault();
		const question = chatbotInput.value.trim();
		if (!question) return;
		answerQuestion(question);
		chatbotInput.value = '';
		chatbotInput.focus();
	});

	chatbot.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && !chatbotPanel.hidden) setChatbotOpen(false);
	});
}

const menuFilterButtons = document.querySelectorAll('[data-menu-filter]');
const menuCategories = document.querySelectorAll('[data-menu-category]');

menuFilterButtons.forEach((button) => {
	button.addEventListener('click', () => {
		const selectedFilter = button.dataset.menuFilter;
		menuCategories.forEach((category) => {
			category.hidden = selectedFilter !== 'all' && category.dataset.menuCategory !== selectedFilter;
		});

		menuFilterButtons.forEach((filterButton) => {
			const isSelected = filterButton === button;
			filterButton.classList.toggle('active', isSelected);
			filterButton.setAttribute('aria-pressed', String(isSelected));
		});
	});
});

const reviewsSection = document.querySelector('[data-reviews]');

if (reviewsSection) {
	const reviewList = reviewsSection.querySelector('#reviews-list');
	const reviewForm = reviewsSection.querySelector('#review-form');
	const reviewStatus = reviewsSection.querySelector('#review-status');
	const reviewSubmitButton = reviewForm.querySelector('button[type="submit"]');
	const supabaseUrlMeta = document.querySelector('meta[name="supabase-url"]');
	const supabaseAnonKeyMeta = document.querySelector('meta[name="supabase-anon-key"]');
	const supabaseUrl = supabaseUrlMeta ? supabaseUrlMeta.content.trim().replace(/\/+$/, '') : '';
	const supabaseAnonKey = supabaseAnonKeyMeta ? supabaseAnonKeyMeta.content.trim() : '';
	const reviewsEndpoint = `${supabaseUrl}/rest/v1/reviews`;
	const requestHeaders = {
		apikey: supabaseAnonKey,
		Authorization: `Bearer ${supabaseAnonKey}`
	};
	const ratingLabels = [...reviewForm.querySelectorAll('.review-rating-options label')];
	const ratingInputs = [...reviewForm.querySelectorAll('input[name="rating"]')];

	const setReviewStatus = (message, state) => {
		reviewStatus.textContent = message;
		if (state) reviewStatus.dataset.state = state;
		else delete reviewStatus.dataset.state;
	};

	const updateRatingStars = () => {
		const selectedRating = ratingInputs.find((input) => input.checked);
		const rating = selectedRating ? Number(selectedRating.value) : 0;
		ratingLabels.forEach((label) => {
			label.classList.toggle('is-selected', Number(label.dataset.rating) <= rating);
		});
	};

	const renderReviews = (reviews) => {
		reviewList.replaceChildren();
		if (!reviews.length) {
			const emptyMessage = document.createElement('p');
			emptyMessage.className = 'reviews-empty';
			emptyMessage.textContent = 'Aún no hay opiniones aprobadas. ¡Comparte la primera!';
			reviewList.append(emptyMessage);
			return;
		}

		reviews.forEach((review) => {
			const card = document.createElement('article');
			card.className = 'review-card';

			const heading = document.createElement('div');
			heading.className = 'review-card-heading';

			const name = document.createElement('p');
			name.className = 'review-card-name';
			name.textContent = review.name;

			const stars = document.createElement('span');
			const rating = Number(review.rating);
			stars.className = 'review-card-stars';
			stars.setAttribute('aria-label', `${rating} de 5 estrellas`);
			stars.textContent = `${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}`;
			heading.append(name, stars);

			const comment = document.createElement('p');
			comment.className = 'review-card-comment';
			comment.textContent = review.comment;

			const date = document.createElement('time');
			date.dateTime = review.created_at;
			date.textContent = new Intl.DateTimeFormat('es-MX', {
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			}).format(new Date(review.created_at));

			card.append(heading, comment, date);
			reviewList.append(card);
		});
	};

	const loadApprovedReviews = async () => {
		reviewList.setAttribute('aria-busy', 'true');
		try {
			const response = await fetch(
				`${reviewsEndpoint}?select=id,name,rating,comment,created_at&status=eq.approved&order=created_at.desc`,
				{ headers: requestHeaders }
			);
			if (!response.ok) throw new Error(`No se pudieron cargar las opiniones (${response.status}).`);

			const reviews = await response.json();
			if (!Array.isArray(reviews)) throw new Error('La respuesta de opiniones no tiene el formato esperado.');
			renderReviews(reviews);
		} catch (error) {
			console.error('Error al cargar las opiniones:', error);
			const errorMessage = document.createElement('p');
			errorMessage.className = 'reviews-empty';
			errorMessage.textContent = 'No pudimos cargar las opiniones. Inténtalo de nuevo más tarde.';
			reviewList.replaceChildren(errorMessage);
			setReviewStatus('No se pudieron cargar las opiniones. Revisa la conexión e inténtalo más tarde.', 'error');
		} finally {
			reviewList.setAttribute('aria-busy', 'false');
		}
	};

	if (!supabaseUrl || !supabaseAnonKey) {
		reviewList.setAttribute('aria-busy', 'false');
		reviewList.querySelector('.reviews-empty').textContent = 'Las opiniones aprobadas aparecerán aquí.';
		reviewSubmitButton.disabled = true;
		setReviewStatus('El formulario necesita configurarse antes de recibir opiniones.', 'error');
	} else {
		reviewSubmitButton.disabled = false;
		setReviewStatus('Tu opinión quedará pendiente hasta que la revisemos.');
		loadApprovedReviews();
	}

	reviewForm.addEventListener('change', updateRatingStars);
	reviewForm.addEventListener('submit', async (event) => {
		event.preventDefault();
		if (!supabaseUrl || !supabaseAnonKey) {
			setReviewStatus('El formulario todavía no está conectado al servicio de reseñas.', 'error');
			return;
		}

		const formData = new FormData(reviewForm);
		if (String(formData.get('website') || '').trim()) {
			setReviewStatus('No se pudo procesar el envío. Revisa los campos e inténtalo de nuevo.', 'error');
			return;
		}

		const payload = {
			name: String(formData.get('name')).trim(),
			rating: Number(formData.get('rating')),
			comment: String(formData.get('comment')).trim()
		};

		reviewSubmitButton.disabled = true;
		setReviewStatus('Enviando tu opinión...');
		try {
			const response = await fetch(reviewsEndpoint, {
				method: 'POST',
				headers: {
					...requestHeaders,
					'Content-Type': 'application/json',
					Prefer: 'return=minimal'
				},
				body: JSON.stringify(payload)
			});
			if (!response.ok) throw new Error(`No se pudo guardar la opinión (${response.status}).`);

			reviewForm.reset();
			updateRatingStars();
			setReviewStatus('¡Gracias! Tu opinión quedó pendiente de revisión antes de publicarse.');
		} catch (error) {
			console.error('Error al enviar la opinión:', error);
			setReviewStatus('No se pudo enviar tu opinión. Inténtalo de nuevo más tarde.', 'error');
		} finally {
			reviewSubmitButton.disabled = false;
		}
	});
}
