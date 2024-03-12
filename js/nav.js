"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show logged in user's favorited stories when click "Favorites" */

function navFavorites(evt) {
  console.debug("navFavorites");
  evt.preventDefault();
  hidePageComponents();
  putFavoritesOnPage();
}

$navFavorites.on("click", navFavorites);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navSubmitStory.show();
  $navFavorites.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show story submission form on click on "submit" button */

function navSubmitStoryClick(evt) {
  console.debug("navSubmitStoryClick");
  evt.preventDefault();
  hidePageComponents();
  $submitStoryForm.show();
}

$navSubmitStory.on("click", navSubmitStoryClick);