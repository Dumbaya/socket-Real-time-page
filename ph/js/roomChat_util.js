let sharedFiles = [];

document.addEventListener('DOMContentLoaded', () => {
	const dropZone = document.getElementById('drop-zone');
	const fileInput = document.getElementById('file_upload');
	const fileListDisplay = document.getElementById('file_list');
	const fileListWrap = document.getElementById('fileList_wrap');

	function renderFileList() {
		fileListDisplay.innerHTML = '';

		if (sharedFiles.length === 0) {
			fileListWrap.style.display = 'none';
			return;
		}

		fileListWrap.style.display = 'block';

		sharedFiles.forEach((file, index) => {
			const tr = document.createElement('tr');

			const td_check = document.createElement('td');
			const checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.dataset.index = index;
			td_check.appendChild(checkbox);
			
			const td_name = document.createElement('td');
			td_name.style = 'width: 300px;';
			td_name.textContent = file.name;

			tr.appendChild(td_check);
			tr.appendChild(td_name);
			fileListDisplay.appendChild(tr);
		});
	}

	function handleFiles(files) {
		for (const file of files) {
			if (!sharedFiles.find(f => f.name === file.name && f.size === file.size)) {
				sharedFiles.push(file);
			}
		}
		renderFileList();
	}

	dropZone.addEventListener('click', () => fileInput.click());

	fileInput.addEventListener('change', (e) => {
		handleFiles(e.target.files);
		fileInput.value = '';
	});

	dropZone.addEventListener('dragover', (e) => {
		e.preventDefault();
		dropZone.style.backgroundColor = '#f0f0f0';
	});

	dropZone.addEventListener('dragleave', () => {
		dropZone.style.backgroundColor = '';
	});

	dropZone.addEventListener('drop', (e) => {
		e.preventDefault();
		dropZone.style.backgroundColor = '';
		handleFiles(e.dataTransfer.files);
	});

	document.getElementById('selectAllBtn').addEventListener('click', () => {
		const checkboxes = fileListDisplay.querySelectorAll('input[type="checkbox"]');
		const allChecked = [...checkboxes].every(cb => cb.checked);
		checkboxes.forEach(cb => cb.checked = !allChecked);
	});
	
	document.getElementById('deleteSelectedBtn').addEventListener('click', () => {
		const checkboxes = fileListDisplay.querySelectorAll('input[type="checkbox"]:checked');
		const selectedIndexes = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));

		selectedIndexes.sort((a, b) => b - a).forEach(i => sharedFiles.splice(i, 1));
		renderFileList();
	});
});
