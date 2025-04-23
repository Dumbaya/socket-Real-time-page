let sharedFiles = [];

document.addEventListener('DOMContentLoaded', () => {
	const dropZone = document.getElementById('drop-zone');
	const fileInput = document.getElementById('file_upload');
	const fileListDisplay = document.getElementById('file_list');

	function renderFileList() {
		fileListDisplay.innerHTML = '';
		sharedFiles.forEach(file => {
			const li = document.createElement('li');
			li.textContent = file.name;
			fileListDisplay.appendChild(li);
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
});
