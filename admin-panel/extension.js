function createDeploymentButton(buttonLabel, siteLabel, endPoint) {
  const button = document.createElement('button');
  button.textContent = buttonLabel;

  button.onclick = async() => {
    button.disabled = true;
    button.textContent = 'Working...';

    try {
      const response = await fetch(endPoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg);
      }

      const data = await response.json();
      button.textContent = 'Requested ✔';
      alert(`Rebuild started! ${siteLabel} should be updated within a minute.`);
    } catch (err) {
      console.error(err);
      alert('Site rebuild failed');
    }
    button.textContent = buttonLabel
    button.disabled = false;
  };

  return button;
}

function addPushChangesButton() {
  // Quickly see if our wrapper exists. If so, exit immediately
  if (document.getElementById('publish-button-wrapper'))
    return;
    
  // Otherwise, we do a slower search to find the "Quick Add" button.
  // If not found, return without doing anything. Maybe next time...
  const quickAdd = Array.from(document.querySelectorAll('span[role="button"]'))
    .find(el => el.textContent.trim() === 'Quick add');
  if (!quickAdd) return;

  // To prevent looping, disconnect the observer while we add our button
  observer.disconnect();

  // Create a wrapper that we'll use in place of the quick add button
  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'row';
  wrapper.style.alignItems = 'center';
  wrapper.style.gap = '0.5rem';
  wrapper.id = 'publish-button-wrapper';

  // Create the two new buttons
  const previewButton = createDeploymentButton('Preview', 'The Preview Site', '/api/decap-plus/preview');
  const approveButton = createDeploymentButton('Approve', 'The Official Public Site', '/api/decap-plus/approve');

  // Insert the wrapper and add the new button
  quickAdd.replaceWith(wrapper);
  wrapper.appendChild(quickAdd);
  wrapper.appendChild(previewButton);
  wrapper.appendChild(approveButton);

  // reconnect the observer now that we've made our changes
  observer.observe(document.body, { childList: true, subtree: true });
}

// Observe DOM mutations to survive React re-renders
const observer = new MutationObserver(addPushChangesButton);
observer.observe(document.body, { childList: true, subtree: true });
