(function () {
	'use strict';

	class App {
		constructor ({elem}) {
			this.elem = elem;
      this._toggleSidebar = this._toggleSidebar.bind(this);
      this._focusVoteForm = this._focusVoteForm.bind(this);
      this._addVotesItem = this._addVotesItem.bind(this);
      this._handleFileSelect = this._handleFileSelect.bind(this);
      this._sortPlayersList = this._sortPlayersList.bind(this);

      this._initElements();
			this._initEvents();
		}

    _initElements () {
      this._sidebar = document.querySelector('.sidebar');
      this._toggleSidebarBtn = document.querySelector('.menu');
      this._addNewVote = document.querySelector('.add-new-vote');
			this._uploadPicture = document.querySelector('input.vote-picture');
      this._uploadPictureLabel = document.querySelector('label[for="upload-picture"]');
			this._inputDescription = document.querySelector('input.vote-description');
      this._playersList = document.querySelector('.players-list');
      this._orderPlayersListSwitcher = document.querySelector('.switch-list-order');
    }

		_initEvents () {
      this._toggleSidebarBtn.addEventListener('click', this._toggleSidebar);
      this._addNewVote.addEventListener('click', this._focusVoteForm);
			this._uploadPicture.addEventListener('click', this._clearValue);
			this._inputDescription.addEventListener('click', this._clearValue);
			this._uploadPicture.addEventListener('change', this._refreshForm);
			this._inputDescription.addEventListener('change', this._refreshForm);
      this._inputDescription.addEventListener('keypress', this._addVotesItem);
      this._uploadPicture.addEventListener('change', this._handleFileSelect, false);
      this._orderPlayersListSwitcher.addEventListener('change', this._sortPlayersList);
    }

		_clearValue (event) {
			event.target.value = "";
		}

    _toggleSidebar () {
      this._sidebar.classList.toggle('hide-sidebar');
    }

    _focusVoteForm () {
      this._uploadPictureLabel.classList.toggle('focus');
      this._uploadPicture.focus();
    }

		_isPictureInvalid () {
			return (!this._uploadPicture.value ||
				this._uploadPicture.value === this._uploadPicture.getAttribute('value'));
		}

		_isDescriptionInvalid () {
			return (!this._inputDescription.value ||
				this._inputDescription.value === this._inputDescription.getAttribute('value'));
		}

		_refreshForm () {
			this._uploadPicture.value = this._uploadPicture.getAttribute('value');
			this._inputDescription.value = this._inputDescription.getAttribute('value');
      this._uploadPictureLabel.style.backgroundImage = '';
			if (this._uploadPicture.classList.contains("form_error")) {
				this._uploadPicture.classList.remove("form_error");
			}
			if (this._inputDescription.classList.contains("form_error")) {
				this._inputDescription.classList.remove("form_error");
			}
		}

		_throwError () {
			if (this._isPictureInvalid() && !this._uploadPicture.classList.contains("form_error")) {
				this._uploadPicture.classList.add("form_error");
			}
			if (this._isDescriptionInvalid() && !this._inputDescription.classList.contains("form_error")) {
				this._inputDescription.classList.add("form_error");
			}
		}

		_initVotesItem () {
      let container = document.querySelector('.draft-votes-list'),
				element = document.createElement('li'),
				figure = document.createElement('figure'),
				picture = document.createElement('img'),
				description = document.createElement('figcaption');

      picture.className = "vote-picture";
			description.className = "vote-description";

			picture.src = this._file;
			description.innerHTML = this._inputDescription.value;

      figure.appendChild(picture);
      figure.appendChild(description);
			element.appendChild(figure);
			container.appendChild(element);
		}

		_addVotesItem (event) {
      let key = event.which || event.keyCode;

      if (key === 13) {
  			if (this._isPictureInvalid() || this._isDescriptionInvalid()) {
  				this._throwError();
  				return;
  			}

  			this._initVotesItem();
  			this._refreshForm();
      }
		}

    _handleFileSelect (event) {
      let file = event.target.files[0],
				reader = new FileReader(),
				self = this;

      if (file.type.match('image.*')) {
        reader.onload = (function() {
          return function(e) {
            self._file = e.target.result;
            self._uploadPictureLabel.style.backgroundImage = 'url("'+ self._file +'")';
          };
        })(file);

        // Read in the image file as a data URL.
        reader.readAsDataURL(file);
      }
    }

    _sortPlayersList (event) {
			let wrapper = this._playersList,
				elements = this._playersList.childNodes,
				newList = [],
				unsortableList = [],
				frag = document.createDocumentFragment(),
				i;

			for (i = 0; i < elements.length; i++) {
				if (elements[i].childNodes[0].childNodes[1]) {
					newList.push(elements[i]);
				} else {
					unsortableList.push(elements[i]);
				}
			}

			if (!event.target.checked) {
				this._sortAlphabetically(newList);
			} else {
				this._shuffle(newList);
			}

			for (i = 0; i < newList.length; ++i) {
				frag.appendChild(newList[i]);
			}
			for (i = 0; i < unsortableList.length; ++i) {
				frag.appendChild(unsortableList[i]);
			}

			wrapper.innerHTML = '';
			wrapper.appendChild(frag);
    }

		_sortAlphabetically (elements) {
      elements.sort(function(a, b) {
        return a.childNodes[0].childNodes[1].innerText !== b.childNodes[0].childNodes[1].innerText ? a.childNodes[0].childNodes[1].innerText < b.childNodes[0].childNodes[1].innerText ? -1 : 1 : 0;
      });
		}

		_shuffle (elements) {
		  let initLength = elements.length, temporaryValue, randomIndex;

			for (let i = 0; i < initLength; i++) {
		    randomIndex = Math.floor(Math.random() * initLength);

		    temporaryValue = elements[i];
		    elements[i] = elements[randomIndex];
		    elements[randomIndex] = temporaryValue;
			}
		}
	}

  window.App = App;
})();
