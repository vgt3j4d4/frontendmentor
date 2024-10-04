document.addEventListener("DOMContentLoaded", () => {
  let showShareTo = false;
  const shareBtn = document.querySelector("#share-btn");
  const shareLinks = document.querySelectorAll(
    "#share-links-container, #share-links-container-tooltip"
  );

  shareBtn.addEventListener("click", toggleShareTo);

  shareLinks.forEach((container) => {
    /** If the focus is out of the container but not to the share button, close the share to */
    container.addEventListener("focusout", (e) => {
      if (container.contains(e.relatedTarget)) return;
      if (e.relatedTarget === shareBtn) return;
      collapseShareTo();
    });
    /** If the user presses the escape key, close the share to */
    container.addEventListener("keydown", (e) => {
      if (e.key === "Escape") collapseShareTo();
    });
  });

  function toggleShareTo() {
    showShareTo = !showShareTo;
    if (showShareTo) {
      shareBtn.classList.add("btn-share--expanded");
      shareBtn.setAttribute("aria-expanded", "true");
      shareLinks.forEach((container) => {
        container.classList.remove("share-to--hidden");
        // If this container is visible (without display: none), focus the first <a> item
        if (container.checkVisibility({ contentVisibilityAuto: true })) {
          const firstLink = container.querySelector("a");
          firstLink.focus();
          const btnShare = container.querySelector(".btn-share");
          if (btnShare) {
            btnShare.addEventListener("click", collapseShareTo, { once: true });
          }
        }
      });
    } else {
      shareLinks.forEach((container) =>
        container.classList.add("share-to--hidden")
      );
      shareBtn.classList.remove("btn-share--expanded");
      shareBtn.focus();
    }
  }

  function collapseShareTo() {
    showShareTo = false;
    shareLinks.forEach((container) =>
      container.classList.add("share-to--hidden")
    );
    shareBtn.classList.remove("btn-share--expanded");
    shareBtn.setAttribute("aria-expanded", "false");
    shareBtn.focus();
  }
});
