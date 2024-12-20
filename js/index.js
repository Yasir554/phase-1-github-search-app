document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
    const searchInput = document.getElementById('search');
  
    let searchType = 'user';  // Default search type is 'user'
  
    // Toggle between user and repo search
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchTerm = searchInput.value.trim();
  
      if (searchTerm === '') return;
  
      if (searchType === 'user') {
        searchUsers(searchTerm);
      } else {
        searchRepositories(searchTerm);
      }
    });
  
    // Search for users
    function searchUsers(searchTerm) {
      fetch(`https://api.github.com/search/users?q=${searchTerm}`, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      })
      .then(response => response.json())
      .then(data => {
        userList.innerHTML = '';
        data.items.forEach(user => {
          const userItem = document.createElement('li');
          userItem.innerHTML = `
            <img src="${user.avatar_url}" alt="${user.login}'s avatar" width="50" height="50"/>
            <a href="${user.html_url}" target="_blank">${user.login}</a>
          `;
          userItem.addEventListener('click', () => {
            fetchUserRepos(user.login);
          });
          userList.appendChild(userItem);
        });
      })
      .catch(error => console.error('Error fetching users:', error));
    }
  
    // Fetch and display repositories for a user
    function fetchUserRepos(username) {
      fetch(`https://api.github.com/users/${username}/repos`, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      })
      .then(response => response.json())
      .then(data => {
        reposList.innerHTML = '';
        data.forEach(repo => {
          const repoItem = document.createElement('li');
          repoItem.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            <p>${repo.description || 'No description available'}</p>
          `;
          reposList.appendChild(repoItem);
        });
      })
      .catch(error => console.error('Error fetching repos:', error));
    }
  
    // Search for repositories by keyword (optional for bonus)
    function searchRepositories(searchTerm) {
      fetch(`https://api.github.com/search/repositories?q=${searchTerm}`, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      })
      .then(response => response.json())
      .then(data => {
        userList.innerHTML = ''; // Clear user list
        reposList.innerHTML = ''; // Clear repos list
  
        data.items.forEach(repo => {
          const repoItem = document.createElement('li');
          repoItem.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            <p>${repo.description || 'No description available'}</p>
          `;
          reposList.appendChild(repoItem);
        });
      })
      .catch(error => console.error('Error fetching repositories:', error));
    }
  
    // Optional: Add a button to toggle between user and repo search
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle Search (User/Repo)';
    toggleButton.addEventListener('click', () => {
      searchType = (searchType === 'user') ? 'repo' : 'user';
      toggleButton.textContent = `Search for ${searchType === 'user' ? 'Users' : 'Repos'}`;
    });
  
    document.body.appendChild(toggleButton);
  });
  