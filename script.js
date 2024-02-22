'use strict';

// variables
const form = document.querySelector('#form');
const input = document.querySelector('#input');
const panelsList = document.querySelector('#panels-list');
const emptyList = document.querySelector('#empty-list');
const notification = document.querySelector('#notification');
const tabsList = document.querySelector('#tabs-list');
const tabs = tabsList.querySelectorAll('.tabs__button');
const todoBody = document.querySelector('#body');
const clearCompletedButton = document.querySelector('#clear-completed');
let tasks = [];

// functions
const filterTasks = function () {
	const currentTab = tabsList.querySelector('.tabs__button--active');
	const panels = Array.from(panelsList.children);

	switch (currentTab.id) {
		case 'tab-all':
			panels.forEach((panel) => {
				panel.hidden = false;
			});
			break;
		case 'tab-active':
			panels.forEach((panel) => {
				panel.hidden = false;

				if (panel.firstElementChild.classList.contains('task--completed')) {
					panel.hidden = true;
				}
			});
			break;
		case 'tab-completed':
			panels.forEach((panel) => {
				panel.hidden = false;

				if (!panel.firstElementChild.classList.contains('task--completed')) {
					panel.hidden = true;
				}
			});
			break;
	}
};

const showNotification = function () {
	notification.classList.remove('form__notification--hidden');

	setTimeout(() => {
		notification.classList.add('form__notification--hidden');
	}, 4000);
};

const addTask = function (event) {
	event.preventDefault();

	const taskText = input.value;

	if (taskText.length === 0) {
		showNotification();

		return;
	}

	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false,
	};
	tasks.push(newTask);

	saveToLocalStorage();

	renderTask(newTask);

	input.value = '';
	input.focus();

	filterTasks();

	checkEmptyList();
};

const deleteTask = function (event) {
	if (event.target.dataset.action !== 'delete') {
		return;
	}

	const panelsItem = event.target.closest('.panels__item');

	const id = Number(panelsItem.id);

	const index = tasks.findIndex((task) => task.id === id);

	tasks.splice(index, 1);

	saveToLocalStorage();

	panelsItem.remove();

	checkEmptyList();

	checkCompleted();
};

const doneTask = function (event) {
	if (event.target.dataset.action !== 'done') {
		return;
	}

	const panelsItem = event.target.closest('.panels__item');

	const id = Number(panelsItem.id);

	const task = tasks.find((task) => task.id === id);

	task.done = !task.done;

	saveToLocalStorage();

	checkCompleted();

	panelsItem.firstElementChild.classList.toggle('task--completed');

	filterTasks();
};

const toggleTab = function (event) {
	if (
		!event.target.classList.contains('tabs__button') ||
		event.target.classList.contains('tabs__button--active')
	) {
		return;
	}

	tabs.forEach((tab) => {
		tab.classList.remove('tabs__button--active');
	});
	event.target.classList.add('tabs__button--active');

	filterTasks();
};

const checkEmptyList = function (event) {
	if (tasks.length === 0) {
		const emptyListHTML = `
		<div class="todo__empty-list" id="empty-list">
		Todo list is empty
		</div>
		`;
		todoBody.insertAdjacentHTML('beforeend', emptyListHTML);
	}

	if (tasks.length > 0) {
		const emptyListElement = document.querySelector('#empty-list');

		if (emptyListElement) {
			emptyListElement.remove();
		}
	}
};

const saveToLocalStorage = function () {
	localStorage.setItem('tasks', JSON.stringify(tasks));
};

const renderTask = function (task) {
	let taskCss = '';
	let checkboxCss = '';

	if (task.done) {
		taskCss = 'task task--completed';
		checkboxCss = 'checked';
	} else {
		taskCss = 'task';
	}
	const taskElement = document.createElement('li');
	taskElement.classList.add('panels__item');
	taskElement.id = task.id;
	taskElement.innerHTML = `
	<div class="${taskCss}">
		<label class="task__check" data-action="done">
			<input class="task__real-checkbox visually-hidden" type="checkbox" ${checkboxCss}>
			<span class="task__custom-checkbox"></span>
			<span class="task__text" id="task-text"></span>
		</label>
		<div class="task__actions">
			<button class="task__button task__button--delete" type="button" data-action="delete">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M13 3L12.3326 13.0107C12.2741 13.8875 12.2449 14.3259 12.0556 14.6583C11.8888 14.951 11.6373 15.1863 11.3342 15.3332C10.99 15.5 10.5506 15.5 9.67181 15.5H6.32812C5.44937 15.5 5.01 15.5 4.66572 15.3332C4.36262 15.1863 4.11114 14.951 3.94441 14.6583C3.75504 14.3259 3.72581 13.8875 3.66736 13.0107L2.99998 3M1.33331 3H14.6666M11.3333 3L11.1078 2.32339C10.8892 1.66771 10.7799 1.33987 10.5772 1.09748C10.3982 0.883442 10.1684 0.717767 9.90873 0.61565C9.61465 0.5 9.26915 0.5 8.57798 0.5H7.42198C6.73081 0.5 6.38531 0.5 6.09124 0.61565C5.83158 0.717767 5.60171 0.883442 5.42272 1.09748C5.22002 1.33987 5.11075 1.66771 4.89218 2.32339L4.66665 3"
						stroke="#F4F4F5" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</button>
		</div>
	</div>
	`;

	const taskText = taskElement.querySelector('#task-text');
	taskText.textContent = task.text;

	panelsList.insertAdjacentElement('beforeend', taskElement);
};

const checkCompleted = function () {
	clearCompletedButton.disabled = tasks.find((task) => task.done)
		? false
		: true;
};

const clearCompletedTasks = function () {
	tasks.forEach((task) => {
		if (task.done) {
			const panelToRemove = document.getElementById(`${task.id}`);

			panelToRemove.remove();
		}
	});

	tasks = tasks.filter((task) => !task.done);

	saveToLocalStorage();

	checkEmptyList();

	checkCompleted();
};

// adding event listeners
form.addEventListener('submit', addTask);
panelsList.addEventListener('click', deleteTask);
panelsList.addEventListener('click', doneTask);
tabsList.addEventListener('click', toggleTab);
clearCompletedButton.addEventListener('click', clearCompletedTasks);

// check local storage
if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

checkCompleted();
